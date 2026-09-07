import assert from 'node:assert/strict';
import test from 'node:test';
import { isClassifiedCategoryId } from '../src/features/classifieds/domain/categories.ts';
import { parseClassifiedPriceInCents } from '../src/features/classifieds/domain/classified-validation-core.ts';
import { getSiteUrl } from '../src/lib/site-url.ts';

test('converte preço BRL para centavos sem ponto flutuante', () => {
  assert.equal(parseClassifiedPriceInCents('R$ 1.234,56'), 123456);
  assert.equal(parseClassifiedPriceInCents('25'), 2500);
  assert.equal(parseClassifiedPriceInCents('25,9'), 2590);
  assert.equal(parseClassifiedPriceInCents('0,01'), 1);
  assert.equal(parseClassifiedPriceInCents(''), null);
});

test('rejeita preços fora do contrato', () => {
  assert.equal(parseClassifiedPriceInCents('12,345'), undefined);
  assert.equal(parseClassifiedPriceInCents('-10'), undefined);
  assert.equal(parseClassifiedPriceInCents('abc'), undefined);
});

test('aceita apenas categorias canônicas', () => {
  assert.equal(isClassifiedCategoryId('vehicles'), true);
  assert.equal(isClassifiedCategoryId('electronics'), true);
  assert.equal(isClassifiedCategoryId('qualquer-coisa'), false);
});


test('normaliza a URL canônica e rejeita configuração inválida', () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;

  process.env.NEXT_PUBLIC_SITE_URL = 'https://acheguese.example/';
  assert.equal(getSiteUrl(), 'https://acheguese.example');

  process.env.NEXT_PUBLIC_SITE_URL = 'não-é-url';
  assert.equal(getSiteUrl(), null);

  if (previous === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = previous;
  }
});
