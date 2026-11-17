#!/usr/bin/env node
/**
 * 芭梧 BYWOOD · 桌面外壳补丁（Windows Desktop，可选）
 *
 * 插件的浏览器半改不到这三处，因为它们在 Electron 主进程里：
 *   - 托盘（任务栏隐藏图标区）的悬浮名称与右键菜单文字
 *   - 任务栏 hover 出来的小窗（缩略图预览）图标
 *   - 退出确认框的标题
 *
 * 这个脚本只做一件事的两半：
 *   1. 改 `resources/app.asar` → `lib/main.js`：语言表 4 个键 × N 种语言换成「芭梧 BYWOOD」，
 *      并给 `createWindow()` 的 BrowserWindow 加 `icon`，指向 `resources/tray.ico`；
 *   2. 把 `shell/assets/` 里的芭梧 `tray.ico` / `icon.png` 放进 `resources/`（原件先备份）。
 *
 * 关键手法：补丁后用换行把 main.js 补回原字节数，归档里每个文件的 offset/size 都不变，
 * 于是可以「同位改写」——只覆盖真正变化的字节段，不必替换 209 MB 的文件，应用正在运行时
 * 也不会被 Windows 文件锁挡住。改完重启应用生效。
 *
 * 安全闸（任何一条不过就停下，不写任何字节）：
 *   - 用同一套写入器把原件原样重建，必须与原件逐字节相同；
 *   - 产物逐文件比对（只允许 main.js 不同），每文件 integrity 重算，全部 offset/size 与原件一致；
 *   - 补丁后的 main.js 过 `node --check`；
 *   - 写入按差异区间进行，写完整文件比一遍 sha256。
 *
 * 用法：
 *   node apply.mjs --app "D:\deepseek harness" [--dry-run]
 *   node apply.mjs --app "D:\deepseek harness" --restore
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// 用应用自带的 Electron 当 node 跑时（ELECTRON_RUN_AS_NODE=1），它会把以 .asar 结尾的路径
// 当归档去解析；这里要读写的是「归档文件本身」，必须关掉这层透明处理。
process.noAsar = true;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MAIN_FILE = 'lib/main.js';
const BRAND = '芭梧 BYWOOD';
const PRODUCT = 'DeepSeek Harness';
const LOCALE_KEYS = ['aboutProduct', 'openApplication', 'quitApplication', 'quitTitle'];
const BACKUP_RELATIVE = path.join('resources', 'bywood-backup');
const ICON_MARKER = 'icon: join(process.resourcesPath, "tray.ico")';
const BLOCK_SIZE = 4194304;

const ASSETS = [
  { name: 'tray.ico', target: path.join('resources', 'tray.ico') },
  { name: 'icon.png', target: path.join('resources', 'icon.png') },
];

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const exists = (file) => fs.existsSync(file);

// ---------------------------------------------------------------------------
// asar 读写
// ---------------------------------------------------------------------------

/** 读 header：8 字节 pickle 头 + 4 字节 pickle 长度 + 4 字节 JSON 长度 + JSON + 补零。 */
function readAsar(asarPath) {
  const file = fs.readFileSync(asarPath);
  const firstField = file.readUInt32LE(0);
  const headerPickleSize = file.readUInt32LE(4);
  const headerPayloadSize = file.readUInt32LE(8);
  const jsonLength = file.readUInt32LE(12);
  if (firstField !== 4) throw new Error(`asar: 意外的首字段 ${firstField}`);
  if (headerPayloadSize !== headerPickleSize - 4) throw new Error('asar: header pickle 长度不自洽');
  const tree = JSON.parse(file.subarray(16, 16 + jsonLength).toString('utf8'));
  return { file, tree, headerPickleSize, jsonLength, dataBase: 8 + headerPickleSize };
}

