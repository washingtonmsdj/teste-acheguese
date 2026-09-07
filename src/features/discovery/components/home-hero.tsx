import Image from 'next/image';
import Link from 'next/link';
import { classifiedCategories } from '@/features/classifieds/domain/categories';
import { HomeSearch } from './home-search';

export function HomeHero() {
  return (
    <section className="hero" id="explorar">
      <div className="container heroGrid">
        <div className="heroCopy">
          <p className="eyebrow">
            Salvador · Classificados ativo · novos módulos por etapas
          </p>
          <h1>
            Descubra e resolva mais perto, <em>em um só lugar.</em>
          </h1>
          <p className="heroText">
            O Achegue-se está sendo construído módulo por módulo. Classificados
            já nasce funcional em Salvador; negócios, serviços e outras áreas
            entram depois, sem atalhos na qualidade.
          </p>

          <HomeSearch />

          <div className="quickCategories" aria-label="Categorias de Classificados">
            {classifiedCategories.slice(0, 6).map((category) => (
              <Link
                href={`/classificados?categoria=${category.id}`}
                key={category.id}
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.label}
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
          <div className="floatingTag tagOne">
            Primeiro módulo<br /><strong>Classificados</strong>
          </div>
          <div className="floatingTag tagTwo">
            Território inicial<br /><strong>Salvador · BA</strong>
          </div>
          <blockquote>“Uma cidade fica mais útil quando o que importa está perto.”</blockquote>
        </aside>
      </div>
    </section>
  );
}
