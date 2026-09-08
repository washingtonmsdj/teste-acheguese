export type TerritoryNavigationId =
  | 'territory'
  | 'map'
  | 'community'
  | 'alerts'
  | 'events'
  | 'opportunities'
  | 'classifieds'
  | 'businesses';

export type TerritoryNavigationIcon =
  | 'home'
  | 'map'
  | 'community'
  | 'alert'
  | 'event'
  | 'opportunity'
  | 'tag'
  | 'business';

export type TerritoryNavigationItem = {
  id: TerritoryNavigationId;
  label: string;
  href: string;
  icon: TerritoryNavigationIcon;
  phase: number;
  availability: 'active' | 'planned';
};

export const territoryNavigationRegistry: readonly TerritoryNavigationItem[] = [
  {
    id: 'territory',
    label: 'Território',
    href: '/',
    icon: 'home',
    phase: 4,
    availability: 'active',
  },
  {
    id: 'map',
    label: 'Mapa',
    href: '/mapa',
    icon: 'map',
    phase: 4,
    availability: 'active',
  },
  {
    id: 'community',
    label: 'Comunidade',
    href: '/comunidade',
    icon: 'community',
    phase: 5,
    availability: 'planned',
  },
  {
    id: 'alerts',
    label: 'Alertas',
    href: '/alertas',
    icon: 'alert',
    phase: 6,
    availability: 'planned',
  },
  {
    id: 'events',
    label: 'Eventos',
    href: '/eventos',
    icon: 'event',
    phase: 6,
    availability: 'planned',
  },
  {
    id: 'opportunities',
    label: 'Oportunidades',
    href: '/oportunidades',
    icon: 'opportunity',
    phase: 6,
    availability: 'planned',
  },
  {
    id: 'classifieds',
    label: 'Classificados',
    href: '/classificados',
    icon: 'tag',
    phase: 7,
    availability: 'active',
  },
  {
    id: 'businesses',
    label: 'Empresas',
    href: '/empresas',
    icon: 'business',
    phase: 8,
    availability: 'planned',
  },
] as const;

export function activeTerritoryNavigation() {
  return territoryNavigationRegistry.filter(
    (item) => item.availability === 'active',
  );
}
