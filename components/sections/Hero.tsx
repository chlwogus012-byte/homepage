"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";

type HeroProps = {
  wordmark: string;
  circleCopy: string;
};

const letterVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const wordVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export function Hero({ wordmark, circleCopy }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const letters = Array.from(wordmark);
  const words = circleCopy.split(" ");

  return (
    <section className="relative overflow-hidden border-b border-border bg-inverse-background py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="whitespace-nowrap font-black uppercase leading-none tracking-tight text-inverse-text/5"
          style={{ fontSize: "clamp(6rem, 24vw, 22rem)" }}
        >
          {wordmark}
        </span>
      </div>

      <Container className="relative flex flex-col items-center gap-14 md:gap-20">
        <h1
          aria-label={wordmark}
          className="w-full text-center font-black uppercase leading-none tracking-tight text-inverse-text"
          style={{ fontSize: "clamp(2.25rem, 9vw, 7.5rem)" }}
        >
          {reduceMotion ? (
            wordmark
          ) : (
            <motion.span
              aria-hidden="true"
              className="inline-flex"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.035, delayChildren: 0.1 }}
            >
              {letters.map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  variants={letterVariants}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {char === " " ? " " : char}
                </motion.span>
              ))}
            </motion.span>
          )}
        </h1>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex aspect-square w-[240px] shrink-0 items-center justify-center rounded-full bg-background px-8 text-center shadow-lg sm:w-[320px] md:w-[420px] lg:w-[480px]"
        >
          <div className="float-loop">
            <p className="text-balance text-base font-bold leading-snug tracking-tight text-text sm:text-lg md:text-xl lg:text-2xl">
              {reduceMotion ? (
                circleCopy
              ) : (
                <motion.span
                  className="inline"
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.09, delayChildren: 1.1 }}
                >
                  {words.map((word, index) => (
                    <motion.span
                      key={`${word}-${index}`}
                      variants={wordVariants}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block"
                    >
                      {word}
                      {index < words.length - 1 ? " " : ""}
                    </motion.span>
                  ))}
                </motion.span>
              )}
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
