import type { Metadata } from "next";
import { getLegal, getSite } from "@/lib/content";
import { parseLegalMarkdown } from "@/lib/markdown";
import { SubHero } from "@/components/ui/SubHero";
import { Container } from "@/components/ui/Container";
import { MarkdownBody } from "@/components/ui/MarkdownBody";

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: `이용약관 | ${site.companyName}`,
    description: `${site.companyName}의 이용약관입니다.`,
    alternates: { canonical: "/terms" },
  };
}

export default function TermsPage() {
  const legal = getLegal("terms");
  const blocks = parseLegalMarkdown(legal.body);

  return (
    <>
      <SubHero
        eyebrow="Terms of Service"
        title="이용약관"
        description={`시행일 ${legal.effectiveDate}`}
        breadcrumb={[{ label: "홈", href: "/" }, { label: "이용약관" }]}
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
