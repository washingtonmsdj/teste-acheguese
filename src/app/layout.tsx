import type { Metadata, Viewport } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: 'Achegue-se — o melhor da sua região',
    template: '%s | Achegue-se',
  },
  description:
    'Descubra e resolva o que importa perto de você. Classificados é o primeiro módulo ativo do Achegue-se em Salvador.',
  applicationName: 'Achegue-se',
  robots: siteUrl
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        noarchive: true,
      },
  alternates: siteUrl
    ? {
        canonical: '/',
      }
    : undefined,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b8a6a',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skipLink" href="#main-content">
          Pular para o conteúdo
        </a>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  );
}