/** 归档内真实存放的文件，按偏移升序（写入顺序即存储顺序）。 */
function packedEntries(tree) {
  const list = [];
  const walk = (node, prefix) => {
    for (const [name, value] of Object.entries(node.files ?? {})) {
      const entryPath = prefix ? `${prefix}/${name}` : name;
      if (value.files) walk(value, entryPath);
      else if (!value.unpacked && typeof value.offset !== 'undefined') list.push({ path: entryPath, entry: value });
    }
  };
  walk(tree, '');
  return list.sort((a, b) => Number(a.entry.offset) - Number(b.entry.offset));
}

function findNode(tree, entryPath) {
  let node = tree;
  for (const part of entryPath.split('/')) {
    node = node.files?.[part];
    if (node === undefined) throw new Error(`asar: 找不到 ${entryPath}`);
  }
  return node;
}

function readEntry(asar, entryPath) {
  const node = findNode(asar.tree, entryPath);
  const start = asar.dataBase + Number(node.offset);
  return asar.file.subarray(start, start + node.size);
}

function serializeHeader(tree) {
  const json = Buffer.from(JSON.stringify(tree), 'utf8');
  const padding = (4 - ((8 + json.length) % 4)) % 4;
  const pickleSize = 8 + json.length + padding;
  const buffer = Buffer.alloc(8 + pickleSize);
  buffer.writeUInt32LE(4, 0);
  buffer.writeUInt32LE(pickleSize, 4);
  buffer.writeUInt32LE(pickleSize - 4, 8);
  buffer.writeUInt32LE(json.length, 12);
  json.copy(buffer, 16);
  return buffer;
}

/** 与 asar 一致的整文件摘要：hash 为全文，blocks 为 4 MiB 分块（空文件也有一个空块）。 */
function integrityOf(buffer) {
  const blocks = [];
  if (buffer.length === 0) blocks.push(sha256(buffer));
  for (let offset = 0; offset < buffer.length; offset += BLOCK_SIZE) {
    blocks.push(sha256(buffer.subarray(offset, Math.min(offset + BLOCK_SIZE, buffer.length))));
  }
  return { algorithm: 'SHA256', hash: sha256(buffer), blockSize: BLOCK_SIZE, blocks };
}

/**
 * 用给定内容重建整个 asar。原始 header 树不动——改动都发生在克隆上，
 * 调用方之后仍能按原偏移回读原件做逐文件比对。
 */
function buildAsar(asar, replacement) {
  const tree = structuredClone(asar.tree);
  const entries = packedEntries(tree);
  const parts = [];
  let cursor = 0;
  for (const { path: entryPath, entry } of entries) {
    const bytes = replacement.get(entryPath) ?? readEntry(asar, entryPath);
    entry.size = bytes.length;
    entry.offset = String(cursor);
    entry.integrity = integrityOf(bytes);
    parts.push(bytes);
    cursor += bytes.length;
  }
  const header = serializeHeader(tree);
  return Buffer.concat([header, ...parts], header.length + cursor);
}

/** 自检：原样重建必须与原件逐字节相同，否则这套写入器不可信，什么都不写。 */
function assertWriterFaithful(asar) {
  const rebuilt = buildAsar(asar, new Map());
  if (!rebuilt.equals(asar.file)) {
    throw new Error(`写入器自检失败：原样重建与原件不同（${rebuilt.length} vs ${asar.file.length} 字节），已中止，未写入任何字节`);
  }
  return rebuilt.length;
}

// ---------------------------------------------------------------------------
// 补丁内容
// ---------------------------------------------------------------------------

const KEY_PATTERN = /^([ \t]*)(aboutProduct|openApplication|quitApplication|quitTitle):(\s*)"((?:[^"\\]|\\.)*)"(,?)$/gm;

/**
 * 1. 语言表里托盘与退出确认用到的四个键，产品名换成芭梧。
 * @returns {{ text: string, locales: number, hits: number }}
 */
