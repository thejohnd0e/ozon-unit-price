# Project Status

## Completed

- Fixed Ozon cards that contain promotional links such as `Съешьте скорее` or `Цена что надо`.
- Product title selection now prefers link text from which a weight or volume can be parsed.
- Added regression tests for promotional-link/title selection.
- Fixed liquid dairy products whose Ozon title uses grams but whose unit price is shown per liter.
- Bumped the extension version to `1.02`.
- Published release `v1.02` with `ozon-unit-price-v1.02.zip`.

## Currently Working

- Unit and volume price calculation is covered by the existing tests.
- Ozon product cards and product pages are supported by the content script.
- Variable-weight and variable-volume products use the upper range bound for the displayed unit price.
- The source changes are committed and `master` is synchronized with `origin/master`; the handoff documents added in this session are currently uncommitted.

## In Progress

- Nothing currently in progress.

## Known Issues and Blockers

- There are no automated browser/DOM integration tests; coverage is limited to parser, calculator, and title-selection unit tests.
- Ozon can change its card markup, promotional labels, or price structure without notice.
- The release archive is intentionally ignored by Git and is attached to GitHub Releases rather than committed.

## Next Recommended Step

Install or reload `v1.3` in Chrome and manually smoke-test the Ozon category grid and product page, including milk cards shown as `950 мл` and product pages whose title says `950 г`.

## Important Files

- `src/sites/ozon.js`: Ozon DOM adapter, price extraction, card title selection, and rendering inputs.
- `src/parser.js`: weight/volume and multipack/range parsing.
- `src/calculator.js`: unit-price calculation and formatting.
- `src/content.js`: mutation observer and card/page scanning lifecycle.
- `tests/ozon.test.js`: regression coverage for promotional card links.
- `manifest.json`: extension version and Chrome content-script configuration.
