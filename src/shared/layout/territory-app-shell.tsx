import type { ReactNode } from 'react';
import { territoryReleaseScope } from '@/config/territory-release-scope';
import Link from 'next/link';
import { Brand } from '@/shared/ui/brand';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';
import { TerritorySidebarNav } from '@/shared/layout/territory-sidebar-nav';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';
import type { TerritoryNavigationId } from '@/shared/navigation/territory-navigation';
import styles from './territory-app-shell.module.css';

type TerritoryAppShellProps = {
  activeId: TerritoryNavigationId;
  territoryName: string;
  territoryHref?: string;
  children: ReactNode;
  contextRail?: ReactNode;
  immersive?: boolean;
};

export function TerritoryAppShell({
  activeId,
  territoryName,
  territoryHref = '/',
  children,
  contextRail,
  immersive = false,
}: TerritoryAppShellProps) {
  return (
    <div
      className={[
        styles.shell,
        contextRail ? styles.hasRail : '',
        immersive ? styles.immersive : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <Brand />
        </div>

        <Link
          className={styles.territoryContext}
          href={territoryHref}
          aria-label={`Território atual: ${territoryName}`}
        >
          <span>Território atual</span>
          <strong>{territoryName}</strong>
          <small>
            {territoryReleaseScope.city.name} · {territoryReleaseScope.city.stateCode}
          </small>
        </Link>

        <TerritorySidebarNav fallbackActiveId={activeId} />

        <div className={styles.sidebarUtility}>
          <Link href="/buscar">
            <NavigationIcon name="search" />
            <span>Buscar</span>
          </Link>
          <Link href="/entrar">
            <NavigationIcon name="user" />
            <span>Sua conta</span>
          </Link>
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <header className={styles.mobileHeader}>
          <Brand />
          <Link
            className={styles.mobileTerritory}
            href={territoryHref}
            aria-label={`Território atual: ${territoryName}`}
          >
            <span className={styles.mobileTerritoryDot} aria-hidden="true" />
            <span>
              <small>Território atual</small>
              <strong>{territoryName}</strong>
            </span>
          </Link>
          <Link
            className={styles.mobileMenu}
            href="/menu"
            aria-label="Abrir menu"
          >
            <NavigationIcon name="menu" />
          </Link>
        </header>

        <header className={styles.desktopTopbar}>
          <Link
            className={styles.topbarTerritory}
            href={territoryHref}
          >
            <span className={styles.locationDot} aria-hidden="true" />
            <span>
              <small>Você está vendo</small>
              <strong>{territoryName}</strong>
            </span>
          </Link>

          <Link className={styles.searchCommand} href="/buscar">
            <NavigationIcon name="search" />
            <span className={styles.searchText}>
              <strong>Buscar no Achegue-se</strong>
              <small>Mapa, bairros e Classificados</small>
            </span>
            <span className={styles.searchArrow} aria-hidden="true">
              →
            </span>
          </Link>

          <Link className={styles.accountButton} href="/entrar">
            <NavigationIcon name="user" />
            <span>Sua conta</span>
          </Link>
        </header>

        <div className={styles.content}>{children}</div>
      </div>

      {contextRail ? (
        <aside className={styles.contextRail}>
          {contextRail}
        </aside>
      ) : null}

      <MobileTabbar />
    </div>
  );
}
