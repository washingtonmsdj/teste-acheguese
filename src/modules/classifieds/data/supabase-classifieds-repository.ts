import type { SupabaseClient } from '@supabase/supabase-js';
import type { ClassifiedDraftInput } from '@/modules/classifieds/domain/classified-form';
import type {
  Classified,
  ClassifiedCondition,
  ClassifiedListItem,
  ClassifiedSearchInput,
  ClassifiedSearchPage,
} from '@/modules/classifieds/domain/types';
import type { ClassifiedsRepository } from '@/modules/classifieds/data/classifieds-repository';
import type { Database } from '@/lib/supabase/database.types';

type ClassifiedRow = Database['public']['Tables']['classifieds']['Row'];
type MediaRow = Database['public']['Tables']['classified_media']['Row'];
type CityRow = Database['public']['Tables']['cities']['Row'];

type ClassifiedWithRelations = ClassifiedRow & {
  cities: CityRow | null;
  classified_media: MediaRow[];
};

function mapClassified(row: ClassifiedWithRelations): Classified {
  return {
    id: row.id,
    ownerId: row.owner_id,
    categoryId: row.category_id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    condition: row.condition as ClassifiedCondition,
    price:
      row.price_cents === null
        ? null
        : { amountInCents: row.price_cents, currency: 'BRL' },
    location: {
      cityId: String(row.city_id),
      cityName: row.cities?.name ?? '',
      stateCode: row.cities?.state_code ?? '',
      neighborhood: row.neighborhood,
    },
    media: row.classified_media.map((media) => ({
      id: media.id,
      storageKey: media.storage_key,
      alt: media.alt,
      position: media.position,
    })),
    status: row.status as Classified['status'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

function mapListItem(row: ClassifiedWithRelations): ClassifiedListItem {
  const item = mapClassified(row);
  const cover = item.media
    .slice()
    .sort((a, b) => a.position - b.position)[0] ?? null;

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    price: item.price,
    condition: item.condition,
    location: item.location,
    status: item.status,
    publishedAt: item.publishedAt,
    cover,
  };
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

export class SupabaseClassifiedsRepository
  implements ClassifiedsRepository
{
  constructor(
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async search(input: ClassifiedSearchInput): Promise<ClassifiedSearchPage> {
    const limit = Math.min(Math.max(input.limit ?? 24, 1), 50);

    let query = this.supabase
      .from('classifieds')
      .select('*, cities(*), classified_media(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit + 1);

    if (input.categoryId) {
      query = query.eq('category_id', input.categoryId);
    }

    if (input.cityId) {
      query = query.eq('city_id', Number(input.cityId));
    }

    if (input.minPriceInCents !== undefined) {
      query = query.gte('price_cents', input.minPriceInCents);
    }

    if (input.maxPriceInCents !== undefined) {
      query = query.lte('price_cents', input.maxPriceInCents);
    }

    if (input.condition) {
      query = query.eq('condition', input.condition);
    }

    if (input.query?.trim()) {
      query = query.textSearch('search_vector', input.query.trim(), {
        config: 'portuguese',
        type: 'websearch',
      });
    }

    if (input.cursor) {
      query = query.lt('published_at', input.cursor);
    }

    const { data, error } = await query;

    if (error) throw error;

    const rows = (data ?? []) as unknown as ClassifiedWithRelations[];
    const hasNextPage = rows.length > limit;
    const visibleRows = rows.slice(0, limit);

    return {
      items: visibleRows.map(mapListItem),
      nextCursor:
        hasNextPage
          ? visibleRows.at(-1)?.published_at ?? null
          : null,
    };
  }

  async findPublishedByIds(ids: string[]): Promise<ClassifiedListItem[]> {
    if (!ids.length) return [];

    const { data, error } = await this.supabase
      .from('classifieds')
      .select('*, cities(*), classified_media(*)')
      .eq('status', 'published')
      .in('id', ids);

    if (error) throw error;

    return ((data ?? []) as unknown as ClassifiedWithRelations[]).map(mapListItem);
  }

  async findPublishedBySlug(slug: string): Promise<Classified | null> {
    const { data, error } = await this.supabase
      .from('classifieds')
      .select('*, cities(*), classified_media(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw error;
    return data
      ? mapClassified(data as unknown as ClassifiedWithRelations)
      : null;
  }

  async findOwnedById(
    id: string,
    ownerId: string,
  ): Promise<Classified | null> {
    const { data, error } = await this.supabase
      .from('classifieds')
      .select('*, cities(*), classified_media(*)')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .maybeSingle();

    if (error) throw error;
    return data
      ? mapClassified(data as unknown as ClassifiedWithRelations)
      : null;
  }

  async createDraft(
    ownerId: string,
    input: ClassifiedDraftInput,
  ): Promise<Classified> {
    const suffix = crypto.randomUUID().slice(0, 8);
    const baseSlug = slugify(input.title) || 'anuncio';

    const { data, error } = await this.supabase
      .from('classifieds')
      .insert({
        owner_id: ownerId,
        category_id: input.categoryId,
        city_id: Number(input.cityId),
        slug: `${baseSlug}-${suffix}`,
        title: input.title,
        description: input.description,
        condition: input.condition,
        price_cents: input.priceInCents,
        neighborhood: input.neighborhood,
        status: 'draft',
      })
      .select('*, cities(*), classified_media(*)')
      .single();

    if (error) throw error;

    return mapClassified(data as unknown as ClassifiedWithRelations);
  }

  async save(classified: Classified): Promise<Classified> {
    const { data, error } = await this.supabase
      .from('classifieds')
      .update({
        category_id: classified.categoryId,
        city_id: Number(classified.location.cityId),
        title: classified.title,
        description: classified.description,
        condition: classified.condition,
        price_cents: classified.price?.amountInCents ?? null,
        neighborhood: classified.location.neighborhood ?? null,
        status: classified.status,
      })
      .eq('id', classified.id)
      .eq('owner_id', classified.ownerId)
      .select('*, cities(*), classified_media(*)')
      .single();

    if (error) throw error;

    return mapClassified(data as unknown as ClassifiedWithRelations);
  }
}
