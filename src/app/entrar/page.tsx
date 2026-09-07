import type { Metadata } from 'next';
import Link from 'next/link';
import { signInAction, signUpAction } from '@/app/entrar/actions';
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
      <section className="authCard authCardWide">
        <Brand />

        <div>
          <p className="eyebrow">Sua conta</p>
          <h1>Entre ou crie sua conta.</h1>
          <p>
            A leitura continua pública. A conta é necessária apenas para ações pessoais,
            como publicar e gerenciar Classificados.
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
            <h2>Já tenho conta</h2>
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
            <h2>Criar conta</h2>
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

        <div className="authFooter">
          <Link className="textLink" href="/classificados">
            Continuar sem conta
          </Link>
          <Link className="textLink" href="/">
            Voltar para a Home
          </Link>
        </div>
      </section>
    </main>
  );
}
