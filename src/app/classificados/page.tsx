import type { Metadata } from 'next';
import Link from 'next/link';
import { classifiedCategories } from '@/features/classifieds/domain/categories';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const metadata: Metadata = {
  title: 'Classificados',
  description: 'Classificados locais do Achegue-se: encontre e anuncie perto de você.',
};

export default function ClassifiedsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="classifiedHero">
        <div className="container classifiedHeroGrid">
          <div>
            <p className="eyebrow">Classificados Achegue-se</p>
            <h1>Compre e venda <em>perto de você.</em></h1>
            <p>
              Um marketplace local pensado para descoberta por região, publicação rápida,
              segurança e moderação.
            </p>
            <form className="classifiedSearch" action="/classificados">
              <label className="srOnly" htmlFor="classified-search">Buscar classificados</label>
              <input id="classified-search" name="q" placeholder="O que você está procurando?" />
              <button className="searchButton" type="submit">Buscar</button>
            </form>
          </div>
          <aside className="classifiedPitch">
            <span>Venda algo hoje</span>
            <strong>Publique em poucos passos.</strong>
            <p>Fotos, categoria, preço e região — sem complicação.</p>
            <Link className="primaryButton linkButton" href="/classificados/novo">Criar anúncio</Link>
          </aside>
        </div>
      </section>

      <section className="section container">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Explorar</p>
            <h2>Categorias de Classificados</h2>
            <p>Estrutura inicial do primeiro vertical completo do MVP.</p>
          </div>
        </div>
        <div className="classifiedCategoryGrid">
          {classifiedCategories.map((category) => (
            <Link href={`/classificados?categoria=${category.id}`} key={category.id}>
              <span aria-hidden="true">{category.icon}</span>
              <strong>{category.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container releasePanel">
          <div>
            <p className="eyebrow">Construção por vertical</p>
            <h2>O que entra antes do lançamento</h2>
            <p>
              Listagem, detalhe, publicação, fotos, conta, favoritos, contato, localização,
              denúncia, moderação, SEO, observabilidade e testes E2E.
            </p>
          </div>
          <Link href="/" className="ghostButton linkButton">Voltar à Home</Link>
        </div>
      </section>
      <MobileTabbar />
    </main>
  );
}
