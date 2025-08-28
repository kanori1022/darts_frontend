import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"], // 開発環境のlocalhost:8000からの画像を許可
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/rails/active_storage/**",
      },
    ],
  },
};

export default nextConfig;
