"use client";

import { AdaptiveDpr, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
import { EnergyOrb } from "./EnergyOrb";
import { OrbitRing } from "./OrbitRing";
import { PixelPortrait } from "./PixelPortrait";

const CYAN: [number, number, number] = [0.4, 2.6, 3];
const VIOLET: [number, number, number] = [1.8, 1.1, 3];

/** Layers drift by different amounts with the pointer, giving real depth. */
function Parallax({ depth, children }: { depth: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const { x, y } = state.pointer;
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, x * depth, 3, delta);
    ref.current.position.y = THREE.MathUtils.damp(
      ref.current.position.y,
      y * depth * 0.6,
      3,
      delta,
    );
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [degraded, setDegraded] = useState(false);
  const animate = !reduced;
  const depth = animate ? 1 : 0;

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

      <group position={[0, -0.15, 0]}>
        <Parallax depth={-0.18 * depth}>
          <group position={[0, 0.55, -1.4]}>
            <EnergyOrb animate={animate} />
          </group>
        </Parallax>

        <Parallax depth={-0.06 * depth}>
          <group position={[0, -0.25, -0.3]}>
            <OrbitRing
              radius={2.35}
              rotation={[1.28, 0.18, -0.32]}
              speed={0.35}
              animate={animate}
              satellites={[
                { offset: 0, color: CYAN, size: 0.045 },
                { offset: 2.4, color: VIOLET, size: 0.03 },
              ]}
            />
            <OrbitRing
              radius={2.75}
              rotation={[1.1, -0.35, 0.5]}
              speed={-0.22}
              animate={animate}
              satellites={[{ offset: 1.2, color: VIOLET, size: 0.035 }]}
            />
          </group>
        </Parallax>

        <Parallax depth={0.1 * depth}>
          <Suspense fallback={null}>
            <group position={[0, -0.35, 0.3]}>
              <PixelPortrait height={3.75} columns={mobile ? 150 : 250} animate={animate} />
            </group>
          </Suspense>
        </Parallax>
      </group>

      <Sparkles
        count={mobile ? 30 : 70}
        scale={[7, 6, 3]}
        size={1.4}
        speed={animate ? 0.25 : 0}
        opacity={0.5}
        color="#c4b5fd"
      />

      {!degraded && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.75} luminanceThreshold={1} luminanceSmoothing={0.25} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
