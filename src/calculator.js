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
      return { minimum: quantity.grams, maximum: quantity.grams, isRange: false };
    }

    if (quantity.type === 'weight-range') {
      return {
        minimum: Math.min(quantity.minGrams, quantity.maxGrams),
        maximum: Math.max(quantity.minGrams, quantity.maxGrams),
        isRange: true,
      };
    }
  }

  if (dimension === 'volume') {
    if (quantity.type === 'volume') {
      return {
        minimum: quantity.milliliters,
        maximum: quantity.milliliters,
        isRange: false,
      };
    }

    if (quantity.type === 'volume-range') {
      return {
        minimum: Math.min(quantity.minMilliliters, quantity.maxMilliliters),
        maximum: Math.max(quantity.minMilliliters, quantity.maxMilliliters),
        isRange: true,
      };
    }
  }

  throw new TypeError(`Quantity type ${quantity.type} is incompatible with ${dimension} mode`);
}

export function calculateUnitPrice(priceRubles, quantity, mode) {
  const config = getModeConfig(mode);
  const bounds = getQuantityBounds(quantity, config.dimension);
  const lowerPrice = (priceRubles * config.baseQuantity) / bounds.maximum;

  if (!bounds.isRange) {
    return lowerPrice;
  }

  return {
    min: lowerPrice,
    max: (priceRubles * config.baseQuantity) / bounds.minimum,
  };
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
