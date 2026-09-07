import type { NextConfig } from 'next';

function httpOrigin(value: string | undefined) {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());

    if (
      url.protocol !== 'https:' &&
      url.protocol !== 'http:'
    ) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

const isDevelopment =
  process.env.NODE_ENV === 'development';
const supabaseOrigin = httpOrigin(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);
const supabaseSocketOrigin =
  supabaseOrigin?.startsWith('https://')
    ? supabaseOrigin.replace('https://', 'wss://')
    : supabaseOrigin?.startsWith('http://')
      ? supabaseOrigin.replace('http://', 'ws://')
      : null;

function directive(
  name: string,
  values: Array<string | null | undefined>,
) {
  return `${name} ${values.filter(Boolean).join(' ')}`;
}

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
    'https://tiles.openfreemap.org',
    supabaseOrigin,
  ]),
  directive('font-src', [
    "'self'",
    'data:',
  ]),
  directive('connect-src', [
    "'self'",
    'https://tiles.openfreemap.org',
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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hnuhabsuzaagsjrtyzdo.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
