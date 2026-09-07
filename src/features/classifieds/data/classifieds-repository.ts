import type {
  Classified,
  ClassifiedSearchInput,
  ClassifiedSearchPage,
} from '@/features/classifieds/domain/types';

export interface ClassifiedsRepository {
  search(input: ClassifiedSearchInput): Promise<ClassifiedSearchPage>;
  findPublishedBySlug(slug: string): Promise<Classified | null>;
  findOwnedById(id: string, ownerId: string): Promise<Classified | null>;
  createDraft(ownerId: string): Promise<Classified>;
  save(classified: Classified): Promise<Classified>;
}
