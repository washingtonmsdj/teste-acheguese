import type { ClassifiedDraftInput } from '@/modules/classifieds/domain/classified-form';
import type {
  Classified,
  ClassifiedSearchInput,
  ClassifiedSearchPage,
} from '@/modules/classifieds/domain/types';

export interface ClassifiedsRepository {
  search(input: ClassifiedSearchInput): Promise<ClassifiedSearchPage>;
  findPublishedBySlug(slug: string): Promise<Classified | null>;
  findOwnedById(id: string, ownerId: string): Promise<Classified | null>;
  createDraft(
    ownerId: string,
    input: ClassifiedDraftInput,
  ): Promise<Classified>;
  save(classified: Classified): Promise<Classified>;
}
