import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/auth/',
        '/entrar',
        '/favoritos',
        '/mensagens',
        '/menu',
        '/buscar',
        '/classificados/meus',
        '/classificados/novo',
        '/classificados/*/editar',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
