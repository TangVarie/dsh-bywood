# BYWOOD visual system

Re-skins the DeepSeek Harness Web GUI to the **BYWOOD design system v5.8.2**
(palette v5.1, screen track) and replaces the product's own mark, wordmark,
title and icon with BYWOOD's.

## What it changes

| Layer | Approach |
|---|---|
| Palette | 138 `--dsw-alias-*` tokens are stacked over light/dark through the theme service's `overrideTokens()`. Canvas `#F3F4F6`/`#0F1318`, surface `#FFFFFF`/`#1B222B`, primary deep teal `#1E5754`/`#6AC1BD`, the ochre accent, four text tiers, hairlines and semantic states all come from `palette.json`. No component carries a second dark palette. |
| Radii | DeepSeek Harness' own scale (4/8/12/16/20/28) is kept. The BYWOOD rule is square corners; after comparing both variants the user chose the default radii, so this is the single deliberate deviation from the design system. |
| Depth | Menus, popovers, toasts and modals lose their shadows and blur; a 1px outline plus a lightness step forms the surface. Shadows survive only on bottom drawers. |
| Type | UI: PingFang SC → Hiragino Sans GB → Microsoft YaHei. Code and terminal use a monospace stack. Headings use a serif display stack; numbers are tabular so tables and stat pills align. |
| Typography | Transcript body is editorial: heading tiers, 1.7 leading paragraphs, hanging lists, quote blocks with a primary rule, tables with horizontal hairlines only (no vertical lines, no fills), code blocks and diffs, thin scrollbars. |
| Components | Settings dialog, tool-call cards, reasoning blocks and step groups, turn process and change cards, code-block banners, menus and dropdowns, right dock, and the running indicator are all brought onto the same tokens and rules; the pixel-whale animation is removed. |
| Copy | The composer placeholder becomes 「说说这一轮要推进什么, / 调用指令, @ 文件或对话」; functional labels stay as shipped. |
| Brand | The sidebar and blank-session hero show the BYWOOD square mark; the brand name reads 芭梧 BYWOOD; the document title, favicon and apple-touch-icon follow. The desktop shortcut, tray and window icons are the rounded BYWOOD icon (22% radius, four-band mark). |

## Installation and updates

The plugin ships through its own DeepSeek Harness plugin index:

```
https://raw.githubusercontent.com/TangVarie/dsh-bywood/main/index.json
```

Add that address once under Plugins → Discover → Add index source, then install the theme. Later versions show up on the same page as an update; the plugin itself never checks for updates or downloads code.

The page root carries `data-bywood-version` with the version that is actually loaded, so a stale page after an update is easy to spot.

## Usage

1. It applies as soon as the plugin is installed — the client bundle is loaded lazily by the page.
2. Light / dark / follow-system still work from Settings → Appearance; both palettes are mapped, so switching only flips tokens.
3. Uninstalling the plugin cleans up every token, stylesheet, brand slot and favicon it installed. The shell re-projects its own title.

## Known limits

- BYWOOD has no chat/composer component (that is its B-tier experiment area). This plugin derives them from the same tokens: the user message is a soft rounded bubble on `--dsw-specific-bubble` (BYWOOD `tint-primary`), the composer a surface with a hairline — no new colours.
- BYWOOD has no syntax-highlighting palette; the syntax theme still owns code colour, and this plugin only sets the surfaces beneath it.
- The brand teal `#7ED1CD` is used as a field only (`--color-field-brand`), never as text, border or icon foreground, per the design system.
- Desktop icons are replaced by swapping resource files in the installation directory (tray/window icon) and the desktop shortcut. `app.asar` is **not** modified — repacking it once caused a blank-window startup failure. The in-app welcome screen and update dialogs are untouched.
