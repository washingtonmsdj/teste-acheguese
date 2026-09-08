import { territoryReleaseScope } from '@/config/territory-release-scope';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';

export default function AdminClassifiedsLoading() {
  return (
    <TerritoryAppShell
      activeId="classifieds"
      territoryName={territoryReleaseScope.city.name}
      contextRail={
        <div className="adminLoadingRail" aria-hidden="true">
          <span className="adminLoadingRailCard adminLoadingRailPrimary" />
          <span className="adminLoadingRailCard adminLoadingRailLinks" />
          <span className="adminLoadingRailCard adminLoadingRailPolicy" />
        </div>
      }
    >
      <main
        className="adminLoadingPage"
        aria-busy="true"
        aria-label="Carregando moderação"
      >
        <section className="adminHero" aria-hidden="true">
          <div className="container">
            <span className="adminLoadingEyebrow" />
            <span className="adminLoadingTitle" />
            <span className="adminLoadingText" />
          </div>
        </section>

        <section className="section container" aria-hidden="true">
          <span className="adminLoadingSectionTitle" />
          <div className="adminLoadingQueue">
            {Array.from({ length: 4 }, (_, index) => (
              <article key={index}>
                <span className="adminLoadingPill" />
                <span className="adminLoadingLine" />
                <span className="adminLoadingLine adminLoadingLineShort" />
                <span className="adminLoadingActions" />
              </article>
            ))}
          </div>
        </section>

        <section className="section sectionSoft" aria-hidden="true">
          <div className="container">
            <span className="adminLoadingSectionTitle" />
            <div className="adminLoadingQueue">
              {Array.from({ length: 3 }, (_, index) => (
                <article key={index}>
                  <span className="adminLoadingPill" />
                  <span className="adminLoadingLine" />
                  <span className="adminLoadingLine adminLoadingLineShort" />
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </TerritoryAppShell>
  );
}
