import Link from 'next/link';

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Achegue-se, página inicial">
      <span className="brandMark" aria-hidden="true">♥</span>
      <span>
        <strong>Achegue-se</strong>
        <small>Sua cidade mais útil no dia a dia</small>
      </span>
    </Link>
  );
}
