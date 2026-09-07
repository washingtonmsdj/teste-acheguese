import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClassifiedDraftAction } from '@/app/classificados/novo/actions';
import { classifiedCategories } from '@/modules/classifieds/domain/categories';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Novo anúncio',
  robots: {
    index: false,
    follow: false,
  },
};

type NewClassifiedPageProps = {
  searchParams: Promise<{ erro?: string }>;
};

export default async function NewClassifiedPage({
  searchParams,
}: NewClassifiedPageProps) {
  const params = await searchParams;
  const configured = Boolean(getSupabasePublicConfig());

  if (!configured) {
    return (
      <main>
        <SiteHeader />
        <section className="formShell">
          <div className="container narrow">
            <p className="eyebrow">Novo classificado</p>
            <h1>Publicação temporariamente indisponível.</h1>
            <p>
              A navegação pública continua funcionando, mas este ambiente ainda não recebeu
              a configuração segura de autenticação.
            </p>
            <Link className="ghostButton linkButton" href="/classificados">
              Voltar aos Classificados
            </Link>
          </div>
        </section>
        <MobileTabbar />
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;

  if (typeof ownerId !== 'string') {
    redirect('/entrar?next=/classificados/novo');
  }

  const { data: cities, error } = await supabase
    .from('cities')
    .select('id, name, state_code')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;

  return (
    <main>
      <SiteHeader />

      <section className="formShell">
        <div className="container formLayout">
          <div className="formIntro">
            <p className="eyebrow">Novo classificado</p>
            <h1>Publique com clareza e sem complicação.</h1>
            <p>
              Comece com um rascunho. Depois você poderá adicionar fotos e revisar tudo
              antes de enviar para publicação.
            </p>
          </div>

          <form className="classifiedForm" action={createClassifiedDraftAction}>
            {params.erro === 'dados_invalidos' && (
              <div className="authFeedback authError" role="alert">
                Revise os campos obrigatórios e tente novamente.
              </div>
            )}

            <fieldset>
              <label>
                Título do anúncio
                <input
                  name="title"
                  minLength={5}
                  maxLength={120}
                  required
                  placeholder="Ex.: Bicicleta aro 29 em ótimo estado"
                />
              </label>

              <label>
                Categoria
                <select name="categoryId" defaultValue="" required>
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
                  <select name="condition" defaultValue="" required>
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
                  required
                  placeholder="Conte os detalhes importantes, estado, tempo de uso e o que acompanha..."
                />
              </label>

              <div className="formColumns">
                <label>
                  Cidade
                  <select name="cityId" defaultValue="" required>
                    <option value="" disabled>Selecione sua cidade</option>
                    {cities?.map((city) => (
                      <option value={city.id} key={city.id}>
                        {city.name} - {city.state_code}
                      </option>
                    ))}
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
              <strong>Primeiro salvamos como rascunho</strong>
              <p>
                Seu anúncio não fica público automaticamente. Fotos e revisão vêm antes
                do envio para moderação.
              </p>
            </div>

            <div className="stateActions">
              <button className="primaryButton" type="submit">
                Salvar rascunho
              </button>
              <Link className="ghostButton linkButton" href="/classificados/meus">
                Meus anúncios
              </Link>
            </div>
          </form>
        </div>
      </section>

      <MobileTabbar />
    </main>
  );
}
