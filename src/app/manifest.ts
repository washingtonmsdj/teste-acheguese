import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Achegue-se',
    short_name: 'Achegue-se',
    description: 'Descubra negócios, serviços e oportunidades perto de você.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0c9470',
    lang: 'pt-BR',
  };
}
