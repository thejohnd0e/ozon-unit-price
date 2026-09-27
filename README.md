# Ozon Unit Price

A dependency-free Chrome extension that helps compare Ozon products by showing a normalized price for weight and volume.

![Ozon Unit Price preview](images/readme.png)

The repository includes the quantity parser, unit-price calculator, Manifest V3 package definition, popup settings surface, and Ozon content integration.

## Supported formats

The calculation layer supports:

- weight in grams and kilograms;
- volume in milliliters and liters;
- decimal commas and decimal points;
- ranges such as `400–600 г`;
- multipacks such as `4 × 100 г` and `6 бутылок по 200 мл`;
- display as `₽/кг` and `₽/л` (default);
- display as `₽/100 г` and `₽/100 мл`;
- both display scales at once.

## Preview the popup

Open `src/popup/popup.html` in a browser. Outside Chrome's extension context, settings use an in-memory fallback and last only until the popup document closes.

## Install in Chrome

1. Clone or download this repository.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Select **Load unpacked**.
5. Choose the repository root containing `manifest.json`. The reserved `src/content.js` entry must exist before Chrome can load the complete unpacked package.
6. Pin the extension and open its popup to choose a display mode.

No build step or package installation is required.

## Settings

Popup settings are stored under the versioned key `ozon-unit-price-settings-v1` in `chrome.storage.sync`. The stored object contains `schemaVersion`, `displayMode`, and `debugEnabled`. The stable `displayMode` values are:

- `unit-standard` (default) maps to calculator modes `per-kilogram` and `per-liter`;
- `unit-small` maps to `per-100-grams` and `per-100-milliliters`;
- `both` maps to all four calculator modes.

The optional debug switch is saved for the future DOM integration. If `chrome.storage.sync` is absent or unavailable, the popup safely falls back to page-local memory; that fallback is intentionally not persistent across popup documents.

## Security and privacy

- All parsing and calculation are designed to run locally in the browser.
- The only extension permission is `storage`.
- The content-script match is limited to `https://*.ozon.ru/*`.
- The extension does not call Ozon APIs or any other remote API.
- There is no analytics, telemetry, remote code, CDN script, or externally hosted image.
- Product and settings data are not sent to a server by this project.

## Local assets

- Extension icons are generated from [`images/icio.png`](images/icio.png) at 16, 32, 48, and 128 px and referenced by the manifest.
- This README uses [`images/readme.png`](images/readme.png) as its local preview illustration.

## Testing

Run the built-in Node test suite:

```bash
npm test
```

Validate the extension files directly:

```bash
node --check src/popup/popup.js
node -e "JSON.parse(require('node:fs').readFileSync('manifest.json', 'utf8'))"
```

## Project structure

- `manifest.json` — least-privilege Manifest V3 package definition.
- `src/popup/` — popup markup, behavior, and component styles.
- `src/styles.css` — scoped `ozon-unit-price-*` injected price styles.
- `src/content-loader.js` — classic MV3 bridge for the module content script.
- `src/content.js` — Ozon DOM adapter and MutationObserver integration.
- `src/parser.js` — DOM-independent quantity parsing.
- `src/calculator.js` — unit-price calculation and Russian formatting.
- `DESIGN.md` — popup design tokens, components, states, and accessibility contract.

## Known limitations

- The content script uses a dynamic module bridge because Manifest V3 content-script entries are classic scripts.
- Live Ozon validation depends on the site's current DOM, price markup, and product-card structure, which may change without notice.
- Price extraction is heuristic and depends on the current rendered Ozon DOM.
- Chrome sync availability and quotas are controlled by the browser; the in-memory fallback is session-local and is not a replacement for cross-device sync.

## Agent workflow

Coding agents must read `AGENTS.md`, `STATUS.md`, `DECISIONS.md`, and `TODO.md` before substantial work, then update the relevant documents after substantial changes.
