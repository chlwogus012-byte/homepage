"use client";

import type { Site } from "@/lib/schema";
import { useContactModal } from "@/components/forms/ContactModalProvider";
import { track } from "@/lib/track";

type MobileCtaBarProps = {
  site: Site;
};

export function MobileCtaBar({ site }: MobileCtaBarProps) {
  const { openContactModal } = useContactModal();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-border bg-surface md:hidden">
      <a
        href={`tel:${site.phone}`}
        onClick={() => track("click_phone", { source: "mobile_cta_bar" })}
        className="flex min-h-14 flex-col items-center justify-center text-xs font-medium text-text"
      >
        전화
      </a>
      <a
        href={site.kakaoChatUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("click_kakao", { source: "mobile_cta_bar" })}
        className="flex min-h-14 flex-col items-center justify-center border-x border-border text-xs font-medium text-text"
      >
        카톡
      </a>
      <button
        type="button"
        onClick={() => openContactModal("mobile_cta_bar")}
        className="flex min-h-14 flex-col items-center justify-center bg-primary text-xs font-semibold text-primary-foreground"
      >
        상담신청
      </button>
    </div>
  );
}
