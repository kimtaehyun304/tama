import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import AuthProvider from "@/components/context/AuthContext";
import LoginModalProvider from "@/components/context/LoginModalContext";
import SimpleModalProvider from "@/components/context/SimpleModalContex";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import LoginModal from "@/components/modal/LoginModal";
import SimpleModal from "@/components/modal/SimpleModal";
import Script from "next/script";
/*
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
*/

//로컬 폰트는 외부 요청이 없어 **렌더링 차단(LCP 지연)**이 거의 없음
const nanumGothic = localFont({
  src: "./fonts/NanumGothic.woff2",
  variable: "--font-nanum-gothic",
  display: "swap",
});

const nanumGothicBold = localFont({
  src: "./fonts/NanumGothicBold.woff2",
  style: "bold",
  variable: "--font-nanum-gothic-bold",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "TAMA %s",
    default: "TAMA", // 템플릿을 설정할때 default는 필수 요소입니다.
  },
  description: "옷을 판매하는 쇼핑몰입니다",
  openGraph: {
    type: "website",
    title: "TAMA",
    description: "옷을 판매하는 쇼핑몰입니다",
    url: "https://dlta.kr",
    images: [
      {
        url: "/tama_panel.png",
        width: 800,
        height: 600,
        alt: "대표 이미지",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        {/* GA4 gtag.js */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZQS95P54WT"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZQS95P54WT');
            `,
          }}
        />
      </head>
      <body
        className={`${nanumGothic.className} ${nanumGothicBold.variable} flex flex-col h-[100vh] overflow-y-scroll`}
      >
        <AuthProvider>
          <LoginModalProvider>
            <SimpleModalProvider>
              <Header />
              <LoginModal />
              <SimpleModal />
              <main className="flex-1">{children}</main>
            </SimpleModalProvider>
          </LoginModalProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
