import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';

export default function Loading() {
  return (
    <TerritoryAppShell
      activeId="territory"
      territoryName="Complexo do Nordeste de Amaralina"
    >
      <main
        className="loadingPage"
        aria-busy="true"
        aria-label="Carregando o território"
      >
        <div className="loadingHeroLayout" aria-hidden="true">
          <div className="loadingCopy">
            <span className="loadingEyebrow" />
            <span className="loadingTitle" />
            <span className="loadingTitle loadingTitleShort" />
            <span className="loadingText" />
            <span className="loadingText loadingTextShort" />
            <div className="loadingActions">
              <span />
              <span />
            </div>
          </div>
          <div className="loadingMap" />
        </div>

        <div className="loadingMetrics" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </main>
    </TerritoryAppShell>
  );
}
