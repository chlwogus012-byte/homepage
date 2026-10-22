import { getCases, getForms, getHome, getServices, getStats } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { Strengths } from "@/components/sections/Strengths";
import { ServicesTabs } from "@/components/sections/ServicesTabs";
import { Clients } from "@/components/sections/Clients";
import { Stats } from "@/components/sections/Stats";
import { FeaturedCases } from "@/components/sections/FeaturedCases";
import { ContactSection } from "@/components/sections/ContactSection";
import { Reveal } from "@/components/ui/Reveal";

export default function Home() {
  const home = getHome();
  const services = getServices();
  const stats = getStats();
  const cases = getCases();
  const forms = getForms();

  const sections = [...home.sections].filter((section) => section.visible).sort((a, b) => a.order - b.order);

  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return <Hero key={section.type} {...section.data} />;
          case "strengths":
            return (
              <Reveal key={section.type}>
                <Strengths {...section.data} />
              </Reveal>
            );
          case "services":
            return (
              <Reveal key={section.type}>
                <ServicesTabs heading={section.data.heading} services={services} />
              </Reveal>
            );
          case "logos":
            return (
              <Reveal key={section.type}>
                <Clients {...section.data} />
              </Reveal>
            );
          case "stats":
            return (
              <Reveal key={section.type}>
                <Stats heading={section.data.heading} stats={stats} />
              </Reveal>
            );
          case "cases": {
            const featured = [...cases]
              .sort((a, b) => Number(b.featured) - Number(a.featured))
              .slice(0, section.data.limit);
            const serviceLabels = Object.fromEntries(services.map((service) => [service.slug, service.title]));
            return (
              <Reveal key={section.type}>
                <FeaturedCases heading={section.data.heading} cases={featured} serviceLabels={serviceLabels} />
              </Reveal>
            );
          }
          case "contact":
            return (
              <Reveal key={section.type}>
                <ContactSection heading={section.data.heading} formDef={forms.contact} />
              </Reveal>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
