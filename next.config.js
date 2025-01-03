/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: 'https://hooks.zapier.com/hooks/catch/16082503/2mjtr7z/',
            },
        ];
    },
};

// Dynamically import `@vercel/toolbar/plugins/next`
async function loadConfig() {
    const withVercelToolbar = (await import('@vercel/toolbar/plugins/next')).default;
    return withVercelToolbar(nextConfig);
}

module.exports = loadConfig();
