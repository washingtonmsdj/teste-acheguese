import { Brand } from '@/shared/ui/brand';
import styles from './loading.module.css';

export default function MenuLoading() {
  return (
    <main className={styles.page} aria-busy="true" aria-label="Carregando menu">
      <div className="container menuPanel">
        <div className="menuTop" aria-hidden="true">
          <Brand />
          <span className={styles.close} />
        </div>

        <div className={styles.intro} aria-hidden="true">
          <span className={styles.context} />
          <span className={styles.eyebrow} />
          <span className={styles.title} />
          <span className={styles.copy} />
        </div>

        <div className={styles.groups} aria-hidden="true">
          {Array.from({ length: 3 }, (_, groupIndex) => (
            <section className={styles.group} key={groupIndex}>
              <span className={styles.groupTitle} />
              {Array.from({ length: groupIndex === 0 ? 4 : 3 }, (_, rowIndex) => (
                <span className={styles.row} key={rowIndex} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
