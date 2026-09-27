const KEY = 'ozon-unit-price-settings-v1';
const DEFAULTS = { mode: 'unit-standard', debug: false };
const radios = [...document.querySelectorAll('input[name="mode"]')];
const debug = document.querySelector('#debug');
const status = document.querySelector('#status');
const area = () => globalThis.chrome?.storage?.sync;
const get = () => new Promise((resolve) => { if (!area()) return resolve({ ...DEFAULTS }); area().get({ [KEY]: DEFAULTS }, (result) => { const value = result[KEY] || {}; resolve({ ...DEFAULTS, mode: value.mode || value.displayMode, debug: value.debug ?? value.debugEnabled }); }); });
function save() { const value = { schemaVersion: 1, displayMode: radios.find((radio) => radio.checked)?.value || DEFAULTS.mode, debugEnabled: debug.checked }; if (area()) area().set({ [KEY]: value }); status.textContent = 'Настройки сохранены'; }
get().then((settings) => { radios.forEach((radio) => { radio.checked = radio.value === settings.mode; }); debug.checked = Boolean(settings.debug); });
radios.forEach((radio) => radio.addEventListener('change', save));
debug.addEventListener('change', save);
