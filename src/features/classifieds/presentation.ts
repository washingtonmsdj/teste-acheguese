import type { ClassifiedCondition } from '@/features/classifieds/domain/types';

export const classifiedConditionLabels: Record<ClassifiedCondition, string> = {
  new: 'Novo',
  like_new: 'Seminovo',
  used: 'Usado',
  for_parts: 'Para peças',
};

export function formatClassifiedPrice(amountInCents: number | null) {
  if (amountInCents === null) return 'Preço a combinar';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100);
}

export function formatClassifiedLocation({
  neighborhood,
  cityName,
  stateCode,
}: {
  neighborhood?: string | null;
  cityName: string;
  stateCode: string;
}) {
  const city = stateCode ? `${cityName} - ${stateCode}` : cityName;
  return [neighborhood, city].filter(Boolean).join(' · ');
}
