import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/** @type {import('next').NextConfig} */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    images: {
        remotePatterns: [
            {
              protocol : 'https',
              hostname : process.env.ALLOW_IMAGE_ORIGIN
            }
        ],

        minimumCacheTTL: 3600,
    },
    // solve debug console error that un file '/.next/server/vendor-chunks/render-from-template-context.js.map'
    //ref : https://github.com/vercel/next.js/issues/65795#issuecomment-2439641016 
    webpack: (config, { dev, isServer }) => {
        if (dev) {
          config.devtool = 'eval-source-map'
        }
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');
        return config
      },
      experimental : {
        instrumentationHook : true,
      },
};

if (process.env.NODE_ENV === "production") {
    nextConfig.compiler = {
      removeConsole: {
        exclude: ["error", "warn"],
      },
    };
}

export default nextConfig;
