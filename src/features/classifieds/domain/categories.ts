export const classifiedCategories = [
  { id: 'vehicles', icon: '🚗', label: 'Veículos' },
  { id: 'real-estate', icon: '🏠', label: 'Imóveis' },
  { id: 'electronics', icon: '📱', label: 'Eletrônicos' },
  { id: 'home', icon: '🛋️', label: 'Casa e móveis' },
  { id: 'fashion', icon: '👕', label: 'Moda' },
  { id: 'sports', icon: '⚽', label: 'Esportes' },
  { id: 'pets', icon: '🐾', label: 'Animais' },
  { id: 'other', icon: '•••', label: 'Outros' },
] as const;

export type ClassifiedCategoryId = (typeof classifiedCategories)[number]['id'];

export function isClassifiedCategoryId(value: string): value is ClassifiedCategoryId {
  return classifiedCategories.some((category) => category.id === value);
}
