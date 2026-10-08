"use client";

import { useState } from "react";
import type { NavItem, Site } from "@/lib/schema";
import { Badge } from "@/components/ui/Badge";
import { NavLink } from "@/components/ui/NavLink";
import { track } from "@/lib/track";

type MobileMenuProps = {
  site: Site;
  navigation: NavItem[];
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ site, navigation, open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-background md:hidden">
      <nav aria-label="전체 메뉴" className="flex-1 px-6 py-4">
        <ul className="flex flex-col">
          {navigation.map((item) => {
            const isExpanded = expanded === item.label;
            return (
              <li key={item.label} className="border-b border-border">
                <div className="flex items-center justify-between">
                  <NavLink
                    href={item.href}
                    onClick={onClose}
                    className="flex-1 py-3 text-base font-semibold text-text"
                  >
                    {item.label}
                    {item.badge ? <Badge>N</Badge> : null}
                  </NavLink>
                  {item.children && item.children.length > 0 ? (
                    <button
                      type="button"
                      aria-label={`${item.label} 하위 메뉴 ${isExpanded ? "닫기" : "열기"}`}
                      aria-expanded={isExpanded}
                      className="flex h-11 w-11 shrink-0 items-center justify-center text-text-muted"
                      onClick={() => setExpanded(isExpanded ? null : item.label)}
                    >
                      {isExpanded ? "−" : "+"}
                    </button>
                  ) : null}
                </div>
                {isExpanded && item.children ? (
                  <ul className="flex flex-col gap-1 pb-3 pl-4">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <NavLink
                          href={child.href}
                          onClick={onClose}
                          className="block py-2 text-sm text-text-muted"
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="grid grid-cols-2 gap-3 border-t border-border p-6">
        <a
          href={`tel:${site.phone}`}
          onClick={() => track("click_phone", { source: "mobile_menu" })}
          className="flex min-h-11 items-center justify-center rounded-sm border border-border text-sm font-semibold text-text"
        >
          전화 상담
        </a>
        <a
          href={site.kakaoChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("click_kakao", { source: "mobile_menu" })}
          className="flex min-h-11 items-center justify-center rounded-sm bg-primary text-sm font-semibold text-primary-foreground"
        >
          카톡 상담
        </a>
      </div>
    </div>
  );
}
