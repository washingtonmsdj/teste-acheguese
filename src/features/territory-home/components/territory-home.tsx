import Link from 'next/link';
import { formatMapUrlState } from '@/core/map';
import type { TerritoryRolloutStage } from '@/core/territory';
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
        <span>Escolha a área</span>
        <small>Complexo ou bairro</small>
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

            <p className="eyebrow">Seu território, organizado</p>
            <h1>{scopeHeadline(data)}</h1>
            <p className={styles.heroText}>
              Consulte mapa, população, escolas e unidades
              de saúde SUS com dados públicos verificados e
              organizados por bairro.
            </p>

            <div className={styles.heroActions}>
              <Link
                className="primaryButton linkButton"
                href={selectedMapHref}
              >
                Abrir mapa
              </Link>
              <a
                className="ghostButton linkButton"
                href="#dados"
              >
                Conhecer o território
              </a>
            </div>

            <div
              className={styles.heroHighlights}
              aria-label="Resumo do território"
            >
              <div>
                <strong>{data.scope.publicPlaceCount}</strong>
                <span>locais públicos</span>
              </div>
              <div>
                <strong>{data.scope.educationCount}</strong>
                <span>unidades de educação</span>
              </div>
              <div>
                <strong>{data.scope.healthCount}</strong>
                <span>unidades SUS</span>
              </div>
            </div>

            <ScopeSelector data={data} />
          </div>

          <aside className={styles.mapCard}>
            <div className={styles.mapCardHeader}>
              <div>
                <span>Mapa do território</span>
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
              <small>Dados verificados</small>
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
              <h2>Conheça a área pelos dados.</h2>
            </div>
            <p>
              {referencePeriod
                ? `Demografia de ${referencePeriod}. `
                : ''}
              Educação e saúde usam bases oficiais já
              verificadas espacialmente.
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
            <h2>Quatro bairros. Um mesmo território.</h2>
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
              <p className="eyebrow">Encontre o essencial</p>
              <h2>Vá direto ao que você precisa.</h2>
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
              <span className={styles.statusEyebrow}>Estado da base</span>
              <strong>{rolloutLabel(data.scope.rolloutStage)}</strong>
              <p>
                A informação pública já está organizada;
                novas camadas entram somente quando forem
                verificadas.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className={`container ${styles.classifiedSection}`}>
        <div>
          <p className="eyebrow">Também no Achegue-se</p>
          <h2>Classificados, sem misturar com a informação pública.</h2>
          <p>
            Comprar, vender e conversar continua em uma área
            própria, enquanto o território permanece como
            contexto principal da plataforma.
          </p>
        </div>
        <Link
          className="ghostButton linkButton"
          href="/classificados"
        >
          Ver Classificados
        </Link>
      </section>

      <section className={styles.sourcesSection}>
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
      <MobileTabbar />
    </main>
  );
}
