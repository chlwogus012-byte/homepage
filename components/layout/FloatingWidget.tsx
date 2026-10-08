"use client";

import { useEffect, useState } from "react";
import type { Site } from "@/lib/schema";
import { useContactModal } from "@/components/forms/ContactModalProvider";
import { track } from "@/lib/track";

type FloatingWidgetProps = {
  site: Site;
};

export function FloatingWidget({ site }: FloatingWidgetProps) {
  const { openContactModal } = useContactModal();
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
          <button
            type="button"
            onClick={() => {
              setContactOpen(false);
              openContactModal("floating_widget");
            }}
            className="flex min-h-11 items-center justify-center rounded-sm border border-border px-5 text-sm font-medium text-text hover:bg-background"
          >
            상담접수
          </button>
          <a
            href={site.kakaoChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("click_kakao", { source: "floating_widget" })}
            className="flex min-h-11 items-center justify-center rounded-sm border border-border px-5 text-sm font-medium text-text hover:bg-background"
          >
            카톡상담
          </a>
          <a
            href={`tel:${site.phone}`}
            onClick={() => track("click_phone", { source: "floating_widget" })}
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
        onClick={() => track("download_brochure", { source: "floating_widget" })}
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
