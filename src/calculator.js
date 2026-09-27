export const UNIT_PRICE_MODES = Object.freeze({
  PER_KILOGRAM: 'per-kilogram',
  PER_LITER: 'per-liter',
  PER_100_GRAMS: 'per-100-grams',
  PER_100_MILLILITERS: 'per-100-milliliters',
});

const MODE_CONFIG = Object.freeze({
  [UNIT_PRICE_MODES.PER_KILOGRAM]: {
    dimension: 'weight',
    baseQuantity: 1000,
    label: '₽/кг',
  },
  [UNIT_PRICE_MODES.PER_LITER]: {
    dimension: 'volume',
    baseQuantity: 1000,
    label: '₽/л',
  },
  [UNIT_PRICE_MODES.PER_100_GRAMS]: {
    dimension: 'weight',
    baseQuantity: 100,
    label: '₽/100 г',
  },
  [UNIT_PRICE_MODES.PER_100_MILLILITERS]: {
    dimension: 'volume',
    baseQuantity: 100,
    label: '₽/100 мл',
  },
});

const PRICE_FORMATTER = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
});

function getModeConfig(mode) {
  const config = MODE_CONFIG[mode];

  if (!config) {
    throw new TypeError(`Unsupported unit-price mode: ${mode}`);
  }

  return config;
}

function getQuantityBounds(quantity, dimension) {
  if (dimension === 'weight') {
    if (quantity.type === 'weight') {
      return { maximum: quantity.grams };
    }

    if (quantity.type === 'weight-range') {
      return {
        maximum: Math.max(quantity.minGrams, quantity.maxGrams),
      };
    }
  }

  if (dimension === 'volume') {
    if (quantity.type === 'volume') {
      return {
        maximum: quantity.milliliters,
      };
    }

    if (quantity.type === 'volume-range') {
      return {
        maximum: Math.max(quantity.minMilliliters, quantity.maxMilliliters),
      };
    }
  }

  throw new TypeError(`Quantity type ${quantity.type} is incompatible with ${dimension} mode`);
}

export function calculateUnitPrice(priceRubles, quantity, mode) {
  const config = getModeConfig(mode);
  const bounds = getQuantityBounds(quantity, config.dimension);
  // Ozon prices variable-weight products by the upper bound; the final charge is adjusted after weighing.
  return (priceRubles * config.baseQuantity) / bounds.maximum;
}

export function formatUnitPrice(unitPrice, mode) {
  const { label } = getModeConfig(mode);

  if (typeof unitPrice === 'number') {
    return `${PRICE_FORMATTER.format(unitPrice)} ${label}`;
  }

  const lower = Math.min(unitPrice.min, unitPrice.max);
  const upper = Math.max(unitPrice.min, unitPrice.max);

  return `${PRICE_FORMATTER.format(lower)}–${PRICE_FORMATTER.format(upper)} ${label}`;
}
