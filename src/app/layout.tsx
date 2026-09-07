import type { Metadata, Viewport } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: 'Achegue-se — território, dados e vida local',
    template: '%s | Achegue-se',
  },
  description:
    'Dados públicos, mapa e utilidade local organizados pelo território. Começando pelo Complexo do Nordeste de Amaralina, em Salvador.',
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
