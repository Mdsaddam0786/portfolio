"use client";

import { useEffect, useMemo, useRef } from "react";
import { allSkills } from "@/data/skills";
import { useReducedMotion } from "@/lib/hooks";

type Point = { x: number; y: number; z: number };

// Evenly distribute points on a unit sphere (Fibonacci lattice).
function fibonacciSphere(n: number): Point[] {
  const pts: Point[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return pts;
}

export function SkillsSphere() {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const points = useMemo(() => fibonacciSphere(allSkills.length), []);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    let rotX = 0.3;
    let rotY = 0;
    let velX = 0;
    let velY = reduced ? 0 : 0.004;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let visible = true;

    const render = () => {
      const radius = el.clientWidth * 0.38;
      const cx = Math.cos(rotX),
        sx = Math.sin(rotX);
      const cy = Math.cos(rotY),
        sy = Math.sin(rotY);
      points.forEach((p, i) => {
        const node = items.current[i];
        if (!node) return;
        // rotate around Y then X
        const x1 = p.x * cy - p.z * sy;
        const z1 = p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        const scale = 0.6 + ((z2 + 1) / 2) * 0.6;
        node.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${scale})`;
        node.style.opacity = String(0.25 + ((z2 + 1) / 2) * 0.75);
        node.style.zIndex = String(Math.round((z2 + 1) * 100));
      });
    };

    const tick = () => {
      if (!dragging) {
        rotY += velY;
        rotX += velX;
        velX *= 0.95;
        if (!reduced) velY += (0.004 - velY) * 0.02;
        else velY *= 0.95;
      }
      render();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      rotY += dx * 0.008;
      rotX -= dy * 0.008;
      velY = dx * 0.008;
      velX = -dy * 0.008;
      render();
    };
    const up = () => (dragging = false);

    // Pause the loop while off-screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(el);

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    render();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [points, reduced]);

  return (
    <div
      ref={container}
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[460px] cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div className="bg-primary/10 absolute inset-[12%] rounded-full blur-3xl" />
      <div className="border-primary/20 absolute inset-[10%] rounded-full border" />
      <ul className="absolute top-1/2 left-1/2">
        {allSkills.map(({ name, icon: Icon, color }, i) => (
          <li
            key={name}
            title={name}
            ref={(n) => {
              items.current[i] = n;
            }}
            className="glass absolute grid h-14 w-14 place-items-center rounded-full will-change-transform"
            style={{ boxShadow: `0 0 18px ${color}33` }}
          >
            <Icon style={{ color }} className="text-3xl" />
          </li>
        ))}
      </ul>
    </div>
  );
}
