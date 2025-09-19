/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: [
      "p19-sign.tiktokcdn-us.com",
      "p19-pu-sign-useast8.tiktokcdn-us.com",
      "p16-pu-sign-useast8.tiktokcdn-us.com",
    ],
  },
};

export default nextConfig;
