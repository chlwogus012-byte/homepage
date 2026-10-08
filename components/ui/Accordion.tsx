"use client";

import { useState } from "react";

type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
};

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `accordion-panel-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-text"
              >
                {item.question}
                <span aria-hidden="true" className="shrink-0 text-text-muted">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            {isOpen ? (
              <div id={panelId} className="pb-4 text-sm text-text-muted">
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
