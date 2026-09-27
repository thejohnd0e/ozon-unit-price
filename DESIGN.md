# Ozon Unit Price Design System

## 0. Research Log

- Embedded refs: shortlisted Linear, Notion, and Airbnb; picked `minimalist-skill.md` with `linear.app.md` because a compact settings popup benefits from quiet editorial structure, precise state hierarchy, and luminance-based surfaces.
- Lazyweb: skipped because the task requires local-only implementation and prohibits fetching remote assets.
- Imagen drafts: skipped because the supplied chat images are not available as workspace files and no image-generation input is available in this task.

## 1. Atmosphere & Identity

A calm comparison instrument rather than a miniature dashboard. Warm neutral surfaces keep the popup readable, while a restrained cobalt ramp marks only interactive and selected states. The signature moment is the selected display-mode tile: its radio marker fills, its border sharpens, and the preview beneath it immediately reflects the saved unit family.

## 2. Color

| Role | Token | Value | Usage |
|---|---|---|---|
| Canvas | `--ozon-unit-price-color-canvas` | `#f5f6f8` | Popup background |
| Surface | `--ozon-unit-price-color-surface` | `#ffffff` | Primary panel and controls |
| Surface muted | `--ozon-unit-price-color-surface-muted` | `#eef1f5` | Preview and secondary regions |
| Surface selected | `--ozon-unit-price-color-surface-selected` | `#edf2ff` | Selected mode tile |
| Text primary | `--ozon-unit-price-color-text` | `#17191d` | Headings and labels |
| Text secondary | `--ozon-unit-price-color-text-muted` | `#656b76` | Descriptions and metadata |
| Border | `--ozon-unit-price-color-border` | `#dfe3e9` | Default outlines |
| Border strong | `--ozon-unit-price-color-border-strong` | `#c7cdd6` | Hover outlines |
| Accent | `--ozon-unit-price-color-accent` | `#2f5cff` | Selected and focus states |
| Accent hover | `--ozon-unit-price-color-accent-hover` | `#234be0` | Hovered accent controls |
| Accent ink | `--ozon-unit-price-color-accent-ink` | `#17308f` | Accessible text on pale accent |
| Success | `--ozon-unit-price-color-success` | `#197a4d` | Saved status |
| Warning | `--ozon-unit-price-color-warning` | `#8a5a00` | Future caution states |
| Error | `--ozon-unit-price-color-error` | `#b42318` | Storage/error states |
| Info | `--ozon-unit-price-color-info` | `#2855c5` | Informational states |
| Focus ring | `--ozon-unit-price-color-focus-ring` | `#9db2ff` | Keyboard focus halo |

Color is semantic. Accent is reserved for selection, focus, and controls; it is not decorative.

## 3. Typography

| Level | Token | Size | Weight | Line height | Usage |
|---|---|---:|---:|---:|---|
| H1 | `--ozon-unit-price-type-h1` | `20px` | 700 | 1.2 | Popup title |
| H2 | `--ozon-unit-price-type-h2` | `14px` | 700 | 1.4 | Section legends |
| Body | `--ozon-unit-price-type-body` | `14px` | 500 | 1.5 | Labels and supporting copy |
| Small | `--ozon-unit-price-type-small` | `12px` | 500 | 1.45 | Descriptions and status |
| Caption | `--ozon-unit-price-type-caption` | `11px` | 700 | 1.35 | Eyebrows and preview metadata |
| Price | `--ozon-unit-price-type-price` | `18px` | 750 | 1.2 | Unit-price preview |

- Primary stack: `"Aptos Display", "Aptos", "Segoe UI Variable Display", system-ui, sans-serif`.
- Numeric stack: `"Aptos", "Segoe UI Variable Text", system-ui, sans-serif` with tabular numerals.
- Display type uses tight tracking; body copy uses normal tracking.
- Visible body text never falls below 12px.

## 4. Spacing & Layout

All spacing uses a 4px base.

| Token | Value | Usage |
|---|---:|---|
| `--ozon-unit-price-space-1` | `4px` | Tight icon/label separation |
| `--ozon-unit-price-space-2` | `8px` | Compact internal gap |
| `--ozon-unit-price-space-3` | `12px` | Control padding |
| `--ozon-unit-price-space-4` | `16px` | Section gap and panel padding |
| `--ozon-unit-price-space-5` | `20px` | Header gap |
| `--ozon-unit-price-space-6` | `24px` | Outer popup padding |

