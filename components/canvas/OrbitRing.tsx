"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

type Props = {
  radius: number;
  rotation: [number, number, number];
  speed: number;
  satellites: { offset: number; color: [number, number, number]; size: number }[];
  animate: boolean;
};

// A hairline orbit with glowing satellites that pass behind and in front of the portrait.
export function OrbitRing({ radius, rotation, speed, satellites, animate }: Props) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const angle = useRef(0);

  useFrame((_, delta) => {
    if (animate) angle.current += delta * speed;
    satellites.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      const a = angle.current + s.offset;
      m.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    });
  });

  return (
    <group rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, 0.0045, 8, 256]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      {satellites.map((s, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
        >
          <sphereGeometry args={[s.size, 16, 16]} />
          <meshBasicMaterial color={s.color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
