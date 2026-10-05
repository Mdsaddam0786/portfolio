"use client";

import { AdaptiveDpr, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
import { VoxelPortrait } from "./VoxelPortrait";

const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Soft two-tone aura behind the portrait (replaces the old orb).
const glowFragment = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float purple = smoothstep(0.62, 0.0, length(p - vec2(-0.04, 0.06)));
    float cyan = smoothstep(0.55, 0.0, length(p - vec2(0.12, -0.12)));
    vec3 col = vec3(0.486, 0.227, 0.929) * pow(purple, 3.0) * 0.32
      + vec3(0.133, 0.827, 0.933) * pow(cyan, 3.0) * 0.14;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Aura() {
  const uniforms = useMemo(() => ({}), []);
  return (
    <mesh position={[0, 0.3, -2.5]} scale={12}>
      <planeGeometry />
      <shaderMaterial
        vertexShader={glowVertex}
        fragmentShader={glowFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function HeroScene() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [degraded, setDegraded] = useState(false);
  const animate = !reduced;

  return (
    <Canvas
      camera={{ position: [0, 0, 7.2], fov: 45 }}
      dpr={mobile || degraded ? [1, 1.5] : [1, 2]}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <color attach="background" args={["#05060f"]} />
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated />

      {/* Neutral key light keeps cube faces true to the photo; coloured rims light their sides. */}
      <ambientLight intensity={1.7} />
      <directionalLight position={[0, 1, 6]} intensity={1.3} />
      <pointLight position={[-4, 1.5, 2]} intensity={40} color="#8b5cf6" />
      <pointLight position={[4, -1, 2]} intensity={30} color="#22d3ee" />

      <Aura />

      <Suspense fallback={null}>
        <group position={[0, -0.35, 0]}>
          <VoxelPortrait height={mobile ? 4.4 : 4.9} columns={mobile ? 42 : 60} animate={animate} />
        </group>
      </Suspense>

      <Sparkles
        count={mobile ? 30 : 60}
        scale={[8, 6, 3]}
        size={1.3}
        speed={animate ? 0.25 : 0}
        opacity={0.45}
        color="#c4b5fd"
      />
    </Canvas>
  );
}
