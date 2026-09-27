import assert from 'node:assert/strict';
import test from 'node:test';

import {
  UNIT_PRICE_MODES,
  calculateUnitPrice,
  formatUnitPrice,
} from '../src/calculator.js';

test('calculates weight prices per kilogram and per 100 grams', () => {
  const quantity = { type: 'weight', grams: 200 };

  assert.equal(calculateUnitPrice(99, quantity, UNIT_PRICE_MODES.PER_KILOGRAM), 495);
  assert.equal(calculateUnitPrice(99, quantity, UNIT_PRICE_MODES.PER_100_GRAMS), 49.5);
});

test('calculates volume prices per liter and per 100 milliliters', () => {
  const quantity = { type: 'volume', milliliters: 250 };

  assert.equal(calculateUnitPrice(120, quantity, UNIT_PRICE_MODES.PER_LITER), 480);
  assert.equal(
    calculateUnitPrice(120, quantity, UNIT_PRICE_MODES.PER_100_MILLILITERS),
    48,
  );
});

test('calculates range prices in ascending display order', () => {
  assert.deepEqual(
    calculateUnitPrice(
      100,
      { type: 'weight-range', minGrams: 400, maxGrams: 600 },
      UNIT_PRICE_MODES.PER_KILOGRAM,
    ),
    { min: 166.66666666666666, max: 250 },
  );

  assert.deepEqual(
    calculateUnitPrice(
      90,
      { type: 'volume-range', minMilliliters: 300, maxMilliliters: 600 },
      UNIT_PRICE_MODES.PER_LITER,
    ),
    { min: 150, max: 300 },
  );
});

test('formats prices with human rounding and the selected unit label', () => {
  const cases = [
    [333.3333, UNIT_PRICE_MODES.PER_KILOGRAM, '333 ₽/кг'],
    [49.5, UNIT_PRICE_MODES.PER_100_GRAMS, '50 ₽/100 г'],
    [480, UNIT_PRICE_MODES.PER_LITER, '480 ₽/л'],
    [12.345, UNIT_PRICE_MODES.PER_100_MILLILITERS, '12 ₽/100 мл'],
  ];

  for (const [value, mode, expected] of cases) {
    assert.equal(formatUnitPrice(value, mode), expected);
  }
});

test('formats calculated ranges from the lower value to the higher value', () => {
  const unitPrice = calculateUnitPrice(
    100,
    { type: 'weight-range', minGrams: 400, maxGrams: 600 },
    UNIT_PRICE_MODES.PER_KILOGRAM,
  );

  assert.equal(formatUnitPrice(unitPrice, UNIT_PRICE_MODES.PER_KILOGRAM), '167–250 ₽/кг');
  assert.equal(
    formatUnitPrice({ min: 250, max: 166.66666666666666 }, UNIT_PRICE_MODES.PER_KILOGRAM),
    '167–250 ₽/кг',
  );
});

test('rounds the specification range example to whole rubles per kilogram', () => {
  const unitPrice = calculateUnitPrice(
    59,
    { type: 'weight-range', minGrams: 400, maxGrams: 600 },
    UNIT_PRICE_MODES.PER_KILOGRAM,
  );

  assert.equal(formatUnitPrice(unitPrice, UNIT_PRICE_MODES.PER_KILOGRAM), '98–148 ₽/кг');
});
