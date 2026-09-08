import { AccountContextRail } from '@/shared/layout/account-context-rail';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';
import styles from './account-area-loading.module.css';

type AccountAreaLoadingProps = {
  active: 'classifieds' | 'new' | 'favorites' | 'messages';
  variant?: 'list' | 'form';
  label: string;
};

export function AccountAreaLoading({
  active,
  variant = 'list',
  label,
}: AccountAreaLoadingProps) {
  return (
    <TerritoryAppShell
      activeId="classifieds"
      territoryName="Salvador"
      contextRail={<AccountContextRail active={active} />}
    >
      <main
        className={styles.page}
        aria-busy="true"
        aria-label={label}
      >
        <section className={styles.hero} aria-hidden="true">
          <span className={styles.eyebrow} />
          <span className={styles.title} />
          <span className={styles.text} />
          <span className={styles.textShort} />
        </section>

        {variant === 'form' ? (
          <section className={styles.formLayout} aria-hidden="true">
            <div className={styles.formIntro}>
              <span className={styles.introTitle} />
              <span className={styles.introText} />
              <span className={styles.introTextShort} />
            </div>
            <div className={styles.formCard}>
              {Array.from({ length: 5 }, (_, index) => (
                <span className={styles.field} key={index} />
              ))}
              <span className={styles.submit} />
            </div>
          </section>
        ) : (
          <section className={styles.list} aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <article key={index}>
                <span className={styles.thumb} />
                <div>
                  <span className={styles.cardTitle} />
                  <span className={styles.cardMeta} />
                  <span className={styles.cardMetaShort} />
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </TerritoryAppShell>
  );
}