function patchLocaleBrand(text) {
  let locales = 0;
  let hits = 0;
  const next = text.replace(KEY_PATTERN, (whole, indent, key, gap, value, comma) => {
    if (!value.includes(PRODUCT)) return whole;
    locales += 1;
    hits += value.split(PRODUCT).length - 1;
    return `${indent}${key}:${gap}"${value.split(PRODUCT).join(BRAND)}"${comma}`;
  });
  const already = text.match(new RegExp(`^[ \\t]*(?:${LOCALE_KEYS.join('|')}):\\s*"[^"\\n]*${BRAND}`, 'gm'));
  if (hits === 0) {
    if (already !== null) return { text, locales: already.length, hits: 0 };
    throw new Error('语言表：没找到 aboutProduct / openApplication / quitApplication / quitTitle，bundle 结构已变，已中止');
  }
  if (!/aboutProduct/.test(text)) throw new Error('语言表：没有 aboutProduct 键，无法确认托盘的悬浮名称，已中止');
  return { text: next, locales, hits };
}

/** 2. 主窗口加窗口图标。锚点不匹配就停，不做「差不多就行」的替换。 */
const ICON_ANCHOR =
  '\t\tminHeight: 600,\n' +
  '\t\tshow,\n' +
  '\t\t...process.platform === "win32" && primary ? {';
const ICON_INSERT =
  '\t\tminHeight: 600,\n' +
  '\t\tshow,\n' +
  `\t\t...process.platform === "win32" ? { ${ICON_MARKER} } : {},\n` +
  '\t\t...process.platform === "win32" && primary ? {';

function patchWindowIcon(text) {
  if (text.includes(ICON_MARKER)) return { text, inserted: false };
  const count = text.split(ICON_ANCHOR).length - 1;
  if (count !== 1) {
    throw new Error(`窗口图标：createWindow() 的锚点命中 ${count} 处（预期 1 处），bundle 结构已变，已中止`);
  }
  return { text: text.replace(ICON_ANCHOR, ICON_INSERT), inserted: true };
}

/**
 * 3. 用换行补回原字节数。
 *
 * 这不是为了好看：字节数不变，归档里每个文件的 offset/size 就都不变，安装目录的 app.asar
 * 才能「同位改写」——只覆盖变化的那几段，不必替换整个文件，应用运行时也不会被文件锁挡住。
 */
function padToOriginalSize(buffer, size) {
  if (buffer.length === size) return { buffer, padded: 0 };
  if (buffer.length > size) {
    throw new Error(`补丁后 main.js 变大了（${buffer.length} > ${size}），无法保持归档偏移不变，已中止`);
  }
  const padded = size - buffer.length;
  return { buffer: Buffer.concat([buffer, Buffer.from('\n'.repeat(padded), 'utf8')]), padded };
}

/** 对外的补丁入口：文本进，文本出，附带给日志用的账。 */
function patchMainJs(text, originalSize) {
  const locale = patchLocaleBrand(text);
  const icon = patchWindowIcon(locale.text);
  const syntax = spawnSyntaxCheck(Buffer.from(icon.text, 'utf8'));
  const { buffer, padded } = padToOriginalSize(Buffer.from(icon.text, 'utf8'), originalSize);
  const patched = buffer.toString('utf8');
  const brandHits = (patched.match(new RegExp(BRAND, 'g')) ?? []).length;
  const patchedLocales = patched.match(new RegExp(`^[ \\t]*(?:${LOCALE_KEYS.join('|')}):\\s*"[^"\\n]*${BRAND}`, 'gm'));
  return {
    text: patched,
    buffer,
    padded,
    syntax,
    brandHits,
    iconInserted: icon.inserted,
    localeLines: patchedLocales === null ? 0 : patchedLocales.length,
    localeChanges: locale.hits,
  };
}

/** ESM 语法检查：写临时文件 → node --check → 删掉。 */
function spawnSyntaxCheck(buffer) {
  const probe = path.join(HERE, '.main.patched.mjs');
  fs.writeFileSync(probe, buffer);
  try {
    const check = spawnSync(process.execPath, ['--check', probe], { stdio: 'ignore' });
    return check.status === 0;
  } finally {
    fs.rmSync(probe, { force: true });
  }
}

