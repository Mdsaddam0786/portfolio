"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Props = { value: string; label: string; className?: string; delay?: number };

// Glass badge floating over the 3D hero; desktop only so it never covers the face on phones.
export function HeroStatChip({ value, label, className, delay = 0 }: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
      transition={
        reduced
          ? { duration: 0.4, delay }
          : {
              opacity: { duration: 0.6, delay: delay + 0.6 },
              y: { duration: 5, delay, repeat: Infinity, ease: "easeInOut" },
            }
      }
      className={cn(
        "pointer-events-none absolute z-10 hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 whitespace-nowrap shadow-[0_8px_32px_rgb(0_0_0/0.4)] backdrop-blur-md md:flex",
        className,
      )}
    >
      <span aria-hidden="true" className="bg-gradient-brand h-9 w-1 rounded-full" />
      <span>
        <span className="font-display block text-lg leading-none font-bold text-white">
          {value}
        </span>
        <span className="text-muted mt-1.5 block text-[11px] tracking-wider uppercase">
          {label}
        </span>
      </span>
    </motion.div>
  );
}
