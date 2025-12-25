import path from 'path';
import { fileURLToPath } from 'url';
import type { NextConfig } from 'next';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  webpack: (config, { isServer }) => {
    // Add parent node_modules to resolve paths
    config.resolve = config.resolve || {};
    config.resolve.modules = config.resolve.modules || [];
    config.resolve.modules.push(path.join(__dirname, 'node_modules'));
    config.resolve.modules.push(path.join(__dirname, '../node_modules'));

    // Explicitly alias mongodb to web/node_modules version
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias.mongodb = path.join(__dirname, 'node_modules/mongodb');

    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        aws4: 'commonjs aws4',
        'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
        kerberos: 'commonjs kerberos',
        '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
        snappy: 'commonjs snappy',
      });
    }
    return config;
  },
};

export default nextConfig;
