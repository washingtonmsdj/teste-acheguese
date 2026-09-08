import Link from 'next/link';
import {
  activeTerritoryNavigation,
} from '@/shared/navigation/territory-navigation';
import { Brand } from '@/shared/ui/brand';

export function SiteHeader() {
  const navigation = activeTerritoryNavigation();

  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Brand />

        <nav className="desktopNav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <Link href={item.href} key={item.id}>
              {item.label}
            </Link>
          ))}
          <Link href="/#dados">Dados públicos</Link>
          <Link href="/#bairros">Bairros</Link>
        </nav>

        <div className="headerActions">
          <Link className="ghostButton linkButton" href="/entrar">
            Entrar
          </Link>
          <Link className="primaryButton linkButton" href="/mapa">
            Abrir mapa
          </Link>
        </div>

        <Link className="menuButton" href="/menu" aria-label="Abrir menu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