| Size token | Value | Usage |
|---|---:|---|
| `--ozon-unit-price-size-popup` | `360px` | Popup inline size |
| `--ozon-unit-price-size-control-min` | `44px` | Minimum target block size |
| `--ozon-unit-price-size-mark` | `36px` | Header mark |
| `--ozon-unit-price-size-radio` | `20px` | Radio marker |
| `--ozon-unit-price-size-switch-width` | `40px` | Debug switch track |
| `--ozon-unit-price-size-switch-height` | `24px` | Debug switch track |
| `--ozon-unit-price-size-switch-thumb` | `18px` | Debug switch thumb |

- Popup content remains usable if rendered at 320px or zoomed to 200%.
- Layout primitive: one vertical stack. Mode options remain a single column to preserve readable labels and target size.
- Radius tokens: `--ozon-unit-price-radius-sm` at 6px for compact controls, `--ozon-unit-price-radius-md` at 8px for options, and `--ozon-unit-price-radius-lg` at 12px for the main surface.

## 5. Components

### Popup Shell

- **Structure:** `main` containing header, display-mode `fieldset`, preview, debug row, and status footer.
- **Spacing:** outer `space-4`, section gaps `space-4`, header gap `space-2`.
- **States:** ready and storage-error status.
- **Accessibility:** Russian document language, one `h1`, landmarks, and live status text.
- **Motion:** none; shell appears immediately.

### Mode Option

- **Structure:** a full-row `label` containing native radio input, title, and description.
- **Variants:** standard units, compact units, and both.
- **Stable values:** `unit-standard`, `unit-small`, and `both`; these values are the storage contract for the later content script.
- **Default:** `unit-standard` (`₽/кг` and `₽/л`).
- **Spacing:** `space-3` internal padding, `space-2` text gap.
- **States:** default, hover, selected, focus-visible, and disabled.
- **Accessibility:** native grouped radios with a visible legend and a minimum 44px target.
- **Motion:** color, opacity, and transform feedback use the micro timing token.

### Toggle Row

- **Structure:** text label and native checkbox rendered as a switch.
- **States:** off, on, hover, focus-visible, and disabled.
- **Accessibility:** native checkbox remains keyboard operable and has a visible label.
- **Motion:** thumb moves with `transform`; reduced motion removes the transition.

### Unit Preview

- **Structure:** caption, example price, and active-unit summary.
- **States:** one-kilogram/liter, per-100-unit, and both.
- **Accessibility:** text communicates the selected state without relying on color.
- **Motion:** text updates without animation to avoid unnecessary distraction.

### Settings Contract

- **Storage key:** `ozon-unit-price-settings-v1` in `chrome.storage.sync`.
- **Shape:** `{ schemaVersion: 1, displayMode, debugEnabled }`.
- **Fallback:** page-local memory only when the Chrome sync API is absent or unavailable; fallback state lasts for the current popup document.
- **Calculator mapping:** `unit-standard` maps to `per-kilogram` and `per-liter`; `unit-small` maps to `per-100-grams` and `per-100-milliliters`; `both` maps to all four calculator modes.

## 6. Motion & Interaction

| Token | Duration | Easing | Usage |
|---|---:|---|---|
| `--ozon-unit-price-motion-micro` | `140ms` | `ease-out` | Hover, radio marker, switch thumb |
| `--ozon-unit-price-motion-standard` | `220ms` | `ease-in-out` | Reserved for future panel changes |

- Animate only `transform`, `opacity`, and color paint properties.
- Active controls use a subtle scale change to confirm press.
- `prefers-reduced-motion: reduce` disables transitions.

## 7. Depth & Surface

Use a mixed strategy: tonal shifts establish hierarchy, one subtle shadow separates the browser popup from its canvas, and thin borders define interactive controls.

| Token | Value | Usage |
|---|---|---|
| `--ozon-unit-price-shadow-panel` | `0 12px 32px rgba(26, 31, 44, 0.12)` | Main popup surface |
| `--ozon-unit-price-border-default` | `1px solid var(--ozon-unit-price-color-border)` | Options and dividers |
| `--ozon-unit-price-border-selected` | `1px solid var(--ozon-unit-price-color-accent)` | Selected option |

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA: 4.5:1 body contrast, 3:1 large text and control boundaries.
- Every control is reachable and usable with keyboard only; native inputs carry semantics.
- Focus is never indicated by color alone and remains visible against every surface.
- Selected mode is communicated by radio state, text, border, marker, and preview copy.
- The interface supports 200% zoom without horizontal scrolling inside its 360px popup window.
- Reduced-motion preferences are respected.

### Inclusive Personas

- Keyboard-only shopper: changes display mode and debug state without pointer input.
- Low-vision shopper at 200% zoom: reads labels and sees current selection without clipping.
- Distracted shopper: understands the current behavior from concise labels and immediate preview.

### Accepted Debt

None.
