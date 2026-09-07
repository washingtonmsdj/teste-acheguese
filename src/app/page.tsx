import { categories, highlights, stats } from '@/features/discovery/home-data';

function Brand() {
  return (
    <a className="brand" href="#" aria-label="Achegue-se, página inicial">
      <span className="brandMark" aria-hidden="true">♥</span>
      <span>
        <strong>Achegue-se</strong>
        <small>Sua região mais próxima de você</small>
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <main>
      <header className="siteHeader">
        <div className="container headerInner">
          <Brand />
          <nav className="desktopNav" aria-label="Navegação principal">
            <a href="#explorar">Explorar</a>
            <a href="#categorias">Categorias</a>
            <a href="#empresas">Para empresas</a>
            <a href="#como-funciona">Como funciona</a>
          </nav>
          <div className="headerActions">
            <button className="ghostButton">Entrar</button>
            <button className="primaryButton">Cadastrar empresa</button>
          </div>
          <button className="menuButton" aria-label="Abrir menu">☰</button>
        </div>
      </header>

      <section className="hero" id="explorar">
        <div className="container heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Comércio local · pessoas reais · regiões mais fortes</p>
            <h1>
              Encontre o melhor da sua região, <em>em um só lugar.</em>
            </h1>
            <p className="heroText">
              Descubra lojas, serviços, profissionais e oportunidades perto de você.
              Apoie o comércio local e conecte-se com pessoas que fazem sua cidade acontecer.
            </p>

            <form className="searchBox">
              <label className="srOnly" htmlFor="search">O que você procura?</label>
              <input id="search" placeholder="O que você procura hoje?" />
              <button type="button" className="locationButton">📍 Minha região</button>
              <button type="submit" className="searchButton">Buscar</button>
            </form>

            <div className="quickCategories" aria-label="Categorias populares">
              {categories.slice(0, 6).map((category) => (
                <a href="#categorias" key={category.label}>
                  <span>{category.icon}</span>{category.label}
                </a>
              ))}
            </div>
          </div>

          <aside className="heroVisual" aria-label="Comércio local em destaque">
            <div className="heroPhoto" role="img" aria-label="Empreendedora em seu comércio local" />
            <div className="floatingTag tagOne">Padaria da Jú<br /><strong>a 300 m</strong></div>
            <div className="floatingTag tagTwo">Pet Feliz<br /><strong>a 450 m</strong></div>
            <blockquote>“Negócios locais constroem grandes histórias.”</blockquote>
          </aside>
        </div>
      </section>

      <section className="statsSection">
        <div className="container statsGrid">
          {stats.map(([value, label]) => (
            <div className="stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
          <div className="mission">
            <span aria-hidden="true">🌱</span>
            <div><strong>Juntos por cidades mais fortes.</strong><small>Conectando pessoas e negócios.</small></div>
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
          <a href="#">Ver todas →</a>
        </div>
        <div className="categoryGrid">
          {categories.map((category) => (
            <a className="categoryCard" href="#" key={category.label}>
              <span>{category.icon}</span>
              <strong>{category.label}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">Descoberta local</p>
              <h2>Destaques da sua região</h2>
              <p>Uma primeira amostra da experiência de descoberta do Achegue-se.</p>
            </div>
            <a href="#">Ver todos →</a>
          </div>
          <div className="highlightGrid">
            {highlights.map((item) => (
              <article className="businessCard" key={item.name}>
                <img src={item.image} alt="" />
                <div>
                  <div className="rating">★ {item.rating}</div>
                  <h3>{item.name}</h3>
                  <p>{item.meta}</p>
                  <a href="#">Ver detalhes →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
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
            <span>✓ Negócios relevantes</span>
            <span>✓ Busca por proximidade</span>
            <span>✓ Favoritos e avaliações</span>
          </div>
        </article>

        <article className="featurePanel businessPanel" id="empresas">
          <p className="eyebrow">Para empresas</p>
          <h2>Mais visibilidade para o negócio local.</h2>
          <p>
            Presença digital, catálogo, contato, avaliações e ferramentas para transformar
            descoberta local em novos clientes.
          </p>
          <button className="primaryButton">Cadastrar minha empresa</button>
        </article>
      </section>

      <section className="appSection">
        <div className="container appGrid">
          <div>
            <p className="eyebrow">Mobile-first de verdade</p>
            <h2>O Achegue-se no seu bolso.</h2>
            <p>
              Esta nova versão nasce primeiro para a rotina no celular e escala naturalmente
              para tablet e desktop.
            </p>
            <div className="storeButtons">
              <span> App Store</span>
              <span>▶ Google Play</span>
            </div>
          </div>
          <div className="phoneMock" aria-label="Prévia mobile do Achegue-se">
            <div className="phoneTop">Achegue-se <span>📍 Salvador - BA</span></div>
            <div className="phoneSearch">🔎 O que você procura?</div>
            <div className="phoneCategories">
              {categories.slice(0, 4).map((item) => <span key={item.label}>{item.icon}<small>{item.label}</small></span>)}
            </div>
            <strong>Destaques perto de você</strong>
            <div className="phoneCard">🍔 <div><b>Burger do Bairro</b><small>★ 4,9 · 300 m</small></div></div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footerInner">
          <Brand />
          <p>Pessoas. Negócios. Comunidades mais fortes.</p>
          <div><a href="#">Termos</a><a href="#">Privacidade</a><a href="#">Contato</a></div>
        </div>
      </footer>

      <nav className="mobileTabbar" aria-label="Navegação mobile">
        <a href="#"><span>⌂</span>Início</a>
        <a href="#"><span>⌕</span>Explorar</a>
        <a href="#"><span>♡</span>Favoritos</a>
        <a href="#"><span>☰</span>Menu</a>
      </nav>
    </main>
  );
}
