"use client";

import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { profile } from "@/data/profile";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Cutout with a soft bottom fade and a two-tone rim light picked up from the orb behind.
const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uTexel;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    if (tex.a < 0.02) discard;

    float left = clamp(tex.a - texture2D(uMap, vUv + vec2(-uTexel.x, 0.0) * 5.0).a, 0.0, 1.0);
    float right = clamp(tex.a - texture2D(uMap, vUv + vec2(uTexel.x, 0.0) * 5.0).a, 0.0, 1.0);
    float top = clamp(tex.a - texture2D(uMap, vUv + vec2(0.0, uTexel.y) * 5.0).a, 0.0, 1.0);

    vec3 cyan = vec3(0.133, 0.827, 0.933);
    vec3 purple = vec3(0.65, 0.48, 1.0);
    vec3 color = tex.rgb;
    color += cyan * left * 0.55 + purple * (right + top) * 0.6;

    float fade = smoothstep(0.0, 0.2, vUv.y);
    gl_FragColor = vec4(color, tex.a * fade);
    #include <colorspace_fragment>
  }
`;

export function Portrait({ height = 3.7 }: { height?: number }) {
  const texture = useTexture(profile.photo, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });

  const { width, uniforms } = useMemo(() => {
    const img = texture.image as { width: number; height: number };
    return {
      width: height * (img.width / img.height),
      uniforms: {
        uMap: { value: texture },
        uTexel: { value: new THREE.Vector2(1 / img.width, 1 / img.height) },
      },
    };
  }, [texture, height]);

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        toneMapped={false}
      />
    </mesh>
  );
}
