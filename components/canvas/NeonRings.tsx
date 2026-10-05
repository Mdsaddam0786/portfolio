"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

// Emissive values above 1 + toneMapped={false} make the rings bloom.
const PURPLE: [number, number, number] = [0.55 * 3, 0.36 * 3, 0.97 * 3];
const CYAN: [number, number, number] = [0.13 * 3, 0.83 * 3, 0.93 * 3];

export function NeonRings({ animate }: { animate: boolean }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!animate) return;
    if (a.current) a.current.rotation.z += delta * 0.25;
    if (b.current) {
      b.current.rotation.x += delta * 0.18;
      b.current.rotation.y += delta * 0.12;
    }
    if (c.current) c.current.rotation.z -= delta * 0.15;
  });

  return (
    <group position={[0, 0.1, -1.2]}>
      <mesh ref={a} rotation={[0.2, 0.3, 0]}>
        <torusGeometry args={[2.4, 0.018, 16, 160]} />
        <meshBasicMaterial color={PURPLE} toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[1.2, 0, 0.4]}>
        <torusGeometry args={[2.85, 0.012, 16, 180]} />
        <meshBasicMaterial color={CYAN} toneMapped={false} />
      </mesh>
      <mesh ref={c} rotation={[-0.5, 0.6, 0]}>
        <torusGeometry args={[3.3, 0.008, 16, 200]} />
        <meshBasicMaterial color={PURPLE} toneMapped={false} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
