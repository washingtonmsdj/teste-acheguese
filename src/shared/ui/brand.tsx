import Link from 'next/link';

export function Brand() {
  return (
    <Link
      className="brand"
      href="/"
      aria-label="Achegue-se, página inicial"
    >
      <span className="brandMark" aria-hidden="true">
        <span>♥</span>
      </span>
      <span>
        <strong>Achegue-se</strong>
        <small>Tudo que importa no seu bairro</small>
      </span>
    </Link>
  );
}
