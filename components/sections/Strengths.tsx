"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Container } from "@/components/ui/Container";

type StrengthPoint = { number: string; title: string; description: string };

type StrengthsProps = {
  heading: string;
  points: StrengthPoint[];
};

export function Strengths({ heading, points }: StrengthsProps) {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <section className="border-b border-border py-16 md:py-24">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text md:text-3xl">{heading}</h2>
          <p className="text-sm font-medium text-text-muted">
            {String(active + 1).padStart(2, "0")} / {String(points.length).padStart(2, "0")}
          </p>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView={1.1}
          speed={reducedMotion ? 0 : 300}
          breakpoints={{ 768: { slidesPerView: 2.2 }, 1280: { slidesPerView: 3.2 } }}
          onSlideChange={(swiper: SwiperInstance) => setActive(swiper.activeIndex)}
          style={{ "--swiper-navigation-color": "var(--text)" } as CSSProperties}
        >
          {points.map((point) => (
            <SwiperSlide key={point.number}>
              <div className="flex h-full flex-col gap-4 rounded-lg border border-border bg-surface p-6">
                <span className="text-3xl font-bold text-primary">{point.number}</span>
                <h3 className="text-lg font-semibold text-text">{point.title}</h3>
                <p className="text-sm text-text-muted">{point.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}
