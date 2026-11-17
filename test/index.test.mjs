import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { addVersion, compareVersions, ensurePlugin, validateIndex } from '../lib.mjs'

const COMMIT = 'a'.repeat(40)
const icon = `data:image/svg+xml;base64,${Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>').toString('base64')}`

function baseIndex() {
  return {
    format: 1,
    title: { en: 'Test index', zh: '测试索引' },
    plugins: [{
      name: 'bywood-dsh-theme',
      title: { en: 'BYWOOD theme', zh: '芭梧主题' },
      description: { en: 'Theme', zh: '主题' },
      icon,
      repository: { url: 'https://github.com/TangVarie/dsh-bywood' },
      versions: [{
        version: '1.0.0',
        publishTimestamp: 1_800_000_000,
        source: { type: 'git', url: 'https://github.com/TangVarie/dsh-bywood', commit: COMMIT },
        engines: { dsh: '>=0.2.2-rc.1 <0.3.0' },
      }],
    }],
  }
}

test('仓库里的 index.json 是合法索引', () => {
  const index = JSON.parse(readFileSync(new URL('../index.json', import.meta.url), 'utf8'))
  assert.equal(validateIndex(index).format, 1)
})

test('拒绝格式错误', () => {
  for (const mutate of [
    index => { index.format = 2 },
    index => { index.title = { zh: '缺英文' } },
    index => { index.plugins[0].name = 'Not A Package' },
    index => { index.plugins[0].icon = 'https://example.com/icon.svg' },
    index => { index.plugins[0].versions = [] },
    index => { index.plugins[0].versions[0].source.commit = 'abc' },
    index => { index.plugins[0].versions[0].source.path = '../escape' },
    index => { index.plugins[0].versions[0].engines = { dsh: 1 } },
  ]) {
    const index = baseIndex()
    mutate(index)
    assert.throws(() => validateIndex(index))
  }
})

test('ensurePlugin 建条目，addVersion 登记第一条', () => {
  const index = { format: 1, title: 'T', plugins: [] }
  ensurePlugin(index, {
    name: 'bywood-dsh-theme',
    title: { en: 'BYWOOD theme', zh: '芭梧主题' },
    description: { en: 'Theme', zh: '主题' },
    icon,
    repository: 'https://github.com/TangVarie/dsh-bywood',
    author: 'BYWOOD',
  })
  addVersion(index, {
    name: 'bywood-dsh-theme',
    version: '1.0.0',
    commit: COMMIT,
    repository: 'https://github.com/TangVarie/dsh-bywood',
    engines: '>=0.2.2-rc.1 <0.3.0',
    publishTimestamp: 1_800_000_000,
  })
  assert.equal(index.plugins[0].versions.length, 1)
  assert.equal(index.plugins[0].versions[0].version, '1.0.0')
})

test('同一版本不能登记两次，版本号必须更新', () => {
  const index = baseIndex()
  assert.throws(() => addVersion(index, {
    name: 'bywood-dsh-theme', version: '1.0.0', commit: COMMIT,
    repository: 'https://github.com/TangVarie/dsh-bywood', publishTimestamp: 1,
  }), /已经在索引里/)
  assert.throws(() => addVersion(index, {
    name: 'bywood-dsh-theme', version: '0.9.0', commit: COMMIT,
    repository: 'https://github.com/TangVarie/dsh-bywood', publishTimestamp: 1,
  }), /不比索引里最高的/)
})

test('新版本排在前面', () => {
  const index = baseIndex()
  addVersion(index, {
    name: 'bywood-dsh-theme', version: '1.1.0', commit: COMMIT,
    repository: 'https://github.com/TangVarie/dsh-bywood', publishTimestamp: 1_800_000_100,
  })
  assert.deepEqual(index.plugins[0].versions.map(version => version.version), ['1.1.0', '1.0.0'])
})

test('SemVer 比较', () => {
  assert.ok(compareVersions('1.0.0', '1.0.1') < 0)
  assert.ok(compareVersions('1.10.0', '1.9.0') > 0)
  assert.ok(compareVersions('1.1.0-rc.1', '1.1.0') < 0)
  assert.ok(compareVersions('1.1.0-rc.1', '1.1.0-rc.2') < 0)
  assert.equal(compareVersions('1.0.0+build.1', '1.0.0+build.2'), 0)
})
