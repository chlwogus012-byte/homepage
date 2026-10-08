import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CaseCard } from "@/components/cases/CaseCard";
import type { CaseFrontmatter } from "@/lib/schema";

type FeaturedCasesProps = {
  heading: string;
  cases: CaseFrontmatter[];
  serviceLabels: Record<string, string>;
};

export function FeaturedCases({ heading, cases, serviceLabels }: FeaturedCasesProps) {
  if (cases.length === 0) return null;

  return (
    <section className="border-b border-border py-16 md:py-24">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text md:text-3xl">{heading}</h2>
          <Link href="/cases" className="text-sm font-semibold text-primary">
            전체 보기 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.slug} caseItem={caseItem} serviceLabels={serviceLabels} />
          ))}
        </div>
      </Container>
    </section>
  );
}
