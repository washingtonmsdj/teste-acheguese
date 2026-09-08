import type { NextConfig } from 'next';

function httpUrl(value: string | undefined) {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());

    if (
      url.protocol !== 'https:' &&
      url.protocol !== 'http:'
    ) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function httpOrigin(value: string | undefined) {
  return httpUrl(value)?.origin ?? null;
}

function originList(value: string | undefined) {
  if (!value?.trim()) return [];

  return [
    ...new Set(
      value
        .split(',')
        .map((item) => httpOrigin(item))
        .filter((item): item is string => Boolean(item)),
    ),
  ];
}

function directive(
  name: string,
  values: Array<string | null | undefined>,
) {
  return `${name} ${[
    ...new Set(values.filter((value): value is string => Boolean(value))),
  ].join(' ')}`;
}

const isDevelopment =
  process.env.NODE_ENV === 'development';

const supabaseUrl = httpUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);
const supabaseOrigin = supabaseUrl?.origin ?? null;
const supabaseSocketOrigin =
  supabaseOrigin?.startsWith('https://')
    ? supabaseOrigin.replace('https://', 'wss://')
    : supabaseOrigin?.startsWith('http://')
      ? supabaseOrigin.replace('http://', 'ws://')
      : null;

const mapOrigins = [
  ...new Set(
    [
      'https://tiles.openfreemap.org',
      httpOrigin(process.env.NEXT_PUBLIC_MAP_STYLE_URL),
      ...originList(
        process.env.NEXT_PUBLIC_MAP_CSP_ORIGINS,
      ),
    ].filter((item): item is string => Boolean(item)),
  ),
];

const contentSecurityPolicy = [
  directive('default-src', ["'self'"]),
  directive('script-src', [
    "'self'",
    "'unsafe-inline'",
    isDevelopment ? "'unsafe-eval'" : null,
  ]),
  directive('style-src', [
    "'self'",
    "'unsafe-inline'",
  ]),
  directive('img-src', [
    "'self'",
    'blob:',
    'data:',
    ...mapOrigins,
    supabaseOrigin,
  ]),
  directive('font-src', [
    "'self'",
    'data:',
  ]),
  directive('connect-src', [
    "'self'",
    ...mapOrigins,
    supabaseOrigin,
    supabaseSocketOrigin,
  ]),
  directive('worker-src', [
    "'self'",
    'blob:',
  ]),
  directive('media-src', [
    "'self'",
    supabaseOrigin,
  ]),
  directive('manifest-src', ["'self'"]),
  directive('object-src', ["'none'"]),
  directive('base-uri', ["'self'"]),
  directive('form-action', ["'self'"]),
  directive('frame-ancestors', ["'none'"]),
  ...(isDevelopment
    ? []
    : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy,
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  ...(isDevelopment
    ? []
    : [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000',
        },
      ]),
];

const privateNoStoreHeaders = [
  {
    key: 'Cache-Control',
    value: 'private, no-store, max-age=0, must-revalidate',
  },
];

const privateRoutePatterns = [
  '/admin/:path*',
  '/auth/:path*',
  '/entrar',
  '/classificados/meus',
  '/classificados/novo',
  '/classificados/:id/editar',
  '/favoritos',
  '/mensagens/:path*',
] as const;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
    NEXT_PUBLIC_MAP_STYLE_URL:
      process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? '',
    NEXT_PUBLIC_MAP_CSP_ORIGINS:
      process.env.NEXT_PUBLIC_MAP_CSP_ORIGINS ?? '',
  },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: supabaseUrl
      ? [
          {
            protocol:
              supabaseUrl.protocol === 'https:'
                ? 'https'
                : 'http',
            hostname: supabaseUrl.hostname,
            port: supabaseUrl.port,
            pathname:
              '/storage/v1/object/sign/**',
          },
        ]
      : [],
  },
  async headers() {
    return [
      ...privateRoutePatterns.map((source) => ({
        source,
        headers: privateNoStoreHeaders,
      })),
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.svg',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
