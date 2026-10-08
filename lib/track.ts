export type TrackEvent =
  | "click_phone"
  | "click_kakao"
  | "open_contact_modal"
  | "generate_lead"
  | "download_brochure"
  | "case_filter"
  | "case_view";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: TrackEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
