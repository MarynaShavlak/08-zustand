import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  async redirects() {
    // the list of notes lives on the filter route, "all" shows notes with any tag
    return [
      {
        source: '/notes',
        destination: '/notes/filter/all',
        permanent: false,
      },
      {
        source: '/notes/filter',
        destination: '/notes/filter/all',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
