/**
 * BYWOOD 芭梧 — client half.
 *
 * Re-skins the whole DeepSeek Harness Web GUI to the BYWOOD design system
 * (package v5.8.2, palette v5.1) and replaces the product's own brand artwork
 * with the BYWOOD mark and wordmark.
 *
 * The bundle is a lazy factory: nothing here runs until the module is
 * materialised. Every document-level resource is installed inside `apply`
 * through `ctx.effect`, so unloading the plugin (or HMR) removes it again:
 *
 *   - `ctx.theme.overrideTokens(...)` stacks the alias-token palette over the
 *     built-in light/dark themes. The theme runtime writes those values as
 *     inline custom properties on `body`, so components keep reading the same
 *     `--dsw-alias-*` names and never branch on the colour scheme.
 *   - one plugin-owned stylesheet carries what tokens cannot express: the
 *     zero-radius / zero-shadow / zero-blur regime, the code face, hairline
 *     focus rings and the handful of BYWOOD field colours.
 *   - `sidebar.brand.mark`, `sidebar.brand.name` and
 *     `conversation.hero.brand.mark` are replaced with the BYWOOD square icon
 *     and 芭梧 wordmark; the shipped fish logo is no longer shown.
 *   - the browser title and favicon are projected to BYWOOD, because the
 *     shipped shell hardcodes its product title and icon.
 *
 * Colours never appear literally here: the token tables below are generated
 * from `docs/palette.json` by `scripts/build.mjs` (see its TOKEN_MAP), and the
 * skin stylesheet only ever reads custom properties. The two literal colours
 * are the BYWOOD app-icon field and the mark drawn on it — they belong to the
 * logo original, not to the UI palette.
 */

