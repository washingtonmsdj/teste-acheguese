import Link from 'next/link';
import type {
  TerritoryRolloutStage,
} from '@/core/territory';
import type {
  TerritoryHomeData,
  TerritoryHomeMetric,
} from '@/features/territory-home/types';
import { TerritoryMiniMap } from '@/integrations/map';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';
import { SiteHeader } from '@/shared/layout/site-header';
import { Brand } from '@/shared/ui/brand';
import styles from './territory-home.module.css';

const numberFormatter = new Intl.NumberFormat('pt-BR');

function formatMetric(
  metric: TerritoryHomeMetric,
): string {
  return metric.value === null
    ? 'Não disponível'
    : numberFormatter.format(metric.value);
}

function rolloutLabel(stage: TerritoryRolloutStage) {
  switch (stage) {
    case 'data_preparation':
      return 'Base territorial em preparação';
    case 'internal_preview':
      return 'Prévia interna';
    case 'public_preview':
      return 'Prévia pública';
    case 'launched':
      return 'Território ativo';
    case 'paused':
      return 'Território pausado';
  }
}

function scopeHeadline(data: TerritoryHomeData) {
  if (data.scope.kind === 'territory') {
    return (
      <>
        <em>{data.scope.name}</em>, com informação pública
        que você consegue conferir.
      </>
    );
  }

  return (
    <>
      O território primeiro. <em>O resto vem depois.</em>
    </>
  );
}

function ScopeSelector({
  data,
}: {
  data: TerritoryHomeData;
}) {
  return (
    <nav
      className={styles.scopeSelector}
      aria-label="Escolher território"
    >
      <Link
        href="/"
        aria-current={
          data.scope.kind === 'group'
            ? 'page'
            : undefined
        }
        className={
          data.scope.kind === 'group'
            ? styles.scopeActive
            : undefined
        }
      >
        Complexo
      </Link>
      {data.neighborhoods.map((neighborhood) => (
        <Link
          href={`/?bairro=${neighborhood.slug}`}
          key={neighborhood.id}
          aria-current={
            neighborhood.selected
              ? 'page'
              : undefined
          }
          className={
            neighborhood.selected
              ? styles.scopeActive
              : undefined
          }
        >
          {neighborhood.name}
        </Link>
      ))}
    </nav>
  );
}

