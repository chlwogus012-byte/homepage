import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidget } from "@/components/layout/FloatingWidget";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { getNavigation, getSite } from "@/lib/content";
import "@/styles/globals.css";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: site.companyName,
    description: `${site.companyName} — 종합 마케팅 회사 공식 홈페이지`,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const site = getSite();
  const navigation = getNavigation();

  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body id="top" className="flex min-h-full flex-col">
        <Header site={site} navigation={navigation} />
        <main className="flex flex-1 flex-col pb-14 md:pb-0">{children}</main>
        <Footer site={site} />
        <FloatingWidget site={site} />
        <MobileCtaBar site={site} />
      </body>
    </html>
  );
}
