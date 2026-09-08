import type { TerritoryNavigationIcon } from './territory-navigation';

export type NavigationIconName =
  | TerritoryNavigationIcon
  | 'search'
  | 'user'
  | 'menu'
  | 'data'
  | 'neighborhood'
  | 'messages'
  | 'favorite'
  | 'check';

type TerritoryNavigationIconProps = {
  name: NavigationIconName;
};

export function NavigationIcon({
  name,
}: TerritoryNavigationIconProps) {
  if (name === 'home') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.8 10.8 12 4l8.2 6.8v8.4a.8.8 0 0 1-.8.8H15v-6H9v6H4.6a.8.8 0 0 1-.8-.8z" />
      </svg>
    );
  }

  if (name === 'map') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.8 9 4l6 2 5-1.8v14L15 20l-6-2-5 1.8z" />
        <path d="M9 4v14M15 6v14" />
      </svg>
    );
  }

  if (name === 'community') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M3.5 19c.8-3.5 2.7-5.3 5.5-5.3s4.8 1.8 5.5 5.3M14 14.2c2.8-.5 5 .8 6 3.8" />
      </svg>
    );
  }

  if (name === 'alert') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4 3.8 19h16.4z" />
        <path d="M12 9v4.5M12 17h.01" />
      </svg>
    );
  }

  if (name === 'event') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5.5" width="16" height="14" rx="2" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16" />
      </svg>
    );
  }

  if (name === 'opportunity') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 19h6M10 22h4" />
        <path d="M8.2 14.7A6 6 0 1 1 15.8 14.7c-.8.6-1.2 1.2-1.3 2.3h-5c-.1-1.1-.5-1.7-1.3-2.3Z" />
      </svg>
    );
  }

  if (name === 'tag') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.5V11l8.6 8.6a1.5 1.5 0 0 0 2.1 0l4.9-4.9a1.5 1.5 0 0 0 0-2.1L11 4H5.5A1.5 1.5 0 0 0 4 5.5Z" />
        <circle cx="8" cy="8" r="1.2" />
      </svg>
    );
  }

  if (name === 'business') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9h16v11H4zM6 9l1-5h10l1 5" />
        <path d="M8 13h3v7M15 13h2" />
      </svg>
    );
  }

  if (name === 'data') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19V11M12 19V5M19 19v-7" />
        <path d="M3.5 19.5h17" />
      </svg>
    );
  }

  if (name === 'neighborhood') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 10 5-4 4 3 3-2 4 3v9H4z" />
        <path d="M8 19v-5h3v5M16 13h1" />
      </svg>
    );
  }

  if (name === 'messages') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-5 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    );
  }

  if (name === 'favorite') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z" />
      </svg>
    );
  }

  if (name === 'check') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6.5 12.5 3.4 3.4L17.8 8" />
      </svg>
    );
  }

  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 5 5" />
      </svg>
    );
  }

  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" />
    </svg>
  );
}
