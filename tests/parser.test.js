import assert from 'node:assert/strict';
import test from 'node:test';

import { parseQuantity } from '../src/parser.js';

test('parses scalar weights with decimal commas, decimal points, and Russian unit spellings', () => {
  const cases = [
    ['Творог 200 г', { type: 'weight', grams: 200 }],
    ['Мука 1 кг', { type: 'weight', grams: 1000 }],
    ['Йогурт 0,5 кг', { type: 'weight', grams: 500 }],
    ['Рис 1.5 кг', { type: 'weight', grams: 1500 }],
    ['Сыр 200 гр', { type: 'weight', grams: 200 }],
    ['Печенье 300 грамм', { type: 'weight', grams: 300 }],
  ];

  for (const [text, expected] of cases) {
    assert.deepEqual(parseQuantity(text), expected, text);
  }
});

test('parses scalar volumes in milliliters and liters', () => {
  const cases = [
    ['Сок 250 мл', { type: 'volume', milliliters: 250 }],
    ['Вода 1.5 л', { type: 'volume', milliliters: 1500 }],
    ['Напиток 2 литра', { type: 'volume', milliliters: 2000 }],
  ];

  for (const [text, expected] of cases) {
    assert.deepEqual(parseQuantity(text), expected, text);
  }
});

test('multiplies count-first packs expressed with multiplication separators', () => {
  const cases = [
    ['Каша 4 × 100 г', { type: 'weight', grams: 400 }],
    ['Каша 4*100 гр', { type: 'weight', grams: 400 }],
    ['Каша 4 x 100 г', { type: 'weight', grams: 400 }],
    ['Каша 4 х 100 г', { type: 'weight', grams: 400 }],
    ['Сок 6 × 200 мл', { type: 'volume', milliliters: 1200 }],
  ];

  for (const [text, expected] of cases) {
    assert.deepEqual(parseQuantity(text), expected, text);
  }
});

test('multiplies packs expressed with Russian count words and "по"', () => {
  const cases = [
    ['Каша 4 по 100 г', { type: 'weight', grams: 400 }],
    ['Корм 4 шт по 100 г', { type: 'weight', grams: 400 }],
    ['Корм 4 шт., 100 г', { type: 'weight', grams: 400 }],
    ['Каша 4 упаковок по 100 г', { type: 'weight', grams: 400 }],
    ['Вода 6 бутылок по 200 мл', { type: 'volume', milliliters: 1200 }],
    ['Молоко 950 мл х 12 шт', { type: 'volume', milliliters: 11400 }],
  ];

  for (const [text, expected] of cases) {
    assert.deepEqual(parseQuantity(text), expected, text);
  }
});

test('normalizes non-breaking, narrow, and thin spaces in multipacks', () => {
  assert.deepEqual(parseQuantity('Каша 4\u2009×\u00a0100\u202fг'), {
    type: 'weight',
    grams: 400,
  });
});

test('parses and normalizes weight and volume ranges', () => {
  const cases = [
    ['Вес 400-600 г', { type: 'weight-range', minGrams: 400, maxGrams: 600 }],
    ['Вес 0.4–0.6 кг', { type: 'weight-range', minGrams: 400, maxGrams: 600 }],
    ['Вес 600–400 г', { type: 'weight-range', minGrams: 400, maxGrams: 600 }],
    [
      'Объем 0,25-0,5 л',
      { type: 'volume-range', minMilliliters: 250, maxMilliliters: 500 },
    ],
  ];

  for (const [text, expected] of cases) {
    assert.deepEqual(parseQuantity(text), expected, text);
  }
});

test('ignores percentages and unrelated bare numbers when selecting a quantity', () => {
  assert.deepEqual(parseQuantity('Творог 2% 200 г'), { type: 'weight', grams: 200 });
  assert.deepEqual(parseQuantity('Молоко 3.2%, 1 л'), {
    type: 'volume',
    milliliters: 1000,
  });
  assert.deepEqual(parseQuantity('Модель 500, упаковка 200 г'), {
    type: 'weight',
    grams: 200,
  });
  assert.equal(parseQuantity('Скидка 5%'), null);
});

test('parses grouped numbers with narrow or regular spaces', () => {
  assert.deepEqual(parseQuantity('Мука 1 000 г'), { type: 'weight', grams: 1000 });
  assert.deepEqual(parseQuantity('Вода 1\u2009500 мл'), { type: 'volume', milliliters: 1500 });
});
