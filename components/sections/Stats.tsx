"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import type { Stat } from "@/lib/schema";

type StatsProps = {
  heading: string;
  stats: Stat[];
};

function useCountUp(target: number, start: boolean): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 0 : 1200;
    const startTime = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return value;
}

function StatTile({ stat, start }: { stat: Stat; start: boolean }) {
  const value = useCountUp(stat.value, start);

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-6">
      <span className="text-3xl font-bold text-text md:text-4xl">
        {value.toLocaleString()}
        {stat.suffix}
      </span>
      <span className="text-sm text-text-muted">{stat.label}</span>
    </div>
  );
}

export function Stats({ heading, stats }: StatsProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-b border-border py-16 md:py-24">
      <Container>
        <h2 className="mb-8 text-2xl font-semibold text-text md:text-3xl">{heading}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <StatTile key={stat.key} stat={stat} start={inView} />
          ))}
        </div>
      </Container>
    </section>
  );
}
