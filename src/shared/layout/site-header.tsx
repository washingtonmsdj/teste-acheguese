import Link from 'next/link';
import { Brand } from '@/shared/ui/brand';

export function SiteHeader() {
  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Brand />

        <nav className="desktopNav" aria-label="Navegação principal">
          <Link href="/#explorar">Explorar</Link>
          <Link href="/#categorias">Categorias</Link>
          <Link href="/mapa">Mapa</Link>
          <Link href="/classificados">Classificados</Link>
          <Link href="/#empresas">Para empresas</Link>
        </nav>

        <div className="headerActions">
          <Link className="ghostButton linkButton" href="/entrar">Entrar</Link>
          <Link className="primaryButton linkButton" href="/#empresas">Cadastrar empresa</Link>
        </div>

        <Link className="menuButton" href="/menu" aria-label="Abrir menu">☰</Link>
      </div>
    </header>
  );
}
