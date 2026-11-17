// Assemble the BYWOOD client half: theme-token table + inline brand SVGs + template.
//
// The token table is derived from docs/palette.json (the single colour source of
// truth) through TOKEN_MAP below, so no colour is ever typed by hand into the
// client. Run `node scripts/build.mjs` after editing the template or the palette.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = name => readFileSync(join(ROOT, name), 'utf8')
const write = (name, text) => writeFileSync(join(ROOT, name), text)

const manifest = JSON.parse(read('package.json'))
const palette = JSON.parse(read('docs/palette.json'))
const L = palette.screen.light
const D = palette.screen.dark
const v = (light, dark) => ({ light, dark })

/**
 * DSH alias token → BYWOOD screen token. Every right-hand value is a palette
 * key, so the generated table is auditable against palette.json one line at a
 * time. `pick` documents a deliberate role match that is not name-identical.
 */
const TOKEN_MAP = {
  // ── canvas & raised surfaces ───────────────────────────────────────────────
  '--dsw-alias-bg-base': v('bg', 'bg'),                       // app canvas, transcript paper
  '--dsw-alias-bg-layer-1': v('surface', 'surface'),          // sidebar / panel / composer
  '--dsw-alias-bg-layer-2': v('surface', 'surface'),          // modal, menu, toast
  '--dsw-alias-bg-layer-3': v('surface', 'surface'),          // stacked popover
  '--dsw-alias-bg-overlay': v('bgSecondary', 'bgSecondary'),  // overlay / dim layer
  '--dsw-alias-bg-module-platform': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-bg-multi-select': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-bg-skeleton': v('fill', 'fill'),
  '--dsw-alias-card-fill': v('bg', 'bg'),                     // card on canvas: one step down
  '--dsw-alias-card-fill-hover': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-card-tile-fill': v('fill', 'fill'),

  // ── text tiers (never pure black / pure white body text) ──────────────────
  '--dsw-alias-label-primary': v('textDark', 'textDark'),
  '--dsw-alias-label-primary-bluish': v('primary', 'primary'),
  '--dsw-alias-label-primary-dimmed': v('text', 'text'),
  '--dsw-alias-label-secondary': v('text', 'text'),
  '--dsw-alias-label-tertiary': v('textLight', 'textLight'),
  '--dsw-alias-label-caption': v('textMount', 'textMount'),
  '--dsw-alias-label-dimmed': v('textFaint', 'textFaint'),
  '--dsw-alias-label-primary-inverted': v('onPrimary', 'ink'),
  '--dsw-alias-label-primary-foreground': v('onPrimary', 'ink'),
  '--dsw-alias-label-on-color': v('onPrimary', 'onPrimary'),
  '--dsw-alias-label-document-preview': v('textLight', 'textLight'),
  '--dsw-alias-markdown-placeholder': v('textFaint', 'textFaint'),

  // ── hairline borders ──────────────────────────────────────────────────────
  '--dsw-alias-border-l1': v('border', 'border'),
  '--dsw-alias-border-l2': v('border', 'border'),
  '--dsw-alias-border-l3': v('borderStrong', 'borderStrong'),
  '--dsw-alias-border-l4': v('borderStrong', 'borderStrong'),
  '--dsw-alias-border-l2-darkmode-thin': v('border', 'border'),
  '--dsw-alias-border-selected': v('primary', 'primary'),
  '--dsw-alias-border-inverted': v('border', 'border'),
  '--dsw-alias-border-inverted2': v('border', 'border'),

  // ── interaction states: translucent fill, pale tint for the active row ────
  '--dsw-alias-interactive-bg-hover': v('fill', 'fill'),
  '--dsw-alias-interactive-bg-hover-solid': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-interactive-bg-active': v('tintPrimary', 'tintPrimary'),
  '--dsw-alias-interactive-bg-hover-accent': v('fill', 'fill'),
  '--dsw-alias-interactive-bg-hover-danger': v('tintAccent', 'tintAccent'),
  '--dsw-alias-turn-trigger-bg': v('fill', 'fill'),
  '--dsw-alias-turn-trigger-bg-hover': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-trajectory-accent': v('primary', 'primary'),

  // ── buttons: primary = the one saturated action block per view ────────────
  '--dsw-alias-brand-primary': v('primary', 'primary'),
  '--dsw-alias-brand-primary-invert': v('onPrimary', 'onPrimary'),
  '--dsw-alias-brand-accent': v('accent', 'accent'),
  '--dsw-alias-brand-primary-new-colorprimary-new-color': v('primary', 'primary'),
  '--dsw-alias-brand-text': v('textDark', 'textDark'),
  '--dsw-alias-button-primary-fill': v('primary', 'primary'),
  '--dsw-alias-button-primary-hover': v('primaryDark', 'primaryDark'),
  '--dsw-alias-button-primary-dimmed': v('tintPrimary', 'tintPrimary'),
  '--dsw-alias-button-elevated-fill': v('surface', 'surface'),
  '--dsw-alias-button-floating-fill': v('bg', 'bg'),
  '--dsw-alias-button-floating-hover': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-button-ghost-active-fill': v('tintPrimary', 'tintPrimary'),
  '--dsw-alias-button-ghost-active-hover': v('fill', 'fill'),
  '--dsw-alias-button-ghost-active-border': v('borderStrong', 'borderStrong'),
  '--dsw-alias-button-contrast-fill': v('textDark', 'textDark'),
  '--dsw-alias-button-tool-bar-fill': v('fill', 'fill'),
  '--dsw-alias-button-tool-bar-hover': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-button-tool-bar-fill-invisible': v('fill', 'fill'),
  '--dsw-alias-button-info-fill': v('primary', 'primary'),
  '--dsw-alias-button-info-hover': v('primaryDark', 'primaryDark'),
  '--dsw-alias-switch-thumb': v('surface', 'textLight'),

  // ── menus: opaque surface + hairline, zero blur, zero shadow ──────────────
  '--dsw-menu-surface-fill': v('surface', 'surface'),
  '--dsw-alias-menu-group-header-fill': v('surface', 'surface'),
  '--dsw-specific-menu': v('surface', 'surface'),
  '--dsw-alias-menu-icon': v('text', 'text'),
  '--dsw-specific-tip': v('bgSecondary', 'bgSecondary'),
  '--dsw-specific-selector': v('surface', 'surface'),
  '--dsw-specific-input-major': v('surface', 'surface'),
  '--dsw-specific-login-input': v('surface', 'surface'),

  // ── markdown & code: translucent fill so one rule works on every layer ────
  '--dsw-alias-markdown-code-block': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-markdown-code-block-banner': v('canvasLine', 'canvasLine'),
  '--dsw-alias-markdown-inline-code': v('fill', 'fill'),
  '--dsw-alias-markdown-code-segment-selected': v('surface', 'surface'),
  '--dsw-alias-markdown-code-segment-unselected': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-markdown-tag': v('fill', 'fill'),
  '--dsw-alias-markdown-citation': v('bgSecondary', 'bgSecondary'),

  // ── conversation bubbles: a pale tint block, ink text tiers inside ────────
  '--dsw-specific-bubble': v('tintPrimary', 'tintPrimary'),
  '--dsw-specific-bubble-highlight': v('borderStrong', 'borderStrong'),
  '--dsw-alias-bg-document-preview': v('bg', 'bg'),
  '--dsw-alias-bg-document-selection': v('tintPrimary', 'tintPrimary'),

  // ── sidebar column ────────────────────────────────────────────────────────
  '--dsw-specific-sidebar-fill': v('surface', 'surface'),
  '--dsw-specific-sidebar-nav-item-active': v('tintPrimary', 'tintPrimary'),
  '--dsw-specific-sidebar-nav-item-active-accent': v('tintPrimary', 'tintPrimary'),
  '--dsw-specific-sidebar-glass-fill': v('surface', 'surface'),
  '--dsw-specific-sidebar-glass-hover': v('bgSecondary', 'bgSecondary'),
  '--dsw-specific-sidebar-glass-collapsed-fill': v('surface', 'surface'),
  '--dsw-specific-sidebar-glass-collapsed-hover': v('bgSecondary', 'bgSecondary'),
  '--dsw-specific-sidebar-tint': v('surface', 'surface'),
  '--dsw-specific-sidebar-wash-top': v('surface', 'surface'),
  '--dsw-specific-sidebar-wash-bottom': v('surface', 'surface'),
  '--dsw-specific-sidebar-wash-top-clear': v('surface', 'surface'),
  '--dsw-specific-sidebar-wash-bottom-clear': v('surface', 'surface'),
  '--dsw-specific-sidebar-right-flash': v('accent', 'accent'),

  // ── status: semantic only, never decoration ────────────────────────────────
  '--dsw-alias-state-business-primary': v('primary', 'primary'),
  '--dsw-alias-state-business-tertiary': v('tintPrimary', 'tintPrimary'),
  '--dsw-alias-state-success-primary': v('success', 'success'),
  '--dsw-alias-state-success-secondary': v('success', 'success'),
  '--dsw-alias-state-success-tertiary': v('tintPrimary', 'tintPrimary'),
  '--dsw-alias-state-warn-primary': v('warning', 'warning'),
  '--dsw-alias-state-warn-secondary': v('warning', 'warning'),
  '--dsw-alias-state-warn-tertiary': v('tintAccent', 'tintAccent'),
  '--dsw-alias-state-warn-label': v('warningDeep', 'warningDeep'),
  '--dsw-alias-state-error-primary': v('danger', 'danger'),
  '--dsw-alias-state-error-secondary': v('danger', 'danger'),
  '--dsw-alias-state-idle-primary': v('borderStrong', 'borderStrong'),
  '--dsw-alias-link': v('accent', 'accent'),
  '--dsw-alias-state-done-primary': v('primary', 'primary'),

  // ── toasts / tooltip / hover card: the one dark chrome surface ────────────
  '--dsw-alias-toast-bg': v('textDark', 'onPrimary'),
  '--dsw-alias-toast-label': v('onPrimary', 'onPrimary'),
  '--dsw-alias-toast-action': v('fieldBrand', 'fieldBrand'),
  '--dsw-alias-tooltip-bg': v('primary', 'primary'),
  '--dsw-alias-tooltip-label': v('onPrimary', 'onPrimary'),
  '--dsw-alias-hovercard-bg': v('textDark', 'onPrimary'),
  '--dsw-alias-hovercard-label-primary': v('onPrimary', 'onPrimary'),
  '--dsw-alias-hovercard-label-secondary': v('textLight', 'textLight'),
  '--dsw-alias-hovercard-label-tertiary': v('textFaint', 'textFaint'),
  '--dsw-alias-hovercard-state-done': v('fieldBrand', 'fieldBrand'),
  '--dsw-alias-hovercard-state-error': v('danger', 'danger'),

  // ── illustration & decorative layers collapse to flat canvas steps ────────
  '--dsw-alias-illustration-background': v('bg', 'bg'),
  '--dsw-alias-illustration-surface': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-illustration-backing': v('borderStrong', 'borderStrong'),
  '--dsw-alias-illustration-detail': v('textFaint', 'textFaint'),
  '--dsw-alias-illustration-shadow': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-illustration-inset': v('bgSecondary', 'bgSecondary'),
  '--dsw-alias-label-shimmer': v('fill', 'fill'),
  '--dsw-alias-label-deep-diving': v('primary', 'primary'),
  '--dsw-alias-label-deep-diving-shimmer': v('tintPrimary', 'tintPrimary'),

  // ── file diffs: BYWOOD tints, not traffic-light fills ────────────────────
  '--dsw-alias-code-diff-added': v('tintPrimary', 'tintPrimary'),
  '--dsw-alias-code-diff-deleted': v('tintAccent', 'tintAccent'),
  '--dsw-alias-file-diff-added-bg': v('tintPrimary', 'tintPrimary'),
  '--dsw-alias-file-diff-added-gutter': v('tintPrimary', 'tintPrimary'),
  '--dsw-alias-file-diff-added-marker': v('primary', 'primary'),
  '--dsw-alias-file-diff-deleted-bg': v('tintAccent', 'tintAccent'),
  '--dsw-alias-file-diff-deleted-gutter': v('tintAccent', 'tintAccent'),
  '--dsw-alias-file-diff-deleted-marker': v('accent', 'accent'),

  // ── charts: one colour keeps one meaning ─────────────────────────────────
  '--dsw-alias-chart-messages': v('primary', 'primary'),
  '--dsw-alias-chart-system': v('textLight', 'textLight'),
  '--dsw-alias-chart-tools': v('accent', 'accent'),

  // ── asides / streaks ─────────────────────────────────────────────────────
  '--dsw-specific-file-upload-track': v('border', 'border'),
  '--dsw-specific-guide-hero': v('bgSecondary', 'bgSecondary'),
}

