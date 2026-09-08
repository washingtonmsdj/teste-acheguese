'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';
import { Brand } from '@/shared/ui/brand';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="statePage">
      <section className="stateCard">
        <div className="stateHeader">
          <Brand />
          <span className="stateBadge">Erro temporário</span>
        </div>

        <div className="stateBody">
          <span className="stateIcon" aria-hidden="true">
            <NavigationIcon name="alert" />
          </span>
          <div className="stateCopy">
            <p className="eyebrow">Não carregou como esperado</p>
            <h1>Tivemos um problema para abrir esta página.</h1>
            <p>
              Tente novamente. Se continuar acontecendo, volte
              ao território e acesse outra área do Achegue-se.
            </p>
          </div>
        </div>

        <div className="stateActions">
          <button
            className="primaryButton"
            type="button"
            onClick={reset}
          >
            Tentar novamente
          </button>
          <Link className="ghostButton linkButton" href="/">
            Voltar ao território
          </Link>
        </div>
      </section>
    </main>
  );
}
