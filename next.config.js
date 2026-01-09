/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // VULNERABILITY: Strict mode disabled

  // VULNERABILITY: Overly permissive CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: '*' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
    ];
  },

  // VULNERABILITY: Exposing environment variables to client
  env: {
    NEXT_PUBLIC_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_STRIPE_KEY: process.env.STRIPE_SECRET_KEY,
  },

  // VULNERABILITY: Source maps in production
  productionBrowserSourceMaps: true,

  // VULNERABILITY: No security headers
  poweredByHeader: true,
};

module.exports = nextConfig;
