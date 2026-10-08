import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCases, getService, getServices, getSite } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SubHero } from "@/components/ui/SubHero";
import { Accordion } from "@/components/ui/Accordion";
import { CaseCard } from "@/components/cases/CaseCard";
import { CtaBanner } from "@/components/sections/CtaBanner";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const site = getSite();
  return {
    title: service.seo.title ?? `${service.title} | ${site.companyName}`,
    description: service.seo.description ?? service.summary,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const services = getServices();
  const serviceLabels = Object.fromEntries(services.map((item) => [item.slug, item.title]));
  const relatedCases = getCases().filter((caseItem) => caseItem.services.includes(service.slug));

  return (
    <>
      <SubHero
        eyebrow="Service"
        title={service.title}
        description={service.summary}
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "서비스", href: "/services/media-mix" },
          { label: service.title },
        ]}
      />

      <section className="border-b border-border py-16 md:py-20">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-text">이런 분께 필요합니다</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {service.targetChecklist.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-text-muted">
                  <span aria-hidden="true" className="text-primary">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text">제공 내용</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-text-muted">
                  <span aria-hidden="true" className="text-primary">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-20">
        <Container>
          <h2 className="text-lg font-semibold text-text">진행 방식</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {service.miniProcess.map((step, index) => (
              <li key={step.title} className="rounded-lg border border-border bg-surface p-6">
                <span className="text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold text-text">{step.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {service.gallery.length > 0 ? (
        <section className="border-b border-border py-16 md:py-20">
          <Container>
            <h2 className="text-lg font-semibold text-text">결과물 예시</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.gallery.map((image) => (
                <div key={image.src} className="relative aspect-video overflow-hidden rounded-lg border border-border">
                  <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="33vw" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {relatedCases.length > 0 ? (
        <section className="border-b border-border py-16 md:py-20">
          <Container>
            <h2 className="text-lg font-semibold text-text">관련 성공사례</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCases.map((caseItem) => (
                <CaseCard key={caseItem.slug} caseItem={caseItem} serviceLabels={serviceLabels} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {service.faq.length > 0 ? (
        <section className="border-b border-border py-16 md:py-20">
          <Container className="max-w-2xl">
            <h2 className="text-lg font-semibold text-text">자주 묻는 질문</h2>
            <div className="mt-6">
              <Accordion items={service.faq} />
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-16 md:py-20">
        <Container>
          <CtaBanner
            heading={`${service.title}, 지금 상담해보세요`}
            description="업종·목표에 맞는 전략을 함께 설계해드립니다."
            source={`service_${service.slug}`}
          />
        </Container>
      </section>
    </>
  );
}
