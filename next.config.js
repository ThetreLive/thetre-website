/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'rose-melodic-felidae-510.mypinata.cloud',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'p2p.thetre.live',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;
