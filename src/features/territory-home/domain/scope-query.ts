export type TerritoryScopeQuery =
  | {
      kind: 'group';
    }
  | {
      kind: 'neighborhood';
      slug: string;
    }
  | {
      kind: 'invalid';
    };

const SLUG_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseTerritoryScopeQuery(
  value: string | string[] | undefined,
): TerritoryScopeQuery {
  const raw = Array.isArray(value) ? value[0] : value;

  if (raw === undefined || raw === '') {
    return { kind: 'group' };
  }

  const slug = raw.trim();

  if (
    !slug ||
    slug.length > 80 ||
    !SLUG_PATTERN.test(slug)
  ) {
    return { kind: 'invalid' };
  }

  return {
    kind: 'neighborhood',
    slug,
  };
}
