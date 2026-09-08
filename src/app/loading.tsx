export default function Loading() {
  return (
    <main
      className="loadingPage"
      aria-busy="true"
      aria-label="Carregando o território"
    >
      <div className="loadingHeader">
        <div className="loadingBrand" />
        <div className="loadingNav" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>

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
  );
}
