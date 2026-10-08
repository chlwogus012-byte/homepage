import type { Metadata } from "next";
import { getForms, getSite } from "@/lib/content";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/ui/Container";

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: `상담 신청 | ${site.companyName}`,
    description: `${site.companyName}에 마케팅 상담을 신청하세요.`,
  };
}

export default function ContactPage() {
  const forms = getForms();

  return (
    <Container className="flex flex-1 flex-col py-12 md:py-20">
      <div className="mx-auto w-full max-w-md">
        <p className="text-sm uppercase tracking-widest text-text-muted">Contact</p>
        <h1 className="mt-2 text-2xl font-semibold text-text md:text-3xl">상담 신청</h1>
        <p className="mt-2 text-sm text-text-muted">
          아래 항목을 남겨주시면 빠르게 연락드리겠습니다.
        </p>
        <div className="mt-8">
          <ContactForm formDef={forms.contact} source="contact_page" />
        </div>
      </div>
    </Container>
  );
}
