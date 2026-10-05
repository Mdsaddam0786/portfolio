"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useHasFinePointer, useReducedMotion } from "@/lib/hooks";

export function Cursor() {
  const finePointer = useHasFinePointer();
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });
  const [hovering, setHovering] = useState(false);

  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest("a, button, [role='button'], input, textarea, select"));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="bg-accent absolute top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ x, y }}
      />
      <motion.div
        className="border-primary-light/70 shadow-glow-sm absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,background-color] duration-200"
        style={{
          x: ringX,
          y: ringY,
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          backgroundColor: hovering ? "rgb(139 92 246 / 0.12)" : "transparent",
        }}
      />
    </div>
  );
}
