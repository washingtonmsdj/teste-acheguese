import {
  isClassifiedCategoryId,
  type ClassifiedCategoryId,
} from '@/features/classifieds/domain/categories';
import type { ClassifiedCondition } from '@/features/classifieds/domain/types';

export type ClassifiedDraftInput = {
  title: string;
  description: string;
  categoryId: ClassifiedCategoryId;
  condition: ClassifiedCondition;
  priceInCents: number | null;
  cityId: string;
  neighborhood: string | null;
};

export type ClassifiedValidationIssue = {
  field:
    | 'title'
    | 'description'
    | 'categoryId'
    | 'condition'
    | 'price'
    | 'cityId'
    | 'neighborhood';
  code: string;
};

export type ClassifiedDraftValidationResult =
  | {
      ok: true;
      value: ClassifiedDraftInput;
    }
  | {
      ok: false;
      issues: ClassifiedValidationIssue[];
    };

const conditions = new Set<ClassifiedCondition>([
  'new',
  'like_new',
  'used',
  'for_parts',
]);

function stringValue(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parsePriceInCents(value: string): number | null | undefined {
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

export function validateClassifiedFormData(
  formData: FormData,
): ClassifiedDraftValidationResult {
  const issues: ClassifiedValidationIssue[] = [];

  const title = stringValue(formData.get('title'));
  const description = stringValue(formData.get('description'));
  const categoryValue = stringValue(formData.get('categoryId'));
  const conditionValue = stringValue(formData.get('condition'));
  const priceValue = stringValue(formData.get('price'));
  const cityId = stringValue(formData.get('cityId'));
  const neighborhoodValue = stringValue(formData.get('neighborhood'));
  const priceInCents = parsePriceInCents(priceValue);

  if (title.length < 5 || title.length > 120) {
    issues.push({ field: 'title', code: 'invalid_length' });
  }

  if (description.length < 20 || description.length > 5000) {
    issues.push({ field: 'description', code: 'invalid_length' });
  }

  if (!isClassifiedCategoryId(categoryValue)) {
    issues.push({ field: 'categoryId', code: 'invalid_category' });
  }

  if (!conditions.has(conditionValue as ClassifiedCondition)) {
    issues.push({ field: 'condition', code: 'invalid_condition' });
  }

  if (priceInCents === undefined) {
    issues.push({ field: 'price', code: 'invalid_price' });
  }

  if (!/^\d+$/.test(cityId)) {
    issues.push({ field: 'cityId', code: 'invalid_city' });
  }

  if (neighborhoodValue.length > 120) {
    issues.push({ field: 'neighborhood', code: 'invalid_length' });
  }

  if (issues.length > 0) {
    return {
      ok: false,
      issues,
    };
  }

  return {
    ok: true,
    value: {
      title,
      description,
      categoryId: categoryValue as ClassifiedCategoryId,
      condition: conditionValue as ClassifiedCondition,
      priceInCents: priceInCents ?? null,
      cityId,
      neighborhood: neighborhoodValue || null,
    },
  };
}
