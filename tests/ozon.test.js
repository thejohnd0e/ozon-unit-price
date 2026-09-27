import assert from 'node:assert/strict';
import test from 'node:test';

import { selectProductTitle } from '../src/sites/ozon.js';

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
