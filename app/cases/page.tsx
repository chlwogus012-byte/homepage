import type { Metadata } from "next";
import { getCases, getServices, getSite } from "@/lib/content";
import { SubHero } from "@/components/ui/SubHero";
import { Container } from "@/components/ui/Container";
import { CaseListClient } from "@/components/cases/CaseListClient";

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: `성공사례 | ${site.companyName}`,
    description: `${site.companyName}의 업종별 마케팅 성공사례를 확인하세요.`,
  };
}

export default function CasesPage() {
  const cases = getCases();
  const services = getServices();

  return (
    <>
      <SubHero
        eyebrow="Case Study"
        title="성공사례"
        description="업종·서비스별로 진행한 마케팅 사례를 확인해보세요."
        breadcrumb={[{ label: "홈", href: "/" }, { label: "성공사례" }]}
      />
      <Container className="py-12 md:py-16">
        <CaseListClient cases={cases} services={services} />
      </Container>
    </>
  );
}
