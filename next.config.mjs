/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    // Ensure React version consistency
    config.resolve.alias = {
      ...config.resolve.alias,
      react: require.resolve("react"),
      "react-dom": require.resolve("react-dom"),
    };

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
