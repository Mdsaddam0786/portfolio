"use client";

import { AdaptiveDpr, Float, PerformanceMonitor, Sparkles, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useState } from "react";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
import { NeonRings } from "./NeonRings";
import { PhotoCard } from "./PhotoCard";

export default function HeroScene() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [degraded, setDegraded] = useState(false);
  const animate = !reduced;

  return (
    <Canvas
      camera={{ position: [0, 0, 7.2], fov: 45 }}
      dpr={mobile || degraded ? [1, 1.25] : [1, 1.75]}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <color attach="background" args={["#05060f"]} />
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 4]} intensity={14} color="#8b5cf6" />
      <pointLight position={[-3, -2, 3]} intensity={6} color="#22d3ee" />

      <Suspense fallback={null}>
        <Float
          speed={animate ? 1.6 : 0}
          rotationIntensity={0.15}
          floatIntensity={animate ? 0.6 : 0}
        >
          <PhotoCard interactive={animate} />
        </Float>
      </Suspense>

      <NeonRings animate={animate} />
      <Stars
        radius={60}
        depth={40}
        count={mobile ? 1200 : 3000}
        factor={3}
        fade
        speed={animate ? 0.6 : 0}
      />
      <Sparkles
        count={mobile ? 40 : 90}
        scale={[8, 6, 4]}
        size={2.2}
        speed={animate ? 0.4 : 0}
        color="#a78bfa"
      />

      {!degraded && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.2} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
