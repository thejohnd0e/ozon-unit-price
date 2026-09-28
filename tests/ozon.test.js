import assert from 'node:assert/strict';
import test from 'node:test';

import { parseOzonQuantity, selectProductTitle } from '../src/sites/ozon.js';

test('treats Ozon milk gram quantities as milliliters', () => {
  assert.deepEqual(
    parseOzonQuantity('Молоко питьевое ультрапастеризованное 3,2% 950 г, Село Зеленое'),
    { type: 'volume', milliliters: 950 },
  );
});

test('keeps ordinary gram quantities as weight', () => {
  assert.deepEqual(parseOzonQuantity('Творог 200 г'), { type: 'weight', grams: 200 });
});

test('selects a product title instead of a promotional badge link', () => {
  assert.equal(
    selectProductTitle(['Съешьте скорее', 'Редис, 250 г']),
    'Редис, 250 г',
  );
});

test('selects a title when the badge link also contains a promotion', () => {
  assert.equal(
    selectProductTitle(['Съешьте скорее Цена что надо', 'Апельсины, 1 кг']),
    'Апельсины, 1 кг',
  );
});
