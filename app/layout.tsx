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
/*
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
*/
const nanumGothic = localFont({
  src: "./fonts/NanumGothic.woff2",
  variable: "--font-nanum-gothic",
});

const nanumGothicBold = localFont({
  src: "./fonts/NanumGothicBold.woff2",
  style: "bold",
  variable: "--font-nanum-gothic-bold",
});

export const metadata: Metadata = {
  title: {
    template: "TAMA %s",
    default: "TAMA", // 템플릿을 설정할때 default는 필수 요소입니다.
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
