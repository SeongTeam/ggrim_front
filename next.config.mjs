/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // solve debug console error that un file '/.next/server/vendor-chunks/render-from-template-context.js.map'
    //ref : https://github.com/vercel/next.js/issues/65795#issuecomment-2439641016 
    webpack: (config, { dev, isServer }) => {
        if (dev) {
          config.devtool = 'eval-source-map'
        }
        return config
      },
};

export default nextConfig;
