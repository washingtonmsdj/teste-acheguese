export type ClassifiedStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'paused'
  | 'sold'
  | 'rejected'
  | 'archived';

export type ClassifiedCondition = 'new' | 'like_new' | 'used' | 'for_parts';

export type Money = {
  amountInCents: number;
  currency: 'BRL';
};

export type ClassifiedLocation = {
  cityId: string;
  cityName: string;
  stateCode: string;
  latitude?: number;
  longitude?: number;
};

export type ClassifiedMedia = {
  id: string;
  storageKey: string;
  alt: string;
  position: number;
};

export type Classified = {
  id: string;
  ownerId: string;
  categoryId: string;
  slug: string;
  title: string;
  description: string;
  condition: ClassifiedCondition;
  price: Money | null;
  location: ClassifiedLocation;
  media: ClassifiedMedia[];
  status: ClassifiedStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type ClassifiedListItem = Pick<
  Classified,
  'id' | 'slug' | 'title' | 'price' | 'condition' | 'location' | 'status' | 'publishedAt'
> & {
  cover: ClassifiedMedia | null;
};

export type ClassifiedSearchInput = {
  query?: string;
  categoryId?: string;
  cityId?: string;
  minPriceInCents?: number;
  maxPriceInCents?: number;
  condition?: ClassifiedCondition;
  cursor?: string;
  limit?: number;
};

export type ClassifiedSearchPage = {
  items: ClassifiedListItem[];
  nextCursor: string | null;
};
