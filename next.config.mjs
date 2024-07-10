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
};

export default nextConfig;
