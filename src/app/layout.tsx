import type { Metadata, Viewport } from 'next';
import { territoryReleaseScope } from '@/config/territory-release-scope';
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
    `Dados públicos, mapa e utilidade local organizados pelo território. Começando por ${territoryReleaseScope.group.name}, em ${territoryReleaseScope.city.name}.`,
  applicationName: 'Achegue-se',
  icons: {
    icon: '/favicon.svg',
  },
  robots: {
    index: false,
    follow: true,
    noarchive: !siteUrl,
  },
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
