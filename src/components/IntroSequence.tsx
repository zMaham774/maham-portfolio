"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import LightsVoidScene from "@/components/scene/LightsVoidScene";
import IntroTitle from "@/components/ui/IntroTitle";

export default function IntroSequence() {
  const lightRef = useRef<THREE.SpotLight | null>(null);
  const fogRef = useRef<THREE.Fog | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, subtitleRef.current], {
        autoAlpha: 0,
        filter: "blur(12px)",
        y: 18,
        force3D: true,
      });

      const tl = gsap.timeline({ defaults: { ease: "sine.out" } });

      if (lightRef.current) {
        tl.to(lightRef.current, { intensity: 2.4, duration: 2.4 }, 0.5);
      }

      if (fogRef.current) {
        tl.to(
          fogRef.current,
          { near: 2.2, far: 16, duration: 2.4, ease: "sine.inOut" },
          0.5,
        );
      }

      tl.to(
        titleRef.current,
        { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1.8, ease: "power2.out" },
        2.0,
      );
      tl.to(
        subtitleRef.current,
        { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1.1, ease: "power2.out" },
        3.6,
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050505]">
      <LightsVoidScene lightRef={lightRef} fogRef={fogRef} />
      <IntroTitle titleRef={titleRef} subtitleRef={subtitleRef} />
    </div>
  );
}
