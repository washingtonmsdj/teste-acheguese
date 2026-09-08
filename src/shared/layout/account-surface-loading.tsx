import { AccountContextRail } from '@/shared/layout/account-context-rail';
import { territoryReleaseScope } from '@/config/territory-release-scope';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';
import styles from './account-surface-loading.module.css';

type AccountSurfaceLoadingProps = {
  active: 'classifieds' | 'new' | 'favorites' | 'messages';
  label: string;
  variant: 'list' | 'form' | 'thread';
};

export function AccountSurfaceLoading({
  active,
  label,
  variant,
}: AccountSurfaceLoadingProps) {
  const rowCount = variant === 'thread' ? 5 : 4;

  return (
    <TerritoryAppShell
      activeId="classifieds"
      territoryName={territoryReleaseScope.city.name}
      contextRail={<AccountContextRail active={active} />}
    >
      <main
        className={styles.page}
        aria-busy="true"
        aria-label={label}
      >
        <section className={styles.hero} aria-hidden="true">
          <div className="container">
            <span className={styles.eyebrow} />
            <span className={styles.title} />
            <span className={styles.copy} />
            <span className={styles.copyShort} />
          </div>
        </section>

        <section className={styles.body} aria-hidden="true">
          <div
            className={[
              'container',
              styles.layout,
              variant === 'form' ? styles.formLayout : '',
              variant === 'thread' ? styles.threadLayout : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {variant === 'form' ? (
              <>
                <div className={styles.formIntro}>
                  <span className={styles.blockTitle} />
                  <span className={styles.line} />
                  <span className={styles.lineShort} />
                </div>
                <div className={styles.formCard}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <span className={styles.field} key={index} />
                  ))}
                  <span className={styles.action} />
                </div>
              </>
            ) : (
              <div className={styles.list}>
                {Array.from({ length: rowCount }, (_, index) => (
                  <article
                    className={[
                      styles.row,
                      variant === 'thread'
                        ? index % 2
                          ? styles.rowMine
                          : styles.rowTheirs
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    key={index}
                  >
                    <span className={styles.rowPill} />
                    <span className={styles.rowTitle} />
                    <span className={styles.rowCopy} />
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </TerritoryAppShell>
  );
}