// ---------------------------------------------------------------------------
// 同位改写
// ---------------------------------------------------------------------------

/** 逐 4 KiB 块比较，合并相邻差异段。 */
function diffRanges(left, right) {
  const ranges = [];
  for (let offset = 0; offset < left.length; offset += 4096) {
    const end = Math.min(offset + 4096, left.length);
    if (left.compare(right, offset, end, offset, end) === 0) continue;
    const last = ranges.at(-1);
    if (last !== undefined && last.offset + last.length === offset) last.length += end - offset;
    else ranges.push({ offset, length: end - offset });
  }
  return ranges;
}

/** 把目标档案按差异区间就地写进安装文件，写完整文件校验。 */
function writeInPlace(installedPath, target, log) {
  const before = fs.readFileSync(installedPath);
  if (before.equals(target)) {
    log('安装文件已经与目标一致，无需改动。');
    return false;
  }
  if (before.length !== target.length) {
    throw new Error(`两个档案字节数不同（${before.length} vs ${target.length}），不能同位改写，已中止`);
  }
  const ranges = diffRanges(before, target);
  const bytes = ranges.reduce((sum, range) => sum + range.length, 0);
  log(`差异区间 ${ranges.length} 段，共 ${bytes} 字节：${ranges.map((r) => `@${r.offset}+${r.length}`).join(' ')}`);

  let handle;
  try {
    handle = fs.openSync(installedPath, 'r+');
  } catch (error) {
    throw new Error(`打不开安装文件写入（${error.code}）：${installedPath}\n如果应用装在 Program Files 之类的位置，请用管理员身份重新运行。`);
  }
  try {
    for (const range of ranges) fs.writeSync(handle, target, range.offset, range.length, range.offset);
    fs.fsyncSync(handle);
  } finally {
    fs.closeSync(handle);
  }
  const after = fs.readFileSync(installedPath);
  if (!after.equals(target)) throw new Error('写入后校验失败：安装文件与目标不一致，请用 restore.cmd 还原');
  return true;
}

// ---------------------------------------------------------------------------
// 资源图标
// ---------------------------------------------------------------------------

function backupPathFor(appDir, name) {
  return path.join(appDir, BACKUP_RELATIVE, `${name}.orig`);
}

/** 放上芭梧托盘/应用图标；原件先备份到 resources/bywood-backup/*.orig。 */
function applyAssets(appDir, log, dryRun) {
  const changes = [];
  for (const asset of ASSETS) {
    const shippedPath = path.join(HERE, 'assets', asset.name);
    const targetPath = path.join(appDir, asset.target);
    if (!exists(shippedPath)) {
      log(`  ${asset.name}：包内没有 shell/assets/${asset.name}，跳过`);
      continue;
    }
    const shipped = fs.readFileSync(shippedPath);
    const shippedHash = sha256(shipped);
    if (exists(targetPath) && sha256(fs.readFileSync(targetPath)) === shippedHash) {
      log(`  ${asset.name}：已是芭梧图标`);
      continue;
    }
    const backup = backupPathFor(appDir, asset.name);
    if (exists(targetPath) && !exists(backup)) {
      if (!dryRun) {
        fs.mkdirSync(path.dirname(backup), { recursive: true });
        fs.copyFileSync(targetPath, backup);
      }
      log(`  ${asset.name}：备份原件 → ${path.relative(appDir, backup)}`);
    }
    if (!dryRun) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, shipped);
    }
    log(`  ${asset.name}：写入 ${path.relative(appDir, targetPath)}（${shipped.length} 字节）`);
    changes.push(asset.name);
  }
  return changes;
}

