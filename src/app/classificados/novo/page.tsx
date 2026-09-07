import type { Metadata } from 'next';
import Link from 'next/link';
import { classifiedCategories } from '@/features/classifieds/domain/categories';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const metadata: Metadata = {
  title: 'Novo anúncio',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewClassifiedPage() {
  return (
    <main>
      <SiteHeader />

      <section className="formShell">
        <div className="container formLayout">
          <div className="formIntro">
            <p className="eyebrow">Novo classificado</p>
            <h1>Publique com clareza e sem complicação.</h1>
            <p>
              Prepare seu anúncio com título, categoria, preço, condição e região.
              Para publicar e gerenciar anúncios, será necessário entrar na sua conta.
            </p>
          </div>

          <form className="classifiedForm">
            <fieldset disabled>
              <label>
                Título do anúncio
                <input
                  name="title"
                  minLength={5}
                  maxLength={120}
                  placeholder="Ex.: Bicicleta aro 29 em ótimo estado"
                />
              </label>

              <label>
                Categoria
                <select name="categoryId" defaultValue="">
                  <option value="" disabled>Escolha uma categoria</option>
                  {classifiedCategories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="formColumns">
                <label>
                  Preço
                  <input
                    name="price"
                    inputMode="decimal"
                    placeholder="R$ 0,00"
                  />
                </label>

                <label>
                  Condição
                  <select name="condition" defaultValue="">
                    <option value="" disabled>Selecione</option>
                    <option value="new">Novo</option>
                    <option value="like_new">Seminovo</option>
                    <option value="used">Usado</option>
                    <option value="for_parts">Para peças</option>
                  </select>
                </label>
              </div>

              <label>
                Descrição
                <textarea
                  name="description"
                  rows={6}
                  minLength={20}
                  maxLength={5000}
                  placeholder="Conte os detalhes importantes..."
                />
              </label>

              <div className="formColumns">
                <label>
                  Cidade
                  <select name="cityId" defaultValue="">
                    <option value="" disabled>Selecione sua cidade</option>
                  </select>
                </label>

                <label>
                  Bairro
                  <input
                    name="neighborhood"
                    maxLength={120}
                    placeholder="Opcional"
                  />
                </label>
              </div>
            </fieldset>

            <div className="formNotice">
              <strong>Publicação protegida por conta</strong>
              <p>
                O anúncio só será enviado depois que a autenticação segura estiver
                disponível neste novo ambiente.
              </p>
            </div>

            <div className="stateActions">
              <Link className="primaryButton linkButton" href="/entrar">
                Entrar para publicar
              </Link>
              <Link className="ghostButton linkButton" href="/classificados">
                Voltar aos Classificados
              </Link>
            </div>
          </form>
        </div>
      </section>

      <MobileTabbar />
    </main>
  );
}
