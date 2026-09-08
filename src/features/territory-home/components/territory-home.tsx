import Link from 'next/link';
import { formatMapUrlState } from '@/core/map';
import type { TerritoryRolloutStage } from '@/core/territory';
import type {
  TerritoryHomeData,
  TerritoryHomeMetric,
} from '@/features/territory-home/types';
import { TerritoryMiniMap } from '@/integrations/map';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';
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
      return 'Dados em preparação';
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

function mapHref(
  data: TerritoryHomeData,
  categories: string[] = ['education', 'health'],
) {
  const state = formatMapUrlState({
    bounds: data.mapData.bounds,
    zoom: data.scope.kind === 'territory' ? 15 : 14,
    categories,
  });

  return `/mapa?${new URLSearchParams(state).toString()}`;
}

function scopeHeadline(data: TerritoryHomeData) {
  if (data.scope.kind === 'territory') {
    return (
      <>
        <em>{data.scope.name}</em>, perto de você.
      </>
    );
  }

  return (
    <>
      Tudo que importa no <em>Complexo</em>, em um só lugar.
    </>
  );
}

function ScopeSelector({
  data,
}: {
  data: TerritoryHomeData;
}) {
  return (
    <div className={styles.scopeBlock}>
      <div className={styles.scopeLabel}>
        <span>Mudar área</span>
        <small>Complexo + 4 bairros</small>
      </div>
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
    </div>
  );
}

