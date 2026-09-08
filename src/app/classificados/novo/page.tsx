import type { Metadata } from 'next';
import { territoryReleaseScope } from '@/config/territory-release-scope';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClassifiedDraftAction } from '@/app/classificados/novo/actions';
import { classifiedCategories } from '@/modules/classifieds/domain/categories';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';
import { AccountContextRail } from '@/shared/layout/account-context-rail';

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
      <TerritoryAppShell
        activeId="classifieds"
        territoryName={territoryReleaseScope.city.name}
      >
        <main>
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
        </main>
      </TerritoryAppShell>
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
    <TerritoryAppShell
      activeId="classifieds"
      territoryName={territoryReleaseScope.city.name}
      contextRail={<AccountContextRail active="new" />}
    >
      <main>

      <section className="formShell">
        <div className="container formLayout">
          <div className="formIntro">
            <p className="eyebrow">Novo classificado</p>
            <h1>Publique com clareza e sem complicação.</h1>
            <p>
              Comece com um rascunho. Depois você poderá adicionar fotos e revisar tudo
              antes de enviar para publicação.
            </p>

            <ol className="classifiedFormFlow" aria-label="Etapas de publicação">
              <li className="classifiedFormFlowActive">
                <span>1</span>
                <div>
                  <strong>Dados do anúncio</strong>
                  <small>Agora</small>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Fotos</strong>
                  <small>Depois do rascunho</small>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Revisão</strong>
                  <small>Antes de publicar</small>
                </div>
              </li>
            </ol>
          </div>

          <form className="classifiedForm" action={createClassifiedDraftAction}>
            {params.erro === 'dados_invalidos' && (
              <div className="authFeedback authError" role="alert">
                Revise os campos obrigatórios e tente novamente.
              </div>
            )}

            <fieldset>
              <section className="classifiedFormSection">
                <div className="classifiedFormSectionHead">
                  <span>01</span>
                  <div>
                    <strong>O que você está anunciando?</strong>
                    <small>Título e categoria.</small>
                  </div>
                </div>

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

              </section>

              <section className="classifiedFormSection">
                <div className="classifiedFormSectionHead">
                  <span>02</span>
                  <div>
                    <strong>Preço e condição</strong>
                    <small>Ajude quem vê o anúncio a entender a oferta.</small>
                  </div>
                </div>

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

              </section>

              <section className="classifiedFormSection">
                <div className="classifiedFormSectionHead">
                  <span>03</span>
                  <div>
                    <strong>Descrição</strong>
                    <small>Conte o estado, uso e o que acompanha.</small>
                  </div>
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
              </section>

              <section className="classifiedFormSection">
                <div className="classifiedFormSectionHead">
                  <span>04</span>
                  <div>
                    <strong>Localização informada</strong>
                    <small>Cidade é obrigatória; bairro é opcional.</small>
                  </div>
                </div>

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
              </section>
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

      </main>
    </TerritoryAppShell>
  );
}
