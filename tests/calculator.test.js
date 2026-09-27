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

test('calculates range prices using the upper bound', () => {
  assert.equal(
    calculateUnitPrice(
      100,
      { type: 'weight-range', minGrams: 400, maxGrams: 600 },
      UNIT_PRICE_MODES.PER_KILOGRAM,
    ),
    166.66666666666666,
  );

  assert.equal(
    calculateUnitPrice(
      90,
      { type: 'volume-range', minMilliliters: 300, maxMilliliters: 600 },
      UNIT_PRICE_MODES.PER_LITER,
    ),
    150,
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

test('calculates the specification range example using the upper weight', () => {
  const unitPrice = calculateUnitPrice(
    454,
    { type: 'weight-range', minGrams: 550, maxGrams: 650 },
    UNIT_PRICE_MODES.PER_KILOGRAM,
  );

  assert.equal(formatUnitPrice(unitPrice, UNIT_PRICE_MODES.PER_KILOGRAM), '698 ₽/кг');
});
