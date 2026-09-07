import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="statePage">
      <div>
        <p className="eyebrow">404</p>
        <h1>Essa página ainda não chegou por aqui.</h1>
        <p>Volte para a Home ou explore o primeiro vertical do Achegue-se.</p>
        <div className="stateActions">
          <Link className="primaryButton linkButton" href="/">Ir para a Home</Link>
          <Link className="ghostButton linkButton" href="/classificados">Classificados</Link>
        </div>
      </div>
    </main>
  );
}
