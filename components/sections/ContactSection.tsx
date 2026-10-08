import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import type { FormDefinition } from "@/lib/schema";

type ContactSectionProps = {
  heading: string;
  formDef: FormDefinition;
};

export function ContactSection({ heading, formDef }: ContactSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm uppercase tracking-widest text-text-muted">Contact</p>
          <h2 className="mt-2 text-2xl font-semibold text-text md:text-3xl">{heading}</h2>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <ContactForm formDef={formDef} source="home_contact_section" />
        </div>
      </Container>
    </section>
  );
}
