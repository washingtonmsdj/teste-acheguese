import Link from 'next/link';
import { Brand } from '@/shared/ui/brand';

export default function NotFound() {
  return (
    <main className="statePage">
      <div className="stateCard">
        <Brand />
        <div className="stateCopy">
          <p className="eyebrow">Página não encontrada · 404</p>
          <h1>Esse endereço não existe por aqui.</h1>
          <p>
            Volte ao território, abra o mapa ou acesse
            Classificados.
          </p>
        </div>
        <div className="stateActions">
          <Link className="primaryButton linkButton" href="/">
            Voltar ao território
          </Link>
          <Link className="ghostButton linkButton" href="/mapa">
            Abrir mapa
          </Link>
          <Link
            className="ghostButton linkButton"
            href="/classificados"
          >
            Classificados
          </Link>
        </div>
      </div>
    </main>
  );
}
