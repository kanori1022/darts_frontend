import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "combines-darts.link"], // 開発環境のlocalhost:8000からの画像を許可
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/rails/active_storage/**",
      },
      {
        protocol: "https",
        hostname: "combines-darts.link",
        pathname: "/rails/active_storage/**",
      },
    ],
    // パフォーマンス最適化のための設定
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },
  // 実験的機能でパフォーマンス向上
  experimental: {
    optimizePackageImports: ["@fortawesome/react-fontawesome"],
  },
};

export default nextConfig;
