import { Brand } from '@/shared/ui/brand';

export default function AuthLoading() {
  return (
    <main
      className="authPage authLoadingPage"
      aria-busy="true"
      aria-label="Carregando acesso"
    >
      <div className="authShell" aria-hidden="true">
        <aside className="authStory authLoadingStory">
          <div className="authStoryTop">
            <Brand />
            <span className="authLoadingBack" />
          </div>

          <div className="authLoadingStoryCopy">
            <span className="authLoadingEyebrow" />
            <span className="authLoadingHeadline" />
            <span className="authLoadingHeadline authLoadingHeadlineShort" />
            <span className="authLoadingLine" />
            <span className="authLoadingLine authLoadingLineShort" />
          </div>

          <div className="authLoadingBenefits">
            {Array.from({ length: 3 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
        </aside>

        <section className="authPanel authLoadingPanel">
          <span className="authLoadingEyebrow" />
          <span className="authLoadingPanelTitle" />
          <span className="authLoadingLine" />
          <div className="authLoadingForms">
            <span />
            <span />
          </div>
        </section>
      </div>
    </main>
  );
}