function TerritoryContextRail({
  data,
  selectedMapHref,
  educationMapHref,
  healthMapHref,
}: {
  data: TerritoryHomeData;
  selectedMapHref: string;
  educationMapHref: string;
  healthMapHref: string;
}) {
  return (
    <div className={styles.contextRailStack}>
      <section className={styles.contextRailCard}>
        <span className={styles.contextRailEyebrow}>Neste território</span>
        <h2>{data.scope.name}</h2>
        <p>
          Informação pública organizada para o recorte que
          você está vendo agora.
        </p>
        <dl className={styles.contextRailMetrics}>
          <div>
            <dt>População</dt>
            <dd>{formatMetric(data.scope.population)}</dd>
          </div>
          <div>
            <dt>Locais públicos</dt>
            <dd>{data.scope.publicPlaceCount}</dd>
          </div>
          <div>
            <dt>Educação</dt>
            <dd>{data.scope.educationCount}</dd>
          </div>
          <div>
            <dt>Saúde SUS</dt>
            <dd>{data.scope.healthCount}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.contextRailCard}>
        <span className={styles.contextRailEyebrow}>Explorar agora</span>
        <nav className={styles.contextRailLinks} aria-label="Atalhos do território">
          <Link href={selectedMapHref}>
            <span>Mapa completo</span>
            <b aria-hidden="true">↗</b>
          </Link>
          <Link href={educationMapHref}>
            <span>Educação no mapa</span>
            <b aria-hidden="true">↗</b>
          </Link>
          <Link href={healthMapHref}>
            <span>Saúde SUS no mapa</span>
            <b aria-hidden="true">↗</b>
          </Link>
        </nav>
      </section>

      <section className={styles.contextRailCard}>
        <span className={styles.contextRailEyebrow}>Base pública</span>
        <strong className={styles.contextRailStatus}>
          {rolloutLabel(data.scope.rolloutStage)}
        </strong>
        <p>
          {data.sources.length} fonte{data.sources.length === 1 ? '' : 's'} com
          origem registrada sustentam esta visão.
        </p>
        <a className={styles.contextRailSourceLink} href="#fontes">
          Conferir fontes ↓
        </a>
      </section>
    </div>
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
  const selectedMapHref = mapHref(data);
  const educationMapHref = mapHref(data, ['education']);
  const healthMapHref = mapHref(data, ['health']);

  const territoryHref =
    data.scope.kind === 'territory'
      ? `/?bairro=${data.scope.slug}`
      : '/';

  return (
    <TerritoryAppShell
      activeId="territory"
      territoryName={data.scope.name}
      territoryHref={territoryHref}
      contextRail={
        <TerritoryContextRail
          data={data}
          selectedMapHref={selectedMapHref}
          educationMapHref={educationMapHref}
          healthMapHref={healthMapHref}
        />
      }
    >
      <main className={styles.page}>
        <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.contextLine}>
              <span className={styles.liveDot} aria-hidden="true" />
              <strong>Salvador · BA</strong>
              <span>Complexo do Nordeste de Amaralina</span>
            </div>

            <p className="eyebrow">Território Vivo</p>
            <h1>{scopeHeadline(data)}</h1>
            <p className={styles.heroText}>
              Mapa, escolas, saúde SUS e dados do bairro que
              você escolher, no mesmo recorte.
            </p>

            <div className={styles.heroActions}>
              <Link
                className="primaryButton linkButton"
                href={selectedMapHref}
              >
                Explorar mapa
              </Link>
              <a
                className="ghostButton linkButton"
                href="#bairros"
              >
                Escolher bairro
              </a>
            </div>

            <div
              className={styles.heroHighlights}
              aria-label="Resumo do território"
            >
              <div>
                <strong>{data.scope.publicPlaceCount}</strong>
                <span>locais</span>
              </div>
              <div>
                <strong>{data.scope.educationCount}</strong>
                <span>educação</span>
              </div>
              <div>
                <strong>{data.scope.healthCount}</strong>
                <span>saúde SUS</span>
              </div>
            </div>

            <ScopeSelector data={data} />
          </div>

          <aside className={styles.mapCard}>
            <div className={styles.mapCardHeader}>
              <div>
                <span>Mapa interativo</span>
                <strong>{data.scope.name}</strong>
              </div>
              <Link href={selectedMapHref}>Explorar ↗</Link>
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
              <small>{data.scope.publicPlaceCount} locais verificados</small>
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
              <p className="eyebrow">Território em números</p>
              <h2>O território, em números.</h2>
            </div>
            <p>
              {referencePeriod
                ? `Demografia de ${referencePeriod}. `
                : ''}
              Educação e saúde usam bases oficiais
              verificadas para este recorte.
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
                  ? `Censo ${data.scope.population.referencePeriod}`
                  : 'Referência não publicada'}
              </small>
            </article>
            <article>
              <span>Domicílios</span>
              <strong>
                {formatMetric(data.scope.households)}
              </strong>
              <small>
                {data.scope.households.referencePeriod
                  ? `Censo ${data.scope.households.referencePeriod}`
                  : 'Referência não publicada'}
              </small>
            </article>
            <article>
              <span>Educação</span>
              <strong>{data.scope.educationCount}</strong>
              <small>unidades oficiais</small>
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
            <p className="eyebrow">Explore por bairro</p>
            <h2>Escolha um bairro.</h2>
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
                    {formatMetric(neighborhood.population)}
                  </dd>
                </div>
                <div>
                  <dt>Educação</dt>
                  <dd>{neighborhood.educationCount}</dd>
                </div>
                <div>
                  <dt>Saúde SUS</dt>
                  <dd>{neighborhood.healthCount}</dd>
                </div>
              </dl>
              <span className={styles.cardAction}>
                Abrir bairro →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.utilitySection}>
        <div className="container">
          <div className={styles.utilityHeader}>
            <div>
              <p className="eyebrow">Acesso rápido</p>
              <h2>O que você precisa agora?</h2>
            </div>
            <p>
              O mapa abre já filtrado para a categoria
              escolhida e mantém o recorte do território.
            </p>
          </div>

          <div className={styles.utilityGrid}>
            <Link
              href={educationMapHref}
              className={`${styles.utilityCard} ${styles.utilityEducation}`}
            >
              <span className={styles.utilityCardMeta}>Educação</span>
              <strong>{data.scope.educationCount} unidades</strong>
              <p>Veja escolas e unidades educacionais no mapa.</p>
              <b aria-hidden="true">↗</b>
            </Link>

            <Link
              href={healthMapHref}
              className={`${styles.utilityCard} ${styles.utilityHealth}`}
            >
              <span className={styles.utilityCardMeta}>Saúde SUS</span>
              <strong>{data.scope.healthCount} unidades</strong>
              <p>Localize unidades com atendimento SUS.</p>
              <b aria-hidden="true">↗</b>
            </Link>

            <Link
              href={selectedMapHref}
              className={`${styles.utilityCard} ${styles.utilityMap}`}
            >
              <span className={styles.utilityCardMeta}>Mapa completo</span>
              <strong>{data.scope.publicPlaceCount} locais</strong>
              <p>Explore limites, pontos e bairros no mesmo mapa.</p>
              <b aria-hidden="true">↗</b>
            </Link>

            <aside className={styles.utilityStatus}>
              <span className={styles.statusEyebrow}>Base pública</span>
              <strong>Dados com origem registrada</strong>
              <p>
                {data.sources.length} fonte{data.sources.length === 1 ? '' : 's'}
                sustentam esta visão do território.
              </p>
              <a href="#fontes">Ver fontes ↓</a>
            </aside>
          </div>
        </div>
      </section>

      <section className={`container ${styles.classifiedSection}`}>
        <div>
          <p className="eyebrow">Classificados locais</p>
          <h2>Compre e venda perto de você.</h2>
          <p>
            Encontre anúncios da região, salve favoritos e
            converse com o anunciante dentro do Achegue-se.
          </p>
        </div>
        <Link
          className="ghostButton linkButton"
          href="/classificados"
        >
          Ver Classificados
        </Link>
      </section>

      <section className={styles.sourcesSection} id="fontes">
        <div className="container">
          <div className={styles.sourcesHeader}>
            <div>
              <p className="eyebrow">Fontes públicas</p>
              <h2>Dados que você pode conferir.</h2>
            </div>
            <p>
              Cada número e local oficial mantém sua origem
              registrada.
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
                    Consultar ↗
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
          <p>Tudo que importa no seu bairro, em um só lugar.</p>
          <nav aria-label="Links do rodapé">
            <Link href={selectedMapHref}>Mapa</Link>
            <Link href="/classificados">Classificados</Link>
            <Link href="/entrar">Entrar</Link>
          </nav>
        </div>
      </footer>

      </main>
    </TerritoryAppShell>
  );
}

export function TerritoryHomeUnavailable() {
  return (
    <TerritoryAppShell
      activeId="territory"
      territoryName="Complexo do Nordeste de Amaralina"
    >
      <main className={styles.page}>
        <section className={styles.unavailable}>
        <div className="container">
          <p className="eyebrow">Território</p>
          <h1>Não foi possível carregar os dados públicos desta área agora.</h1>
          <p>
            A página não substitui informação oficial por
            conteúdo de demonstração.
          </p>
          <div className={styles.heroActions}>
            <Link
              className="ghostButton linkButton"
              href="/classificados"
            >
              Ver Classificados
            </Link>
          </div>
        </div>
        </section>
      </main>
    </TerritoryAppShell>
  );
}
