"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = { value: number; prefix?: string; suffix?: string };

export function Counter({ value, prefix = "", suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
