import type { ClassifiedCategoryId } from '@/modules/classifieds/domain/categories';

type ClassifiedCategoryIconProps = {
  category: ClassifiedCategoryId;
};

export function ClassifiedCategoryIcon({
  category,
}: ClassifiedCategoryIconProps) {
  if (category === 'vehicles') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 15 1.7-5.2A2 2 0 0 1 8.6 8.4h6.8a2 2 0 0 1 1.9 1.4L19 15" />
        <path d="M4 15h16v3H4zM7 18v2M17 18v2M7.5 13h.01M16.5 13h.01" />
      </svg>
    );
  }

  if (category === 'real-estate') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 11 8-6 8 6v8H4z" />
        <path d="M9 19v-5h6v5" />
      </svg>
    );
  }

  if (category === 'electronics') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M10 6h4M11 18h2" />
      </svg>
    );
  }

  if (category === 'home') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 13h14v6H5zM7 13V9h4a3 3 0 0 1 3 3v1M5 16H3v3M19 16h2v3" />
      </svg>
    );
  }

  if (category === 'fashion') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9 5-4 2-2 5 4 2v6h10v-6l4-2-2-5-4-2a3 3 0 0 1-6 0Z" />
      </svg>
    );
  }

  if (category === 'sports') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="m9 5 3 3 3-3M7 10l3 2-1 4M17 10l-3 2 1 4M9 16h6" />
      </svg>
    );
  }

  if (category === 'pets') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 11c-2.6 1.4-4 3.2-4 5.2 0 2 1.5 3.3 3.6 3.3 1.5 0 2.7-.8 4.4-.8s2.9.8 4.4.8c2.1 0 3.6-1.3 3.6-3.3 0-2-1.4-3.8-4-5.2-1.4-.8-2.5-1.2-4-1.2S9.4 10.2 8 11Z" />
        <circle cx="7" cy="7" r="1.6" />
        <circle cx="12" cy="5.5" r="1.6" />
        <circle cx="17" cy="7" r="1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
    </svg>
  );
}
