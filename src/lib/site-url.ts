export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}
