import Link from 'next/link';

export function Brand() {
  return (
    <Link
      className="brand"
      href="/"
      aria-label="Achegue-se, página inicial"
    >
      <span className="brandMark" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path
            className="brandPin"
            d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"
          />
          <path
            className="brandHeart"
            d="M12 14.4s-3.5-2.1-3.5-4.4c0-1.2.9-2.1 2.1-2.1.7 0 1.2.3 1.4.9.3-.6.8-.9 1.5-.9 1.2 0 2.1.9 2.1 2.1 0 2.3-3.6 4.4-3.6 4.4Z"
          />
        </svg>
      </span>
      <span>
        <strong>Achegue-se</strong>
        <small>Tudo que importa no seu bairro</small>
      </span>
    </Link>
  );
}
