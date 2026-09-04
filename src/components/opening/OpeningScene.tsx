"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import Lenis from "lenis";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type gsap from "gsap";
import { Gallery, FocalPoint } from "./Gallery";
import { Chamber } from "./Chamber";
import {
  applyScroll,
  buildTimeline,
  createSequenceState,
  INTRO_DURATION,
  type SequenceState,
} from "./sequence";
import { TitleOverlay } from "./TitleOverlay";
import { AboutOverlay } from "./AboutOverlay";

type Scroll = { p: number; live: boolean };

/** Camera dolly, handheld float, FOV breath and fog, all driven by the timeline. */
function Rig({
  s,
  tl,
  scroll,
}: {
  s: SequenceState;
  tl: React.RefObject<gsap.core.Timeline | null>;
  scroll: React.RefObject<Scroll>;
}) {
  const { camera, scene } = useThree();
  const start = useRef(0);
  const fog = useMemo(() => new THREE.Fog("#050505", 1, 20), []);

  useEffect(() => {
    scene.fog = fog;
    scene.background = new THREE.Color("#050505");
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!start.current) start.current = performance.now();
    const elapsed = (performance.now() - start.current) / 1000;

    if (scroll.current.live && elapsed >= INTRO_DURATION) {
      // Phase 2 — scroll owns the same shared state object.
      applyScroll(s, scroll.current.p, delta);
    } else if (tl.current) {
      // Drive the timeline from real elapsed time so a slow frame never stalls it.
      tl.current.time(elapsed);
    }

    camera.position.set(
      s.camX + Math.sin(t * 0.18) * 0.14,
      s.camY + Math.sin(t * 0.27) * 0.045,
      s.camZ
    );
    camera.lookAt(s.camX * 0.42 + Math.sin(t * 0.11) * 0.22, 3.1, s.camZ - 40);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 46 + Math.sin(t * 0.13) * 0.5;
    cam.updateProjectionMatrix();
    fog.near = Math.max(0.4, s.fogFar * 0.05);
    fog.far = s.fogFar;
  });

  return null;
}

/**
 * The gallery takes plain numbers. Sampling the timeline ~20x/s (instead of
 * every frame) keeps the fades smooth without re-rendering the tree at 60fps.
 */
function RevealedGallery({ s }: { s: SequenceState }) {
  const [vals, setVals] = useState({ reveal: 0, floor: 0, glow: 0, open: 0, chamber: 0 });
  const acc = useRef(0);

  useFrame((_, delta) => {
    acc.current += delta;
    if (acc.current < 1 / 30) return;
    acc.current = 0;
    if (
      Math.abs(vals.reveal - s.reveal) > 0.002 ||
      Math.abs(vals.floor - s.floor) > 0.002 ||
      Math.abs(vals.glow - s.glow) > 0.002 ||
      Math.abs(vals.open - s.open) > 0.002 ||
      Math.abs(vals.chamber - s.chamber) > 0.002
    ) {
      setVals({
        reveal: s.reveal,
        floor: s.floor,
        glow: s.glow,
        open: s.open,
        chamber: s.chamber,
      });
    }
  });

  return (
    <>
      <Gallery reveal={vals.reveal} floor={vals.floor} open={vals.open} />
      <FocalPoint glow={vals.glow} />
      <Chamber p={vals.chamber} />
    </>
  );
}

export function OpeningScene() {
  const s = useMemo(() => createSequenceState(), []);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const scroll = useRef<Scroll>({ p: 0, live: false });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = buildTimeline(s, reduced);
    tlRef.current = tl;

    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85 });
    lenis.stop();
    lenis.on("scroll", ({ scroll: y, limit }: { scroll: number; limit: number }) => {
      scroll.current.p = limit > 0 ? Math.min(1, Math.max(0, y / limit)) : 0;
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // hand control over to scroll once the intro has landed
    const handoff = window.setTimeout(
      () => {
        scroll.current.live = true;
        lenis.start();
      },
      reduced ? 1200 : INTRO_DURATION * 1000
    );

    return () => {
      window.clearTimeout(handoff);
      cancelAnimationFrame(raf);
      lenis.destroy();
      tlRef.current = null;
      tl.kill();
    };
  }, [s]);

  return (
    <>
      <div className="fixed inset-0" style={{ backgroundColor: "#050505" }}>
        <Canvas
          gl={{ antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1.75]}
          camera={{ position: [0, 1.85, 46], fov: 46, near: 0.1, far: 400 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.82;
          }}
        >
          <Rig s={s} tl={tlRef} scroll={scroll} />
          <ambientLight intensity={0.035} color="#4a6c96" />
          <RevealedGallery s={s} />
          <EffectComposer>
            <Bloom intensity={0.85} luminanceThreshold={0.45} luminanceSmoothing={0.5} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.92} />
            <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.06} />
          </EffectComposer>
        </Canvas>
        <TitleOverlay s={s} />
        <AboutOverlay s={s} />
      </div>
      {/* scroll runway — drives the camera through the gallery into the chamber */}
      <div aria-hidden className="pointer-events-none h-[700vh] w-full" />
    </>
  );
}
