/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/(candidates|follow-the-crypto-(ads|misc-assets))/**",
      },
    ],
  },
  async redirects() {
    const routes = [
      "beneficiaries",
      "committees",
      "companies",
      "elections",
      "expenditures",
      "individuals",
      "quidproquo",
      "spending",
      "states",
    ];
    return routes.flatMap((route) => [
      {
        source: `/${route}`,
        destination: `/2026/${route}`,
        permanent: false,
      },
      {
        source: `/${route}/:path*`,
        destination: `/2026/${route}/:path*`,
        permanent: false,
      },
    ]);
  },
};

export default nextConfig;
