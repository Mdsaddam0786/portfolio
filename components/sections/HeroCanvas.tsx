"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="bg-primary/10 shadow-glow h-64 w-52 animate-pulse rounded-3xl" />
    </div>
  ),
});

export function HeroCanvas() {
  return <HeroScene />;
}
