"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { profile } from "@/data/profile";

type Props = { height?: number; columns: number; animate: boolean };

const ASSEMBLE_SECONDS = 2.6;
const SCATTER_SECONDS = 0.8;
const HOVER_RADIUS = 0.75;
const PURPLE = new THREE.Color("#8b5cf6");
const CYAN = new THREE.Color("#22d3ee");

const smooth = THREE.MathUtils.smoothstep;
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

type Voxels = {
  count: number;
  cell: number;
  target: Float32Array; // x, y
  start: Float32Array; // x, y, z
  startRot: Float32Array; // x, y, z
  scatter: Float32Array; // x, y, z  (scroll break-apart direction)
  delay: Float32Array;
  rand: Float32Array;
  base: THREE.Color[];
  accent: THREE.Color[];
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Downsample the cutout to a coarse grid; every opaque cell becomes one coloured cube. */
function buildVoxels(
  image: CanvasImageSource & { width: number; height: number },
  columns: number,
  width: number,
  height: number,
): Voxels {
  const rows = Math.round(columns * (image.height / image.width));
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, columns, rows);
  const { data } = ctx.getImageData(0, 0, columns, rows);

  const rand = mulberry32(11);
  const cell = width / columns;
  const target: number[] = [];
  const start: number[] = [];
  const startRot: number[] = [];
  const scatter: number[] = [];
  const delay: number[] = [];
  const rnd: number[] = [];
  const base: THREE.Color[] = [];
  const accent: THREE.Color[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const i = (y * columns + x) * 4;
      const v = 1 - (y + 0.5) / rows;
      if (data[i + 3] < 140 || v < 0.07) continue;
      // Undo premultiplication on soft edges so border cubes keep their true colour.
      const a = data[i + 3] / 255;
      const tx = ((x + 0.5) / columns - 0.5) * width;
      const ty = (v - 0.5) * height;
      target.push(tx, ty);

      const theta = rand() * Math.PI * 2;
      const r = 3 + rand() * 4;
      start.push(
        tx * 0.4 + Math.cos(theta) * r,
        ty * 0.4 + Math.sin(theta) * r * 0.75,
        1 + rand() * 3.5,
      );
      startRot.push((rand() - 0.5) * 8, (rand() - 0.5) * 8, (rand() - 0.5) * 8);

      const len = Math.hypot(tx, ty) || 1;
      scatter.push(
        (tx / len) * (1.5 + rand() * 3),
        (ty / len) * (1 + rand() * 2.5) + 1.2,
        1.5 + rand() * 4,
      );
      delay.push((1 - v) * 0.6 + rand() * 0.4);
      rnd.push(rand());
      base.push(
        new THREE.Color().setRGB(
          data[i] / 255 / Math.max(a, 0.5),
          data[i + 1] / 255 / Math.max(a, 0.5),
          data[i + 2] / 255 / Math.max(a, 0.5),
          THREE.SRGBColorSpace,
        ),
      );
      accent.push(PURPLE.clone().lerp(CYAN, v));
    }
  }

  return {
    count: target.length / 2,
    cell,
    target: new Float32Array(target),
    start: new Float32Array(start),
    startRot: new Float32Array(startRot),
    scatter: new Float32Array(scatter),
    delay: new Float32Array(delay),
    rand: new Float32Array(rnd),
    base,
    accent,
  };
}

const planeVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vPos;
  void main() {
    vUv = uv;
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Full-resolution photo with a hole wherever cubes have been pulled out.
const planeFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uTexel;
  uniform float uSolid;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec2 vPos;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    if (tex.a < 0.02) discard;
    float left = clamp(tex.a - texture2D(uMap, vUv + vec2(-uTexel.x, 0.0) * 6.0).a, 0.0, 1.0);
    float right = clamp(tex.a - texture2D(uMap, vUv + vec2(uTexel.x, 0.0) * 6.0).a, 0.0, 1.0);
    float top = clamp(tex.a - texture2D(uMap, vUv + vec2(0.0, uTexel.y) * 6.0).a, 0.0, 1.0);
    vec3 color = tex.rgb + vec3(0.133, 0.827, 0.933) * left * 0.5
      + vec3(0.65, 0.48, 1.0) * (right + top) * 0.55;

    float infl = (1.0 - smoothstep(0.0, uRadius, distance(vPos, uMouse))) * uHover;
    float hole = smoothstep(0.03, 0.22, infl);
    float a = tex.a * smoothstep(0.0, 0.16, vUv.y) * uSolid * (1.0 - hole);
    if (a < 0.01) discard;
    gl_FragColor = vec4(color, a);
    #include <colorspace_fragment>
  }
