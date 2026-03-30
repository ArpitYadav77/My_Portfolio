import React, { useRef, useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import arpitHero from '../src/assets/hero/arpit-hero.png';

// ═══════════════════════════════════════════════════════════════════════════════
// VERTEX SHADER — Surface distortion that sticks to the body
// ═══════════════════════════════════════════════════════════════════════════════

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform float u_time;
  uniform float u_hover;

  // ── Simplex 3D Noise ───────────────────────────────
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;

    // Liquid surface bulge — sticks to the surface, not floating
    float n = snoise(vec3(uv * 4.0, u_time * 0.5));
    pos.z += n * 0.08 * u_hover;

    // Subtle writhing on the body surface
    pos.x += sin(u_time * 1.5 + uv.y * 6.0) * 0.005 * u_hover;
    pos.y += cos(u_time * 1.2 + uv.x * 5.0) * 0.003 * u_hover;

    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// FRAGMENT SHADER — Realistic Venom symbiote with all upgraded effects
// ═══════════════════════════════════════════════════════════════════════════════

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  uniform sampler2D u_texture;
  uniform float u_time;
  uniform float u_hover;   // smooth 0→1 hover blend
  uniform vec2 u_mouse;    // normalized mouse pos on canvas

  // ── Simplex 3D Noise ───────────────────────────────
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // ── Fractal Brownian Motion (multi-layer noise) ────
  float fbm(vec3 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      val += amp * snoise(p * freq);
      freq *= 2.1;
      amp *= 0.5;
    }
    return val;
  }

  void main() {
    vec2 uv = vUv;
    float t = u_time;
    float hover = u_hover;

    // ──────────────────────────────────────────────────
    // 1. FLOWING ORGANIC NOISE (multi-layer FBM)
    // ──────────────────────────────────────────────────
    float n1 = fbm(vec3(uv * 4.0, t * 0.3));
    float n2 = fbm(vec3(uv * 8.0 + 50.0, t * 0.4));
    float n3 = snoise(vec3(uv * 12.0, t * 0.6));
    float organicNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // ──────────────────────────────────────────────────
    // 2. SPREADING MASK — covers body top-to-bottom
    //    gravity drip: spread follows Y axis downward
    // ──────────────────────────────────────────────────

    // Main gravity spread — drips from top to bottom (GRADUAL)
    // The -0.8 offset ensures face/head area stays visible early
    float gravitySpread = smoothstep(
      0.15, 0.75,
      (1.0 - uv.y) + organicNoise * 0.25 + hover * 0.9 - 0.8
    );

    // Edge crawl — creeps from left/right edges inward (subtle)
    float edgeLeft  = smoothstep(0.0, 0.35, uv.x + organicNoise * 0.12 + hover * 0.3 - 0.25);
    float edgeRight = smoothstep(0.0, 0.35, (1.0 - uv.x) + organicNoise * 0.12 + hover * 0.3 - 0.25);
    float edgeCrawl = 1.0 - edgeLeft * edgeRight;

    // Drip tendrils — stringy downward flowing lines
    float drip1 = snoise(vec3(uv.x * 6.0, uv.y * 20.0 - t * 1.5, t * 0.2));
    float drip2 = snoise(vec3(uv.x * 10.0 + 30.0, uv.y * 15.0 - t * 1.2, t * 0.15));
    float drips = max(
      smoothstep(0.5, 0.8, drip1),
      smoothstep(0.55, 0.85, drip2)
    ) * hover * smoothstep(0.7, 0.3, uv.y);

    // Combine all spread layers — gradual, bottom-up takeover
    float spread = clamp(gravitySpread * hover + edgeCrawl * hover * 0.4 + drips * 0.4, 0.0, 1.0);

    // ──────────────────────────────────────────────────
    // 3. UV DISTORTION — liquid warping that sticks to surface
    // ──────────────────────────────────────────────────
    float distortAmt = 0.04 * hover;
    vec2 distortedUV = uv + vec2(
      snoise(vec3(uv * 5.0, t * 0.4)) * distortAmt,
      snoise(vec3(uv * 5.0 + 100.0, t * 0.35)) * distortAmt
    );

    vec4 original = texture2D(u_texture, distortedUV);

    // Edge detection — use texture luminance gradient for body-aware crawling
    float lum = dot(original.rgb, vec3(0.299, 0.587, 0.114));
    float lumRight = dot(texture2D(u_texture, distortedUV + vec2(0.005, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float lumUp = dot(texture2D(u_texture, distortedUV + vec2(0.0, 0.005)).rgb, vec3(0.299, 0.587, 0.114));
    float edge = length(vec2(lumRight - lum, lumUp - lum));

    // Edge-aware crawl — symbiote follows body contours
    float edgeCrawlBody = smoothstep(0.01, 0.06, edge) * hover * 0.4;
    spread = clamp(spread + edgeCrawlBody, 0.0, 1.0);

    // ──────────────────────────────────────────────────
    // 4. VENOM BLACK — glossy wet dark material
    // ──────────────────────────────────────────────────
    vec3 venomBlack = vec3(0.015, 0.015, 0.02);

    // ──────────────────────────────────────────────────
    // 5. BLEND original image + venom
    // ──────────────────────────────────────────────────
    vec3 finalColor = mix(original.rgb, venomBlack, spread);

    // ──────────────────────────────────────────────────
    // 6. WET SHINE — glossy specular highlights
    //    Normal-based lighting for wet reflections
    // ──────────────────────────────────────────────────
    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
    float ndotl = max(dot(vNormal, lightDir), 0.0);

    // Specular from noise peaks — wet liquid shine
    float spec1 = pow(max(0.0, snoise(vec3(uv * 8.0, t * 0.5))), 8.0) * 0.7;
    float spec2 = pow(max(0.0, snoise(vec3(uv * 15.0 + 40.0, t * 0.3))), 12.0) * 0.5;
    float wetShine = (spec1 + spec2) * spread * hover;

    // Fresnel rim reflection — wet edges glow
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
    float rimWet = fresnel * spread * hover * 0.4;

    finalColor += vec3(wetShine + rimWet);

    // ──────────────────────────────────────────────────
    // 7. CRAWLING EDGE GLOW — where symbiote meets skin
    // ──────────────────────────────────────────────────
    float boundaryEdge = smoothstep(0.03, 0.0, abs(spread - 0.5));
    float pulse = 0.6 + 0.4 * sin(t * 4.0);
    finalColor += vec3(0.08, 0.02, 0.12) * boundaryEdge * hover * pulse * 2.0;

    // Thin bright crawling line
    float thinLine = smoothstep(0.012, 0.0, abs(spread - 0.48));
    finalColor += vec3(0.15, 0.06, 0.22) * thinLine * hover;

    // ──────────────────────────────────────────────────
    // 8. DARK VEIN PATTERN — visible under symbiote surface
    // ──────────────────────────────────────────────────
    float veinNoise = snoise(vec3(uv * 30.0, t * 0.25));
    float veins = smoothstep(0.6, 0.75, abs(veinNoise)) * spread * 0.12;
    finalColor += vec3(0.03, 0.01, 0.05) * veins;

    // ──────────────────────────────────────────────────
    // 9. SUBTLE IRIDESCENCE — oily color shift on surface
    // ──────────────────────────────────────────────────
    float iri = snoise(vec3(uv * 6.0, t * 0.15));
    vec3 iridescence = vec3(
      0.02 + iri * 0.02,
      0.005,
      0.03 + iri * 0.03
    ) * wetShine * 1.5;
    finalColor += iridescence;

    gl_FragColor = vec4(finalColor, original.a);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE PLANE — The 3D surface that holds the shader
// ═══════════════════════════════════════════════════════════════════════════════

interface ImagePlaneProps {
  hovered: boolean;
  mousePos: { x: number; y: number };
}

const ImagePlane: React.FC<ImagePlaneProps> = ({ hovered, mousePos }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const texture = useTexture(arpitHero);

  const hoverVal = useRef(0);
  const tiltTarget = useRef({ x: 0, y: 0 });
  const tiltCurrent = useRef({ x: 0, y: 0 });

  const aspect = useMemo(() => {
    if (texture.image) {
      const img = texture.image as HTMLImageElement;
      return img.width / img.height;
    }
    return 0.75;
  }, [texture]);

  const planeH = Math.min(viewport.height * 0.75, 5.5);
  const planeW = planeH * aspect;

  const uniforms = useMemo(() => ({
    u_texture: { value: texture },
    u_time:    { value: 0 },
    u_hover:   { value: 0 },
    u_mouse:   { value: new THREE.Vector2(0.5, 0.5) },
  }), [texture]);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.getElapsedTime();

    // Smooth hover transition (like the reference: += (target - current) * 0.05)
    const target = hovered ? 1 : 0;
    hoverVal.current += (target - hoverVal.current) * Math.min(delta * 4, 0.08);

    // Update uniforms
    materialRef.current.uniforms.u_time.value = t;
    materialRef.current.uniforms.u_hover.value = hoverVal.current;
    materialRef.current.uniforms.u_mouse.value.set(
      mousePos.x * 0.5 + 0.5,
      mousePos.y * 0.5 + 0.5
    );

    // Gentle oscillating sway (NOT additive spin — stays front-facing)
    const baseY = Math.sin(t * 0.3) * 0.1;

    // Mouse tilt on hover
    if (hovered) {
      tiltTarget.current.y = mousePos.x * 0.2;
      tiltTarget.current.x = -mousePos.y * 0.12;
    } else {
      tiltTarget.current.y = 0;
      tiltTarget.current.x = 0;
    }
    tiltCurrent.current.x += (tiltTarget.current.x - tiltCurrent.current.x) * delta * 5;
    tiltCurrent.current.y += (tiltTarget.current.y - tiltCurrent.current.y) * delta * 5;

    meshRef.current.rotation.x = tiltCurrent.current.x;
    meshRef.current.rotation.y = baseY + tiltCurrent.current.y;

    // Breathing + slight scale up on hover
    const breathe = 1 + Math.sin(t * 1.2) * 0.005;
    const hoverScale = 1 + hoverVal.current * 0.015;
    const s = breathe * hoverScale;
    meshRef.current.scale.set(s, s, s);

    // Parallax depth
    meshRef.current.position.z = hoverVal.current * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeW, planeH, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS WRAPPER — Container with mouse tracking
// ═══════════════════════════════════════════════════════════════════════════════

const HeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-3d-container"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 5]} intensity={0.9} color="#ffffff" />
        <directionalLight position={[-2, 1, 3]} intensity={0.25} color="#ffbd12" />
        <pointLight position={[-3, 0, -2]} intensity={0.4} color="#6366f1" />
        <pointLight position={[3, -1, -1]} intensity={0.3} color="#4f46e5" />

        <Suspense fallback={null}>
          <ImagePlane hovered={false} mousePos={mousePos} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// WEBGL DETECTION + FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════

function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch { return false; }
}

const FallbackImage: React.FC = () => (
  <div className="hero-3d-container hero-fallback">
    <img src={arpitHero} alt="Arpit Yadav" className="hero-fallback-img" />
  </div>
);

export const HeroImage3D: React.FC = () => {
  const [ok, setOk] = useState(true);
  useEffect(() => { setOk(isWebGLAvailable()); }, []);
  if (!ok) return <FallbackImage />;
  return <HeroCanvas />;
};
