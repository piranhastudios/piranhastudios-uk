module.exports = {
    async rewrites() {
        return [
          {
            source: '/:path*',
            destination: 'https://hooks.zapier.com/hooks/catch/16082503/2mjtr7z/',
          },
        ]
      },
  };