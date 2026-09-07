'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', icon: '⌂', label: 'Início' },
  { href: '/classificados', icon: '⌕', label: 'Classificados' },
  { href: '/favoritos', icon: '♡', label: 'Favoritos' },
  { href: '/menu', icon: '☰', label: 'Menu' },
] as const;

export function MobileTabbar() {
  const pathname = usePathname();

  return (
    <nav className="mobileTabbar" aria-label="Navegação mobile">
      {items.map((item) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            className={active ? 'active' : undefined}
            href={item.href}
            key={item.href}
            aria-current={active ? 'page' : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
