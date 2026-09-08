import Link from 'next/link';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';
import { Brand } from '@/shared/ui/brand';

export default function NotFound() {
  return (
    <main className="statePage">
      <section className="stateCard">
        <div className="stateHeader">
          <Brand />
          <span className="stateBadge">404</span>
        </div>

        <div className="stateBody">
          <span className="stateIcon" aria-hidden="true">
            <NavigationIcon name="map" />
          </span>
          <div className="stateCopy">
            <p className="eyebrow">Página não encontrada</p>
            <h1>Esse endereço não existe por aqui.</h1>
            <p>
              Continue por uma das áreas que já estão
              disponíveis no Achegue-se.
            </p>
          </div>
        </div>

        <nav className="stateQuickLinks" aria-label="Continuar navegando">
          <Link href="/">
            <span className="stateQuickIcon">
              <NavigationIcon name="home" />
            </span>
            <span>
              <strong>Território</strong>
              <small>Voltar para a visão geral</small>
            </span>
            <b aria-hidden="true">→</b>
          </Link>
          <Link href="/mapa">
            <span className="stateQuickIcon">
              <NavigationIcon name="map" />
            </span>
            <span>
              <strong>Mapa</strong>
              <small>Explorar bairros e serviços</small>
            </span>
            <b aria-hidden="true">→</b>
          </Link>
          <Link href="/classificados">
            <span className="stateQuickIcon">
              <NavigationIcon name="tag" />
            </span>
            <span>
              <strong>Classificados</strong>
              <small>Ver anúncios locais</small>
            </span>
            <b aria-hidden="true">→</b>
          </Link>
        </nav>
      </section>
    </main>
  );
}
