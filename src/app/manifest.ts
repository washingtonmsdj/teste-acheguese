import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Achegue-se',
    short_name: 'Achegue-se',
    description: 'Dados públicos, mapa e utilidade local organizados pelo território.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0c9470',
    lang: 'pt-BR',
  };
}
