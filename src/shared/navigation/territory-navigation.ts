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

export type TerritoryNavigationSection =
  | 'territory'
  | 'local-life'
  | 'services';

export type TerritoryNavigationItem = {
  id: TerritoryNavigationId;
  label: string;
  description: string;
  href: string;
  icon: TerritoryNavigationIcon;
  section: TerritoryNavigationSection;
  phase: number;
  mobilePrimary: boolean;
  availability: 'active' | 'planned';
};

export const territoryNavigationRegistry: readonly TerritoryNavigationItem[] = [
  {
    id: 'territory',
    label: 'Território',
    description: 'Visão geral da área',
    href: '/',
    icon: 'home',
    section: 'territory',
    phase: 4,
    mobilePrimary: true,
    availability: 'active',
  },
  {
    id: 'map',
    label: 'Mapa',
    description: 'Bairros, educação e saúde',
    href: '/mapa',
    icon: 'map',
    section: 'territory',
    phase: 4,
    mobilePrimary: true,
    availability: 'active',
  },
  {
    id: 'community',
    label: 'Comunidade',
    description: 'Conversas e vida local',
    href: '/comunidade',
    icon: 'community',
    section: 'local-life',
    phase: 5,
    mobilePrimary: true,
    availability: 'planned',
  },
  {
    id: 'alerts',
    label: 'Alertas',
    description: 'Avisos importantes da região',
    href: '/alertas',
    icon: 'alert',
    section: 'local-life',
    phase: 6,
    mobilePrimary: false,
    availability: 'planned',
  },
  {
    id: 'events',
    label: 'Eventos',
    description: 'Agenda do território',
    href: '/eventos',
    icon: 'event',
    section: 'local-life',
    phase: 6,
    mobilePrimary: false,
    availability: 'planned',
  },
  {
    id: 'opportunities',
    label: 'Oportunidades',
    description: 'Vagas, cursos e oportunidades',
    href: '/oportunidades',
    icon: 'opportunity',
    section: 'local-life',
    phase: 6,
    mobilePrimary: false,
    availability: 'planned',
  },
  {
    id: 'classifieds',
    label: 'Classificados',
    description: 'Comprar e vender',
    href: '/classificados',
    icon: 'tag',
    section: 'services',
    phase: 7,
    mobilePrimary: true,
    availability: 'active',
  },
  {
    id: 'businesses',
    label: 'Empresas',
    description: 'Comércio e serviços locais',
    href: '/empresas',
    icon: 'business',
    section: 'services',
    phase: 8,
    mobilePrimary: false,
    availability: 'planned',
  },
] as const;

export function activeTerritoryNavigation() {
  return territoryNavigationRegistry.filter(
    (item) => item.availability === 'active',
  );
}

export function activeTerritoryNavigationBySection(
  section: TerritoryNavigationSection,
) {
  return activeTerritoryNavigation().filter(
    (item) => item.section === section,
  );
}


export function activeMobileNavigation() {
  return activeTerritoryNavigation().filter(
    (item) => item.mobilePrimary,
  );
}
