// /** @type {import('next').NextConfig} */
// const nextConfig = {};
// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://tin-asbestos-papua-consideration.trycloudflare.com/api/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;