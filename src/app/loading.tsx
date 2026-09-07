export default function Loading() {
  return (
    <main className="loadingPage" aria-busy="true" aria-label="Carregando">
      <div className="loadingBrand" />
      <div className="loadingHero" />
      <div className="loadingGrid">
        <span /><span /><span /><span />
      </div>
    </main>
  );
}
