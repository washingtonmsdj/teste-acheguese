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
              Esta é a estrutura visual do fluxo. Persistência, conta, upload e validação
              de servidor entram nas próximas etapas do vertical.
            </p>
          </div>

          <form className="classifiedForm">
            <fieldset disabled>
              <label>
                Título do anúncio
                <input placeholder="Ex.: Bicicleta aro 29 em ótimo estado" />
              </label>

              <label>
                Categoria
                <select defaultValue="">
                  <option value="" disabled>Escolha uma categoria</option>
                  {classifiedCategories.map((category) => (
                    <option value={category.id} key={category.id}>{category.label}</option>
                  ))}
                </select>
              </label>

              <div className="formColumns">
                <label>
                  Preço
                  <input inputMode="decimal" placeholder="R$ 0,00" />
                </label>
                <label>
                  Condição
                  <select defaultValue="">
                    <option value="" disabled>Selecione</option>
                    <option>Novo</option>
                    <option>Seminovo</option>
                    <option>Usado</option>
                  </select>
                </label>
              </div>

              <label>
                Descrição
                <textarea rows={6} placeholder="Conte os detalhes importantes..." />
              </label>

              <label>
                Cidade
                <input placeholder="Sua cidade" />
              </label>
            </fieldset>

            <div className="formNotice">
              <strong>Próxima etapa técnica</strong>
              <p>Conectar autenticação + banco + storage antes de habilitar o envio.</p>
            </div>

            <Link className="ghostButton linkButton" href="/classificados">
              Voltar aos Classificados
            </Link>
          </form>
        </div>
      </section>
      <MobileTabbar />
    </main>
  );
}
