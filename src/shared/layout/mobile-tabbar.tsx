'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';
import { activeMobileNavigation } from '@/shared/navigation/territory-navigation';

export function MobileTabbar() {
  const pathname = usePathname();
  const items = activeMobileNavigation();

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
            key={item.id}
            aria-current={active ? 'page' : undefined}
          >
            <NavigationIcon name={item.icon} />
            <span>
              {item.id === 'territory' ? 'Início' : item.label}
            </span>
          </Link>
        );
      })}

      <Link
        className={pathname === '/menu' ? 'active' : undefined}
        href="/menu"
        aria-current={pathname === '/menu' ? 'page' : undefined}
      >
        <NavigationIcon name="menu" />
        <span>Menu</span>
      </Link>
    </nav>
  );
}
