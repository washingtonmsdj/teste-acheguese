export const territoryReleaseScope = {
  city: {
    name: 'Salvador',
    slug: 'salvador',
    stateCode: 'BA',
    geographicPath: '/br/ba/salvador',
  },
  group: {
    name: 'Complexo do Nordeste de Amaralina',
    shortName: 'Complexo',
    slug: 'complexo-do-nordeste-de-amaralina',
  },
  map: {
    bounds: {
      west: -38.4873837606422,
      south: -13.0134576151743,
      east: -38.4668939364098,
      north: -12.9958446983238,
    },
    zoom: 14,
    categories: ['education', 'health'],
  },
  neighborhoods: [
    { slug: 'nordeste-de-amaralina', name: 'Nordeste de Amaralina' },
    { slug: 'santa-cruz', name: 'Santa Cruz' },
    { slug: 'vale-das-pedrinhas', name: 'Vale das Pedrinhas' },
    { slug: 'chapada-do-rio-vermelho', name: 'Chapada do Rio Vermelho' },
  ],
} as const;
