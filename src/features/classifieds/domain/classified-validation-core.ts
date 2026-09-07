export function parseClassifiedPriceInCents(
  value: string,
): number | null | undefined {
  if (!value) {
    return null;
  }

  const normalized = value
    .replace(/\s/g, '')
    .replace(/^R\$/i, '')
    .replace(/\./g, '')
    .replace(',', '.');

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    return undefined;
  }

  const [whole, fraction = ''] = normalized.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));

  if (!Number.isSafeInteger(cents) || cents < 0) {
    return undefined;
  }

  return cents;
}
