import Link from 'next/link';
import {
  activeTerritoryNavigationBySection,
  type TerritoryNavigationItem,
} from '@/shared/navigation/territory-navigation';
import { Brand } from '@/shared/ui/brand';

type MenuLink = Pick<
  TerritoryNavigationItem,
  'id' | 'label' | 'href' | 'description'
>;

const territoryExtras: readonly MenuLink[] = [
  {
    id: 'territory-data' as TerritoryNavigationItem['id'],
    label: 'Dados públicos',
    href: '/#dados',
    description: 'População e serviços',
  },
  {
    id: 'territory-neighborhoods' as TerritoryNavigationItem['id'],
    label: 'Bairros',
    href: '/#bairros',
    description: 'Explore cada bairro',
  },
];

const accountLinks = [
  {
    id: 'messages',
    label: 'Mensagens',
    href: '/mensagens',
    description: 'Suas conversas',
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    href: '/favoritos',
    description: 'Itens que você salvou',
  },
  {
    id: 'signin',
    label: 'Entrar',
    href: '/entrar',
    description: 'Acessar sua conta',
  },
] as const;

function MenuGroup({
  title,
  links,
}: {
  title: string;
  links: readonly {
    id: string;
    label: string;
    href: string;
    description: string;
  }[];
}) {
  if (!links.length) return null;

  return (
    <section className="menuSection">
      <h2>{title}</h2>
      <nav aria-label={title}>
        {links.map((item) => (
          <Link href={item.href} key={item.id}>
            <span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
            <b aria-hidden="true">→</b>
          </Link>
        ))}
      </nav>
    </section>
  );
}

export default function MenuPage() {
  const territoryLinks = [
    ...activeTerritoryNavigationBySection('territory'),
    ...territoryExtras,
  ];
  const localLifeLinks =
    activeTerritoryNavigationBySection('local-life');
  const serviceLinks =
    activeTerritoryNavigationBySection('services');

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
          <MenuGroup title="Agora no bairro" links={localLifeLinks} />
          <MenuGroup title="Serviços" links={serviceLinks} />
          <MenuGroup title="Sua conta" links={accountLinks} />
        </div>
      </div>
    </main>
  );
}
