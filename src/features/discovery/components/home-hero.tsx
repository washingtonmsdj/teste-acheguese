import Image from 'next/image';
import Link from 'next/link';
import { categories } from '@/features/discovery/home-data';
import { HomeSearch } from './home-search';

export function HomeHero() {
  return (
    <section className="hero" id="explorar">
      <div className="container heroGrid">
        <div className="heroCopy">
          <p className="eyebrow">Comércio local · pessoas reais · regiões mais fortes</p>
          <h1>
            Encontre o melhor da sua região, <em>em um só lugar.</em>
          </h1>
          <p className="heroText">
            Descubra negócios, serviços, profissionais, oportunidades e classificados
            perto de você. Apoie quem faz sua cidade acontecer.
          </p>

          <HomeSearch />

          <div className="quickCategories" aria-label="Categorias populares">
            {categories.slice(0, 6).map((category) => (
              <Link href={category.href} key={category.label}>
                <span aria-hidden="true">{category.icon}</span>{category.label}
              </Link>
            ))}
          </div>
        </div>

        <aside className="heroVisual" aria-label="Comércio local em destaque">
          <Image
            className="heroPhoto"
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85"
            alt="Empreendedora em um comércio local"
            fill
            priority
            sizes="(min-width: 980px) 48vw, 100vw"
          />
          <div className="heroPhotoOverlay" aria-hidden="true" />
          <div className="floatingTag tagOne">Negócios locais<br /><strong>mais perto</strong></div>
          <div className="floatingTag tagTwo">Descoberta<br /><strong>por região</strong></div>
          <blockquote>“Negócios locais constroem grandes histórias.”</blockquote>
        </aside>
      </div>
    </section>
  );
}
