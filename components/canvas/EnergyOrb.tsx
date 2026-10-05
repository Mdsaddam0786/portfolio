"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Ashima Arts 3D simplex noise (MIT).
const noise = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

const orbVertex = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;
  ${noise}
  void main() {
    float n = snoise(normal * 1.1 + uTime * 0.18);
    vNoise = n;
    vec3 pos = position + normal * n * 0.035;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const orbFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.6);
    vec3 purple = vec3(0.545, 0.361, 0.965);
    vec3 cyan = vec3(0.133, 0.827, 0.933);
    float mixer = 0.5 + 0.5 * sin(vNormal.y * 2.2 + vNormal.x * 1.3 + uTime * 0.4 + vNoise * 1.5);
    vec3 rim = mix(purple, cyan, mixer);
    // Deep core with faint flowing bands so the orb never reads as flat.
    vec3 core = vec3(0.035, 0.028, 0.09) + rim * (0.06 + 0.04 * sin(vNoise * 10.0 + uTime));
    vec3 color = core + rim * fresnel * 2.0;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const haloFragment = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uStrength;
  void main() {
    float d = distance(vUv, vec2(0.5));
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * uStrength);
  }
`;

const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function EnergyOrb({ animate }: { animate: boolean }) {
  const orbMat = useRef<THREE.ShaderMaterial>(null);

  const orbUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const haloUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#7c3aed") },
      uStrength: { value: 0.55 },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (animate && orbMat.current) orbMat.current.uniforms.uTime.value += delta;
  });

  return (
    <group>
      <mesh position-z={-0.6} scale={6.2}>
        <planeGeometry />
        <shaderMaterial
          vertexShader={haloVertex}
          fragmentShader={haloFragment}
          uniforms={haloUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.55, 48]} />
        <shaderMaterial
          ref={orbMat}
          vertexShader={orbVertex}
          fragmentShader={orbFragment}
          uniforms={orbUniforms}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
