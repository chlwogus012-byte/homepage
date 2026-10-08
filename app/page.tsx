import { getCases, getForms, getHome, getServices, getStats } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { Strengths } from "@/components/sections/Strengths";
import { ServicesTabs } from "@/components/sections/ServicesTabs";
import { Stats } from "@/components/sections/Stats";
import { FeaturedCases } from "@/components/sections/FeaturedCases";
import { ContactSection } from "@/components/sections/ContactSection";

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
            return <Strengths key={section.type} {...section.data} />;
          case "services":
            return <ServicesTabs key={section.type} heading={section.data.heading} services={services} />;
          case "stats":
            return <Stats key={section.type} heading={section.data.heading} stats={stats} />;
          case "cases": {
            const featured = [...cases]
              .sort((a, b) => Number(b.featured) - Number(a.featured))
              .slice(0, section.data.limit);
            const serviceLabels = Object.fromEntries(services.map((service) => [service.slug, service.title]));
            return (
              <FeaturedCases
                key={section.type}
                heading={section.data.heading}
                cases={featured}
                serviceLabels={serviceLabels}
              />
            );
          }
          case "contact":
            return <ContactSection key={section.type} heading={section.data.heading} formDef={forms.contact} />;
          default:
            return null;
        }
      })}
    </>
  );
}
