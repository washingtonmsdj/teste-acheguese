'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type IconName = 'home' | 'map' | 'tag' | 'menu';

function TabIcon({ name }: { name: IconName }) {
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
        <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.2" />
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

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" />
    </svg>
  );
}

const items = [
  { href: '/', icon: 'home', label: 'Início' },
  { href: '/mapa', icon: 'map', label: 'Mapa' },
  { href: '/classificados', icon: 'tag', label: 'Classificados' },
  { href: '/menu', icon: 'menu', label: 'Menu' },
] as const;

export function MobileTabbar() {
  const pathname = usePathname();

  return (
    <nav className="mobileTabbar" aria-label="Navegação mobile">
      {items.map((item) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

        return (
          <Link
            className={active ? 'active' : undefined}
            href={item.href}
            key={item.href}
            aria-current={active ? 'page' : undefined}
          >
            <TabIcon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
