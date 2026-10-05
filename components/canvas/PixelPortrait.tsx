"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { profile } from "@/data/profile";

type Props = { height?: number; columns: number; animate: boolean };

const ASSEMBLE_SECONDS = 2.8;
const SCATTER_SECONDS = 0.9;
const HOVER_RADIUS = 0.58;

/** Shared GLSL: how strongly the cursor pushes a point at `p` out of the image. */
const influence = /* glsl */ `
  float influence(vec2 p, vec2 mouse, float radius, float hover) {
    float d = distance(p, mouse);
    return (1.0 - smoothstep(0.0, radius, d)) * hover;
  }
`;

const pointsVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPointScale;
  uniform float uCell;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uRadius;
  attribute vec3 aStart;
  attribute vec2 aUv;
  attribute float aDelay;
  attribute float aRand;
  varying vec2 vUv;
  varying float vFlight;
  varying float vInfl;
  ${influence}

  float easeOutCubic(float x) { return 1.0 - pow(1.0 - x, 3.0); }

  void main() {
    vUv = aUv;
    vec3 target = position;

    // Staggered assembly: each pixel starts after its delay, then eases home.
    float t = clamp((uProgress - aDelay * 0.45) / 0.55, 0.0, 1.0);
    float e = easeOutCubic(t);
    float flight = 1.0 - e;

    // Swirl around the vertical axis while travelling.
    float ang = flight * (2.2 + aRand * 1.5);
    vec3 s = aStart;
    vec3 swirled = vec3(s.x * cos(ang) - s.z * sin(ang), s.y, s.x * sin(ang) + s.z * cos(ang));
    vec3 pos = mix(swirled, target, e);

    // Cursor breaks the nearby image back into floating pixels.
    float infl = influence(target.xy, uMouse, uRadius, uHover) * e;
    vec2 dir = normalize(target.xy - uMouse + 0.0001);
    pos.xy += dir * infl * (0.06 + aRand * 0.14);
    pos.z += infl * (0.6 + aRand * 1.4);
    pos += vec3(sin(uTime * 1.7 + aRand * 40.0), cos(uTime * 1.3 + aRand * 30.0), 0.0) * infl * 0.05;

    vFlight = flight;
    vInfl = infl;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    // Assembled pixels tile seamlessly; flying ones shrink for a sparkly trail.
    float size = uCell * (1.08 - flight * 0.45 - infl * 0.25);
    gl_PointSize = max(size * uPointScale / -mv.z, 1.0);
  }
`;

const pointsFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uSolid;
  varying vec2 vUv;
  varying float vFlight;
  varying float vInfl;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    vec3 purple = vec3(0.545, 0.361, 0.965);
    vec3 cyan = vec3(0.133, 0.827, 0.933);
    vec3 accent = mix(purple, cyan, vUv.y);
    float energy = max(vFlight, vInfl);
    // Pixels glow with the brand colours while they're in motion (bloom picks up > 1.0).
    vec3 color = mix(tex.rgb, accent * 1.6, energy * 0.32);
    // Once the HD photo is in place, only the disturbed pixels stay visible.
    float visible = max(1.0 - uSolid, smoothstep(0.02, 0.25, vInfl));
    gl_FragColor = vec4(color, visible);
    #include <colorspace_fragment>
  }
`;

const planeVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vPos;
  void main() {
    vUv = uv;
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// The full-resolution photo, with a hole where the cursor has pulled pixels out.
const planeFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uTexel;
  uniform float uSolid;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec2 vPos;
  ${influence}

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    if (tex.a < 0.02) discard;

    float left = clamp(tex.a - texture2D(uMap, vUv + vec2(-uTexel.x, 0.0) * 6.0).a, 0.0, 1.0);
    float right = clamp(tex.a - texture2D(uMap, vUv + vec2(uTexel.x, 0.0) * 6.0).a, 0.0, 1.0);
    float top = clamp(tex.a - texture2D(uMap, vUv + vec2(0.0, uTexel.y) * 6.0).a, 0.0, 1.0);
    vec3 cyan = vec3(0.133, 0.827, 0.933);
    vec3 purple = vec3(0.65, 0.48, 1.0);
    vec3 color = tex.rgb + cyan * left * 0.5 + purple * (right + top) * 0.55;

    float hole = smoothstep(0.02, 0.25, influence(vPos, uMouse, uRadius, uHover));
    float fade = smoothstep(0.0, 0.18, vUv.y);
    float a = tex.a * fade * uSolid * (1.0 - hole);
    if (a < 0.01) discard;
    gl_FragColor = vec4(color, a);
    #include <colorspace_fragment>
  }
