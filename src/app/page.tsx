import Link from 'next/link';
import { CategoryGrid } from '@/features/discovery/components/category-grid';
import { Highlights } from '@/features/discovery/components/highlights';
import { HomeHero } from '@/features/discovery/components/home-hero';
import { categories, pillars } from '@/features/discovery/home-data';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';
import { SiteHeader } from '@/shared/layout/site-header';
import { Brand } from '@/shared/ui/brand';

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HomeHero />

      <section className="statsSection" aria-label="Princípios da plataforma">
        <div className="container statsGrid">
          {pillars.map(([value, label]) => (
            <div className="stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
          <div className="mission">
            <span aria-hidden="true">🌱</span>
            <div>
              <strong>Juntos por cidades mais fortes.</strong>
              <small>Conectando pessoas e negócios.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section container" id="categorias">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Perto de você</p>
            <h2>Explore por categoria</h2>
            <p>Encontre exatamente o que precisa sem perder tempo.</p>
          </div>
          <Link href="/buscar">Ver todas →</Link>
        </div>
        <CategoryGrid />
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">Descoberta local</p>
              <h2>Comece pela sua região</h2>
              <p>Uma prévia da experiência; os resultados reais virão da base local.</p>
            </div>
            <Link href="/buscar">Explorar →</Link>
          </div>
          <Highlights />
        </div>
      </section>

      <section className="section container verticalCta">
        <div>
          <p className="eyebrow">Primeiro vertical do MVP</p>
          <h2>Classificados locais, simples e seguros.</h2>
          <p>
            Compra e venda com contexto de região, favoritos, fotos, contato e moderação.
            Estamos construindo este fluxo completo antes de abrir o próximo vertical.
          </p>
        </div>
        <Link className="primaryButton linkButton" href="/classificados">Explorar Classificados</Link>
      </section>

      <section className="section container productGrid" id="como-funciona">
        <article className="featurePanel peoplePanel">
          <p className="eyebrow">Para você</p>
          <h2>Encontre, descubra, apoie.</h2>
          <p>
            Busca local, favoritos, mapa, avaliações e novidades em uma experiência simples,
            rápida e confiável.
          </p>
          <div className="featureList">
            <span>✓ Descoberta por região</span>
            <span>✓ Experiência mobile-first</span>
            <span>✓ Privacidade e moderação desde a base</span>
          </div>
        </article>

        <article className="featurePanel businessPanel" id="empresas">
          <p className="eyebrow">Para empresas</p>
          <h2>Mais visibilidade para o negócio local.</h2>
          <p>
            Perfis comerciais serão a próxima vertical depois que Classificados estiver
            fechado para MVP.
          </p>
          <Link className="primaryButton linkButton" href="/empresas">Conhecer a proposta</Link>
        </article>
      </section>

      <section className="appSection">
        <div className="container appGrid">
          <div>
            <p className="eyebrow">Mobile-first de verdade</p>
            <h2>O Achegue-se no seu bolso.</h2>
            <p>
              A experiência nasce para a rotina no celular e escala naturalmente para
              tablet e desktop, sem duplicar produto.
            </p>
            <div className="storeButtons" aria-label="Aplicativos planejados">
              <span>Web app responsivo</span>
              <span>PWA preparada</span>
            </div>
          </div>

          <div className="phoneMock" aria-label="Prévia mobile do Achegue-se">
            <div className="phoneTop">Achegue-se <span>📍 Sua região</span></div>
            <div className="phoneSearch">🔎 O que você procura?</div>
            <div className="phoneCategories">
              {categories.slice(0, 4).map((item) => (
                <span key={item.label}>{item.icon}<small>{item.label}</small></span>
              ))}
            </div>
            <strong>Destaques perto de você</strong>
            <div className="phoneCard">
              📍
              <div><b>Descoberta local</b><small>Resultados da sua região</small></div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footerInner">
          <Brand />
          <p>Pessoas. Negócios. Comunidades mais fortes.</p>
          <div>
            <Link href="/termos">Termos</Link>
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/contato">Contato</Link>
          </div>
        </div>
      </footer>

      <MobileTabbar />
    </main>
  );
}
