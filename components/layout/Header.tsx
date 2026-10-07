"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NavItem, Site } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { NavLink } from "@/components/ui/NavLink";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";

type HeaderProps = {
  site: Site;
  navigation: NavItem[];
};

export function Header({ site, navigation }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-background transition-[padding] ${
        scrolled ? "py-2" : "py-4"
      }`}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <Container className="flex items-center justify-between gap-6">
        <Link
          href="/"
          className="text-lg font-bold text-text"
          onClick={() => setMegaOpen(false)}
        >
          {site.companyName}
        </Link>

        <nav
          aria-label="주 메뉴"
          className="hidden items-center gap-8 md:flex"
          onMouseEnter={() => setMegaOpen(true)}
          onFocus={() => setMegaOpen(true)}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-text hover:text-primary"
            >
              {item.label}
              {item.badge ? <Badge>N</Badge> : null}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${site.phone}`}
            className="hidden text-sm font-semibold text-text md:block"
          >
            {site.phone}
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-text md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </Container>

      <MegaMenu
        navigation={navigation}
        open={megaOpen}
        onNavigate={() => setMegaOpen(false)}
      />
      <MobileMenu
        site={site}
        navigation={navigation}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
