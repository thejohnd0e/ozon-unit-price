import { parseQuantity } from '../parser.js';
import { UNIT_PRICE_MODES, calculateUnitPrice, formatUnitPrice } from '../calculator.js';

export const SETTINGS_KEY = 'ozon-unit-price-settings-v1';
export const DEFAULT_SETTINGS = Object.freeze({ mode: 'unit-standard', debug: false });
export const PRODUCT_LINK = 'a[href*="/product/"]';

const text = (node) => (node?.innerText || node?.textContent || '').replace(/\s+/gu, ' ').trim();
const visible = (node) => Boolean(node && node.getClientRects().length && getComputedStyle(node).display !== 'none');

function cardForLink(link) {
  let node = link;
  while (node?.parentElement) {
    const own = new Set([...node.querySelectorAll(PRODUCT_LINK)].map((item) => new URL(item.href).pathname));
    const parent = new Set([...node.parentElement.querySelectorAll(PRODUCT_LINK)].map((item) => new URL(item.href).pathname));
    if (own.size === 1 && parent.size > 1) return node;
    node = node.parentElement;
  }
  return null;
}

function priceIn(root) {
  const leaves = [...root.querySelectorAll('*')].filter((node) => node.children.length === 0 && visible(node) && !node.closest('s,del,[style*="line-through"]') && getComputedStyle(node).textDecorationLine !== 'line-through' && /₽/u.test(text(node)));
  const values = leaves.map((node) => text(node).match(/([\d\s\u00a0\u2009\u202f]+)\s*₽/u)).filter(Boolean).map((match) => Number(match[1].replace(/[\s\u00a0\u2009\u202f]/gu, '')));
  return values.find(Number.isFinite) ?? null;
}

function units(mode) {
  if (mode === 'unit-small') return [UNIT_PRICE_MODES.PER_100_GRAMS, UNIT_PRICE_MODES.PER_100_MILLILITERS];
  if (mode === 'both') return [UNIT_PRICE_MODES.PER_KILOGRAM, UNIT_PRICE_MODES.PER_LITER, UNIT_PRICE_MODES.PER_100_GRAMS, UNIT_PRICE_MODES.PER_100_MILLILITERS];
  return [UNIT_PRICE_MODES.PER_KILOGRAM, UNIT_PRICE_MODES.PER_LITER];
}

export function selectProductTitle(values) {
  return [...values]
    .filter((value) => value.length > 8)
    .sort((left, right) => Number(Boolean(parseQuantity(right))) - Number(Boolean(parseQuantity(left))) || right.length - left.length)[0] || '';
}

export function readOzonItem(root) {
  const link = root.matches?.(PRODUCT_LINK) ? root : root.querySelector?.(PRODUCT_LINK);
  const productTitle = text(document.querySelector('[data-widget="webProductHeading"] h1'));
  const isProductPage = Boolean(productTitle && root.closest?.('[data-widget="webProductHeading"]'));
  const priceWidget = document.querySelector('[data-widget="webPrice"]');
  const card = link ? cardForLink(link) : root.closest?.('[data-widget="webPrice"]')?.parentElement || (isProductPage ? priceWidget?.parentElement : null);
  const title = isProductPage ? productTitle : card ? selectProductTitle([...card.querySelectorAll(PRODUCT_LINK)].map(text)) : '';
  const priceRoot = isProductPage ? priceWidget : card;
  const price = priceIn(priceRoot || root);
  const quantity = parseQuantity(title);
  if (!title || price === null || !quantity) return null;
  return { card: card || priceRoot || root, title, price, quantity };
}

export function renderUnitPrices(item, mode) {
  return units(mode).filter((unit) => (unit.includes('kilogram') || unit.includes('grams')) === item.quantity.type.startsWith('weight')).map((unit) => formatUnitPrice(calculateUnitPrice(item.price, item.quantity, unit), unit));
}

export function findPriceAnchor(item) {
  const widget = item.card.querySelector?.('[data-widget="webPrice"]');
  if (widget) return widget;
  const leaf = [...item.card.querySelectorAll?.('*') || []].find((node) => node.children.length === 0 && /₽/u.test(text(node)));
  return leaf?.parentElement || item.card;
}
