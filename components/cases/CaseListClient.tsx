"use client";

import { useMemo, useState } from "react";
import { CaseCard } from "@/components/cases/CaseCard";
import type { CaseFrontmatter, Service } from "@/lib/schema";
import { track } from "@/lib/track";

type StatusFilter = "all" | CaseFrontmatter["status"];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "ongoing", label: "진행중" },
  { value: "done", label: "완료" },
];

type CaseListClientProps = {
  cases: CaseFrontmatter[];
  services: Service[];
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function CaseListClient({ cases, services }: CaseListClientProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");

  const serviceLabels = useMemo(
    () => Object.fromEntries(services.map((service) => [service.slug, service.title])),
    [services],
  );

  const industries = useMemo(
    () => Array.from(new Set(cases.map((caseItem) => caseItem.industry))),
    [cases],
  );

  const servicesInUse = useMemo(
    () => services.filter((service) => cases.some((caseItem) => caseItem.services.includes(service.slug))),
    [services, cases],
  );

  const filtered = cases.filter((caseItem) => {
    if (status !== "all" && caseItem.status !== status) return false;
    if (selectedServices.length > 0 && !caseItem.services.some((slug) => selectedServices.includes(slug))) {
      return false;
    }
    if (selectedIndustries.length > 0 && !selectedIndustries.includes(caseItem.industry)) return false;
    return true;
  });

  function onToggleService(slug: string) {
    setSelectedServices((prev) => {
      const next = toggle(prev, slug);
      track("case_filter", { type: "service", value: slug, active: next.includes(slug) });
      return next;
    });
  }

  function onToggleIndustry(industry: string) {
    setSelectedIndustries((prev) => {
      const next = toggle(prev, industry);
      track("case_filter", { type: "industry", value: industry, active: next.includes(industry) });
      return next;
    });
  }

  function onChangeStatus(value: StatusFilter) {
    setStatus(value);
    track("case_filter", { type: "status", value });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-8">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={status === option.value}
              onClick={() => onChangeStatus(option.value)}
              className={`min-h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                status === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-text-muted hover:text-text"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {servicesInUse.map((service) => (
            <button
              key={service.slug}
              type="button"
              aria-pressed={selectedServices.includes(service.slug)}
              onClick={() => onToggleService(service.slug)}
              className={`min-h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                selectedServices.includes(service.slug)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-text-muted hover:text-text"
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {industries.map((industry) => (
            <button
              key={industry}
              type="button"
              aria-pressed={selectedIndustries.includes(industry)}
              onClick={() => onToggleIndustry(industry)}
              className={`min-h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                selectedIndustries.includes(industry)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-text-muted hover:text-text"
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      <p className="py-6 text-sm text-text-muted">전체 {filtered.length}건</p>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((caseItem) => (
            <CaseCard key={caseItem.slug} caseItem={caseItem} serviceLabels={serviceLabels} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-text-muted">조건에 맞는 사례가 없습니다.</p>
      )}
    </div>
  );
}
