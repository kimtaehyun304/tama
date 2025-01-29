import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import LoginModal from "@/components/modal/LoginModal";
import AuthProvider from "@/components/context/AuthContext";
import LoginModalProvider from "@/components/context/LoginModalContext";
import SimpleModalProvider from "@/components/context/SimpleModalContex";
import SimpleModal from "@/components/modal/SimpleModal";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "TAMA %s",
    default: "쇼핑몰", // 템플릿을 설정할때 default는 필수 요소입니다.
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col h-[100vh]`}
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
