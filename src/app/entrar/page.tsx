import type { Metadata } from 'next';
import Link from 'next/link';
import { Brand } from '@/shared/ui/brand';

export const metadata: Metadata = {
  title: 'Entrar',
};

export default function SignInPage() {
  return (
    <main className="authPage">
      <section className="authCard">
        <Brand />
        <div>
          <p className="eyebrow">Sua conta</p>
          <h1>Entre no Achegue-se</h1>
          <p>
            A autenticação será conectada quando iniciarmos publicação e favoritos de
            Classificados. A tela já possui um endereço estável para não quebrar a navegação.
          </p>
        </div>
        <Link className="primaryButton linkButton" href="/classificados">
          Continuar explorando
        </Link>
        <Link className="textLink" href="/">Voltar para a Home</Link>
      </section>
    </main>
  );
}