/** 还原托盘/应用图标。 */
function restoreAssets(appDir, log, dryRun) {
  const restored = [];
  for (const asset of ASSETS) {
    const targetPath = path.join(appDir, asset.target);
    let backup = backupPathFor(appDir, asset.name);
    if (!exists(backup)) {
      // 兼容更早手工做过的备份（直接放在 bywood-backup/ 下，没有 .orig 后缀）
      const legacy = path.join(appDir, BACKUP_RELATIVE, asset.name);
      if (!exists(legacy)) {
        log(`  ${asset.name}：没有备份，保持现状`);
        continue;
      }
      backup = legacy;
    }
    if (!dryRun) fs.copyFileSync(backup, targetPath);
    log(`  ${asset.name}：从 ${path.relative(appDir, backup)} 还原`);
    restored.push(asset.name);
  }
  return restored;
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { appDir: '', dryRun: false, restore: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--app') args.appDir = argv[++i];
    else if (flag === '--dry-run') args.dryRun = true;
    else if (flag === '--restore') args.restore = true;
    else if (flag === '-h' || flag === '--help') args.help = true;
    else throw new Error(`未知参数 ${flag}`);
  }
  return args;
}

function resolveAppDir(appDir) {
  if (!appDir) throw new Error('缺少 --app <安装目录>');
  const resolved = path.resolve(appDir);
  const required = [path.join(resolved, 'resources', 'app.asar'), path.join(resolved, 'DeepSeek Harness.exe')];
  for (const file of required) {
    if (!exists(file)) throw new Error(`这不像 DeepSeek Harness 的安装目录：缺少 ${file}`);
  }
  return resolved;
}

function applyFlow(appDir, dryRun) {
  const asarPath = path.join(appDir, 'resources', 'app.asar');
  const log = (line) => console.log(line);
  console.log(`安装目录：${appDir}`);
  console.log(`读取 ${asarPath}`);
  const asar = readAsar(asarPath);
  const entries = packedEntries(asar.tree);
  if (asar.file.length !== fs.statSync(asarPath).size) throw new Error('asar 读取长度与文件大小不符，已中止');
  log(`  归档内文件 ${entries.length} 个，共 ${asar.file.length} 字节`);

  const mainNode = findNode(asar.tree, MAIN_FILE);
  const original = readEntry(asar, MAIN_FILE).toString('utf8');
  const already = original.includes(ICON_MARKER) && original.includes(BRAND);
  if (already) {
    log(`  ${MAIN_FILE} 已经打过补丁（${mainNode.size} 字节）`);
  }

  let patched = null;
  if (!already) {
    log('自检：用本脚本重建原件');
    assertWriterFaithful(asar);
    log('  ✓ 重建结果与原件逐字节一致');

    log('打补丁');
    const result = patchMainJs(original, mainNode.size);
    if (!result.syntax) throw new Error('补丁后的 main.js 语法检查失败，已中止（未写入任何字节）');
    if (result.brandHits < 1) throw new Error('补丁后没有找到芭梧文案，已中止');
    log(`  语言表：${result.localeChanges} 处产品名 → ${BRAND}，${result.localeLines} 个键生效`);
    log(`  窗口图标：${result.iconInserted ? '已插入 BrowserWindow icon' : '已存在'}`);
    if (result.padded > 0) log(`  main.js 末尾补 ${result.padded} 个换行，字节数回到 ${mainNode.size}（保持归档偏移）`);
    patched = result.buffer;

    log('重建归档并复检');
    const built = buildAsar(asar, new Map([[MAIN_FILE, patched]]));
    if (built.length !== asar.file.length) throw new Error(`复检失败：产物 ${built.length} 字节 ≠ 原件 ${asar.file.length} 字节`);
    const sourceLayout = new Map(entries.map(({ path: entryPath, entry }) => [entryPath, `${entry.offset}/${entry.size}`]));
    const check = readAsarBuffer(built);
    const builtEntries = packedEntries(check.tree);
    if (builtEntries.length !== entries.length) throw new Error('复检失败：文件数不一致');
    for (const { path: entryPath, entry } of builtEntries) {
      if (sourceLayout.get(entryPath) !== `${entry.offset}/${entry.size}`) {
        throw new Error(`复检失败：${entryPath} 的偏移/大小变了`);
      }
      const expected = entryPath === MAIN_FILE ? patched : readEntry(asar, entryPath);
      if (!readEntry(check, entryPath).equals(expected)) throw new Error(`复检失败：${entryPath} 内容不符`);
    }
    if (findNode(check.tree, MAIN_FILE).integrity.hash !== sha256(patched)) throw new Error('复检失败：main.js integrity 未同步');
    log(`  ✓ ${builtEntries.length} 个文件逐一比对一致，integrity 已重算，全部偏移与原件相同`);

    if (!dryRun) {
      log('写入安装目录');
      writeInPlace(asarPath, built, log);
      const installedHash = sha256(fs.readFileSync(asarPath));
      log(`  ✓ app.asar 已就地更新（sha256 ${installedHash.slice(0, 16)}…）`);
    } else {
      log('--dry-run：不写入 app.asar');
    }
  }

  log('托盘 / 应用图标');
  applyAssets(appDir, log, dryRun);

  console.log('');
  if (dryRun) console.log('预演完成，没有改动任何文件。去掉 --dry-run 才会真正写入。');
  else console.log('完成。完全退出并重新打开 DeepSeek Harness 后生效（关窗口只是收进托盘，要在托盘里「退出」）。');
}

