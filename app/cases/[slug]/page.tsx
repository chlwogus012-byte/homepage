import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCase, getCases, getServices, getSite } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { CaseViewTracker } from "@/components/cases/CaseViewTracker";

const STATUS_LABEL: Record<"ongoing" | "done", string> = {
  ongoing: "진행중",
  done: "완료",
};

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCases().map((caseItem) => ({ slug: caseItem.slug }));
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = getCase(slug);
  if (!caseItem) return {};

  const site = getSite();
  return {
    title: caseItem.seo?.title ?? `${caseItem.title} | ${site.companyName}`,
    description: caseItem.seo?.description ?? caseItem.challenge,
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseItem = getCase(slug);
  if (!caseItem) notFound();

  const services = getServices();
  const serviceLabels = Object.fromEntries(services.map((service) => [service.slug, service.title]));

  const allCases = getCases();
  const index = allCases.findIndex((item) => item.slug === slug);
  const prevCase = index > 0 ? allCases[index - 1] : undefined;
  const nextCase = index < allCases.length - 1 ? allCases[index + 1] : undefined;

  const period =
    caseItem.status === "ongoing"
      ? `${caseItem.startDate} ~ 진행중`
      : `${caseItem.startDate} ~ ${caseItem.endDate ?? ""}`;

  return (
    <>
      <CaseViewTracker slug={caseItem.slug} />

      <section className="border-b border-border bg-surface py-12 md:py-16">
        <Container className="flex flex-col gap-4">
          <Breadcrumb
            items={[{ label: "홈", href: "/" }, { label: "성공사례", href: "/cases" }, { label: caseItem.title }]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{STATUS_LABEL[caseItem.status]}</Badge>
            {caseItem.isSample ? <Badge>샘플 사례</Badge> : null}
          </div>
          <h1 className="text-2xl font-bold text-text md:text-4xl">{caseItem.title}</h1>
          <p className="text-sm text-text-muted">
            {caseItem.industry}
            {caseItem.region ? ` · ${caseItem.region}` : ""} · {period}
          </p>
          <div className="flex flex-wrap gap-1">
            {caseItem.services.map((svcSlug) => (
              <Badge key={svcSlug}>{serviceLabels[svcSlug] ?? svcSlug}</Badge>
            ))}
          </div>
          <div className="relative mt-4 aspect-video overflow-hidden rounded-lg border border-border bg-background">
            <Image src={caseItem.thumbnail.src} alt={caseItem.thumbnail.alt} fill className="object-cover" sizes="100vw" />
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-20">
        <Container className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Before</h2>
            <p className="mt-2 text-sm text-text-muted">{caseItem.challenge}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Strategy</h2>
            <p className="mt-2 text-sm text-text-muted">{caseItem.strategy}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Execution</h2>
            <p className="mt-2 text-sm text-text-muted">{caseItem.execution.text}</p>
          </div>
        </Container>
      </section>

      {caseItem.execution.images.length > 0 ? (
        <section className="border-b border-border py-16 md:py-20">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {caseItem.execution.images.map((image) => (
                <div key={image.src} className="relative aspect-video overflow-hidden rounded-lg border border-border">
                  <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="33vw" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {caseItem.results.length > 0 ? (
        <section className="border-b border-border py-16 md:py-20">
          <Container>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">After</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {caseItem.results.map((result) => (
                <div key={result.label} className="rounded-lg border border-border bg-surface p-6">
                  <p className="text-2xl font-bold text-text">{result.value}</p>
                  <p className="mt-1 text-sm text-text-muted">{result.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {caseItem.testimonial ? (
        <section className="border-b border-border py-16 md:py-20">
          <Container>
            <blockquote className="border-l-2 border-primary pl-4 text-text-muted">
              {caseItem.testimonial}
            </blockquote>
          </Container>
        </section>
      ) : null}

      {caseItem.body ? (
        <section className="border-b border-border py-10">
          <Container>
            <p className="text-xs text-text-muted">{caseItem.body}</p>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-border py-8">
        <Container className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            {prevCase ? (
              <Link href={`/cases/${prevCase.slug}`} className="text-text-muted hover:text-text">
                ← 이전 사례: {prevCase.title}
              </Link>
            ) : null}
            {nextCase ? (
              <Link href={`/cases/${nextCase.slug}`} className="text-text-muted hover:text-text">
                다음 사례: {nextCase.title} →
              </Link>
            ) : null}
          </div>
          <Link href="/cases" className="font-semibold text-primary">
            목록으로
          </Link>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <CtaBanner
            heading="비슷한 고민이 있다면 상담하세요"
            description="업종·상황에 맞는 전략을 무료로 상담해드립니다."
            source={`case_${caseItem.slug}`}
          />
        </Container>
      </section>
    </>
  );
}
