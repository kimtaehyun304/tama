import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    //"!./components/slider/**/*.{js,ts,jsx,tsx,mdx}", // slider 디렉토리 제외
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        "6-header": "1fr 1fr 1fr 1fr 1fr 1fr",
        "5-header2": "2fr 1fr 1fr 1fr 1fr",
      },
      margin: {
        standard: "10%",
        "mobile-standard": "11rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
