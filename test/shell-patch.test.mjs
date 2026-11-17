import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BRAND, ICON_MARKER, buildAsar, diffRanges, integrityOf, padToOriginalSize, patchLocaleBrand, patchMainJs, patchWindowIcon, readAsarBuffer, serializeHeader } from '../shell/apply.mjs'

const PRODUCT = 'DeepSeek Harness'

/** 和 0.2.2-rc.3 同形状的最小 main.js 片段：语言表 + createWindow 的 BrowserWindow 选项。 */
function sampleMainJs(locales = ['en', 'zh-CN', 'ja', 'es', 'fr', 'de', 'ru', 'pt']) {
  const tables = locales.map((locale, index) => [
    `const messages_${index} = {`,
    `\tlocale: "${locale}",`,
    '\tedit: "Edit",',
    `\taboutProduct: "${PRODUCT}",`,
    '\tquit: "Quit",',
    `\tquitApplication: "Quit ${PRODUCT}",`,
    `\topenApplication: "Open ${PRODUCT}",`,
    `\tquitTitle: "Quit ${PRODUCT}?",`,
    '\twelcomeTitle: "' + PRODUCT + '",',
    '};',
  ].join('\n')).join('\n')
  const window = [
    'function createWindow(preload, show = false, primary = false) {',
    '\tconst window = new BrowserWindow({',
    '\t\twidth: 1280,',
    '\t\theight: 820,',
    '\t\tminWidth: 520,',
    '\t\tminHeight: 600,',
    '\t\tshow,',
    '\t\t...process.platform === "win32" && primary ? {',
    '\t\t\tbackgroundColor: "#ffffff",',
    '\t\t} : {},',
    '\t\twebPreferences: { preload },',
    '\t});',
    '\treturn window;',
    '}',
  ].join('\n')
  // 真实的 main.js 有 800 多 KB，图标那行（+86 字节）远小于语言表省下的（每处 -3 字节）。
  // 样例也要够长，才能体现「补丁后仍然更短、于是补换行回到原字节数」这个前提。
  const filler = `const filler = "${'x'.repeat(4096)}";`
  return `${tables}\n${filler}\n${window}\n\nmain();\n`
}

function makeAsar(files) {
  const tree = { files: {} }
  const parts = []
  let cursor = 0
  for (const [name, content] of Object.entries(files)) {
    const bytes = Buffer.from(content, 'utf8')
    const segments = name.split('/')
    let node = tree
    for (const segment of segments.slice(0, -1)) {
      node.files[segment] ??= { files: {} }
      node = node.files[segment]
    }
    node.files[segments.at(-1)] = { size: bytes.length, offset: String(cursor), integrity: integrityOf(bytes) }
    parts.push(bytes)
    cursor += bytes.length
  }
  return Buffer.concat([serializeHeader(tree), ...parts])
}

test('语言表：四个键换成芭梧，其它键不动', () => {
  const { text, locales, hits } = patchLocaleBrand(sampleMainJs())
  assert.equal(locales, 32)
  assert.equal(hits, 32)
  assert.equal(text.match(new RegExp(BRAND, 'g')).length, 32)
  assert.ok(text.includes('\taboutProduct: "' + BRAND + '",'))
  assert.ok(text.includes('\topenApplication: "Open ' + BRAND + '",'))
  assert.ok(text.includes('\tquitTitle: "Quit ' + BRAND + '?",'))
  assert.equal((text.match(new RegExp('welcomeTitle: "' + PRODUCT + '"', 'g')) ?? []).length, 8)
})

test('语言表：改完再跑一次是幂等的', () => {
  const once = patchLocaleBrand(sampleMainJs()).text
  const twice = patchLocaleBrand(once)
  assert.equal(twice.text, once)
  assert.equal(twice.hits, 0)
})

test('窗口图标：插入一次，再跑不重复插', () => {
  const inserted = patchWindowIcon(sampleMainJs())
  assert.equal(inserted.inserted, true)
  assert.ok(inserted.text.includes(ICON_MARKER))
  const again = patchWindowIcon(inserted.text)
  assert.equal(again.inserted, false)
  assert.equal(again.text, inserted.text)
})

test('锚点不在就报错，不乱改', () => {
  assert.throws(() => patchWindowIcon('const x = 1;\n'), /锚点命中 0 处/)
  assert.throws(() => patchLocaleBrand('const x = 1;\n'), /没找到/)
})

test('补丁保持字节数：末尾补换行，语法仍通过', () => {
  const original = sampleMainJs()
  const originalSize = Buffer.byteLength(original)
  const result = patchMainJs(original, originalSize)
  assert.equal(result.buffer.length, originalSize)
  assert.ok(result.padded > 0)
  assert.equal(result.syntax, true)
  assert.ok(result.buffer.toString('utf8').includes(ICON_MARKER))
  assert.ok(result.buffer.toString('utf8').endsWith('\n'.repeat(result.padded)))
})

test('补丁后超大就停下（保持偏移的前提）', () => {
  assert.throws(() => padToOriginalSize(Buffer.from('abcdef'), 3), /变大了/)
})

test('asar 写入器：原样重建逐字节相同', () => {
  const archive = makeAsar({ 'a.txt': 'hello', 'dir/b.txt': 'world', 'empty': '' })
  const parsed = readAsarBuffer(archive)
  const rebuilt = buildAsar(parsed, new Map())
  assert.equal(rebuilt.equals(archive), true)
})

test('asar 写入器：替换一个文件，其余字节与偏移按预期', () => {
  const archive = makeAsar({ 'a.txt': 'hello', 'dir/b.txt': 'world' })
  const parsed = readAsarBuffer(archive)
  const replacement = new Map([['a.txt', Buffer.from('HELLO')]])
  const built = buildAsar(parsed, replacement)
  const check = readAsarBuffer(built)
  assert.equal(built.length, archive.length)
  assert.equal(check.tree.files['a.txt'].integrity.hash, integrityOf(Buffer.from('HELLO')).hash)
  assert.equal(check.tree.files.dir.files['b.txt'].offset, parsed.tree.files.dir.files['b.txt'].offset)
})

test('差异区间：按 4 KiB 块合并，只覆盖变化的那几段', () => {
  const left = Buffer.alloc(16384, 0x2e)
  const right = Buffer.from(left)
  right[10] = 0x58
  right[4100] = 0x59
  right[9000] = 0x5a
  // 三块都变了且相邻 → 合并成一段
  assert.deepEqual(diffRanges(left, right), [{ offset: 0, length: 12288 }])

  const spaced = Buffer.from(left)
  spaced[10] = 0x58
  spaced[9000] = 0x5a
  // 中间隔着一整块没变 → 两段
  assert.deepEqual(diffRanges(left, spaced), [{ offset: 0, length: 4096 }, { offset: 8192, length: 4096 }])
  assert.deepEqual(diffRanges(left, left), [])
})

test('空文件的 integrity 也有一个空块', () => {
  const empty = integrityOf(Buffer.alloc(0))
  assert.equal(empty.blocks.length, 1)
  assert.equal(empty.hash, empty.blocks[0])
})
