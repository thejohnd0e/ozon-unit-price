# Technical Decisions

## Product title selection

Ozon product cards may contain multiple links with the same product URL. Promotional links can have longer text than the actual product title, so `src/sites/ozon.js` ranks candidate link text by whether `parseQuantity` can extract a weight or volume before using text length as a tie-breaker.

## Variable quantities

For weight and volume ranges, unit-price display uses the upper bound. This matches Ozon's variable-weight pricing behavior; the final order amount may be adjusted after weighing.

## Release packaging

Release archives are local ignored artifacts. The extension package is uploaded to GitHub Releases and is not committed to the repository.
