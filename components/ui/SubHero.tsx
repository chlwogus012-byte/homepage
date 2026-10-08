import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type SubHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
};

export function SubHero({ eyebrow, title, description, breadcrumb }: SubHeroProps) {
  return (
    <section className="border-b border-border bg-surface py-12 md:py-16">
      <Container className="flex flex-col gap-4">
        <Breadcrumb items={breadcrumb} />
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="text-2xl font-bold text-text md:text-4xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-sm text-text-muted md:text-base">{description}</p>
        ) : null}
      </Container>
    </section>
  );
}
