import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';
import styles from './mapa.module.css';

export default function MapLoading() {
  return (
    <TerritoryAppShell
      activeId="map"
      territoryName="Complexo do Nordeste de Amaralina"
      immersive
    >
      <main
        className={styles.page}
        aria-busy="true"
        aria-label="Carregando o mapa do território"
      >
        <section className={`${styles.shell} ${styles.loadingShell}`}>
        <aside className={styles.controlsPane} aria-hidden="true">
          <div className={styles.loadingBack} />
          <div className={styles.loadingControlCopy}>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className={styles.loadingSummary}>
            <span />
            <span />
          </div>
          <div className={styles.loadingFilters}>
            <span />
            <span />
          </div>
        </aside>

        <div
          className={`${styles.mapStage} ${styles.loadingMapStage}`}
          aria-hidden="true"
        >
          <span className={styles.loadingHud} />
        </div>

        <aside className={styles.resultsPane} aria-hidden="true">
          <div className={styles.loadingResultsHeader}>
            <span />
            <span />
          </div>
          <div className={styles.loadingResultsList}>
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
        </aside>
        </section>
      </main>
    </TerritoryAppShell>
  );
}
