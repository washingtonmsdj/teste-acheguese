import Link from 'next/link';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';
import { SignOutControl } from '@/shared/layout/sign-out-control';
import styles from './account-context-rail.module.css';

type AccountContextRailProps = {
  active: 'classifieds' | 'new' | 'favorites' | 'messages';
};

const accountLinks = [
  {
    id: 'classifieds',
    label: 'Meus anúncios',
    description: 'Rascunhos e publicações',
    href: '/classificados/meus',
    icon: 'tag' as const,
  },
  {
    id: 'new',
    label: 'Novo anúncio',
    description: 'Começar por um rascunho',
    href: '/classificados/novo',
    icon: 'tag' as const,
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    description: 'Anúncios que você salvou',
    href: '/favoritos',
    icon: 'favorite' as const,
  },
  {
    id: 'messages',
    label: 'Mensagens',
    description: 'Conversas privadas',
    href: '/mensagens',
    icon: 'messages' as const,
  },
] as const;

export function AccountContextRail({
  active,
}: AccountContextRailProps) {
  return (
    <div className={styles.stack}>
      <section className={styles.summary}>
        <span className={styles.eyebrow}>Sua área</span>
        <h2>Conta Achegue-se</h2>
        <p>
          Ações pessoais ficam separadas dos dados públicos
          do território.
        </p>
      </section>

      <nav className={styles.links} aria-label="Navegação da sua conta">
        {accountLinks.map((item) => {
          const selected = item.id === active;

          return (
            <Link
              href={item.href}
              key={item.id}
              className={selected ? styles.active : undefined}
              aria-current={selected ? 'page' : undefined}
            >
              <span className={styles.icon}>
                <NavigationIcon name={item.icon} />
              </span>
              <span className={styles.copy}>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              <b aria-hidden="true">→</b>
            </Link>
          );
        })}
      </nav>

      <section className={styles.privacy}>
        <span className={styles.eyebrow}>Privacidade</span>
        <strong>Seu endereço exato não vira público.</strong>
        <p>
          Favoritos, mensagens e gerenciamento de anúncios
          pertencem à sua conta e exigem autenticação.
        </p>
      </section>

      <SignOutControl />
    </div>
  );
}