`;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sample opaque pixels of the cutout on a grid → particle targets + scattered starts. */
function buildParticles(
  image: CanvasImageSource & { width: number; height: number },
  columns: number,
  width: number,
  height: number,
) {
  const rows = Math.round(columns * (image.height / image.width));
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(image, 0, 0, columns, rows);
  const { data } = ctx.getImageData(0, 0, columns, rows);

  const rand = mulberry32(7);
  const pos: number[] = [];
  const start: number[] = [];
  const uvs: number[] = [];
  const delays: number[] = [];
  const rnds: number[] = [];
  const cell = width / columns;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const alpha = data[(y * columns + x) * 4 + 3];
      const v = 1 - (y + 0.5) / rows;
      // Skip transparent pixels and the faded-out bottom strip.
      if (alpha < 128 || v < 0.06) continue;
      const u = (x + 0.5) / columns;
      const px = (u - 0.5) * width;
      const py = (v - 0.5) * height;
      pos.push(px, py, 0);
      uvs.push(u, v);

      // Burst outward from the image into a loose 3D cloud.
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 2.2 + rand() * 3.2;
      start.push(
        px * 0.6 + r * Math.sin(phi) * Math.cos(theta),
        py * 0.6 + r * Math.sin(phi) * Math.sin(theta) * 0.7,
        // Mostly in front of the image so pixels fly toward the viewer, never hidden by the orb.
        (0.25 + 0.75 * Math.abs(Math.cos(phi))) * r * 0.75,
      );
      // Head assembles first, then the body; noise keeps it organic.
      delays.push((1 - v) * 0.65 + rand() * 0.35);
      rnds.push(rand());
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("aStart", new THREE.Float32BufferAttribute(start, 3));
  geo.setAttribute("aUv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute("aDelay", new THREE.Float32BufferAttribute(delays, 1));
  geo.setAttribute("aRand", new THREE.Float32BufferAttribute(rnds, 1));
  return { geometry: geo, cell };
}

export function PixelPortrait({ height = 3.75, columns, animate }: Props) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const group = useRef<THREE.Group>(null);

  const texture = useTexture(profile.photo, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
  });

  const img = texture.image as HTMLImageElement;
  const width = height * (img.width / img.height);

  const { geometry, cell } = useMemo(
    () => buildParticles(img, columns, width, height),
    [img, columns, width, height],
  );

  const shared = useMemo(
    () => ({
      uMap: { value: texture },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uHover: { value: 0 },
      uRadius: { value: HOVER_RADIUS },
      uSolid: { value: animate ? 0 : 1 },
    }),
    [texture, animate],
  );

  const pointsUniforms = useMemo(
    () => ({
      ...shared,
      uProgress: { value: animate ? 0 : 1 },
      uTime: { value: 0 },
      uCell: { value: cell },
      uPointScale: { value: 1 },
    }),
    [shared, cell, animate],
  );

  const planeUniforms = useMemo(
    () => ({
      ...shared,
      uTexel: { value: new THREE.Vector2(1 / img.width, 1 / img.height) },
    }),
    [shared, img],
  );

  // Animation state lives in refs so pointer events never trigger React renders.
  const progress = useRef(animate ? 0 : 1);
  const direction = useRef<1 | -1>(1);
  const hoverTarget = useRef(0);
  const mouseTarget = useRef(new THREE.Vector2(99, 99));

  const pointsMat = useRef<THREE.ShaderMaterial>(null);
  const planeMat = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, delta) => {
    const mat = pointsMat.current;
    if (!mat) return;
    const u = mat.uniforms;
    const dt = Math.min(delta, 0.1);
    u.uTime.value += dt;
    u.uPointScale.value =
      (size.height * dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));

    if (animate) {
      progress.current += direction.current === 1 ? dt / ASSEMBLE_SECONDS : -dt / SCATTER_SECONDS;
      if (progress.current <= 0) {
        progress.current = 0;
        direction.current = 1;
      }
      progress.current = Math.min(progress.current, 1);
    }
    u.uProgress.value = progress.current;
    // HD photo fades in only once every pixel has landed.
    u.uSolid.value = THREE.MathUtils.smoothstep(progress.current, 0.94, 1);
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, hoverTarget.current, 6, dt);
    u.uMouse.value.lerp(mouseTarget.current, 1 - Math.exp(-14 * dt));

    // three.js clones uniforms per material, so mirror the shared ones onto the photo.
    const p = planeMat.current?.uniforms;
    if (p) {
      p.uSolid.value = u.uSolid.value;
      p.uHover.value = u.uHover.value;
      p.uMouse.value.copy(u.uMouse.value);
    }
  });

  const toLocal = (e: ThreeEvent<PointerEvent>) => {
    if (!group.current) return;
    const p = group.current.worldToLocal(e.point.clone());
    mouseTarget.current.set(p.x, p.y);
  };

  return (
    <group ref={group}>
      <mesh renderOrder={1}>
        <planeGeometry args={[width, height]} />
        <shaderMaterial
          ref={planeMat}
          vertexShader={planeVertex}
          fragmentShader={planeFragment}
          uniforms={planeUniforms}
          transparent
          toneMapped={false}
        />
      </mesh>

      <points geometry={geometry} renderOrder={2} frustumCulled={false}>
        <shaderMaterial
          ref={pointsMat}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          uniforms={pointsUniforms}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </points>

      {/* Invisible hit area: drives the hover shatter and click-to-rebuild. */}
      {animate && (
        <mesh
          position-z={0.01}
          onPointerMove={(e) => {
            toLocal(e);
            hoverTarget.current = 1;
          }}
          onPointerOut={() => {
            hoverTarget.current = 0;
          }}
          onClick={() => {
            if (progress.current >= 1) direction.current = -1;
          }}
        >
          <planeGeometry args={[width * 0.9, height]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
      )}
    </group>
  );
}
