/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/:path*',
            destination: 'https://hooks.zapier.com/hooks/catch/16082503/2mjtr7z/',
          },
        ]
      },
  };

const withVercelToolbar = require('@vercel/toolbar/plugins/next')();
// Instead of module.exports = nextConfig, do this:
module.exports = withVercelToolbar(nextConfig);