import type { Metadata } from "next";
import { getLegal, getSite } from "@/lib/content";
import { parseLegalMarkdown } from "@/lib/markdown";
import { SubHero } from "@/components/ui/SubHero";
import { Container } from "@/components/ui/Container";
import { MarkdownBody } from "@/components/ui/MarkdownBody";

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: `개인정보처리방침 | ${site.companyName}`,
    description: `${site.companyName}의 개인정보처리방침입니다.`,
    alternates: { canonical: "/privacy" },
  };
}

export default function PrivacyPage() {
  const legal = getLegal("privacy");
  const blocks = parseLegalMarkdown(legal.body);

  return (
    <>
      <SubHero
        eyebrow="Privacy Policy"
        title="개인정보처리방침"
        description={`시행일 ${legal.effectiveDate}`}
        breadcrumb={[{ label: "홈", href: "/" }, { label: "개인정보처리방침" }]}
      />
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto w-full max-w-3xl">
            <MarkdownBody blocks={blocks} />
          </div>
        </Container>
      </section>
    </>
  );
}
