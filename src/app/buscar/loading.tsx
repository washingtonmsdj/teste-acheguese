import { territoryReleaseScope } from '@/config/territory-release-scope';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';
import styles from './loading.module.css';

export default function SearchLoading() {
  return (
    <TerritoryAppShell
      activeId="territory"
      territoryName={territoryReleaseScope.group.name}
    >
      <main className={styles.page} aria-busy="true" aria-label="Carregando busca">
        <section className={styles.hero} aria-hidden="true">
          <div className="container">
            <span className={styles.pill} />
            <span className={styles.eyebrow} />
            <span className={styles.title} />
            <span className={styles.titleShort} />
            <span className={styles.copy} />
            <span className={styles.territoryCard} />
          </div>
        </section>
        <section className={styles.choices} aria-hidden="true">
          <span className={styles.choiceCard} />
          <span className={styles.choiceCard} />
        </section>
        <div className={styles.guidance} aria-hidden="true" />
      </main>
    </TerritoryAppShell>
  );
}
