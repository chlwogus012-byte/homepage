"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Service } from "@/lib/schema";

type ServicesTabsProps = {
  heading: string;
  services: Service[];
};

export function ServicesTabs({ heading, services }: ServicesTabsProps) {
  const [activeSlug, setActiveSlug] = useState(services[0]?.slug);
  const active = services.find((service) => service.slug === activeSlug) ?? services[0];

  if (!active) return null;

  return (
    <section className="border-b border-border py-16 md:py-24">
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
          <div className="aspect-video rounded-lg border border-border bg-surface" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
