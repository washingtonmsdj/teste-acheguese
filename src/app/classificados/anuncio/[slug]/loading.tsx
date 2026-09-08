import { territoryReleaseScope } from '@/config/territory-release-scope';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';

export default function ClassifiedDetailLoading() {
  return (
    <TerritoryAppShell
      activeId="classifieds"
      territoryName={territoryReleaseScope.city.name}
    >
      <main
        className="publicDetailPage detailLoadingPage"
        aria-busy="true"
        aria-label="Carregando anúncio"
      >
        <div className="container publicDetailTopline" aria-hidden="true">
          <span className="detailLoadingBack" />
          <span className="detailLoadingLocation" />
        </div>

        <div className="container publicDetailLayout" aria-hidden="true">
          <div className="publicDetailMain">
            <div className="publicDetailGallery detailLoadingGallery">
              <span className="detailLoadingImage detailLoadingImageMain" />
              <span className="detailLoadingImage" />
              <span className="detailLoadingImage" />
            </div>

            <div className="detailLoadingCopy">
              <span className="detailLoadingEyebrow" />
              <span className="detailLoadingTitle" />
              <span className="detailLoadingPrice" />
              <span className="detailLoadingLine" />
              <span className="detailLoadingLine detailLoadingLineShort" />
            </div>
          </div>

          <aside className="publicDetailSidebar">
            <span className="detailLoadingActionCard" />
            <span className="detailLoadingSafetyCard" />
          </aside>
        </div>
      </main>
    </TerritoryAppShell>
  );
}
