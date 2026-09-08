/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'https://dev-headlessecommerce.pantheonsite.io/graphql',
      },
    ];
  },
};

export default nextConfig;