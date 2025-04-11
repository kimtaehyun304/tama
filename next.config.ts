import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // API 서버 포트
        pathname: "/api/images/items/**", // 이미지 경로 패턴
      },
      {
        protocol: "https",
        hostname: "d2c8f9ztxduzat.cloudfront.net",
        pathname: "/**", // 이미지 경로 패턴
      },
    ],
  },
};

export default nextConfig;
