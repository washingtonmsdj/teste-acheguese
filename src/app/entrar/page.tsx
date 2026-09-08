import type { Metadata } from 'next';
import Link from 'next/link';
import { signInAction, signUpAction } from '@/app/entrar/actions';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';
import { Brand } from '@/shared/ui/brand';

export const metadata: Metadata = {
  title: 'Entrar',
  robots: {
    index: false,
    follow: false,
  },
};

type SignInPageProps = {
  searchParams: Promise<{
    erro?: string;
    mensagem?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  indisponivel: 'A autenticação ainda não está disponível neste ambiente.',
  dados_invalidos: 'Informe um e-mail válido e uma senha com pelo menos 8 caracteres.',
  credenciais_invalidas: 'E-mail ou senha inválidos.',
  cadastro_falhou: 'Não foi possível criar a conta. Revise os dados e tente novamente.',
  origem_invalida: 'Não foi possível validar a origem da solicitação.',
  confirmacao_falhou: 'O link de confirmação não pôde ser validado.',
};

export default async function SignInPage({
  searchParams,
}: SignInPageProps) {
  const params = await searchParams;
  const next =
    params.next?.startsWith('/') && !params.next.startsWith('//')
      ? params.next
      : '/classificados/meus';

  return (
    <main className="authPage">
      <div className="authShell">
        <aside className="authStory">
          <div className="authStoryTop">
            <Brand />
            <Link className="authBackLink" href="/">
              ← Voltar ao território
            </Link>
          </div>

          <div className="authStoryCopy">
            <p className="eyebrow">Conta Achegue-se</p>
            <h1>
              O território é público. <em>Sua conta cuida do que é seu.</em>
            </h1>
            <p>
              Você não precisa entrar para consultar mapa e
              dados públicos. A conta habilita somente ações
              pessoais e privadas.
            </p>
          </div>

          <div className="authBenefits" aria-label="Recursos da conta">
            <article>
              <span>
                <NavigationIcon name="tag" />
              </span>
              <div>
                <strong>Publicar e gerenciar</strong>
                <small>Crie e acompanhe seus anúncios.</small>
              </div>
            </article>
            <article>
              <span>
                <NavigationIcon name="favorite" />
              </span>
              <div>
                <strong>Salvar</strong>
                <small>Guarde anúncios nos seus Favoritos.</small>
              </div>
            </article>
            <article>
              <span>
                <NavigationIcon name="messages" />
              </span>
              <div>
                <strong>Conversar</strong>
                <small>Acesse suas mensagens privadas.</small>
              </div>
            </article>
          </div>

          <div className="authStoryFooter">
            <span>Complexo do Nordeste de Amaralina</span>
            <small>Salvador · BA</small>
          </div>
        </aside>

        <section className="authPanel">
          <div className="authPanelHeader">
            <p className="eyebrow">Acesso</p>
            <h2>Entre ou crie sua conta.</h2>
            <p>
              Use seu e-mail. A leitura pública permanece
              disponível mesmo sem cadastro.
            </p>
          </div>

          {params.erro && (
            <div className="authFeedback authError" role="alert">
              {errorMessages[params.erro] ?? 'Não foi possível concluir a solicitação.'}
            </div>
          )}

          {params.mensagem === 'confirme_email' && (
            <div className="authFeedback authSuccess" role="status">
              Conta criada. Confira seu e-mail para confirmar o acesso.
            </div>
          )}

          <div className="authForms">
            <form className="authForm" action={signInAction}>
              <h3>Já tenho conta</h3>
              <input type="hidden" name="next" value={next} />

              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="voce@exemplo.com"
                />
              </label>

              <label>
                Senha
                <input
                  type="password"
                  name="password"
                  minLength={8}
                  autoComplete="current-password"
                  required
                  placeholder="Sua senha"
                />
              </label>

              <button className="primaryButton" type="submit">
                Entrar
              </button>
            </form>

            <form className="authForm authFormSecondary" action={signUpAction}>
              <h3>Criar conta</h3>
              <input type="hidden" name="next" value={next} />

              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="voce@exemplo.com"
                />
              </label>

              <label>
                Crie uma senha
                <input
                  type="password"
                  name="password"
                  minLength={8}
                  autoComplete="new-password"
                  required
                  placeholder="Mínimo de 8 caracteres"
                />
              </label>

              <button className="ghostButton" type="submit">
                Criar minha conta
              </button>
            </form>
          </div>

          <div className="authPrivacyNote">
            <strong>Leitura pública por padrão.</strong>
            <span>
              Entrar não altera o território que você está
              consultando e não torna seu endereço público.
            </span>
          </div>

          <div className="authFooter">
            <Link className="textLink" href="/classificados">
              Continuar sem conta
            </Link>
            <Link className="textLink" href="/">
              Ir para o território
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
