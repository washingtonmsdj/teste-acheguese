export type TerritoryType =
  | 'country'
  | 'state'
  | 'city'
  | 'district'
  | 'neighborhood';

export type TerritoryStatus =
  | 'active'
  | 'coming_soon'
  | 'inactive';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type BoundingBox = {
  west: number;
  south: number;
  east: number;
  north: number;
};

export type Territory = {
  id: string;
  type: TerritoryType;
  parentId: string | null;
  slug: string;
  name: string;
  geographicPath: string;
  status: TerritoryStatus;
  countryCode: string | null;
  stateCode: string | null;
  ibgeCode: string | null;
  timezone: string | null;
  center: Coordinates | null;
  bbox: BoundingBox | null;
};

export type TerritoryGroupStatus =
  | 'active'
  | 'coming_soon'
  | 'inactive';

export type TerritoryGroup = {
  id: string;
  slug: string;
  name: string;
  anchorCityId: string;
  status: TerritoryGroupStatus;
};

export type TerritoryScope =
  | {
      kind: 'territory';
      territoryId: string;
    }
  | {
      kind: 'group';
      groupId: string;
    }
  | {
      kind: 'none';
    };

export type TerritoryReference = Pick<
  Territory,
  | 'id'
  | 'type'
  | 'slug'
  | 'name'
  | 'geographicPath'
  | 'status'
>;
