import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    return [];
  }

  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/classificados`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/buscar`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/empresas`, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
