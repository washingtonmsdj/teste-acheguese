type ClaimsWithAppMetadata = {
  app_metadata?: unknown;
};

export function hasClassifiedAdminRole(claims: unknown) {
  if (!claims || typeof claims !== 'object') return false;

  const appMetadata = (claims as ClaimsWithAppMetadata).app_metadata;

  if (!appMetadata || typeof appMetadata !== 'object') return false;

  return (
    (appMetadata as { role?: unknown }).role === 'classified_admin'
  );
}
