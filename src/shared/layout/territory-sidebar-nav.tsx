'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';
import {
  activeTerritoryNavigationBySection,
  type TerritoryNavigationId,
  type TerritoryNavigationSection,
} from '@/shared/navigation/territory-navigation';
import styles from './territory-app-shell.module.css';

type TerritorySidebarNavProps = {
  fallbackActiveId: TerritoryNavigationId;
};

const navigationGroups: Array<{
  id: TerritoryNavigationSection;
  label: string;
}> = [
  { id: 'territory', label: 'Território' },
  { id: 'local-life', label: 'Agora no bairro' },
  { id: 'services', label: 'Serviços' },
];

function isNavigationItemActive(
  pathname: string | null,
  href: string,
  id: TerritoryNavigationId,
  fallbackActiveId: TerritoryNavigationId,
) {
  if (!pathname) return id === fallbackActiveId;

  return href === '/'
    ? pathname === '/'
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function TerritorySidebarNav({
  fallbackActiveId,
}: TerritorySidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={styles.sidebarNav}
      aria-label="Navegação territorial"
    >
      {navigationGroups.map((group) => {
        const items = activeTerritoryNavigationBySection(
          group.id,
        );

        if (!items.length) return null;

        return (
          <div className={styles.navGroup} key={group.id}>
            <span className={styles.navGroupLabel}>
              {group.label}
            </span>
            <div className={styles.navGroupItems}>
              {items.map((item) => {
                const active = isNavigationItemActive(
                  pathname,
                  item.href,
                  item.id,
                  fallbackActiveId,
                );

                return (
                  <Link
                    href={item.href}
                    key={item.id}
                    className={
                      active ? styles.navActive : undefined
                    }
                    aria-current={active ? 'page' : undefined}
                  >
                    <NavigationIcon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
