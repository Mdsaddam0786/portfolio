"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { profile } from "@/data/profile";

const CARD_W = 2.6;
const CARD_H = 3.3;
const RADIUS = 0.28;

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// Purple → cyan diagonal gradient with HDR intensity so Bloom picks it up.
const borderShader = {
  uniforms: { uTime: { value: 0 }, uIntensity: { value: 2.2 } },
  vertexShader: /* glsl */ `
    varying vec2 vPos;
    void main() {
      vPos = position.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vPos;
    void main() {
      float t = 0.5 + 0.5 * sin((vPos.x * 0.6 + vPos.y * 0.45) + uTime * 0.8);
      vec3 purple = vec3(0.545, 0.361, 0.965);
      vec3 cyan = vec3(0.133, 0.827, 0.933);
      gl_FragColor = vec4(mix(purple, cyan, t) * uIntensity, 1.0);
    }
  `,
};

export function PhotoCard({ interactive }: { interactive: boolean }) {
  const group = useRef<THREE.Group>(null);
  const borderMat = useRef<THREE.ShaderMaterial>(null);
  const texture = useTexture(profile.photo, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
  });

  const { panel, border, photoSize } = useMemo(() => {
    const img = texture.image as { width: number; height: number };
    const aspect = img.width / img.height;
    // Photo is wider than the card's inner area and pokes out above it.
    const h = CARD_H * 1.12;
    return {
      panel: new THREE.ShapeGeometry(roundedRect(CARD_W, CARD_H, RADIUS), 12),
      border: new THREE.ShapeGeometry(roundedRect(CARD_W + 0.06, CARD_H + 0.06, RADIUS + 0.03), 12),
      photoSize: [h * aspect, h] as const,
    };
  }, [texture]);

  useFrame((state, delta) => {
    if (borderMat.current) borderMat.current.uniforms.uTime.value += delta;
    if (!group.current || !interactive) return;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.35, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.2, 4, delta);
  });

  const [pw, ph] = photoSize;

  return (
    <group ref={group}>
      <mesh geometry={border} position-z={-0.02}>
        <shaderMaterial ref={borderMat} args={[borderShader]} toneMapped={false} />
      </mesh>
      <mesh geometry={panel} position-z={-0.01}>
        <meshStandardMaterial
          color="#120d2b"
          roughness={0.55}
          metalness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Bottom edge aligned with the card's bottom, head breaks out the top. */}
      <mesh position={[0, -CARD_H / 2 + ph / 2, 0.12]}>
        <planeGeometry args={[pw, ph]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} alphaTest={0.02} />
      </mesh>
    </group>
  );
}
