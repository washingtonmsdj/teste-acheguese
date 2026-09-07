import Link from 'next/link';
import { Brand } from '@/shared/ui/brand';

const links = [
  ['Território', '/'],
  ['Dados públicos', '/#dados'],
  ['Mapa', '/mapa'],
  ['Bairros', '/#bairros'],
  ['Classificados', '/classificados'],
  ['Mensagens', '/mensagens'],
  ['Favoritos', '/favoritos'],
  ['Entrar', '/entrar'],
] as const;

export default function MenuPage() {
  return (
    <main className="menuPage">
      <div className="container menuPanel">
        <div className="menuTop">
          <Brand />
          <Link href="/" aria-label="Fechar menu">
            ×
          </Link>
        </div>
        <nav aria-label="Menu">
          {links.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
              <span>→</span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
