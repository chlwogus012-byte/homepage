"use client";

import { useContactModal } from "@/components/forms/ContactModalProvider";

type CtaBannerProps = {
  heading: string;
  description?: string;
  source: string;
};

export function CtaBanner({ heading, description, source }: CtaBannerProps) {
  const { openContactModal } = useContactModal();

  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-border bg-surface p-8 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-text md:text-2xl">{heading}</h2>
        {description ? <p className="mt-2 text-sm text-text-muted">{description}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => openContactModal(source)}
        className="flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground"
      >
        상담 신청하기 <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
