import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import type { FormDefinition } from "@/lib/schema";

type ContactSectionProps = {
  heading: string;
  formDef: FormDefinition;
};

export function ContactSection({ heading, formDef }: ContactSectionProps) {
  return (
    <section id="contact" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <h2 className="mb-8 text-2xl font-semibold text-text md:text-3xl">{heading}</h2>
        <div className="rounded-lg border border-border bg-surface p-6">
          <ContactForm formDef={formDef} source="home_contact_section" />
        </div>
      </Container>
    </section>
  );
}