// Palette keys that exist only as CSS-composition helpers above.
const ALIASES = {
  textMount: L.textLight,            // caption: the lightest tier that still carries text
  ink: D.onPrimary,                  // ink text on light fills (dark mode)
  canvasLine: L.bg,                  // code-block banner sits on the canvas step
}

/** Resolve one palette key for one mode, failing loudly on an unknown key. */
function resolve(key, mode) {
  const table = mode === 'light' ? L : D
  if (key in table) return table[key]
  if (key in ALIASES) return ALIASES[key]
  throw new Error(`unknown palette key "${key}" for ${mode}`)
}

const tokens = {}
for (const [token, pair] of Object.entries(TOKEN_MAP)) {
  tokens[token] = { light: resolve(pair.light, 'light'), dark: resolve(pair.dark, 'dark') }
}

const branding = JSON.parse(read('.svg-literal.json'))
const svg = {
  iconViewBox: branding.iconViewBox,
  iconMarkBody: branding.iconMarkBody,
  bandsViewBox: branding.bandsViewBox,
  bandsBody: branding.bandsBody,
  markViewBox: branding.markViewBox,
  markBody: branding.markBody,
  horizontalViewBox: branding.horizontalViewBox,
  markPath: branding.markPath,
  wordmarkPath: branding.wordmarkPath,
  wPath: branding.wPath,
}

const template = read('src/client.template.js')
// 标志青（fieldBrand）由色板注入：品牌面色块用，src 里绝不出现裸 hex。
const FIELD_TINT = palette.screen.light.fieldBrand
const output = template
  .replace('__THEME_TOKENS__', JSON.stringify(tokens, null, 2))
  .replace('__BRAND_SVG__', JSON.stringify(svg, null, 2))
  .replace('__ICON_SVG__', JSON.stringify(read('src/assets/icon.svg').replace(/^BOM|^\uFEFF/, '').trim()))
  .replace('__FIELD_TINT__', FIELD_TINT)
  .replace('__BYWOOD_VERSION__', manifest.version)

if (output.includes('__THEME_TOKENS__') || output.includes('__BRAND_SVG__') || output.includes('__ICON_SVG__') || output.includes('__FIELD_TINT__') || output.includes('__BYWOOD_VERSION__')) {
  throw new Error('template placeholder left unreplaced')
}

write('client.js', output)
console.log(`client.js written: ${output.length} bytes, ${Object.keys(tokens).length} theme tokens`)