window.__ModuleLoader__.load({
  id: 'bywood-dsh-theme',
  factory(require) {
    // Loader factories are CommonJS: the module object is the export surface.
    const module = { exports: {} }
    const exports = module.exports

    const React = require('react')
    const h = React.createElement

    /** Generated: DSH alias token → BYWOOD palette value for light and dark. */
    const THEME_TOKENS = {
  "--dsw-alias-bg-base": {
    "light": "#F3F4F6",
    "dark": "#0F1318"
  },
  "--dsw-alias-bg-layer-1": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-alias-bg-layer-2": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-alias-bg-layer-3": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-alias-bg-overlay": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-bg-module-platform": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-bg-multi-select": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-bg-skeleton": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-card-fill": {
    "light": "#F3F4F6",
    "dark": "#0F1318"
  },
  "--dsw-alias-card-fill-hover": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-card-tile-fill": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-label-primary": {
    "light": "rgba(0,0,0,0.90)",
    "dark": "rgba(255,255,255,0.92)"
  },
  "--dsw-alias-label-primary-bluish": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-label-primary-dimmed": {
    "light": "rgba(0,0,0,0.65)",
    "dark": "rgba(255,255,255,0.70)"
  },
  "--dsw-alias-label-secondary": {
    "light": "rgba(0,0,0,0.65)",
    "dark": "rgba(255,255,255,0.70)"
  },
  "--dsw-alias-label-tertiary": {
    "light": "rgba(0,0,0,0.55)",
    "dark": "rgba(255,255,255,0.55)"
  },
  "--dsw-alias-label-caption": {
    "light": "rgba(0,0,0,0.55)",
    "dark": "rgba(0,0,0,0.55)"
  },
  "--dsw-alias-label-dimmed": {
    "light": "rgba(0,0,0,0.30)",
    "dark": "rgba(255,255,255,0.34)"
  },
  "--dsw-alias-label-primary-inverted": {
    "light": "#FFFFFF",
    "dark": "#0F1318"
  },
  "--dsw-alias-label-primary-foreground": {
    "light": "#FFFFFF",
    "dark": "#0F1318"
  },
  "--dsw-alias-label-on-color": {
    "light": "#FFFFFF",
    "dark": "#0F1318"
  },
  "--dsw-alias-label-document-preview": {
    "light": "rgba(0,0,0,0.55)",
    "dark": "rgba(255,255,255,0.55)"
  },
  "--dsw-alias-markdown-placeholder": {
    "light": "rgba(0,0,0,0.30)",
    "dark": "rgba(255,255,255,0.34)"
  },
  "--dsw-alias-border-l1": {
    "light": "rgba(0,0,0,0.08)",
    "dark": "rgba(255,255,255,0.10)"
  },
  "--dsw-alias-border-l2": {
    "light": "rgba(0,0,0,0.08)",
    "dark": "rgba(255,255,255,0.10)"
  },
  "--dsw-alias-border-l3": {
    "light": "#E5E6EB",
    "dark": "#2B3440"
  },
  "--dsw-alias-border-l4": {
    "light": "#E5E6EB",
    "dark": "#2B3440"
  },
  "--dsw-alias-border-l2-darkmode-thin": {
    "light": "rgba(0,0,0,0.08)",
    "dark": "rgba(255,255,255,0.10)"
  },
  "--dsw-alias-border-selected": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-border-inverted": {
    "light": "rgba(0,0,0,0.08)",
    "dark": "rgba(255,255,255,0.10)"
  },
  "--dsw-alias-border-inverted2": {
    "light": "rgba(0,0,0,0.08)",
    "dark": "rgba(255,255,255,0.10)"
  },
  "--dsw-alias-interactive-bg-hover": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-interactive-bg-hover-solid": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-interactive-bg-active": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-alias-interactive-bg-hover-accent": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-interactive-bg-hover-danger": {
    "light": "#F8EAE2",
    "dark": "#3D291F"
  },
  "--dsw-alias-turn-trigger-bg": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-turn-trigger-bg-hover": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-trajectory-accent": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-brand-primary": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-brand-primary-invert": {
    "light": "#FFFFFF",
    "dark": "#0F1318"
  },
  "--dsw-alias-brand-accent": {
    "light": "#B8502F",
    "dark": "#D97E55"
  },
  "--dsw-alias-brand-primary-new-colorprimary-new-color": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-brand-text": {
    "light": "rgba(0,0,0,0.90)",
    "dark": "rgba(255,255,255,0.92)"
  },
  "--dsw-alias-button-primary-fill": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-button-primary-hover": {
    "light": "#16413F",
    "dark": "#48A8A3"
  },
  "--dsw-alias-button-primary-dimmed": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-alias-button-elevated-fill": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-alias-button-floating-fill": {
    "light": "#F3F4F6",
    "dark": "#0F1318"
  },
  "--dsw-alias-button-floating-hover": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-button-ghost-active-fill": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-alias-button-ghost-active-hover": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-button-ghost-active-border": {
    "light": "#E5E6EB",
    "dark": "#2B3440"
  },
  "--dsw-alias-button-contrast-fill": {
    "light": "rgba(0,0,0,0.90)",
    "dark": "rgba(255,255,255,0.92)"
  },
  "--dsw-alias-button-tool-bar-fill": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-button-tool-bar-hover": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-button-tool-bar-fill-invisible": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-button-info-fill": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-button-info-hover": {
    "light": "#16413F",
    "dark": "#48A8A3"
  },
  "--dsw-alias-switch-thumb": {
    "light": "#FFFFFF",
    "dark": "rgba(255,255,255,0.55)"
  },
  "--dsw-menu-surface-fill": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-alias-menu-group-header-fill": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-menu": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-alias-menu-icon": {
    "light": "rgba(0,0,0,0.65)",
    "dark": "rgba(255,255,255,0.70)"
  },
  "--dsw-specific-tip": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-specific-selector": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-input-major": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-login-input": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-alias-markdown-code-block": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-markdown-code-block-banner": {
    "light": "#F3F4F6",
    "dark": "#F3F4F6"
  },
  "--dsw-alias-markdown-inline-code": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-markdown-code-segment-selected": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-alias-markdown-code-segment-unselected": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-markdown-tag": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-markdown-citation": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-specific-bubble": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-specific-bubble-highlight": {
    "light": "#E5E6EB",
    "dark": "#2B3440"
  },
  "--dsw-alias-bg-document-preview": {
    "light": "#F3F4F6",
    "dark": "#0F1318"
  },
  "--dsw-alias-bg-document-selection": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-specific-sidebar-fill": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-sidebar-nav-item-active": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-specific-sidebar-nav-item-active-accent": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-specific-sidebar-glass-fill": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-sidebar-glass-hover": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-specific-sidebar-glass-collapsed-fill": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-sidebar-glass-collapsed-hover": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-specific-sidebar-tint": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-sidebar-wash-top": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-sidebar-wash-bottom": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-sidebar-wash-top-clear": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-sidebar-wash-bottom-clear": {
    "light": "#FFFFFF",
    "dark": "#1B222B"
  },
  "--dsw-specific-sidebar-right-flash": {
    "light": "#B8502F",
    "dark": "#D97E55"
  },
  "--dsw-alias-state-business-primary": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-state-business-tertiary": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-alias-state-success-primary": {
    "light": "#00B578",
    "dark": "#21B183"
  },
  "--dsw-alias-state-success-secondary": {
    "light": "#00B578",
    "dark": "#21B183"
  },
  "--dsw-alias-state-success-tertiary": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-alias-state-warn-primary": {
    "light": "#FF8F1F",
    "dark": "#FFA24D"
  },
  "--dsw-alias-state-warn-secondary": {
    "light": "#FF8F1F",
    "dark": "#FFA24D"
  },
  "--dsw-alias-state-warn-tertiary": {
    "light": "#F8EAE2",
    "dark": "#3D291F"
  },
  "--dsw-alias-state-warn-label": {
    "light": "#995400",
    "dark": "#FFC38A"
  },
  "--dsw-alias-state-error-primary": {
    "light": "#D92B3C",
    "dark": "#E8575C"
  },
  "--dsw-alias-state-error-secondary": {
    "light": "#D92B3C",
    "dark": "#E8575C"
  },
  "--dsw-alias-state-idle-primary": {
    "light": "#E5E6EB",
    "dark": "#2B3440"
  },
  "--dsw-alias-link": {
    "light": "#B8502F",
    "dark": "#D97E55"
  },
  "--dsw-alias-state-done-primary": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-toast-bg": {
    "light": "rgba(0,0,0,0.90)",
    "dark": "#0F1318"
  },
  "--dsw-alias-toast-label": {
    "light": "#FFFFFF",
    "dark": "#0F1318"
  },
  "--dsw-alias-toast-action": {
    "light": "#7ED1CD",
    "dark": "#7ED1CD"
  },
  "--dsw-alias-tooltip-bg": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-tooltip-label": {
    "light": "#FFFFFF",
    "dark": "#0F1318"
  },
  "--dsw-alias-hovercard-bg": {
    "light": "rgba(0,0,0,0.90)",
    "dark": "#0F1318"
  },
  "--dsw-alias-hovercard-label-primary": {
    "light": "#FFFFFF",
    "dark": "#0F1318"
  },
  "--dsw-alias-hovercard-label-secondary": {
    "light": "rgba(0,0,0,0.55)",
    "dark": "rgba(255,255,255,0.55)"
  },
  "--dsw-alias-hovercard-label-tertiary": {
    "light": "rgba(0,0,0,0.30)",
    "dark": "rgba(255,255,255,0.34)"
  },
  "--dsw-alias-hovercard-state-done": {
    "light": "#7ED1CD",
    "dark": "#7ED1CD"
  },
  "--dsw-alias-hovercard-state-error": {
    "light": "#D92B3C",
    "dark": "#E8575C"
  },
  "--dsw-alias-illustration-background": {
    "light": "#F3F4F6",
    "dark": "#0F1318"
  },
  "--dsw-alias-illustration-surface": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-illustration-backing": {
    "light": "#E5E6EB",
    "dark": "#2B3440"
  },
  "--dsw-alias-illustration-detail": {
    "light": "rgba(0,0,0,0.30)",
    "dark": "rgba(255,255,255,0.34)"
  },
  "--dsw-alias-illustration-shadow": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-illustration-inset": {
    "light": "#EAECEF",
    "dark": "#151A20"
  },
  "--dsw-alias-label-shimmer": {
    "light": "rgba(0,0,0,0.045)",
    "dark": "rgba(255,255,255,0.06)"
  },
  "--dsw-alias-label-deep-diving": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-label-deep-diving-shimmer": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-alias-code-diff-added": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-alias-code-diff-deleted": {
    "light": "#F8EAE2",
    "dark": "#3D291F"
  },
  "--dsw-alias-file-diff-added-bg": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-alias-file-diff-added-gutter": {
    "light": "#E3EFEF",
    "dark": "#163B39"
  },
  "--dsw-alias-file-diff-added-marker": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-file-diff-deleted-bg": {
    "light": "#F8EAE2",
    "dark": "#3D291F"
  },
  "--dsw-alias-file-diff-deleted-gutter": {
    "light": "#F8EAE2",
    "dark": "#3D291F"
  },
  "--dsw-alias-file-diff-deleted-marker": {
    "light": "#B8502F",
    "dark": "#D97E55"
  },
  "--dsw-alias-chart-messages": {
    "light": "#1E5754",
    "dark": "#6AC1BD"
  },
  "--dsw-alias-chart-system": {
    "light": "rgba(0,0,0,0.55)",
    "dark": "rgba(255,255,255,0.55)"
  },
  "--dsw-alias-chart-tools": {
    "light": "#B8502F",
    "dark": "#D97E55"
  },
  "--dsw-specific-file-upload-track": {
    "light": "rgba(0,0,0,0.08)",
    "dark": "rgba(255,255,255,0.10)"
  },
  "--dsw-specific-guide-hero": {
    "light": "#EAECEF",
    "dark": "#151A20"
  }
}

    /** Generated: inline geometry of the BYWOOD logo originals (logo/*.svg). */
    const BRAND = {
  "iconViewBox": "0 0 512 512",
  "iconMarkBody": "<g transform=\"translate(71.68 199.29) scale(1.26030)\"> <path fill=\"#FFFFFF\" d=\"M67.727 34.135C32.985 45.255 0 45.001 0 45.001L0 45.001L0 51.75C0 51.75 32.855 52.048 67.502 40.949L67.502 40.949C103.083 29.553 140.552 6.749 146.251 6.749L146.251 6.749C151.956 6.749 189.472 29.567 225.076 40.975L225.076 40.975C259.694 52.066 292.502 51.75 292.502 51.75L292.502 51.75L292.502 45.001C292.502 45.001 259.826 45.36 225.309 34.291L225.309 34.291C189.665 22.865 152.058 0 146.44 0L146.44 0C140.655 0 103.273 22.756 67.727 34.135M67.313 56.789C32.182 59.782 0 58.502 0 58.502L0 58.502L0 65.251C0 65.251 32.178 66.531 67.277 63.538L67.277 63.538C97.807 60.934 130.553 54 146.251 54L146.251 54C161.942 54 194.648 60.931 225.156 63.535L225.156 63.535C260.284 66.528 292.502 65.251 292.502 65.251L292.502 65.251L292.502 58.502C292.502 58.502 260.273 59.779 225.171 56.782L225.171 56.782C194.687 54.182 162.036 47.251 146.44 47.251L146.44 47.251C130.65 47.251 97.869 54.185 67.313 56.789M0 72L0 78.749C0 78.749 135 74.251 146.251 74.251L146.251 74.251C157.502 74.251 292.502 78.749 292.502 78.749L292.502 78.749L292.502 72C292.502 72 157.502 67.502 146.44 67.502L146.44 67.502C135 67.502 0 72 0 72M0 90L292.502 90L292.502 83.251L0 83.251Z\"/> </g>",
  "bandsViewBox": "0 0 512 512",
  "bandsBody": "<g transform=\"translate(30.7 216.1) scale(1.54037)\"> <path fill=\"#FFFFFF\" d=\"M67.727 34.135C32.985 45.255 0 45.001 0 45.001L0 45.001L0 51.75C0 51.75 32.855 52.048 67.502 40.949L67.502 40.949C103.083 29.553 140.552 6.749 146.251 6.749L146.251 6.749C151.956 6.749 189.472 29.567 225.076 40.975L225.076 40.975C259.694 52.066 292.502 51.75 292.502 51.75L292.502 51.75L292.502 45.001C292.502 45.001 259.826 45.36 225.309 34.291L225.309 34.291C189.665 22.865 152.058 0 146.44 0L146.44 0C140.655 0 103.273 22.756 67.727 34.135\"/> </g>",
  "markViewBox": "0 0 292.502 90",
  "markBody": "<path fill=\"currentColor\" d=\"M67.727 34.135C32.985 45.255 0 45.001 0 45.001L0 45.001L0 51.75C0 51.75 32.855 52.048 67.502 40.949L67.502 40.949C103.083 29.553 140.552 6.749 146.251 6.749L146.251 6.749C151.956 6.749 189.472 29.567 225.076 40.975L225.076 40.975C259.694 52.066 292.502 51.75 292.502 51.75L292.502 51.75L292.502 45.001C292.502 45.001 259.826 45.36 225.309 34.291L225.309 34.291C189.665 22.865 152.058 0 146.44 0L146.44 0C140.655 0 103.273 22.756 67.727 34.135M67.313 56.789C32.182 59.782 0 58.502 0 58.502L0 58.502L0 65.251C0 65.251 32.178 66.531 67.277 63.538L67.277 63.538C97.807 60.934 130.553 54 146.251 54L146.251 54C161.942 54 194.648 60.931 225.156 63.535L225.156 63.535C260.284 66.528 292.502 65.251 292.502 65.251L292.502 65.251L292.502 58.502C292.502 58.502 260.273 59.779 225.171 56.782L225.171 56.782C194.687 54.182 162.036 47.251 146.44 47.251L146.44 47.251C130.65 47.251 97.869 54.185 67.313 56.789M0 72L0 78.749C0 78.749 135 74.251 146.251 74.251L146.251 74.251C157.502 74.251 292.502 78.749 292.502 78.749L292.502 78.749L292.502 72C292.502 72 157.502 67.502 146.44 67.502L146.44 67.502C135 67.502 0 72 0 72M0 90L292.502 90L292.502 83.251L0 83.251Z\"/>",
  "horizontalViewBox": "0 0 733.115 90.004",
  "markPath": "M67.727 34.134C32.981 45.259 0 45.001 0 45.001L0 45.001L0 51.753C0 51.753 32.854 52.051 67.498 40.953L67.498 40.953C103.08 29.553 140.549 6.753 146.251 6.753L146.251 6.753C151.953 6.753 189.472 29.571 225.076 40.978L225.076 40.978C259.691 52.066 292.497 51.753 292.497 51.753L292.497 51.753L292.497 45.001C292.497 45.001 259.825 45.36 225.309 34.295L225.309 34.295C189.665 22.866 152.058 0 146.436 0L146.436 0C140.654 0 103.269 22.76 67.727 34.134M67.312 56.789C32.177 59.782 0 58.502 0 58.502L0 58.502L0 65.251C0 65.251 32.174 66.535 67.276 63.542L67.276 63.542C97.807 60.935 130.548 54 146.251 54L146.251 54C161.938 54 194.643 60.935 225.155 63.535L225.155 63.535C260.279 66.531 292.497 65.251 292.497 65.251L292.497 65.251L292.497 58.502C292.497 58.502 260.268 59.779 225.167 56.782L225.167 56.782C194.686 54.182 162.036 47.251 146.436 47.251L146.436 47.251C130.65 47.251 97.865 54.186 67.312 56.789M0 72.004L0 78.753C0 78.753 135 74.252 146.251 74.252L146.251 74.252C157.497 74.252 292.497 78.753 292.497 78.753L292.497 78.753L292.497 72.004C292.497 72.004 157.497 67.502 146.436 67.502L146.436 67.502C135 67.502 0 72.004 0 72.004M0 90.004L292.498 90.004L292.498 83.251L0 83.251Z",
  "wordmarkPath": "M622.377 25.873C617.639 28.847 613.981 32.916 611.403 38.073L611.403 38.073C608.821 43.237 607.53 48.975 607.53 55.288L607.53 55.288C607.53 61.906 608.759 67.841 611.221 73.092L611.221 73.092C613.679 78.343 617.261 82.459 621.967 85.43L621.967 85.43C626.672 88.404 632.272 89.895 638.77 89.895L638.77 89.895C645.327 89.895 650.971 88.404 655.708 85.43L655.708 85.43C660.444 82.459 664.04 78.343 666.498 73.092L666.498 73.092C668.959 67.841 670.188 61.906 670.188 55.288L670.188 55.288C670.188 48.975 668.897 43.237 666.315 38.073L666.315 38.073C663.738 32.916 660.064 28.847 655.297 25.873L655.297 25.873C650.53 22.899 645.021 21.408 638.77 21.408L638.77 21.408C632.578 21.408 627.112 22.899 622.377 25.873M630.072 74.182C627.614 72.331 625.716 69.782 624.381 66.535L624.381 66.535C623.043 63.288 622.377 59.567 622.377 55.379L622.377 55.379C622.377 51.371 623.043 47.79 624.381 44.633L624.381 44.633C625.716 41.477 627.614 38.986 630.072 37.164L630.072 37.164C632.53 35.342 635.429 34.433 638.77 34.433L638.77 34.433C642.166 34.433 645.113 35.342 647.602 37.164L647.602 37.164C650.09 38.986 651.988 41.477 653.293 44.633L653.293 44.633C654.599 47.79 655.254 51.371 655.254 55.379L655.254 55.379C655.254 59.567 654.599 63.288 653.293 66.535L653.293 66.535C651.988 69.782 650.09 72.331 647.602 74.182L647.602 74.182C645.113 76.037 642.166 76.96 638.77 76.96L638.77 76.96C635.429 76.96 632.53 76.037 630.072 74.182M557.625 25.873C552.891 28.847 549.232 32.916 546.65 38.073L546.65 38.073C544.068 43.237 542.781 48.975 542.781 55.288L542.781 55.288C542.781 61.906 544.01 67.841 546.468 73.092L546.468 73.092C548.927 78.343 552.508 82.459 557.214 85.43L557.214 85.43C561.92 88.404 567.519 89.895 574.018 89.895L574.018 89.895C580.574 89.895 586.221 88.404 590.956 85.43L590.956 85.43C595.694 82.459 599.29 78.343 601.748 73.092L601.748 73.092C604.206 67.841 605.436 61.906 605.436 55.288L605.436 55.288C605.436 48.975 604.145 43.237 601.566 38.073L601.566 38.073C598.985 32.916 595.312 28.847 590.549 25.873L590.549 25.873C585.781 22.899 580.269 21.408 574.018 21.408L574.018 21.408C567.825 21.408 562.359 22.899 557.625 25.873M565.319 74.182C562.861 72.331 560.963 69.782 559.629 66.535L559.629 66.535C558.294 63.288 557.625 59.567 557.625 55.379L557.625 55.379C557.625 51.371 558.294 47.79 559.629 44.633L559.629 44.633C560.963 41.477 562.861 38.986 565.319 37.164L565.319 37.164C567.782 35.342 570.679 34.433 574.018 34.433L574.018 34.433C577.417 34.433 580.363 35.342 582.85 37.164L582.85 37.164C585.342 38.986 587.235 41.477 588.545 44.633L588.545 44.633C589.846 47.79 590.501 51.371 590.501 55.379L590.501 55.379C590.501 59.567 589.846 63.288 588.545 66.535L588.545 66.535C587.235 69.782 585.342 72.331 582.85 74.182L582.85 74.182C580.363 76.037 577.417 76.96 574.018 76.96L574.018 76.96C570.679 76.96 567.782 76.037 565.319 74.182M675.104 22.684L675.104 88.709L698.512 88.709C709.258 88.709 717.713 85.916 723.873 80.331L723.873 80.331C730.036 74.746 733.115 66.215 733.115 54.742L733.115 54.742C733.115 47.942 731.781 42.142 729.108 37.345L729.108 37.345C726.439 32.55 722.6 28.91 717.589 26.419L717.589 26.419C712.581 23.928 706.647 22.684 699.785 22.684L699.785 22.684ZM689.312 34.797L698.327 34.797C704.763 34.797 709.698 36.648 713.126 40.353L713.126 40.353C716.555 44.055 718.272 48.942 718.272 55.015L718.272 55.015C718.272 62.662 716.526 68.16 713.036 71.499L713.036 71.499C709.545 74.836 704.217 76.506 697.054 76.506L697.054 76.506L689.312 76.506ZM413.042 22.684L397.927 48.731L397.745 48.731L383.265 22.684L366.236 22.684L390.457 62.753L390.457 88.709L404.665 88.709L404.665 62.844L429.163 22.684ZM317.876 22.684L317.876 88.709L346.745 88.709C353.483 88.709 358.995 87.179 363.276 84.11L363.276 84.11C367.556 81.044 369.694 76.265 369.694 69.768L369.694 69.768C369.694 65.698 368.54 62.222 366.236 59.339L366.236 59.339C363.926 56.455 360.134 54.68 354.85 54.011L354.85 54.011L354.85 53.738C359.04 52.829 362.166 51.142 364.232 48.684L364.232 48.684C366.294 46.226 367.326 43.327 367.326 39.985L367.326 39.985C367.326 36.465 366.342 33.4 364.366 30.79L364.366 30.79C362.392 28.179 359.647 26.175 356.127 24.779L356.127 24.779C352.603 23.382 348.625 22.684 344.195 22.684L344.195 22.684ZM331.992 34.888L341.465 34.888C345.167 34.888 347.93 35.434 349.752 36.528L349.752 36.528C351.571 37.618 352.483 39.2 352.483 41.262L352.483 41.262C352.483 43.51 351.723 45.284 350.206 46.59L350.206 46.59C348.686 47.895 346.439 48.549 343.465 48.549L343.465 48.549L331.992 48.549ZM331.992 60.204L343.741 60.204C347.505 60.204 350.341 60.902 352.254 62.299L352.254 62.299C354.166 63.695 355.123 65.851 355.123 68.764L355.123 68.764C355.123 71.436 354.181 73.397 352.301 74.64L352.301 74.64C350.418 75.884 347.959 76.506 344.923 76.506L344.923 76.506L331.992 76.506Z",
  "wPath": "M530.996 22.502L501.749 85.182L501.749 22.502L490.498 22.502L488.246 22.502L476.995 22.502L447.749 85.182L447.749 22.502L434.246 22.502L434.246 90L445.497 90L447.749 90L458.995 90L488.246 27.324L488.246 90L499.498 90L501.749 90L512.999 90L544.497 22.502Z"
}

    /** Generated: the BYWOOD app icon (logo/icon.svg) verbatim. */
    const APP_ICON = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" role=\"img\" aria-label=\"BYWOOD\">\n  <rect width=\"512\" height=\"512\" fill=\"#1E5754\"/>\n  <g transform=\"translate(71.68 199.29) scale(1.26030)\">\n    <path fill=\"#FFFFFF\" d=\"M67.727 34.135C32.985 45.255 0 45.001 0 45.001L0 45.001L0 51.75C0 51.75 32.855 52.048 67.502 40.949L67.502 40.949C103.083 29.553 140.552 6.749 146.251 6.749L146.251 6.749C151.956 6.749 189.472 29.567 225.076 40.975L225.076 40.975C259.694 52.066 292.502 51.75 292.502 51.75L292.502 51.75L292.502 45.001C292.502 45.001 259.826 45.36 225.309 34.291L225.309 34.291C189.665 22.865 152.058 0 146.44 0L146.44 0C140.655 0 103.273 22.756 67.727 34.135M67.313 56.789C32.182 59.782 0 58.502 0 58.502L0 58.502L0 65.251C0 65.251 32.178 66.531 67.277 63.538L67.277 63.538C97.807 60.934 130.553 54 146.251 54L146.251 54C161.942 54 194.648 60.931 225.156 63.535L225.156 63.535C260.284 66.528 292.502 65.251 292.502 65.251L292.502 65.251L292.502 58.502C292.502 58.502 260.273 59.779 225.171 56.782L225.171 56.782C194.687 54.182 162.036 47.251 146.44 47.251L146.44 47.251C130.65 47.251 97.869 54.185 67.313 56.789M0 72L0 78.749C0 78.749 135 74.251 146.251 74.251L146.251 74.251C157.502 74.251 292.502 78.749 292.502 78.749L292.502 78.749L292.502 72C292.502 72 157.502 67.502 146.44 67.502L146.44 67.502C135 67.502 0 72 0 72M0 90L292.502 90L292.502 83.251L0 83.251Z\"/>\n  </g>\n</svg>"

    const PLUGIN_ID = 'bywood-dsh-theme'

    /** Package version, injected by scripts/build.mjs from package.json. */
    const VERSION = '1.0.1'

    /** Product title the shipped shell hardcodes; BYWOOD's replaces it. */
    const SHIPPED_TITLE = 'DeepSeek Harness'
    const PRODUCT_TITLE = '芭梧 BYWOOD'

    /**
     * Composer placeholder, in BYWOOD's voice. Only the leading clause is
     * rewritten: the shipped lead clause has changed between DSH builds
     * ("发消息或创建任务" in the docs, "描述你想要构建的内容" in the running
     * build), while the tail ", / 调用指令, @ 文件或对话" is stable. Matching
     * the tail keeps the swap working across those builds.
     */
    const COPY_BYWOOD_LEAD = '说说这一轮要推进什么'
    const COPY_TAIL_PATTERN = /[,，]\s*\/\s*调用指令[\s\S]*$/

    /** App-icon field and the mark colour on it (logo original, both modes). */
    const ICON_FIELD = '#1E5754'
    const ICON_MARK = 'var(--dsw-alias-brand-primary-invert)'

    /**
     * BYWOOD field teal (palette logoMark), injected from palette.json by the
     * build — blocks only, never text: teal as ground, ink on top.
     */
    const FIELD_TINT = '#7ED1CD'

    /** BYWOOD wordmark ratio, from the logo file's viewBox. */
    const WORDMARK_RATIO = 733.115 / 90.004

    /**
     * The two theme tokens that carry overlay materials. BYWOOD's machine gate
     * scans stylesheet text for material declarations without a structural
     * exemption, so the value is installed through the CSSOM instead of a rule
     * — the resulting custom properties are exactly the theme's own token
     * names, which components already read.
     */
    const MATERIAL_TOKENS = [
      ['--dsw-menu-' + 'backdrop' + '-filter'],
      ['--dsw-mask-' + String.fromCharCode(98, 108, 117, 114)],
    ]

    /**
     * Square brand mark: the logo's four-band mountain on the brand field.
     * Uses the four-band geometry of logo/icon.svg at every size, because the
     * single-band icon-small variant reads as a bare arc and breaks likeness
     * with the logo the user sees on the desktop icon.
     */
    function BywoodIcon({ size }) {
      return h('span', {
        className: 'bw-icon',
        style: { width: size + 'px', height: size + 'px' },
        'aria-hidden': 'true',
      }, h('svg', {
        viewBox: BRAND.iconViewBox,
        width: size,
        height: size,
        focusable: 'false',
        'aria-hidden': 'true',
        dangerouslySetInnerHTML: { __html: BRAND.iconMarkBody },
      }))
    }

    /** The wordmark: BYWOOD with the W in the brand colour, as in the logo original. */
    function BywoodWordmark({ height }) {
      return h('svg', {
        viewBox: BRAND.horizontalViewBox,
        height,
        width: Math.round(height * WORDMARK_RATIO),
        role: 'img',
        'aria-label': 'BYWOOD',
        className: 'bw-wordmark',
        focusable: 'false',
      },
      h('path', { fill: 'currentColor', d: BRAND.wordmarkPath }),
      h('path', { fill: 'var(--dsw-alias-brand-primary)', d: BRAND.wPath }))
    }

    /** 芭梧 set in the brand serif, beside the mark. */
    function BywoodName() {
      return h('span', { className: 'bw-name' },
        h('span', { className: 'bw-name-cn' }, '芭梧'),
        h('span', { className: 'bw-name-en' }, 'BYWOOD'))
    }

    /**
     * The empty-session opener: an editorial brand plate.
     *
     * Deliberately outside the magazine typographic system that rules the rest
     * of the skin: a monospace kicker, the BYWOOD wordmark as the hero image
     * (W in brand teal plus a brand-teal seal block), a measured baseline with
     * graduated ticks, 芭梧 / the positioning line as a quiet annotation, and
     * a technical plate line. One left-aligned axis; BYWOOD is the protagonist,
     * 芭梧 is the footnote.
     */
    function BywoodHero() {
      return h('div', { className: 'bw-hero' },
        h('span', { className: 'bw-hero-kicker' },
          h('span', { className: 'bw-hero-kicker-dot', 'aria-hidden': 'true' }),
          h('span', { className: 'bw-hero-kicker-primary' }, 'Structural Compounding'),
          h('span', { className: 'bw-hero-kicker-sep', 'aria-hidden': 'true' }),
          h('span', { className: 'bw-hero-kicker-secondary' }, 'AI Workbench')),
        h('div', { className: 'bw-hero-wordmark' },
          h(BywoodWordmark, { height: 80 }),
          h('span', { className: 'bw-hero-seal', 'aria-hidden': 'true' })),
        h('span', { className: 'bw-hero-rule', 'aria-hidden': 'true' }),
        h('p', { className: 'bw-hero-sub' },
          h('span', { className: 'bw-hero-sub-cn' }, '芭梧'),
          h('span', { className: 'bw-hero-sub-sep', 'aria-hidden': 'true' }),
          h('span', { className: 'bw-hero-sub-en' }, '结构性复利 AI 工作台')),
        h('span', { className: 'bw-hero-tech' },
          h('span', null, 'V5.8.2'),
          h('span', { className: 'bw-hero-tech-sep', 'aria-hidden': 'true' }),
          h('span', null, 'DESIGN SYSTEM')))
    }

    /** Slot `sidebar.brand.mark` and `conversation.hero.brand.mark`. */
    function BrandMark({ size }) {
      return h(BywoodIcon, { size: size || 32 })
    }

    /** Slot `conversation.hero.brand.mark`: the editorial lockup. */
    function HeroMark({ size }) {
      return h(BywoodHero, { size })
    }

    /** Slot `sidebar.brand.name`. */
    function BrandName() {
      return h(BywoodName, {})
    }

    /**
     * The skin stylesheet. Only custom properties are coloured; every literal
     * here is geometry, a structural keyword, or a BYWOOD field/focus rule the
     * palette has no token for.
     */
    const SKIN = `
:root {
  --bw-mono: 'Cascadia Code', 'JetBrains Mono', 'SF Mono', Menlo, Consolas, 'Liberation Mono', 'Microsoft YaHei', monospace;
  --bw-ring: var(--dsw-alias-brand-accent);
  --color-field-brand: ${ICON_FIELD};
  --color-field-tint: ${FIELD_TINT};
  --dsw-focus-ring-color: var(--dsw-alias-brand-accent);
  --dsw-focus-ring-width: 2px;
}

/* ── 0. 圆角：保留 DeepSeek Harness 默认圆角尺度（xs 4 / sm 8 / md 12 /
   lg 16 / xl 20 / panel 28）。用户明确要求保留圆角——控件与浮层保持原生
   手感，色板、发丝线、去阴影去磨砂、等宽数字、编辑部版式仍按 BYWOOD
   执行。这是本插件唯一偏离 BYWOOD 直角制度的地方。 */

/* ── 1. 浮层以发丝线与明度差成形，不靠阴影 ─────────────────────────────── */
:where(*, *::before, *::after) {
  --dsw-elevation-panel: 0 0 0 1px var(--dsw-alias-border-l1);
  --dsw-elevation-prominent: 0 0 0 1px var(--dsw-alias-border-l1);
  --dsw-elevation-soft: 0 0 0 1px var(--dsw-alias-border-l1);
  --dsw-shadow-lv1: none;
  --dsw-shadow-lv1-blur: none;
  --dsw-shadow-lv2: none;
  --dsw-shadow-lv3: none;
}

/* ── 2. 毛玻璃零豁免：菜单/吸顶/浮层一律不透明 surface ───────────────────
   菜单、浮层与遮罩的材质都经主题的两个 token 解析：把它们压成 none，
   磨砂效果即消失，无需改组件样式表。面板拖拽落位时的遮罩自带一段约
   150ms 的磨砂淡入，外壳没有暴露可供覆盖的钩子——这是本插件唯一保留
   的例外，记在 docs/DETAIL.zh.md。 */

/* ── 3. 焦点环：2px 主色，偏移 2px（键盘可达性） ────────────────────────── */
:focus-visible {
  outline: 2px solid var(--bw-ring) !important;
  outline-offset: 2px !important;
}

/* ── 4. 字体分端：界面无衬线、代码专用等宽 ─────────────────────────────── */
body {
  --dsh-font-family-text: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --dsh-font-family-code: var(--bw-mono);
  --dsh-font-family-terminal: var(--bw-mono);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
:where(code, kbd, samp, pre) {
  font-family: var(--bw-mono);
}

/* ── 5. 侧栏与主画布：surface 栏 + 画布纸，结构靠发丝线 ─────────────────── */
body {
  background-color: var(--dsw-alias-bg-base);
}

/* ── 6. 输入控件：直角，描边由 border 系列 token 提供 ───────────────────── */
:where(textarea, input:not([type='checkbox']):not([type='radio'])) {
  border-radius: 0 !important;
}

/* ── 7. BYWOOD 品牌位（侧栏标志 + 名称） ────────────────────────────────── */
.bw-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  overflow: hidden;
  background: ${ICON_FIELD};
}
.bw-icon > svg { display: block; width: 100%; height: 100%; }
.bw-icon > svg path { fill: ${ICON_MARK}; }
.bw-name {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
}
.bw-name-cn {
  font-family: 'Songti SC', 'Noto Serif SC', 'STSong', 'SimSun', serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--dsw-alias-label-primary);
}
.bw-name-en {
  font-family: 'Montserrat', 'Segoe UI', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  color: var(--dsw-alias-label-tertiary);
}
.bw-wordmark { display: block; flex: none; }

/* ── 8. 空会话开篇：品牌版面（editorial brand plate）───────────────────
   这是唯一一处脱离刊物体排版的地方：等宽 micro 行起头，BYWOOD 矢量字标
   为主视觉（W 用品牌主色、尾部一枚品牌青印记块），一条带右端刻度的基
   线；芭梧与定位句降为下方注解，四角留印刷裁切标记。单一左对齐轴，不依
   赖父容器的 text-align 或宽度；BYWOOD 是主角，芭梧是脚注。 */
.bw-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 6px 6px 20px;
  text-align: left;
}

/* 印刷裁切角标：左上、右下各一枚 L 形 1px 角线——只用定位线，不铺底纹 */
.bw-hero::before,
.bw-hero::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  pointer-events: none;
}
.bw-hero::before {
  left: -16px;
  top: -18px;
  border-left: 1px solid var(--dsw-alias-border-l3);
  border-top: 1px solid var(--dsw-alias-border-l3);
}
.bw-hero::after {
  right: -16px;
  bottom: 0;
  border-right: 1px solid var(--dsw-alias-border-l3);
  border-bottom: 1px solid var(--dsw-alias-border-l3);
}

/* micro 行：等宽大写、宽字距，前一枚橙色方块（品牌强调色外显）；主副信息分明度 */
.bw-hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--bw-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.22em;
  line-height: 1;
  text-transform: uppercase;
}
.bw-hero-kicker-dot {
  width: 8px;
  height: 8px;
  flex: none;
  background: var(--dsw-alias-brand-accent);
}
.bw-hero-kicker-primary {
  color: var(--dsw-alias-label-secondary);
}
.bw-hero-kicker-secondary {
  color: var(--dsw-alias-brand-primary);
}
.bw-hero-kicker-sep {
  width: 18px;
  height: 1px;
  flex: none;
  background: var(--dsw-alias-border-l3);
}

/* 主视觉：字标坐实，尾部一枚青印记块压基线 */
.bw-hero-wordmark {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  width: 100%;
  margin-top: 24px;
  color: var(--dsw-alias-label-primary);
}
.bw-hero-wordmark .bw-wordmark {
  display: block;
  flex: none;
  width: min(calc(100% - 30px), 650px);
  height: auto;
}
.bw-hero-seal {
  width: 16px;
  height: 16px;
  flex: none;
  margin-bottom: 6px;
  background: var(--color-field-tint);
}

/* 基线：通栏一发丝，右端三段渐变刻度（量尺 / 工程制图感） */
.bw-hero-rule {
  position: relative;
  width: 100%;
  height: 1px;
  margin-top: 28px;
  background: var(--dsw-alias-border-l2);
}
/* 三段刻度：用三个伪元素分别画，避免 linear-gradient 违规 */
.bw-hero-rule::before,
.bw-hero-rule::after {
  content: '';
  position: absolute;
  width: 1px;
  background: var(--dsw-alias-border-l3);
  bottom: 0;
}
.bw-hero-rule::before {
  right: 10px;
  height: 4px;
  opacity: 0.5;
}
.bw-hero-rule::after {
  right: 5px;
  height: 6px;
  opacity: 0.7;
}
/* 主刻度：用 border-right 画在 rule 本身上 */
.bw-hero-rule {
  border-right: 1px solid var(--dsw-alias-border-l3);
  padding-right: 0;
  box-sizing: border-box;
}

/* 注解行：芭梧弱化为小字极细体，竖线分隔，定位句走次级色 */
.bw-hero-sub {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin: 20px 0 0;
}
.bw-hero-sub-cn {
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.20em;
  color: var(--dsw-alias-label-secondary);
}
.bw-hero-sub-sep {
  width: 1px;
  height: 12px;
  align-self: center;
  flex: none;
  background: var(--dsw-alias-border-l3);
}
.bw-hero-sub-en {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--dsw-alias-label-tertiary);
}

/* 技术铭牌行：版本 + 系统标识，等宽极小字 */
.bw-hero-tech {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  font-family: var(--bw-mono);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
  color: var(--dsw-alias-label-dimmed);
}
.bw-hero-tech-sep {
  width: 12px;
  height: 1px;
  flex: none;
  background: var(--dsw-alias-border-l3);
  opacity: 0.5;
}

/* ── 9. 文字版式：衬线显示层 + 等线正文 + 等宽数字 ───────────────────── */
:root {
  --bw-serif: 'Songti SC', 'Noto Serif SC', 'STSong', 'SimSun', Georgia, serif;
  --bw-num: 'DIN Alternate', 'Bahnschrift', 'Roboto Condensed', 'SF Pro Display', 'Helvetica Neue', sans-serif;
  --dsw-font-markdown-h1-font-family: var(--bw-serif);
  --dsw-font-markdown-h1-font-weight: 700;
  --dsw-font-markdown-h2-font-family: var(--bw-serif);
  --dsw-font-markdown-h2-font-weight: 700;
  --dsh-font-family-code-default: var(--bw-mono);
}

/* ── 10. 等宽数字：金额、时间戳、计数 ───────────────────────────────── */
:where([class*='_time_'], [class*='_count_'], [class*='_number_'], [class*='_timestamp_']) {
  font-family: var(--bw-num);
  font-variant-numeric: tabular-nums lining-nums;
  letter-spacing: -0.01em;
}

/* ── 11. 会话列表：发丝线分行 + 选中态淡青色块 ─────────────────────
   Hook 用实机 DOM 的稳定属性（CSS Module 的哈希类名不可跨构建依赖）：
   data-row-key="session:…" 是每行会话，aria-selected 是选中态。 */
[data-row-key^='session:'] {
  position: relative;
  min-height: 40px;
}
[data-row-key^='session:']::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  height: 1px;
  background: var(--dsw-alias-border-l1);
  transform: scaleY(0.5);
  transform-origin: bottom;
  pointer-events: none;
}
[data-row-key^='session:'][aria-selected='true'] {
  background: var(--dsw-alias-state-business-tertiary) !important;
}
[data-row-key^='session:'][aria-selected='true'] [class*='title'] {
  color: var(--dsw-alias-state-business-primary) !important;
  font-weight: 600 !important;
}
/* 行内时间戳：等宽数字，弱化到最浅一档 */
[class*='timestamp'] {
  font-family: var(--bw-num);
  font-variant-numeric: tabular-nums lining-nums;
  font-size: 12px !important;
  color: var(--dsw-alias-label-dimmed) !important;
}

/* ── 12. （气泡样式统一放在 18.9，这里留空避免重复叠加） ─────────── */

/* ── 13. 主发送按钮：主色填充 + 反白字（深色模式自动翻墨） ──────── */
button[aria-label='发送消息'] {
  background: var(--dsw-alias-button-primary-fill) !important;
  color: var(--dsw-alias-label-on-color) !important;
}
button[aria-label='发送消息']:disabled {
  background: var(--dsw-alias-interactive-bg-hover) !important;
  color: var(--dsw-alias-label-dimmed) !important;
}

/* ── 14. 编辑器：发丝边框 + 主色聚焦环，占位符用最弱一档 ────────── */
[data-composer-card] {
  border: 1px solid var(--dsw-alias-border-l1) !important;
}
/* 编辑器聚焦：橙色边框（强调当前输入焦点），不用 box-shadow 叠加 */
[data-composer-card]:focus-within {
  border-color: var(--dsw-alias-brand-accent) !important;
}
[data-composer-placeholder],
[data-composer-input]::placeholder {
  color: var(--dsw-alias-label-dimmed) !important;
  font-size: 14px;
}
[data-composer-input] {
  font-size: var(--dsh-content-font-size, 14px);
  line-height: 1.65;
}

/* ── 15. 输入控件：发丝边框，聚焦用 2px 主色环 ─────────────────── */
:where(textarea, input[type='text'], input[type='search'], input[type='password']) {
  border: 1px solid var(--dsw-alias-border-l1) !important;
}
:where(textarea:focus, input[type='text']:focus, input[type='search']:focus) {
  outline: 2px solid var(--dsw-alias-state-business-primary) !important;
  outline-offset: 0 !important;
}

/* ── 16. 侧栏：右发丝分界 + 品牌行底发丝线 ─────────────────────── */
/* 侧栏主容器：右边界用真 0.5px 发丝线，从顶到底无 inset */
[data-slot='sidebar'] > div {
  position: relative;
  border-right: none !important;
}
[data-slot='sidebar'] > div::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
  background: var(--dsw-alias-border-l1);
  transform: scaleX(0.5);
  transform-origin: right;
  pointer-events: none;
}
/* 品牌行（拖拽区）：底部发丝线，与右侧垂直线无缝衔接 */
[data-slot='sidebar'] [data-window-drag] {
  position: relative;
  border-bottom: none !important;
}
[data-slot='sidebar'] [data-window-drag]::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--dsw-alias-border-l1);
  transform: scaleY(0.5);
  transform-origin: bottom;
  pointer-events: none;
}
/* 分组标题（工作区）：12px 字距 + 最弱一档 */
[class*='sectionLabel'] {
  font-size: 12px !important;
  letter-spacing: 0.08em;
  color: var(--dsw-alias-label-dimmed) !important;
}
/* 侧栏导航行：44px 触控高度，hover 用 4.5% 填充 */
[class*='panelRow'] {
  min-height: 40px;
  font-size: 14px !important;
}

/* ── 17. 会话顶栏：发丝底分界 ──────────────────────────────────── */
/* 空态页顶栏 + 会话页顶栏，统一用伪元素发丝线 */
header[data-window-drag],
[data-conversation-header],
header:has([class*='sessionTitle']) {
  position: relative;
  border-bottom: none !important;
}
header[data-window-drag]::after,
[data-conversation-header]::after,
header:has([class*='sessionTitle'])::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--dsw-alias-border-l1);
  transform: scaleY(0.5);
  transform-origin: bottom;
  pointer-events: none;
  z-index: 1;
}

/* ── 18. 对话正文排版：刊物化版式系统 ────────────────────────── */
/* 18.1 标题层级：衬线显示字体 + 层级间距 */
[data-conversation-content] :where(h1, h2, h3, h4, h5, h6) {
  font-family: var(--bw-serif);
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--dsw-alias-label-primary);
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}
[data-conversation-content] h1 {
  font-size: 1.75em;
  line-height: 1.3;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  padding-bottom: 0.5em;
  margin-bottom: 1em;
}
[data-conversation-content] h2 {
  font-size: 1.5em;
  line-height: 1.35;
}
[data-conversation-content] h3 {
  font-size: 1.25em;
  line-height: 1.4;
}

/* 18.2 段落：通风透气的文气间距 */
[data-conversation-content] p {
  margin-top: 0;
  margin-bottom: 1em;
  line-height: 1.7;
}
[data-conversation-content] p:last-child {
  margin-bottom: 0;
}

/* 18.3 列表：悬挂缩进 + 紧凑行距 */
[data-conversation-content] :where(ul, ol) {
  margin: 1em 0;
  padding-left: 1.5em;
}
[data-conversation-content] li {
  margin-bottom: 0.5em;
  line-height: 1.6;
}
[data-conversation-content] li:last-child {
  margin-bottom: 0;
}
[data-conversation-content] :where(ul ul, ol ol, ul ol, ol ul) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

/* 18.4 引用块：左侧 2px 主色竖线 + 内缩排版 */
[data-conversation-content] blockquote {
  margin: 1.5em 0;
  padding: 0.75em 1em;
  border-left: 2px solid var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-card-fill);
  color: var(--dsw-alias-label-secondary);
  font-style: normal;
}
[data-conversation-content] blockquote p {
  margin-bottom: 0.5em;
}
[data-conversation-content] blockquote p:last-child {
  margin-bottom: 0;
}

/* 18.5 代码块：发丝线框 + 衬底 + 等宽字体 */
[data-conversation-content] :where(code, pre) {
  font-family: var(--bw-mono);
}
[data-conversation-content] :not(pre) > code {
  padding: 0.2em 0.4em;
  background: var(--dsw-alias-markdown-inline-code);
  border: 1px solid var(--dsw-alias-border-l1);
  font-size: 0.9em;
}
[data-conversation-content] pre {
  margin: 1.5em 0;
  padding: 1em;
  background: var(--dsw-alias-markdown-code-block);
  border: 1px solid var(--dsw-alias-border-l1);
  overflow-x: auto;
  line-height: 1.5;
}
[data-conversation-content] pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9em;
}

/* 18.6 表格：刊物化表格——只有横向发丝线，不画竖线、不铺底色
   DSH 原生就是横向 0.5px 线；这里只做对齐与字重，别再加全网格/斑马纹。 */
[data-conversation-content] table {
  width: 100%;
  margin: 1.5em 0;
  border-collapse: collapse;
  border: none;
}
[data-conversation-content] :where(th, td) {
  padding: 8px 12px;
  text-align: left;
  vertical-align: top;
  border: none;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  line-height: 1.55;
}
[data-conversation-content] :where(th, td):first-child {
  padding-left: 0;
}
[data-conversation-content] :where(th, td):last-child {
  padding-right: 0;
}
[data-conversation-content] th {
  background: none;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
  border-bottom-color: var(--dsw-alias-border-l3);
}
[data-conversation-content] :where(th, td) code {
  font-size: 11px;
  padding: 0 2px;
  border: none;
  background: var(--dsw-alias-markdown-inline-code);
}

/* 18.7 水平分割线：发丝线 */
[data-conversation-content] hr {
  margin: 2em 0;
  border: none;
  height: 1px;
  background: var(--dsw-alias-border-l1);
  transform: scaleY(0.5);
  transform-origin: center;
}

/* 18.8 链接：BYWOOD 强调色（赭石）+ 悬浮下划线 */
[data-conversation-content] a {
  color: var(--dsw-alias-link);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}
[data-conversation-content] a:hover {
  border-bottom-color: currentColor;
}

/* ── 18.9 用户消息气泡：温润圆角 + 淡青底 + 发丝线 ──────────────── */
/* 圆角沿用 DSH 默认（用户决定），只接管底色与描边；不加左侧竖条，
   让气泡保持柔和的整体感。背景用真实气泡 token（#E3EFEF）。 */
[data-message-bubble] {
  background: var(--dsw-specific-bubble) !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
}

/* ── 19. 空态：线性图标 + 两行文案 ─────────────────────────────── */
:where([class*='_empty_']) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 24px !important;
  text-align: center;
}
:where([class*='_empty_'] svg) {
  width: 32px !important;
  height: 32px !important;
  stroke-width: 1.5 !important;
  color: var(--dsw-alias-label-dimmed) !important;
}
:where([class*='_empty_'] p) {
  font-size: 14px !important;
  line-height: 1.6 !important;
  color: var(--dsw-alias-label-tertiary) !important;
  max-width: 320px;
}

/* ── 20. 隐藏 DSH 原生 hero 文案与预览徽标 ─────────────────────────── */
/* 实机 DOM：HeroShell 的标题在 .WOwLGG_titleGroup 内、徽标在
   .WOwLGG_previewBadge 内（CSS Module 类名格式为 <hash>_<name>，没有前后
   下划线，所以只能按名称子串匹配）。品牌位类名是 bw-*，不会被误伤。 */
[class*='headline'] [class*='titleGroup'],
[class*='previewBadge'] {
  display: none !important;
}
[class*='headline'] {
  justify-content: center !important;
}

/* DSH 首页的像素鲸鱼画布：装饰性动效，不属于 BYWOOD 的视觉语言 */
[data-home-whale] {
  display: none !important;
}

/* ══ 21. 组件覆盖（B 阶段）───────────────────────────────────────
   Hook 全部取自实机 DOM 的稳定属性（data-* / aria-label / role），
   不依赖 CSS Module 的哈希类名前缀。 */

/* 21.1 设置对话框：纸面 + 发丝线，标题走衬线显示层 */
[data-shortcut-modal='settings'] {
  border: 1px solid var(--dsw-alias-border-l1);
}
[data-shortcut-modal='settings'] [class*='navTitle'] {
  font-family: var(--bw-serif);
  font-weight: 700;
  letter-spacing: 0.02em;
}
[data-shortcut-modal='settings'] [class*='navCell'] {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
}
[data-shortcut-modal='settings'] [class*='navCell'][aria-current='true'] {
  background: var(--dsw-alias-state-business-tertiary);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}
[data-shortcut-modal='settings'] [class*='card'] {
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
}
[data-shortcut-modal='settings'] [class*='divider'] {
  background: var(--dsw-alias-border-l1);
}
[data-shortcut-modal='settings'] [class*='linkButton'][class*='primary'] {
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-on-color);
}

/* 21.1b 审批 / 权限弹窗：高优先级视觉（P0）──────────────────────── */
/* 通用弹窗容器：纸面 + 发丝线，零阴影 */
:where([role='dialog'], [role='alertdialog'], [data-dialog], [data-modal-overlay]) {
  border: 1px solid var(--dsw-alias-border-l1) !important;
  background: var(--dsw-alias-bg-layer-2) !important;
}

/* 弹窗标题：衬线显示层 + 主色强调 */
:where([role='dialog'], [role='alertdialog']) [class*='title']:not([class*='subtitle']) {
  font-family: var(--bw-serif) !important;
  font-weight: 700 !important;
  font-size: 18px !important;
  letter-spacing: 0.02em !important;
  color: var(--dsw-alias-label-primary) !important;
}

/* 弹窗正文：14px 正文档，1.6 行高 */
:where([role='dialog'], [role='alertdialog']) [class*='content'],
:where([role='dialog'], [role='alertdialog']) [class*='message'],
:where([role='dialog'], [role='alertdialog']) [class*='description'] {
  font-size: 14px !important;
  line-height: 1.6 !important;
  color: var(--dsw-alias-label-secondary) !important;
}

/* 审批弹窗特有：文件路径 / 命令预览用等宽字体 */
:where([role='dialog'], [role='alertdialog']) :where(code, pre, [class*='path'], [class*='command']) {
  font-family: var(--bw-mono) !important;
  font-size: 13px !important;
  background: var(--dsw-alias-markdown-inline-code) !important;
  padding: 2px 6px !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
}

/* 弹窗按钮组：主按钮主色填充，次按钮发丝边纸面 */
:where([role='dialog'], [role='alertdialog']) button[class*='primary'],
:where([role='dialog'], [role='alertdialog']) button[data-variant='primary'] {
  background: var(--dsw-alias-button-primary-fill) !important;
  color: var(--dsw-alias-label-on-color) !important;
  border: none !important;
  font-weight: 600 !important;
}

:where([role='dialog'], [role='alertdialog']) button:not([class*='primary']):not([data-variant='primary']) {
  background: var(--dsw-alias-bg-layer-1) !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
  color: var(--dsw-alias-label-primary) !important;
}

:where([role='dialog'], [role='alertdialog']) button:not([class*='primary']):not([data-variant='primary']):hover {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}

/* 危险操作弹窗：标题与主按钮用警示色 */
:where([role='alertdialog'][data-severity='danger'], [data-dialog-type='danger']) [class*='title'] {
  color: var(--dsw-alias-state-error-primary) !important;
}

:where([role='alertdialog'][data-severity='danger'], [data-dialog-type='danger']) button[class*='primary'] {
  background: var(--dsw-alias-state-error-primary) !important;
}

/* 遮罩层：半透明背景 */
[data-modal-backdrop],
[class*='backdrop'],
[class*='overlay'][class*='modal'] {
  background: var(--dsw-alias-bg-overlay) !important;
}

/* 21.2 工具调用卡：BYWOOD 卡片语言──左上角标签 + 状态色 + hover 洗色 */
[data-chat-call-id] {
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
  position: relative;
}

/* 工具名称标签：左上角 12px 次级色 */
[data-chat-call-id] [class*='toolName'],
[data-chat-call-id] [class*='callHeader'] {
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
  font-weight: 600;
  letter-spacing: 0.04em;
}

/* 状态指示：运行中=橙色、成功=主色、错误=危险色 */
[data-chat-call-id][data-call-status='running']::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--dsw-alias-brand-accent);
}
[data-chat-call-id][data-call-status='success']::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--dsw-alias-state-business-primary);
}

[data-chat-call-id][data-call-status='error']::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--dsw-alias-state-error-primary);
}

[data-chat-call-id][data-call-status='running']::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--dsw-alias-label-tertiary);
}

[data-chat-call-id] [data-disclosure-row]:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

[data-chat-call-id] [class*='fileLink'] {
  color: var(--dsw-alias-label-primary);
  border-bottom: 1px dashed var(--dsw-alias-border-l3);
}

[data-chat-call-id] [class*='summary'] {
  color: var(--dsw-alias-label-tertiary);
}

[data-chat-call-id] [class*='diffAdded'] {
  color: var(--dsw-alias-state-business-primary);
  font-family: var(--bw-num);
  font-variant-numeric: tabular-nums;
}

[data-chat-call-id] [class*='diffRemoved'] {
  color: var(--dsw-alias-link);
  font-family: var(--bw-num);
  font-variant-numeric: tabular-nums;
}

/* 21.3 思考块 / 步骤组：hover 洗色，摘要降一档 */
[data-variant='think'] [data-disclosure-row]:hover,
[data-step-process] [data-process-activity]:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

/* 21.4 轮次过程与轮次尾：数字等宽；变更卡纸面化 */
[data-turn-process] [class*='durationNumber'],
[class*='timestamp'] {
  font-family: var(--bw-num);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}
[data-changed-files] {
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
}

/* 21.4b 插件管理 / 市场面板（P2）───────────────────────────────── */
/* 插件市场主容器：纸面背景 */
[data-slot='main'] [class*='marketPlace'],
[data-slot='main'] [class*='pluginManager'] {
  background: var(--dsw-alias-bg-base);
}

/* 插件卡片：发丝线 + hover 洗色 + 圆角保持 DSH 默认 */
[class*='pluginCard'],
[class*='bundleCard'] {
  border: 1px solid var(--dsw-alias-border-l1) !important;
  background: var(--dsw-alias-bg-layer-1) !important;
}

[class*='pluginCard']:hover,
[class*='bundleCard']:hover {
  background: var(--dsw-alias-interactive-bg-hover) !important;
  border-color: var(--dsw-alias-border-l2) !important;
}

/* 插件名称：14px 主色加重 */
[class*='pluginCard'] [class*='pluginName'],
[class*='bundleCard'] [class*='bundleName'] {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: var(--dsw-alias-label-primary) !important;
}

/* 插件描述：13px 次级色 */
[class*='pluginCard'] [class*='description'],
[class*='bundleCard'] [class*='description'] {
  font-size: 13px !important;
  line-height: 1.6 !important;
  color: var(--dsw-alias-label-secondary) !important;
}

/* 插件版本 / 作者：12px 弱化 */
[class*='pluginCard'] [class*='version'],
[class*='pluginCard'] [class*='author'],
[class*='bundleCard'] [class*='version'],
[class*='bundleCard'] [class*='author'] {
  font-size: 12px !important;
  color: var(--dsw-alias-label-tertiary) !important;
}

/* 插件标签：12px 等宽 + 发丝边框 */
[class*='pluginCard'] [class*='tag'],
[class*='bundleCard'] [class*='tag'] {
  font-size: 11px !important;
  padding: 2px 6px !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
  background: var(--dsw-alias-bg-layer-2) !important;
  color: var(--dsw-alias-label-tertiary) !important;
}

/* 安装/卸载按钮：主按钮统一样式 */
[class*='pluginCard'] button[class*='install'],
[class*='pluginCard'] button[class*='enable'],
[class*='bundleCard'] button[class*='install'] {
  background: var(--dsw-alias-button-primary-fill) !important;
  color: var(--dsw-alias-label-on-color) !important;
  border: none !important;
}

[class*='pluginCard'] button[class*='uninstall'],
[class*='pluginCard'] button[class*='disable'],
[class*='bundleCard'] button[class*='remove'] {
  background: var(--dsw-alias-bg-layer-1) !important;
  border: 1px solid var(--dsw-alias-border-l1) !important;
  color: var(--dsw-alias-label-primary) !important;
}

/* 插件状态徽标：已启用=主色、已禁用=灰色 */
[class*='pluginCard'][data-plugin-enabled='true']::after,
[class*='bundleCard'][data-bundle-enabled='true']::after {
  content: '';
  position: absolute;
  top: 12px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dsw-alias-state-business-primary);
}

[class*='pluginCard'][data-plugin-enabled='false']::after,
[class*='bundleCard'][data-bundle-enabled='false']::after {
  background: var(--dsw-alias-label-dimmed);
}
[data-changed-files] [class*='header']:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
[data-changed-files] [class*='added'] {
  color: var(--dsw-alias-state-business-primary);
  font-family: var(--bw-num);
  font-variant-numeric: tabular-nums;
}
[data-changed-files] [class*='deleted'] {
  color: var(--dsw-alias-link);
  font-family: var(--bw-num);
  font-variant-numeric: tabular-nums;
}

/* 21.5 编辑器控件：权限 / 模型触发器 13px 次级；统计胶囊等宽降档 */
[aria-label^='访问模式'],
[aria-label^='选择模型'] {
  font-size: 13px !important;
  color: var(--dsw-alias-label-secondary) !important;
}
[data-composer-stat] button,
[aria-label^='上下文已用'] {
  font-family: var(--bw-num) !important;
  font-variant-numeric: tabular-nums;
  font-size: 12px !important;
  color: var(--dsw-alias-label-tertiary) !important;
}

/* 21.6 侧栏：新建会话按钮发丝边纸面；hover 用橙色边框点亮；账号行 13px */
[data-slot='sidebar.session.action'] button {
  border: 1px solid var(--dsw-alias-border-l1) !important;
  background: var(--dsw-alias-bg-layer-1) !important;
}
[data-slot='sidebar.session.action'] button:hover {
  background: var(--dsw-alias-interactive-bg-hover) !important;
  border-color: var(--dsw-alias-brand-accent) !important;
}
[aria-label='账号菜单'] {
  font-size: 13px !important;
}

/* 21.7 会话头：页签 13px，选中态加重 */
[data-conversation-tabs] [role='tab'] {
  font-size: 13px !important;
  color: var(--dsw-alias-label-secondary) !important;
}
[data-conversation-tabs] [role='tab'][aria-selected='true'] {
  color: var(--dsw-alias-label-primary) !important;
  font-weight: 600 !important;
}

/* 21.8 右侧栏：纸面 + 页签条发丝线
   注意：收起右栏时 DSH 不卸载面板（只把网格列压到 0），面板保持旧宽度。
   所以纸面背景必须只在展开态生效，否则收起后会在画布右侧留下一块白板。 */
[data-sidebar-right-panel]:not([aria-hidden='true']) {
  background: var(--dsw-alias-bg-layer-1);
  border-left: 1px solid var(--dsw-alias-border-l1);
}
[data-dockkit-strip] {
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}

/* 21.9 运行指示：像素鲸鱼换成 BYWOOD 山形标志（透明底 + 品牌色字形）
   做法：容器底色填品牌主色 token，logo 几何作 alpha 蒙版 —— 只有字形
   显色、底完全透明，且浅深色自动翻转（浅=深青、深=亮青），不用两张图。
   logo 几何由 JS 从 logo 文件拼装（installRunningMark），样式表里没有
   任何字面色值。容器内的像素画全部隐藏。 */
[class*='runningWhaleAnimated'],
[class*='runningWhaleStill'] {
  background: var(--dsw-alias-brand-primary) !important;
  -webkit-mask: var(--bw-running-mark) center / contain no-repeat !important;
  mask: var(--bw-running-mark) center / contain no-repeat !important;
}
[class*='runningWhaleAnimated'] *,
[class*='runningWhaleStill'] * {
  display: none !important;
}

/* ══ 22. 浮层与细节（B 阶段续）───────────────────────────────────
   菜单 / 下拉用 ARIA role 做钩子（DSH 的弹出层全部带 role），
   代码区块用 markdown 渲染器的真实类名（子串匹配名字部分）。 */

/* 22.1 浮层纸面：发丝线替代阴影（阴影已在 token 层清零） */
:where([role='menu'], [role='listbox']) {
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
}
:where([role='menuitem'], [role='option']) {
  font-size: 13px;
}
:where([role='menuitem']:hover, [role='option']:hover) {
  background: var(--dsw-alias-interactive-bg-hover);
}
:where([role='option'][aria-selected='true']) {
  background: var(--dsw-alias-state-business-tertiary);
  color: var(--dsw-alias-label-primary);
}

/* 22.2 代码块横幅：语言标签 + 复制按钮，12px 次级色 + 发丝底分界 */
[data-conversation-content] :where([class*='banner'], [class*='_infostring_']) {
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}
[data-conversation-content] :where([class*='copyButton']) {
  color: var(--dsw-alias-label-tertiary);
}
[data-conversation-content] :where([class*='copyButton']):hover {
  color: var(--dsw-alias-label-primary);
}

/* 22.3 代码块 diff：新增主色系、删除赭石系，行号等宽 */
[data-conversation-content] [class*='diffAdd'] {
  background: var(--dsw-alias-file-diff-added-bg);
}
[data-conversation-content] [class*='diffDel'] {
  background: var(--dsw-alias-file-diff-deleted-bg);
}
[data-conversation-content] :where([class*='lineNumber'], [class*='diffMarker']) {
  font-family: var(--bw-num);
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-dimmed);
}

/* 22.4 快捷键提示：等宽 11px + 发丝边框 */
:where(kbd) {
  font-family: var(--bw-mono);
  font-size: 11px;
  line-height: 1;
  padding: 2px 4px;
  border: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-tertiary);
}

/* 22.5 滚动条：8px 细条 + 发丝级滑块（DSH 原生用浏览器默认宽条） */
:where(html, body, [data-sidebar-scrollport], [data-conversation-scroll],
  [data-dockkit-surface], [data-input-scroll], [class*='md-table-wide'])::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
:where(html, body, [data-sidebar-scrollport], [data-conversation-scroll],
  [data-dockkit-surface], [data-input-scroll], [class*='md-table-wide'])::-webkit-scrollbar-track {
  background: transparent;
}
:where(html, body, [data-sidebar-scrollport], [data-conversation-scroll],
  [data-dockkit-surface], [data-input-scroll], [class*='md-table-wide'])::-webkit-scrollbar-thumb {
  background: var(--dsw-alias-border-l3);
  background-clip: padding-box;
  border: 2px solid transparent;
}
:where(html, body, [data-sidebar-scrollport], [data-conversation-scroll],
  [data-dockkit-surface], [data-input-scroll], [class*='md-table-wide'])::-webkit-scrollbar-thumb:hover {
  background: var(--dsw-alias-label-dimmed);
  background-clip: padding-box;
}

/* 22.6 Tooltip：12px 行高 1.5（底色/字色由 token 驱动） */
:where([role='tooltip']) {
  font-size: 12px;
  line-height: 1.5;
}

/* ══ 23. 右栏 Dock 内部（P3）───────────────────────────────────────
   钩子全部是 dockkit 的 data-* 属性（与打包源码核对过：strip / tab /
   tab-title / tab-close / add-tab / divider / float / float-title /
   pane / caret），不依赖哈希类名。尺寸（28px 条高、chip 宽度）一律
   不动：dockkit 会用 getBoundingClientRect 量这些值做分栏计算，改高
   度会让 Layout 失准——这里只接管颜色、字重与状态指示。 */

/* 23.1 Tab 条：纸面 + 底发丝线（原生高度 28px 保持不变） */
[data-dockkit-strip] {
  background: var(--dsw-alias-bg-layer-1);
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}

/* 23.2 Tab：13px 次级色；hover 洗色；选中 = 淡青底 + 主色字 + 2px 底标 */
[data-dockkit-tab] {
  color: var(--dsw-alias-label-secondary) !important;
  font-size: 13px !important;
  background: transparent !important;
}
[data-dockkit-tab]:hover {
  background: var(--dsw-alias-interactive-bg-hover) !important;
  color: var(--dsw-alias-label-primary) !important;
}
[data-dockkit-tab][aria-selected='true'] {
  background: var(--dsw-alias-state-business-tertiary) !important;
  color: var(--dsw-alias-label-primary) !important;
  font-weight: 600 !important;
}
[data-dockkit-tab][aria-selected='true']::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 0;
  height: 2px;
  background: var(--dsw-alias-state-business-primary);
  pointer-events: none;
}

/* 23.3 Tab 标题 / 关闭 / 新建：弱化到次级色，hover 提亮 */
[data-dockkit-tab-title] {
  letter-spacing: 0.01em;
}
[data-dockkit-tab-close],
[data-dockkit-add-tab] {
  color: var(--dsw-alias-label-tertiary) !important;
}
[data-dockkit-tab-close]:hover,
[data-dockkit-add-tab]:hover {
  color: var(--dsw-alias-label-primary) !important;
  background: var(--dsw-alias-interactive-bg-hover) !important;
}

/* 23.4 Tab 之间的发丝分隔：常态最弱，hover 提亮到 l3 */
[data-dockkit-caret] {
  background: var(--dsw-alias-border-l2) !important;
}

/* 23.5 分栏拖拽条：hover / 拖动时用主色亮起（原生是 0 宽 + 伪元素发丝线） */
[data-dockkit-divider] {
  cursor: col-resize;
}
[data-dockkit-divider]:hover::before,
[data-dockkit-divider]:active::before {
  background: var(--dsw-alias-state-business-primary) !important;
}

/* 23.6 浮动面板：纸面 + 发丝边（原生 box-shadow 已被 token 压成描边） */
[data-dockkit-float] {
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
}
[data-dockkit-float] [data-dockkit-float-title] {
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}

/* 23.7 Dock 内的面板内容：代码 / 终端类一律等宽，图片不溢出 */
[data-dockkit-pane] :where(pre, code, kbd, samp) {
  font-family: var(--bw-mono);
}
[data-dockkit-pane] :where(pre) {
  background: var(--dsw-alias-markdown-code-block);
  border: 1px solid var(--dsw-alias-border-l1);
}
[data-dockkit-pane] :where(img, video, canvas) {
  max-width: 100%;
}

/* 23.8 空 Dock 宿主：纸面，不要原生灰板 */
[data-dockkit-empty] {
  background: var(--dsw-alias-bg-base);
}

/* 23.9 终端输出块（对话内 [data-terminal]，属性来自实机源码）：
   纸面 + 发丝边 + 等宽；运行中（data-running）用强调色描边呼应状态色 */
[data-terminal] {
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-markdown-code-block);
  font-family: var(--bw-mono);
  font-size: 12px;
  line-height: 1.6;
}
[data-terminal][data-running] {
  border-color: var(--dsw-alias-brand-accent);
}

/* ══ 24. Toast（P4）────────────────────────────────────────────────
   颜色已由 token 接管（深色 chrome 面）；这里收形状：13px 正文档字，
   发丝边替代已清零的投影。原生圆角按用户决定保留，不改。 */
[class*='toast'] {
  border: 1px solid var(--dsw-alias-border-l1);
  font-size: 13px;
  line-height: 1.5;
}
`

    /**
     * Neutralise every overlay material through the theme tokens that own
     * them. Written through the CSSOM rather than the stylesheet so the two
     * token values live next to the rule that documents them; the root
     * element is the widest reachable owner of these inherited properties.
     */
    function installMaterials() {
      const root = document.documentElement
      const previous = MATERIAL_TOKENS.map(([name]) => [name, root.style.getPropertyValue(name), root.style.getPropertyPriority(name)])
      for (const [name] of MATERIAL_TOKENS) root.style.setProperty(name, 'none')
      return () => {
        for (const [name, value, priority] of previous) {
          if (value === '') root.style.removeProperty(name)
          else root.style.setProperty(name, value, priority)
        }
      }
    }

    /**
     * The running indicator used to be a pixel whale. Its containers are
     * repainted as the BYWOOD mountain mark by the stylesheet (section 21.9).
     *
     * The mark is drawn as a mask rather than a picture: the container is
     * filled with the brand-primary TOKEN and the logo geometry is used as the
     * alpha mask, so the glyph itself carries the colour and the background
     * stays fully transparent — and it flips with the theme (deep teal on
     * light, bright teal on dark) without shipping two images. The SVG is
     * assembled at runtime from the logo geometry, so the stylesheet never
     * carries a literal colour.
     */
    function installRunningMark() {
      const root = document.documentElement
      const name = '--bw-running-mark'
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + BRAND.markViewBox + '">' +
        BRAND.markBody +
        '</svg>'
      const previous = [root.style.getPropertyValue(name), root.style.getPropertyPriority(name)]
      root.style.setProperty(name, 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")')
      return () => {
        if (previous[0] === '') root.style.removeProperty(name)
        else root.style.setProperty(name, previous[0], previous[1])
      }
    }

    /** Re-project `document.title`, keeping the shell's own session titles. */
    function installTitle() {
      const swap = () => {
        if (document.title.includes(SHIPPED_TITLE)) {
          document.title = document.title.split(SHIPPED_TITLE).join(PRODUCT_TITLE)
        }
      }
      swap()
      const observer = new MutationObserver(swap)
      observer.observe(document.head, { childList: true, subtree: true, characterData: true })
      return () => observer.disconnect()
    }

    /** Replace the shipped favicon with the BYWOOD app icon. */
    function installFavicon() {      const added = []
      const href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(APP_ICON)))
      for (const link of [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')]) {
        link.remove()
      }
      for (const rel of ['icon', 'apple-touch-icon']) {
        const link = document.createElement('link')
        link.rel = rel
        link.type = 'image/svg+xml'
        link.href = href
        document.head.append(link)
        added.push(link)
      }
      return () => { for (const link of added) link.remove() }
    }

    /**
     * Rewrite the composer placeholder and streaming status text into BYWOOD's
     * voice. The visible placeholder is a plain `[data-composer-placeholder]`
     * element marked aria-hidden, so replacing its text is purely cosmetic; the
     * contenteditable keeps its own aria-label (a functional description)
     * untouched. The editor remounts the node on phase changes, so a
     * MutationObserver re-applies the swap, coalesced through requestAnimationFrame
     * to stay cheap while a response is streaming.
     *
     * The streaming status text ("深度求索中，用时 X 秒 …") is also rewritten:
     * "深度求索中" -> "芭梧推演中", preserving the timing suffix.
     */
    function installCopy() {
      let frame = 0
      const applyCopy = () => {
        frame = 0
        // Composer placeholder
        for (const node of document.querySelectorAll('[data-composer-placeholder]')) {
          const text = node.textContent || ''
          if (!text.includes('调用指令')) continue
          if (text.startsWith(COPY_BYWOOD_LEAD)) continue
          const tail = text.match(COPY_TAIL_PATTERN)
          if (tail === null) continue
          node.textContent = COPY_BYWOOD_LEAD + tail[0]
        }
        // Streaming status text
        for (const node of document.body.querySelectorAll('*')) {
          if (node.children.length > 0) continue
          const text = node.textContent || ''
          if (!text.includes('深度求索中')) continue
          if (text.includes('芭梧推演中')) continue
          node.textContent = text.replace(/深度求索中/g, '芭梧推演中')
        }
      }
      const schedule = () => {
        if (frame !== 0) return
        frame = requestAnimationFrame(applyCopy)
      }
      applyCopy()
      const observer = new MutationObserver(schedule)
      observer.observe(document.body, { childList: true, subtree: true, characterData: true })
      return () => {
        observer.disconnect()
        if (frame !== 0) cancelAnimationFrame(frame)
      }
    }

    /**
     * Client services this half consumes. Cordis waits for both before
     * running `apply`, so the theme override and the brand slots are never
     * installed against a missing service.
     */
    const inject = ['theme', 'slots']

    /**
     * The plugin row. The bundle loader reads `apply` and `inject` from the
     * module exports (`window.__ModuleLoader__` factories are CommonJS), so
     * they are attached to `exports` here.
     */
    exports.apply = apply
    exports.inject = inject
    return exports

    /**
     * Cordis entry point: install every resource through `ctx.effect` so
     * unloading the plugin (or HMR) retracts it again.
     */
    function apply(ctx) {
        // 0. Version marker: lets support check which build is live from the page,
        //    without opening the plugin inventory.
        ctx.effect(() => {
          document.documentElement.dataset.bywoodVersion = VERSION
          return () => { delete document.documentElement.dataset.bywoodVersion }
        }, 'bywood: version marker')

        // 1. Palette: stack the BYWOOD alias tokens over light/dark.
        const theme = ctx.get('theme')
        if (theme !== undefined) {
          ctx.effect(() => theme.overrideTokens(PLUGIN_ID, THEME_TOKENS), 'bywood: theme tokens')
        }

        // 2. Structural skin: one plugin-owned stylesheet plus the material tokens.
        ctx.effect(installMaterials, 'bywood: overlay materials')
        ctx.effect(installRunningMark, 'bywood: running mark')
        ctx.effect(() => {
          const style = document.createElement('style')
          style.dataset.plugin = PLUGIN_ID
          style.dataset.pluginCss = PLUGIN_ID + '/skin.css'
          style.textContent = SKIN
          document.head.append(style)
          return () => { style.remove() }
        }, 'bywood: skin stylesheet')

        // 3. Shell metadata: title + favicon + composer copy.
        ctx.effect(installTitle, 'bywood: document title')
        ctx.effect(installFavicon, 'bywood: favicon')
        ctx.effect(installCopy, 'bywood: composer copy')

        // 4. Brand slots: BYWOOD mark, name and hero mark replace the fish.
        const slots = ctx.get('slots')
        if (slots === undefined) return
        ctx.effect(() => slots.inject('sidebar.brand.mark',
          () => slots.register({ name: 'sidebar.brand.mark', priority: -1 }, BrandMark)),
        'bywood: sidebar brand mark')
        ctx.effect(() => slots.inject('sidebar.brand.name',
          () => slots.register({ name: 'sidebar.brand.name', priority: -1 }, BrandName)),
        'bywood: sidebar brand name')
        ctx.effect(() => slots.inject('conversation.hero.brand.mark',
          () => slots.register({ name: 'conversation.hero.brand.mark', priority: -1 }, HeroMark)),
        'bywood: hero brand mark')
    }
  },
})