export function TerritoryHome({
  data,
}: {
  data: TerritoryHomeData;
}) {
  const referencePeriod =
    data.scope.population.referencePeriod ??
    data.scope.households.referencePeriod;

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.contextLine}>
              <span className={styles.liveDot} aria-hidden="true" />
              <strong>Salvador · BA</strong>
              <span>Complexo do Nordeste de Amaralina</span>
            </div>

            <div className={styles.stageBadge}>
              {rolloutLabel(data.scope.rolloutStage)}
            </div>

            <p className="eyebrow">Achegue-se território vivo</p>
            <h1>{scopeHeadline(data)}</h1>
            <p className={styles.heroText}>
              Dados oficiais, mapa e serviços públicos
              organizados por território. Sem empresas,
              avaliações, alertas ou comunidade inventados
              para preencher a tela.
            </p>

            <div className={styles.heroActions}>
              <Link
                className="primaryButton linkButton"
                href="/mapa"
              >
                Explorar mapa
              </Link>
              <a
                className="ghostButton linkButton"
                href="#dados"
              >
                Ver dados públicos
              </a>
            </div>

            <ScopeSelector data={data} />
          </div>

          <aside className={styles.mapCard}>
            <div className={styles.mapCardHeader}>
              <div>
                <span>Mapa territorial</span>
                <strong>{data.scope.name}</strong>
              </div>
              <Link href="/mapa">Abrir ↗</Link>
            </div>

            <TerritoryMiniMap
              data={data.mapData}
              className={styles.miniMap}
              ariaLabel={`Prévia do mapa de ${data.scope.name}`}
            />

            <div className={styles.mapLegend}>
              <span>
                <i className={styles.educationMarker} />
                Educação
              </span>
              <span>
                <i className={styles.healthMarker} />
                Saúde SUS
              </span>
              <small>
                {data.scope.publicPlaceCount} locais
                verificados
              </small>
            </div>
          </aside>
        </div>
      </section>

      <section
        className={styles.metricsSection}
        id="dados"
        aria-label="Dados públicos do território"
      >
        <div className="container">
          <div className={styles.metricsIntro}>
            <div>
              <p className="eyebrow">Dados públicos reais</p>
              <h2>Uma leitura rápida do território.</h2>
            </div>
            <p>
              {referencePeriod
                ? `Demografia de ${referencePeriod}. `
                : ''}
              Escolas e unidades SUS vêm dos catálogos
              oficiais já validados espacialmente.
            </p>
          </div>

          <div className={styles.metricGrid}>
            <article>
              <span>População</span>
              <strong>
                {formatMetric(data.scope.population)}
              </strong>
              <small>
                {data.scope.population.referencePeriod
                  ? `referência ${data.scope.population.referencePeriod}`
                  : 'sem referência publicada'}
              </small>
            </article>
            <article>
              <span>Domicílios</span>
              <strong>
                {formatMetric(data.scope.households)}
              </strong>
              <small>
                {data.scope.households.referencePeriod
                  ? `referência ${data.scope.households.referencePeriod}`
                  : 'sem referência publicada'}
              </small>
            </article>
            <article>
              <span>Educação</span>
              <strong>{data.scope.educationCount}</strong>
              <small>unidades oficiais verificadas</small>
            </article>
            <article>
              <span>Saúde SUS</span>
              <strong>{data.scope.healthCount}</strong>
              <small>unidades com atendimento SUS</small>
            </article>
          </div>
        </div>
      </section>

      <section
        className={`container ${styles.neighborhoodSection}`}
        id="bairros"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className="eyebrow">Quatro bairros · uma base</p>
            <h2>Entre no detalhe sem perder o contexto.</h2>
          </div>
          {data.scope.kind === 'territory' && (
            <Link href="/">Ver o Complexo inteiro →</Link>
          )}
        </div>

        <div className={styles.neighborhoodGrid}>
          {data.neighborhoods.map((neighborhood) => (
            <Link
              href={`/?bairro=${neighborhood.slug}`}
              className={
                neighborhood.selected
                  ? `${styles.neighborhoodCard} ${styles.neighborhoodSelected}`
                  : styles.neighborhoodCard
              }
              key={neighborhood.id}
            >
              <div>
                <span>Bairro</span>
                <strong>{neighborhood.name}</strong>
              </div>
              <dl>
                <div>
                  <dt>População</dt>
                  <dd>
                    {formatMetric(
                      neighborhood.population,
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Escolas</dt>
                  <dd>{neighborhood.educationCount}</dd>
                </div>
                <div>
                  <dt>Saúde SUS</dt>
                  <dd>{neighborhood.healthCount}</dd>
                </div>
              </dl>
              <span className={styles.cardAction}>
                Ver território →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.nowSection}>
        <div className={`container ${styles.nowGrid}`}>
          <article className={styles.nowPrimary}>
            <p className="eyebrow">Agora no território</p>
            <h2>A utilidade começa antes do feed.</h2>
            <p>
              A camada comunitária ainda não foi liberada
              neste território. Enquanto isso, o Achegue-se
              já organiza o que pode ser comprovado:
              limites, população, escolas e saúde SUS.
            </p>
            <div className={styles.nowChecks}>
              <span>✓ Mapa por viewport</span>
              <span>✓ Fontes rastreáveis</span>
              <span>✓ Zero conteúdo social fictício</span>
            </div>
          </article>

          <aside className={styles.statusPanel}>
            <span className={styles.statusEyebrow}>
              Estado da base
            </span>
            <strong>
              {rolloutLabel(data.scope.rolloutStage)}
            </strong>
            <p>
              Dados públicos podem ser consultados sem
              significar que o rollout do território já foi
              lançado.
            </p>
            <Link href="/mapa">
              Ver o que já está mapeado →
            </Link>
          </aside>
        </div>
      </section>

      <section className={`container ${styles.classifiedSection}`}>
        <div>
          <p className="eyebrow">Vertical já disponível</p>
          <h2>Classificados ficam dentro do território — não no centro dele.</h2>
          <p>
            O módulo continua acessível enquanto a nova base
            territorial passa a organizar a experiência do
            Achegue-se.
          </p>
        </div>
        <Link
          className="primaryButton linkButton"
          href="/classificados"
        >
          Explorar Classificados
        </Link>
      </section>

      <section className={styles.sourcesSection}>
        <div className="container">
          <div className={styles.sourcesHeader}>
            <div>
              <p className="eyebrow">Proveniência</p>
              <h2>De onde vieram estes dados?</h2>
            </div>
            <p>
              O Achegue-se não publica número oficial sem
              fonte rastreável.
            </p>
          </div>

          <div className={styles.sourceList}>
            {data.sources.map((source) => (
              <article
                key={`${source.providerName}:${source.datasetName}`}
              >
                <div>
                  <strong>{source.providerName}</strong>
                  <span>{source.datasetName}</span>
                </div>
                {source.sourceUrl ? (
                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consultar fonte ↗
                  </a>
                ) : (
                  <span>Fonte registrada</span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <Brand />
          <p>
            Tudo que importa no seu bairro, organizado pelo
            território.
          </p>
          <nav aria-label="Links do rodapé">
            <Link href="/mapa">Mapa</Link>
            <Link href="/classificados">Classificados</Link>
            <Link href="/entrar">Entrar</Link>
          </nav>
        </div>
      </footer>

      <MobileTabbar />
    </main>
  );
}

export function TerritoryHomeUnavailable() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <section className={styles.unavailable}>
        <div className="container">
          <p className="eyebrow">Base territorial</p>
          <h1>Os dados do território não estão disponíveis neste ambiente.</h1>
          <p>
            Nenhum número ou local de demonstração foi
            colocado no lugar dos dados reais.
          </p>
          <div className={styles.heroActions}>
            <Link
              className="ghostButton linkButton"
              href="/classificados"
            >
              Ir para Classificados
            </Link>
          </div>
        </div>
      </section>
      <MobileTabbar />
    </main>
  );
}
