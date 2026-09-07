'use client';

import Link from 'next/link';
import { useEffect } from 'react';

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
      <div>
        <p className="eyebrow">Algo saiu do caminho</p>
        <h1>Não foi possível carregar esta página.</h1>
        <p>Tente novamente. Se o problema continuar, o erro poderá ser rastreado pela observabilidade.</p>
        <div className="stateActions">
          <button className="primaryButton" type="button" onClick={reset}>
            Tentar novamente
          </button>
          <Link className="ghostButton linkButton" href="/">Ir para a Home</Link>
        </div>
      </div>
    </main>
  );
}
