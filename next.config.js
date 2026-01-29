/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

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
    // basePath only for GitHub Pages production deployment
    ...(process.env.GITHUB_ACTIONS && {
        basePath: '/facturify-frontend',
        assetPrefix: '/facturify-frontend/',
    }),
};

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);

