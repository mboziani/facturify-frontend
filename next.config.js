/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'export',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    basePath: '/facturify-frontend',
    assetPrefix: '/facturify-frontend/',
    // Rewrites are not supported in static export
    // async rewrites() { ... }
};

module.exports = nextConfig;
