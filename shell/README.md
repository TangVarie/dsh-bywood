# 桌面外壳补丁（可选）· 托盘名称 + 任务栏小窗图标

插件本体只改浏览器里的页面。还有三处品牌在 **Electron 主进程**里，浏览器半够不到，Host 半（主进程 spawn 出去的独立 node 子进程）也拿不到 `Tray` / `BrowserWindow`：

| 位置 | 不打补丁 | 打了补丁 |
|---|---|---|
| 任务栏隐藏图标区：悬浮名称 | `DeepSeek Harness` | `芭梧 BYWOOD` |
| 任务栏隐藏图标区：右键菜单 | 打开 / 退出 DeepSeek Harness | 打开 / 退出 芭梧 BYWOOD |
| 任务栏 hover 出来的小窗（缩略图）图标 | DSH 鲸鱼 | 芭梧方标 |
| 退出确认框标题 | `DeepSeek Harness` | `芭梧 BYWOOD` |

顺手把 `resources/tray.ico`（托盘图标）和 `resources/icon.png`（应用图标）换成芭梧的，原件先备份。

**这是可选的、装在本机的一步**，不随插件索引自动生效，DSH 升级后要重跑一次。

## 怎么用

Windows，装好插件之后：

1. 双击 `apply.cmd`（或 `powershell -ExecutionPolicy Bypass -File apply.ps1`）。
2. 看到「完成」后**完全退出 DeepSeek Harness 再打开**——关窗口只是收进托盘，要在托盘里右键「退出」。

脚本会自己找安装目录（参数 → `DSH_NODE_EXECUTABLE` → 卸载注册表 → 常见路径 → 开始菜单快捷方式）；找不到时手动指定：

```powershell
powershell -ExecutionPolicy Bypass -File apply.ps1 -AppDir "D:\deepseek harness"
```

常用开关：

| 命令 | 作用 |
|---|---|
| `apply.cmd` | 打补丁 |
| `apply.cmd -DryRun` | 预演：跑完全部校验，不写任何字节 |
| `restore.cmd` | 用备份还原 `app.asar` 与两个图标 |
| `node apply.mjs --app <目录> --restore --dry-run` | 命令行方式，等价 |

## 它到底改了什么

只有一处代码：`resources/app.asar` → `lib/main.js`。

1. **语言表 8 种语言 × 4 个键**：`aboutProduct`（托盘悬浮名 + 退出确认框标题）、`openApplication` / `quitApplication`（托盘右键两项）、`quitTitle`（退出确认框正文），产品名换成「芭梧 BYWOOD」。
2. **主窗口加图标**：`createWindow()` 的 `BrowserWindow` 里插一行

   ```js
   ...process.platform === "win32" ? { icon: join(process.resourcesPath, "tray.ico") } : {},
   ```

   任务栏缩略图预览、Alt-Tab 用的都是这个「窗口图标」；不设就回落到 exe 内嵌图标。

另外把 `shell/assets/` 里的 `tray.ico`、`icon.png` 复制进 `resources/`。

**字节数为什么不变**：补丁后用换行把 `main.js` 补回原来的字节数（848,505），归档里每个文件的 offset/size 都不变，于是可以**同位改写**——只覆盖真正变化的那几段字节（header 里 4 KiB 摘要段 + `main.js` 本体 384 KiB），不用替换 209 MB 的文件。好处：应用**正在运行**时也能装（不会被 Windows 文件锁挡住），改动面小到可以逐段核对。

## 安全闸

任何一条不过就停下，不写任何字节：

1. **写入器自检**：用同一套写入器把原件原样重建，必须与原件**逐字节相同**；
2. **产物复检**：重建后重新解析，20051 个归档内文件逐个比对（只允许 `main.js` 不同），每文件 `integrity`（SHA256 + 4 MiB 分块，空文件也有一块）重算，全部 offset/size 与原件一致；
3. **语法闸**：补丁后的 `main.js` 过 `node --check`；
4. **锚点闸**：`createWindow()` 的选项与语言表键都在、且各命中预期次数，否则报「bundle 结构已变」并退出（不做「差不多就行」的替换）；
5. **写后校验**：写完整文件比一遍 SHA256，不符就提示用 `restore.cmd`。

Electron 的 asar 读取器在读出每个文件时会核对 header 里的 SHA256，不符直接 `exitImmediately(1)`——所以每文件摘要必须重算，脚本做了，并且用应用自带的 Electron 读取器实测过安装目录里的产物。

## 回滚

```powershell
restore.cmd
```

用 `resources/bywood-backup/app.asar.orig`、`tray.ico.orig`、`icon.png.orig` 还原。备份只在第一次打补丁时写，之后不会被覆盖。

## 升级之后

`electron-updater` 更新会把 `app.asar` 与 `resources/` 整个换掉，补丁随之消失（托盘名称与小窗图标回到 DSH）。更新后重新双击 `apply.cmd` 即可——补丁是**基于本机当前安装现场生成**的，不存任何预编译产物，所以跨版本可用；真遇到 `bundle 结构已变`，说明 DSH 改了主进程代码形状，需要更新 `shell/apply.mjs` 里的锚点。

## 已知边界

- 只处理 Windows。macOS 的窗口/托盘图标走 `app.setAboutPanelOptions` 与 `Tray`，逻辑不同，没做。
- 不改 exe 内嵌图标（PE 资源，要 rcedit，且会影响代码签名；重装/升级也会覆盖）。
- 欢迎页与更新对话框的文案仍是 DSH 自己的（在 `renderer/` 资源里，本补丁不碰）。
- 没在真机启动上验证过「重启后一定正常」——脚本能证明的是「档案结构与内容正确、Electron 读取器能读」，启动由你的那次重启验证。出问题就 `restore.cmd`。
- 安装目录若在 `Program Files` 下，写入需要管理员权限；脚本会报错并提示。

## 文件

| 文件 | 作用 |
|---|---|
| `apply.mjs` | 全部逻辑：找目录 → 补丁 → 自检/复检 → 同位改写 → 图标 → 校验；`--restore` 走还原 |
| `apply.ps1` | 一键入口：找安装目录、选 runner（系统 node 优先，否则借应用自带 Electron）、透传退出码 |
| `apply.cmd` / `restore.cmd` | 双击入口 |
| `assets/tray.ico` | 芭梧托盘图标（16/24 单峰、32+ 四带） |
| `assets/icon.png` | 芭梧应用图标（128px） |
| `../test/shell-patch.test.mjs` | 补丁规则与 asar 写入器的单元测试 |
