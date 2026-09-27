const NUMBER_PATTERN = String.raw`\d+(?:[\s\u00a0\u2009\u202f]\d{3})*(?:[.,]\d+)?`;
const UNIT_PATTERN = [
  String.raw`килограмм(?:а|ов)?`,
  String.raw`миллилитр(?:а|ов)?`,
  String.raw`грамм(?:а|ов)?`,
  String.raw`литр(?:а|ов)?`,
  String.raw`кг`,
  String.raw`мл`,
  String.raw`гр\.?`,
  String.raw`г`,
  String.raw`л`,
].join('|');
const COUNT_UNIT_PATTERN = [
  String.raw`шт\.?`,
  String.raw`штук(?:а|и)?`,
  String.raw`упаков(?:ка|ки|ок)`,
  String.raw`бутыл(?:ка|ки|ок)`,
].join('|');
const MULTIPLICATION_PATTERN = String.raw`[×xх*]`;
const UNIT_BOUNDARY_PATTERN = String.raw`(?![\p{L}])`;

const MULTIPACK_PATTERN = new RegExp(
  String.raw`(?<count>\d+)\s*(?:(?:${COUNT_UNIT_PATTERN})\s*(?:по|${MULTIPLICATION_PATTERN}|[,.]\s*)?|по|${MULTIPLICATION_PATTERN})\s*(?<amount>${NUMBER_PATTERN})\s*(?<unit>${UNIT_PATTERN})${UNIT_BOUNDARY_PATTERN}`,
  'iu',
);
const REVERSE_MULTIPACK_PATTERN = new RegExp(
  String.raw`(?<amount>${NUMBER_PATTERN})\s*(?<unit>${UNIT_PATTERN})${UNIT_BOUNDARY_PATTERN}\s*${MULTIPLICATION_PATTERN}\s*(?<count>\d+)\s*(?:${COUNT_UNIT_PATTERN})${UNIT_BOUNDARY_PATTERN}`,
  'iu',
);
const RANGE_PATTERN = new RegExp(
  String.raw`(?<minimum>${NUMBER_PATTERN})\s*[-–]\s*(?<maximum>${NUMBER_PATTERN})\s*(?<unit>${UNIT_PATTERN})${UNIT_BOUNDARY_PATTERN}`,
  'iu',
);
const SCALAR_PATTERN = new RegExp(
  String.raw`(?<amount>${NUMBER_PATTERN})\s*(?<unit>${UNIT_PATTERN})${UNIT_BOUNDARY_PATTERN}`,
  'iu',
);

function parseNumber(value) {
  return Number(value.replace(/[\s\u00a0\u2009\u202f]/gu, '').replace(',', '.'));
}

function convertToBaseUnit(value, unit) {
  const normalizedUnit = unit.replace(/\.$/u, '');

  if (normalizedUnit === 'кг' || normalizedUnit.startsWith('килограмм')) {
    return { kind: 'weight', value: value * 1000 };
  }

  if (
    normalizedUnit === 'г' ||
    normalizedUnit === 'гр' ||
    normalizedUnit.startsWith('грамм')
  ) {
    return { kind: 'weight', value };
  }

  if (normalizedUnit === 'мл' || normalizedUnit.startsWith('миллилитр')) {
    return { kind: 'volume', value };
  }

  return {
    kind: 'volume',
    value: normalizedUnit === 'л' || normalizedUnit.startsWith('литр') ? value * 1000 : value,
  };
}

function scalarQuantity(amount, unit, multiplier = 1) {
  const converted = convertToBaseUnit(parseNumber(amount) * multiplier, unit);

  if (converted.kind === 'weight') {
    return { type: 'weight', grams: converted.value };
  }

  return { type: 'volume', milliliters: converted.value };
}

function rangeQuantity(minimum, maximum, unit) {
  const convertedMinimum = convertToBaseUnit(parseNumber(minimum), unit);
  const convertedMaximum = convertToBaseUnit(parseNumber(maximum), unit);
  const lower = Math.min(convertedMinimum.value, convertedMaximum.value);
  const upper = Math.max(convertedMinimum.value, convertedMaximum.value);

  if (convertedMinimum.kind === 'weight') {
    return { type: 'weight-range', minGrams: lower, maxGrams: upper };
  }

  return {
    type: 'volume-range',
    minMilliliters: lower,
    maxMilliliters: upper,
  };
}

function findCandidate(text, pattern, priority, buildQuantity) {
  const match = pattern.exec(text);

  if (!match) {
    return null;
  }

  return {
    index: match.index,
    priority,
    quantity: buildQuantity(match.groups),
  };
}

export function parseQuantity(text) {
  if (typeof text !== 'string') {
    return null;
  }

  const normalizedText = text.toLowerCase().replace(/\s+/gu, ' ').trim();
  const candidates = [
    findCandidate(normalizedText, MULTIPACK_PATTERN, 0, ({ count, amount, unit }) =>
      scalarQuantity(amount, unit, Number(count)),
    ),
    findCandidate(normalizedText, REVERSE_MULTIPACK_PATTERN, 0, ({ count, amount, unit }) =>
      scalarQuantity(amount, unit, Number(count)),
    ),
    findCandidate(normalizedText, RANGE_PATTERN, 1, ({ minimum, maximum, unit }) =>
      rangeQuantity(minimum, maximum, unit),
    ),
    findCandidate(normalizedText, SCALAR_PATTERN, 2, ({ amount, unit }) =>
      scalarQuantity(amount, unit),
    ),
  ].filter(Boolean);

  candidates.sort((left, right) => left.index - right.index || left.priority - right.priority);

  return candidates[0]?.quantity ?? null;
}