function readAsarBuffer(buffer) {
  const firstField = buffer.readUInt32LE(0);
  const headerPickleSize = buffer.readUInt32LE(4);
  const headerPayloadSize = buffer.readUInt32LE(8);
  const jsonLength = buffer.readUInt32LE(12);
  if (firstField !== 4) throw new Error(`asar: 意外的首字段 ${firstField}`);
  if (headerPayloadSize !== headerPickleSize - 4) throw new Error('asar: header pickle 长度不自洽');
  const tree = JSON.parse(buffer.subarray(16, 16 + jsonLength).toString('utf8'));
  return { file: buffer, tree, headerPickleSize, jsonLength, dataBase: 8 + headerPickleSize };
}

/** 用备份还原：app.asar 与图标一起回原样。 */
function restoreFlow(appDir, dryRun) {
  const log = (line) => console.log(line);
  const asarPath = path.join(appDir, 'resources', 'app.asar');
  const backup = path.join(appDir, BACKUP_RELATIVE, 'app.asar.orig');
  console.log(`安装目录：${appDir}`);
  if (!exists(backup)) {
    log(`没有找到备份：${backup}`);
    log('（只有跑过 apply 才会有备份；没打过补丁就无需还原。）');
  } else {
    const target = fs.readFileSync(backup);
    log(`备份：${backup}（${target.length} 字节）`);
    if (dryRun) log('--dry-run：不写入 app.asar');
    else writeInPlace(asarPath, target, log);
  }

  log('托盘 / 应用图标');
  restoreAssets(appDir, log, dryRun);

  console.log('');
  if (dryRun) console.log('预演完成，没有改动任何文件。');
  else console.log('完成。完全退出并重新打开 DeepSeek Harness 后生效。');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('用法: node apply.mjs --app <安装目录> [--dry-run] [--restore]');
    return;
  }
  const appDir = resolveAppDir(args.appDir);
  if (args.restore) restoreFlow(appDir, args.dryRun);
  else applyFlow(appDir, args.dryRun);
}

if (process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url) main();

export { applyFlow, restoreFlow, patchMainJs, patchLocaleBrand, patchWindowIcon, padToOriginalSize, readAsar, readAsarBuffer, buildAsar, packedEntries, findNode, readEntry, serializeHeader, diffRanges, integrityOf, sha256, MAIN_FILE, ICON_MARKER, BRAND, PRODUCT };
