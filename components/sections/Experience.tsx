"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { HiOutlineAcademicCap, HiOutlineBriefcase } from "react-icons/hi";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { timeline } from "@/data/experience";
import { cn } from "@/lib/utils";

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading id="experience-title" eyebrow="Journey" title="Experience & Education" />

        <div className="relative ml-4 md:mx-auto md:max-w-4xl">
          {/* track + glowing progress line */}
          <div
            aria-hidden="true"
            className="bg-line absolute top-0 bottom-0 left-0 w-px md:left-1/2"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY }}
            className="from-primary to-accent absolute top-0 bottom-0 left-0 w-px origin-top bg-gradient-to-b shadow-[0_0_12px_#8b5cf6] md:left-1/2"
          />

          <ol ref={listRef}>
            {timeline.map((item, i) => {
              const Icon = item.kind === "work" ? HiOutlineBriefcase : HiOutlineAcademicCap;
              const right = i % 2 === 1;
              return (
                <li
                  key={`${item.org}-${item.period}`}
                  className="relative mb-12 pl-10 last:mb-0 md:grid md:grid-cols-2 md:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className="bg-gradient-brand shadow-glow absolute top-1 left-0 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full text-white md:left-1/2"
                  >
                    <Icon />
                  </span>
                  <Reveal
                    y={30}
                    className={cn(
                      "glass neon-border rounded-2xl p-6",
                      right ? "md:col-start-2 md:ml-10" : "md:mr-10",
                    )}
                  >
                    <p className="text-accent font-mono text-xs tracking-wider">
                      {item.period}
                      {item.current && (
                        <span className="ml-2 rounded-full bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
                          Current
                        </span>
                      )}
                    </p>
                    <h3 className="font-display mt-2 text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-primary-light text-sm">
                      {item.org}
                      {item.location && <span className="text-muted"> · {item.location}</span>}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {item.points.map((pt) => (
                        <li key={pt} className="text-muted flex gap-2 text-sm leading-relaxed">
                          <span
                            aria-hidden="true"
                            className="bg-accent mt-2 h-1 w-1 shrink-0 rounded-full"
                          />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
