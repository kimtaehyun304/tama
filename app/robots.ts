// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Google
      {
        userAgent: "Googlebot",
        allow: "/",
      },

      // Naver
      {
        userAgent: "Yeti",
        allow: "/",
      },

      // Bing
      {
        userAgent: "Bingbot",
        allow: "/",
      },

      // 그 외 모든 봇 차단
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: "https://example.com/sitemap.xml",
  };
}
