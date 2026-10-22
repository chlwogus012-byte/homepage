import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidget } from "@/components/layout/FloatingWidget";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { ContactModalProvider } from "@/components/forms/ContactModalProvider";
import { getForms, getNavigation, getSite } from "@/lib/content";
import { getSiteUrl } from "@/lib/seo";
import "@/styles/globals.css";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

function isConfirmedValue(value: string | undefined): value is string {
  return Boolean(value) && !(value!.startsWith("[") && value!.endsWith("]"));
}

export function generateMetadata(): Metadata {
  const site = getSite();
  const siteUrl = getSiteUrl();

  const verificationOther: Record<string, string> = {};
  if (isConfirmedValue(site.naverSearchAdvisorVerification)) {
    verificationOther["naver-site-verification"] = site.naverSearchAdvisorVerification;
  }
  if (isConfirmedValue(site.googleSearchConsoleVerification)) {
    verificationOther["google-site-verification"] = site.googleSearchConsoleVerification;
  }

  return {
    metadataBase: new URL(siteUrl),
    title: site.companyName,
    description: `${site.companyName} — 종합 마케팅 회사 공식 홈페이지`,
    alternates: { canonical: "/" },
    ...(Object.keys(verificationOther).length > 0 ? { verification: { other: verificationOther } } : {}),
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const site = getSite();
  const navigation = getNavigation();
  const forms = getForms();
  const siteUrl = getSiteUrl();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.companyName,
    url: siteUrl,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
    },
  };

  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body id="top" className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ContactModalProvider formDef={forms.contact}>
          <Header site={site} navigation={navigation} />
          <main className="flex flex-1 flex-col pb-14 md:pb-0">{children}</main>
          <Footer site={site} />
          <FloatingWidget site={site} />
          <MobileCtaBar site={site} />
        </ContactModalProvider>
      </body>
    </html>
  );
}
