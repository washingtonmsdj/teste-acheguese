import Link from 'next/link';
import { Brand } from '@/shared/ui/brand';

export function SiteHeader() {
  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Brand />

        <nav className="desktopNav" aria-label="Navegação principal">
          <Link href="/">Território</Link>
          <Link href="/#dados">Dados</Link>
          <Link href="/mapa">Mapa</Link>
          <Link href="/#bairros">Bairros</Link>
          <Link href="/classificados">Classificados</Link>
        </nav>

        <div className="headerActions">
          <Link className="ghostButton linkButton" href="/entrar">
            Entrar
          </Link>
          <Link className="primaryButton linkButton" href="/mapa">
            Explorar mapa
          </Link>
        </div>

        <Link className="menuButton" href="/menu" aria-label="Abrir menu">
          ☰
        </Link>
      </div>
    </header>
  );
}
