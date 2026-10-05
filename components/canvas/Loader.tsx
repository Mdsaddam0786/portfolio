"use client";

import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const R = 44;
const C = 2 * Math.PI * R;

export function Loader() {
  const { progress, active } = useProgress();
  const [timedOut, setTimedOut] = useState(false);

  // Never trap visitors behind the loader if an asset stalls.
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const done = timedOut || (!active && progress >= 100);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label={`Loading ${Math.round(progress)}%`}
          className="bg-bg fixed inset-0 z-[90] grid place-items-center"
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <div className="relative grid place-items-center">
            <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
              <defs>
                <linearGradient id="loader-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke="rgb(255 255 255 / 0.08)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke="url(#loader-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={C}
                strokeDashoffset={C - (C * progress) / 100}
                style={{
                  transition: "stroke-dashoffset 0.3s ease",
                  filter: "drop-shadow(0 0 6px #8b5cf6)",
                }}
              />
            </svg>
            <span className="absolute font-mono text-lg text-white">{Math.round(progress)}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
