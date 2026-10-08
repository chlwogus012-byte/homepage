import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type HeroProps = {
  headline: string;
  subcopy: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export function Hero({ headline, subcopy, ctaPrimary, ctaSecondary }: HeroProps) {
  return (
    <section className="flex min-h-[70vh] items-center border-b border-border py-20">
      <Container className="flex flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Marketing Partner
        </p>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-text md:text-5xl">
          {headline}
        </h1>
        <p className="max-w-xl text-base text-text-muted md:text-lg">{subcopy}</p>
        <div className="flex flex-wrap gap-3">
          <Button href={ctaPrimary.href} variant="primary" arrow>
            {ctaPrimary.label}
          </Button>
          <Button href={ctaSecondary.href} variant="secondary" arrow>
            {ctaSecondary.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
