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
        '/auth/',
        '/entrar',
        '/favoritos',
        '/mensagens',
        '/classificados/meus',
        '/classificados/novo',
        '/classificados/*/editar',
        '/empresas',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
