
import type {NextConfig} from 'next';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';


const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // Correctly resolve absolute paths for aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };

    // Alias problematic OpenTelemetry exporters to false to prevent Webpack errors
    // This is necessary because Genkit's dependencies can try to dynamically load these
    config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;
    config.resolve.alias['@opentelemetry/exporter-zipkin'] = false;
    
    // Copy the pdf.js worker to the public directory
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(
              path.dirname(require.resolve('pdfjs-dist/package.json')),
              'build/pdf.worker.js'
            ),
            to: path.join(__dirname, 'public'),
          },
        ],
      })
    );

    return config;
  },
};

export default nextConfig;
