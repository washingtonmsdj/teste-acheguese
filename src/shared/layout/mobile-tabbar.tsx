import Link from 'next/link';

const items = [
  { href: '/', icon: '⌂', label: 'Início' },
  { href: '/classificados', icon: '⌕', label: 'Classificados' },
  { href: '/favoritos', icon: '♡', label: 'Favoritos' },
  { href: '/menu', icon: '☰', label: 'Menu' },
] as const;

export function MobileTabbar() {
  return (
    <nav className="mobileTabbar" aria-label="Navegação mobile">
      {items.map((item) => (
        <Link href={item.href} key={item.href}>
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
