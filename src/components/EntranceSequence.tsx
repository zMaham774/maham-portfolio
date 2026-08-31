"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import EntranceOverlay from "./EntranceOverlay";

export default function EntranceSequence() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(glowRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.8,
      ease: "power2.out",
    });

    tl.to(
      "#entrance-title",
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.out",
      },
      "-=0.7"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#050505",
      }}
    >
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: "-18%",
          display: "grid",
          placeItems: "center",
          background:
            "radial-gradient(circle at center, rgba(255, 198, 96, 0.9) 0%, rgba(210, 155, 63, 0.56) 14%, rgba(96, 64, 18, 0.24) 28%, rgba(0, 0, 0, 0) 58%)",
          opacity: 0,
          transform: "scale(0.9)",
          filter: "blur(10px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      <EntranceOverlay />
    </div>
  );
}