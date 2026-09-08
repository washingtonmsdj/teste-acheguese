import { MobileTabbar } from '@/shared/layout/mobile-tabbar';
import { SiteHeader } from '@/shared/layout/site-header';

export default function ClassifiedsLoading() {
  return (
    <main
      className="classifiedLoadingPage"
      aria-busy="true"
      aria-label="Carregando Classificados"
    >
      <SiteHeader />

      <section className="classifiedLoadingHero" aria-hidden="true">
        <div className="container classifiedLoadingHeroGrid">
          <div className="classifiedLoadingCopy">
            <span className="classifiedLoadingEyebrow" />
            <span className="classifiedLoadingTitle" />
            <span className="classifiedLoadingText" />
            <span className="classifiedLoadingText classifiedLoadingTextShort" />
            <span className="classifiedLoadingSearch" />
          </div>
          <div className="classifiedLoadingPitch" />
        </div>
      </section>

      <section className="section container" aria-hidden="true">
        <div className="classifiedLoadingSectionTitle" />
        <div className="classifiedLoadingCategories">
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </section>

      <section className="section sectionSoft" aria-hidden="true">
        <div className="container">
          <div className="classifiedLoadingResultsHead">
            <span />
            <span />
          </div>
          <div className="classifiedLoadingCards">
            {Array.from({ length: 6 }, (_, index) => (
              <article key={index}>
                <span className="classifiedLoadingImage" />
                <span className="classifiedLoadingCardLine" />
                <span className="classifiedLoadingCardLine classifiedLoadingCardLineShort" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <MobileTabbar />
    </main>
  );
}
