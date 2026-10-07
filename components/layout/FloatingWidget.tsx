"use client";

import { useEffect, useState } from "react";
import type { Site } from "@/lib/schema";
import { Button } from "@/components/ui/Button";

type FloatingWidgetProps = {
  site: Site;
};

export function FloatingWidget({ site }: FloatingWidgetProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 md:flex">
      {contactOpen ? (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 shadow-lg">
          <Button href="/contact" variant="secondary" onClick={() => setContactOpen(false)}>
            상담접수
          </Button>
          <a
            href={site.kakaoChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center rounded-sm border border-border px-5 text-sm font-medium text-text hover:bg-background"
          >
            카톡상담
          </a>
          <a
            href={`tel:${site.phone}`}
            className="flex min-h-11 items-center justify-center rounded-sm border border-border px-5 text-sm font-medium text-text hover:bg-background"
          >
            전화상담
          </a>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={contactOpen}
        onClick={() => setContactOpen((value) => !value)}
        className="flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg"
      >
        상담문의
      </button>

      <a
        href={site.brochurePdf}
        className="flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-text shadow"
      >
        소개서 다운로드
      </a>

      {showTop ? (
        <a
          href="#top"
          aria-label="맨 위로"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-text shadow"
        >
          ↑
        </a>
      ) : null}
    </div>
  );
}
