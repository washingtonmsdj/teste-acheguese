export const classifiedCategories = [
  { id: 'vehicles', label: 'Veículos' },
  { id: 'real-estate', label: 'Imóveis' },
  { id: 'electronics', label: 'Eletrônicos' },
  { id: 'home', label: 'Casa e móveis' },
  { id: 'fashion', label: 'Moda' },
  { id: 'sports', label: 'Esportes' },
  { id: 'pets', label: 'Animais' },
  { id: 'other', label: 'Outros' },
] as const;

export type ClassifiedCategoryId = (typeof classifiedCategories)[number]['id'];

export function isClassifiedCategoryId(value: string): value is ClassifiedCategoryId {
  return classifiedCategories.some((category) => category.id === value);
}
