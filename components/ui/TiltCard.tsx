"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { useHasFinePointer, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const finePointer = useHasFinePointer();
  const reduced = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(400px circle at ${gx}% ${gy}%, rgb(139 92 246 / 0.18), transparent 60%)`;
  const enabled = finePointer && !reduced;

  return (
    <motion.div
      className={cn("relative [transform-style:preserve-3d]", className)}
      style={enabled ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      onPointerMove={(e) => {
        if (!enabled) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 12);
        rx.set(-(py - 0.5) * 12);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
      {enabled && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glare }}
        />
      )}
    </motion.div>
  );
}
