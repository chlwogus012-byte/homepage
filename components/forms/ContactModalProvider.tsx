"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { ContactForm } from "@/components/forms/ContactForm";
import type { FormDefinition } from "@/lib/schema";
import { track } from "@/lib/track";

type ContactModalContextValue = {
  openContactModal: (source: string) => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function useContactModal(): ContactModalContextValue {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
}

type ContactModalProviderProps = {
  formDef: FormDefinition;
  children: ReactNode;
};

export function ContactModalProvider({ formDef, children }: ContactModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("modal");

  const openContactModal = useCallback((src: string) => {
    setSource(src);
    setIsOpen(true);
    track("open_contact_modal", { source: src });
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContactModalContext.Provider value={{ openContactModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={close} title="상담 신청">
        <ContactForm formDef={formDef} source={source} />
      </Modal>
    </ContactModalContext.Provider>
  );
}
