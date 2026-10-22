"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Service } from "@/lib/schema";

type ServicesTabsProps = {
  heading: string;
  services: Service[];
};

const categoryIcons: Record<string, React.ReactNode> = {
  "media-mix": (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="32" r="16" />
      <circle cx="40" cy="32" r="16" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="28" r="16" />
      <path d="M39 39L52 52" />
      <path d="M21 29l5-6 4 4 7-8" />
    </svg>
  ),
  performance: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 48V32" />
      <path d="M28 48V20" />
      <path d="M44 48V28" />
      <path d="M12 24l16-10 16 8 12-10" />
      <path d="M52 12h-8v8" />
    </svg>
  ),
  viral: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="32" r="5" />
      <circle cx="46" cy="16" r="5" />
      <circle cx="46" cy="48" r="5" />
      <path d="M20.5 29.5L41.5 18.5" />
      <path d="M20.5 34.5L41.5 45.5" />
    </svg>
  ),
  brand: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 10l18 8v14c0 12-8 18-18 22-10-4-18-10-18-22V18l18-8z" />
      <path d="M24 32l6 6 10-12" />
    </svg>
  ),
};

function ServiceVisual({ service }: { service: Service }) {
  const icon = categoryIcons[service.category];

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-gradient-to-br from-surface via-surface to-primary/15">
      <span
        aria-hidden="true"
        className="absolute -bottom-4 right-2 select-none text-7xl font-black leading-none text-text/5 md:text-8xl"
      >
        {String(service.order).padStart(2, "0")}
      </span>
      {icon ? (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-primary">
          <div className="h-20 w-20 md:h-24 md:w-24">{icon}</div>
        </div>
      ) : null}
    </div>
  );
}

export function ServicesTabs({ heading, services }: ServicesTabsProps) {
  const [activeSlug, setActiveSlug] = useState(services[0]?.slug);
  const active = services.find((service) => service.slug === activeSlug) ?? services[0];

  if (!active) return null;

  return (
    <section id="services" className="scroll-mt-24 border-b border-border py-16 md:py-24">
      <Container>
        <h2 className="mb-8 text-2xl font-semibold text-text md:text-3xl">{heading}</h2>

        <div role="tablist" aria-label={heading} className="mb-8 flex flex-wrap gap-2 border-b border-border">
          {services.map((service) => (
            <button
              key={service.slug}
              role="tab"
              type="button"
              aria-selected={service.slug === active.slug}
              onClick={() => setActiveSlug(service.slug)}
              className={`min-h-11 border-b-2 px-4 text-sm font-medium transition-colors ${
                service.slug === active.slug
                  ? "border-primary text-text"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-text-muted">{active.summary}</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-text">
              {active.deliverables.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-primary">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={`/services/${active.slug}`}
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              자세히 보기 <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ServiceVisual service={active} />
        </div>
      </Container>
    </section>
  );
}
