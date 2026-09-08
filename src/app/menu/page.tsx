import Link from 'next/link';
import { Brand } from '@/shared/ui/brand';

const territoryLinks = [
  ['Território', '/', 'Visão geral da área'],
  ['Mapa', '/mapa', 'Bairros, educação e saúde'],
  ['Dados públicos', '/#dados', 'População e serviços'],
  ['Bairros', '/#bairros', 'Explore cada bairro'],
] as const;

const serviceLinks = [
  ['Classificados', '/classificados', 'Comprar e vender'],
] as const;

const accountLinks = [
  ['Mensagens', '/mensagens', 'Suas conversas'],
  ['Favoritos', '/favoritos', 'Itens que você salvou'],
  ['Entrar', '/entrar', 'Acessar sua conta'],
] as const;

function MenuGroup({
  title,
  links,
}: {
  title: string;
  links: readonly (readonly [string, string, string])[];
}) {
  return (
    <section className="menuSection">
      <h2>{title}</h2>
      <nav aria-label={title}>
        {links.map(([label, href, description]) => (
          <Link href={href} key={href}>
            <span>
              <strong>{label}</strong>
              <small>{description}</small>
            </span>
            <b aria-hidden="true">→</b>
          </Link>
        ))}
      </nav>
    </section>
  );
}

export default function MenuPage() {
  return (
    <main className="menuPage">
      <div className="container menuPanel">
        <div className="menuTop">
          <Brand />
          <Link
            className="menuClose"
            href="/"
            aria-label="Fechar menu"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </Link>
        </div>

        <div className="menuIntro">
          <p className="eyebrow">Navegação</p>
          <h1>Onde você quer chegar?</h1>
          <p>
            Explore o território ou acesse suas áreas
            pessoais.
          </p>
        </div>

        <div className="menuGroups">
          <MenuGroup title="Território" links={territoryLinks} />
          <MenuGroup title="Serviços" links={serviceLinks} />
          <MenuGroup title="Sua conta" links={accountLinks} />
        </div>
      </div>
    </main>
  );
}
