# 芭梧 BYWOOD · DeepSeek Harness 主题插件

把 DeepSeek Harness 的 Web 界面换成芭梧：色板、字体、发丝线、去阴影去磨砂、品牌标志与词标。界面改造全部在浏览器半 `client.js` 里，不改安装目录、不重打包 `app.asar`。

这个仓库同时是**插件本体**和**插件索引**。装了 DSH 的机器只要添加一次索引地址，就能在「插件 → 发现」里安装芭梧；以后这个仓库登记了新版本，插件页会出现「更新」，点一下升级。

## 索引地址（一个网址）

```
https://raw.githubusercontent.com/TangVarie/dsh-bywood/main/index.json
```

GitHub 的 raw 域名在国内不一定稳定。读不到时可以把同一份索引换到别的静态地址，或者等网络恢复；插件代码本身也是从这个仓库按提交号取的。

## 装一次

1. 侧栏「插件」→「实验性插件」里打开「自定义插件索引」。
2. 插件页「发现」→「添加索引源」→ 粘贴上面的索引地址。
3. 找到「芭梧 BYWOOD 视觉系统」→ 安装。
4. 刷新页面。侧栏品牌位、标题、favicon 和整套配色应当换成芭梧。

装好之后，地址和版本都不用再管；更新在插件页点。

## 更新是怎么判断的

DSH 只在两种条件同时成立时给出「有可用更新」：

- 本机这份是从 **Git 提交**装的（`update: git`），不是本地 `link:` 目录；
- 索引里那个更高版本号的 `source`，和本机安装时用的仓库地址、目录完全一致。

所以每发一版必须走下面的流程，索引里的提交号要指向**真正包含这一版 `package.json` 的那次提交**。登记过的版本不要改指向、不要删：已经装了旧版的机器靠它判断自己是不是最新。

## 发一版

1. 改代码（`src/client.template.js` 或 `docs/palette.json`），把 `package.json` 的 `version` 加上去。
2. 重建并自检：

   ```bash
   node scripts/build.mjs
   node --check client.js
   node test/index.test.mjs
   ```

3. 提交、推送。
4. 记下这次提交的完整 40 位提交号，登记索引：

   ```bash
   node release.mjs <40 位提交号>
   ```

   脚本从那次提交里读 `package.json`（不读工作区），把版本、包名、`engines.dsh` 和发布时间写进 `index.json`；同一版本登记过会被拒绝。
5. 把改过的 `index.json` 再提交、推送。GitHub raw 有几分钟缓存，刷新插件页就能看到更新。

## 仓库结构

| 文件 | 作用 |
|---|---|
| `package.json` | 包清单：`dsh.bundle.patch`、`dsh.client`、`engines.dsh` |
| `cordis.patch.yml` | profile 里的一层：插入一行空插件，让浏览器半随包被发现 |
| `index.js` | Host 半（空 `apply`），只为让 bundle 有库存条目 |
| `client.js` | **构建产物**，DSH 实际加载的浏览器半 |
| `src/client.template.js` | 浏览器半的唯一手写源 |
| `scripts/build.mjs` | `docs/palette.json` + `TOKEN_MAP` + 模板 → `client.js` |
| `scripts/extract-svg.mjs` | 从 `src/assets` 抽内联 SVG → `.svg-literal.json` |
| `docs/palette.json` | 色板唯一事实源（BYWOOD v5.8.2） |
| `docs/DETAIL.zh.md` / `DETAIL.md` | 插件详情页正文 |
| `index.json` | 插件索引（format 1） |
| `lib.mjs` | 索引校验与版本登记 |
| `release.mjs` | 发版脚本 |
| `test/index.test.mjs` | 索引与版本登记的测试 |

## 本地开发

```bash
node scripts/build.mjs          # 重建 client.js
node test/index.test.mjs     # 测试
```

改 `client.js` 的源头是 `src/client.template.js`，不要直接改产物。浏览器半改完刷新页面即可；包清单或 Host 半改动要重启应用。

## 边界

- 只改 Web 界面。桌面快捷方式、托盘 / 窗口图标不在这个插件里；`app.asar` 不碰。
- BYWOOD 没有聊天 / 输入框构件，消息行与 composer 按同一套 token 推导，没有新增色值。
- 面板拖拽落位时的遮罩自带约 150ms 磨砂，外壳没有暴露覆盖钩子，这是唯一保留的例外。
- 插件不做版本自检；更新完全由 DSH 的插件索引判断。
