# Local Extension Icons

The extension icons are generated from the square portrait at `images/icio.png`.

Prepare local PNG copies from the original portrait with these exact names and dimensions:

- `icons/icon-16.png` — 16 × 16 px
- `icons/icon-32.png` — 32 × 32 px
- `icons/icon-48.png` — 48 × 48 px
- `icons/icon-128.png` — 128 × 128 px

The generated files use a square crop with an edge-to-edge background. Both the top-level `icons` and `action.default_icon` entries in `manifest.json` reference these local PNGs. Do not use remote image URLs.
