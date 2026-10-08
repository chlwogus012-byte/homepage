"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

export function CaseViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track("case_view", { slug });
  }, [slug]);

  return null;
}
