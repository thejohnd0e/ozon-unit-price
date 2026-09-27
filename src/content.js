import { DEFAULT_SETTINGS, findPriceAnchor, PRODUCT_LINK, readOzonItem, renderUnitPrices, SETTINGS_KEY } from './sites/ozon.js';

const CLASS = 'ozon-unit-price-value';
let settings = { ...DEFAULT_SETTINGS };
let queued = false;

const log = (...args) => { if (settings.debug) console.debug('[ozon-unit-price]', ...args); };
const normalizeSettings = (value = {}) => ({ ...DEFAULT_SETTINGS, mode: value.mode || value.displayMode || DEFAULT_SETTINGS.mode, debug: value.debug ?? value.debugEnabled ?? DEFAULT_SETTINGS.debug });
function loadSettings() {
  return new Promise((resolve) => {
    if (!globalThis.chrome?.storage?.sync) return resolve({ ...DEFAULT_SETTINGS });
    chrome.storage.sync.get({ [SETTINGS_KEY]: DEFAULT_SETTINGS }, (result) => resolve(normalizeSettings(result[SETTINGS_KEY])));
  });
}
function update(root) {
  const item = readOzonItem(root);
  if (!item) return;
  const values = renderUnitPrices(item, settings.mode);
  const old = item.card.querySelector?.(`.${CLASS}`);
  if (!values.length) return old?.remove();
  const signature = `${item.title}|${item.price}|${settings.mode}|${values.join('|')}`;
  const output = old || document.createElement('div');
  if (!old) {
    output.className = CLASS;
    const anchor = findPriceAnchor(item);
    if (anchor === item.card) item.card.append(output);
    else anchor.insertAdjacentElement('afterend', output);
  }
  if (output.dataset.signature === signature) return;
  output.dataset.signature = signature;
  output.textContent = values.join(' · ');
  output.title = item.title;
  log({ title: item.title, price: item.price, quantity: item.quantity, values });
}
function scan(root = document) {
  [...root.querySelectorAll?.(PRODUCT_LINK) || []].forEach(update);
  if (root.matches?.(PRODUCT_LINK)) update(root);
  const heading = document.querySelector('[data-widget="webProductHeading"] h1');
  if (heading) update(heading);
}
const pendingRoots = new Set();
function queue(nodes) {
  nodes.forEach((node) => {
    const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    const root = element?.closest?.('.tile-root,[data-widget="webPrice"],[data-widget="tileGridDesktop"]') || element;
    if (root) pendingRoots.add(root);
  });
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; const roots = [...pendingRoots]; pendingRoots.clear(); roots.filter((node) => node && !node.closest?.(`.${CLASS}`)).forEach(scan); });
}
async function start() {
  settings = await loadSettings();
  scan();
  new MutationObserver((mutations) => queue(mutations.flatMap((mutation) => [...mutation.addedNodes, mutation.target]).filter((node) => node.nodeType === Node.ELEMENT_NODE))).observe(document.body, { childList: true, subtree: true, characterData: true });
  globalThis.chrome?.storage?.onChanged?.addListener((changes, area) => { if (area === 'sync' && changes[SETTINGS_KEY]) { settings = normalizeSettings(changes[SETTINGS_KEY].newValue); queue([document]); } });
}
start();
