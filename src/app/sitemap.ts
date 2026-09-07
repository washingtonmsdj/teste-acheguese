import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { getSiteUrl } from '@/lib/site-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return [];
  }

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/classificados`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const config = getSupabasePublicConfig();

  if (!config) {
    return routes;
  }

  const supabase = createClient<Database>(
    config.url,
    config.publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const { data, error } = await supabase
    .from('classifieds')
    .select('slug, updated_at')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('updated_at', { ascending: false })
    .limit(5000);

  if (error) {
    return routes;
  }

  return [
    ...routes,
    ...(data ?? []).map((item) => ({
      url: `${siteUrl}/classificados/anuncio/${item.slug}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