`;

export function VoxelPortrait({ height = 4.6, columns, animate }: Props) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const planeMat = useRef<THREE.ShaderMaterial>(null);

  const texture = useTexture(profile.photo, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });
  const img = texture.image as HTMLImageElement;
  const width = height * (img.width / img.height);

  const voxels = useMemo(
    () => buildVoxels(img, columns, width, height),
    [img, columns, width, height],
  );
  const cube = useMemo(() => {
    const s = voxels.cell * 0.9;
    return new THREE.BoxGeometry(s, s, s);
  }, [voxels.cell]);

  const planeUniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTexel: { value: new THREE.Vector2(1 / img.width, 1 / img.height) },
      uSolid: { value: animate ? 0 : 1 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uHover: { value: 0 },
      uRadius: { value: HOVER_RADIUS },
    }),
    [texture, img, animate],
  );

  // All animation state lives in refs: pointer and scroll never re-render React.
  const anim = useRef({
    progress: animate ? 0 : 1,
    direction: 1 as 1 | -1,
    hover: 0,
    hoverTarget: 0,
    mouse: new THREE.Vector2(99, 99),
    mouseTarget: new THREE.Vector2(99, 99),
    scroll: 0,
    time: 0,
    idleFrames: 0,
  });

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  // Seed colours once so the first frame is correct even before animating.
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < voxels.count; i++) m.setColorAt(i, voxels.base[i]);
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [voxels]);

  useFrame((state, delta) => {
    const m = mesh.current;
    const g = group.current;
    if (!m || !g) return;
    const a = anim.current;
    const dt = Math.min(delta, 0.1);
    a.time += dt;

    if (animate) {
      a.progress += a.direction === 1 ? dt / ASSEMBLE_SECONDS : -dt / SCATTER_SECONDS;
      if (a.progress <= 0) {
        a.progress = 0;
        a.direction = 1;
      }
      a.progress = Math.min(a.progress, 1);

      // Scroll: 0 at the top, 1 once the hero is ~70% scrolled away.
      const heroH = window.innerHeight * 0.7;
      const target = THREE.MathUtils.clamp(window.scrollY / heroH, 0, 1);
      a.scroll = THREE.MathUtils.damp(a.scroll, target, 8, dt);
    }
    a.hover = THREE.MathUtils.damp(a.hover, a.hoverTarget, 7, dt);
    a.mouse.lerp(a.mouseTarget, 1 - Math.exp(-16 * dt));

    // Whole portrait leans gently toward the cursor.
    if (animate) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.12, 3, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.06, 3, dt);
    }

    const solid = smooth(a.progress, 0.94, 1) * (1 - smooth(a.scroll, 0.0, 0.05));
    const p = planeMat.current?.uniforms;
    if (p) {
      p.uSolid.value = solid;
      p.uHover.value = a.hover;
      p.uMouse.value.copy(a.mouse);
    }

    // Skip the per-cube work once everything is at rest behind the HD photo.
    const busy = a.progress < 1 || a.hover > 0.002 || a.scroll > 0.002 || solid < 1;
    a.idleFrames = busy ? 0 : a.idleFrames + 1;
    if (a.idleFrames > 2) return;

    const v = voxels;
    const zFront = v.cell * 0.5;
    for (let i = 0; i < v.count; i++) {
      const tx = v.target[i * 2];
      const ty = v.target[i * 2 + 1];
      const r = v.rand[i];

      // 1. Assemble from the scattered start.
      const t = THREE.MathUtils.clamp((a.progress - v.delay[i] * 0.45) / 0.55, 0, 1);
      const e = easeOutCubic(t);
      const f = 1 - e;
      let x = v.start[i * 3] + (tx - v.start[i * 3]) * e;
      let y = v.start[i * 3 + 1] + (ty - v.start[i * 3 + 1]) * e + Math.sin(t * Math.PI) * 0.4 * r;
      let z = v.start[i * 3 + 2] * f;
      let rx = v.startRot[i * 3] * f;
      let ry = v.startRot[i * 3 + 1] * f;
      let rz = v.startRot[i * 3 + 2] * f;

      // 2. Hover: cubes near the cursor pop toward the viewer and tilt outward.
      const dx = tx - a.mouse.x;
      const dy = ty - a.mouse.y;
      const d = Math.hypot(dx, dy);
      const infl = (1 - smooth(d, 0, HOVER_RADIUS)) * a.hover * e;
      if (infl > 0.001) {
        const ripple = Math.sin(d * 10 - a.time * 7) * 0.06;
        z += infl * (0.35 + r * 0.55) + ripple * infl;
        rx += (-dy / (d + 0.001)) * infl * 0.9;
        ry += (dx / (d + 0.001)) * infl * 0.9;
      }

      // 3. Scroll: break apart, bottom-up, drifting out in 3D.
      const sc = smooth(a.scroll, r * 0.35, r * 0.35 + 0.65);
      if (sc > 0) {
        x += v.scatter[i * 3] * sc;
        y += v.scatter[i * 3 + 1] * sc;
        z += v.scatter[i * 3 + 2] * sc;
        rx += (r - 0.5) * 6 * sc;
        ry += (0.5 - r) * 5 * sc;
        rz += r * 4 * sc;
      }

      // Hidden behind the HD photo at rest; grow in wherever they're disturbed.
      const visible = Math.max(1 - solid, smooth(infl, 0.03, 0.22));
      const scale = visible * (1 - sc * 0.35);

      dummy.position.set(x, y, z - zFront);
      dummy.rotation.set(rx, ry, rz);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      // Cubes glow in brand colours while in motion.
      const energy = Math.min(1, f * 0.5 + infl * 0.12 + sc * 0.22);
      color.copy(v.base[i]).lerp(v.accent[i], energy);
      m.setColorAt(i, color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  const toLocal = (e: ThreeEvent<PointerEvent>) => {
    if (!group.current) return;
    const p = group.current.worldToLocal(e.point.clone());
    anim.current.mouseTarget.set(p.x, p.y);
  };

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[cube, undefined, voxels.count]} frustumCulled={false}>
        <meshStandardMaterial roughness={0.45} metalness={0.1} />
      </instancedMesh>

      <mesh position-z={0.002}>
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

      {animate && (
        <mesh
          position-z={0.01}
          onPointerMove={(e) => {
            toLocal(e);
            anim.current.hoverTarget = 1;
          }}
          onPointerOut={() => {
            anim.current.hoverTarget = 0;
          }}
          onClick={() => {
            if (anim.current.progress >= 1) anim.current.direction = -1;
          }}
        >
          <planeGeometry args={[width * 0.85, height]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
      )}
    </group>
  );
}
