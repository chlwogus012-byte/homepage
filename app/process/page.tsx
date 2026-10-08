import type { Metadata } from "next";
import { getProcess, getSite } from "@/lib/content";
import { SubHero } from "@/components/ui/SubHero";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/sections/CtaBanner";

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: `운영 프로세스 | ${site.companyName}`,
    description: `${site.companyName}가 마케팅을 운영하는 방식을 소개합니다.`,
  };
}

export default function ProcessPage() {
  const steps = getProcess();

  return (
    <>
      <SubHero
        eyebrow="Operation Process"
        title="운영 프로세스"
        description="진단부터 리포트·개선까지, 체계적인 프로세스로 운영합니다."
        breadcrumb={[{ label: "홈", href: "/" }, { label: "운영 프로세스" }]}
      />

      <section className="border-b border-border py-16 md:py-20">
        <Container>
          <ol className="flex flex-col gap-8">
            {steps.map((step) => (
              <li key={step.step} className="flex gap-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary text-base font-bold text-primary">
                  {String(step.step).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-text">{step.title}</h2>
                  <p className="mt-1 text-sm text-text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <CtaBanner
            heading="우리 업장에 맞는 프로세스가 궁금하다면"
            description="업종과 목표를 알려주시면 맞춤 프로세스를 제안해드립니다."
            source="process_page"
          />
        </Container>
      </section>
    </>
  );
}
