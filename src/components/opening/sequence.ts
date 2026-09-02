import gsap from "gsap";

// Use real elapsed time even on slow frames, so the sequence never stalls.
gsap.ticker.lagSmoothing(0);

export type SequenceState = {
  /** camera z position in world units */
  camZ: number;
  /** camera height */
  camY: number;
  /** fog far plane — pulls back as the gallery reveals */
  fogFar: number;
  /** 0..1 master reveal of architecture */
  reveal: number;
  /** distant focal glow intensity */
  glow: number;
  /** floor / light strip intensity */
  floor: number;
  /** overlay title opacity */
  title: number;
  /** subtitle + hint opacity */
  hint: number;
};

export const START: SequenceState = {
  camZ: 46,
  camY: 1.85,
  fogFar: 6,
  reveal: 0,
  glow: 0,
  floor: 0,
  title: 0,
  hint: 0,
};

export const END: SequenceState = {
  camZ: -4,
  camY: 1.7,
  fogFar: 130,
  reveal: 1,
  glow: 1,
  floor: 1,
  title: 0,
  hint: 1,
};

export function createSequenceState(): SequenceState {
  return { ...START };
}

/**
 * Master cinematic timeline. Every visual beat is driven from this one clock,
 * so the scene and the DOM overlay can never drift apart.
 */
export function buildTimeline(s: SequenceState, reducedMotion: boolean) {
  const tl = gsap.timeline({ paused: true });

  if (reducedMotion) {
    Object.assign(s, END, { title: 1 });
    tl.to(s, { title: 1, hint: 1, duration: 0.8 });
    return tl;
  }

  // 0.0 — pure black
  tl.to(s, { duration: 1.0 });

  // 1.0 — faint gold glow blooms far away
  tl.to(s, { glow: 0.35, duration: 2.2, ease: "power2.inOut" }, 1.0);

  // 2.5 — title fades up
  tl.to(s, { title: 1, duration: 1.8, ease: "power2.out" }, 2.5);

  // 5.0 — camera starts the long forward drift; title releases
  tl.to(s, { camZ: END.camZ, duration: 9.2, ease: "power1.inOut" }, 5.0);
  tl.to(s, { camY: END.camY, duration: 9.2, ease: "sine.inOut" }, 5.0);
  tl.to(s, { title: 0, duration: 2.0, ease: "power2.in" }, 5.4);

  // 6.0 — floor resolves, light strip ignites
  tl.to(s, { floor: 1, duration: 3.4, ease: "power2.out" }, 5.8);
  tl.to(s, { fogFar: 46, duration: 3.0, ease: "power1.out" }, 5.6);

  // 8.0 — wall panels and portals emerge from black
  tl.to(s, { reveal: 1, duration: 4.2, ease: "power2.out" }, 7.6);
  tl.to(s, { glow: 1, duration: 4.0, ease: "power2.inOut" }, 7.6);

  // 10.5 — gallery fully opens
  tl.to(s, { fogFar: END.fogFar, duration: 3.6, ease: "power1.inOut" }, 10.2);

  // 13.0 — settle, hint appears
  tl.to(s, { hint: 1, duration: 1.4, ease: "power2.out" }, 13.0);

  return tl;
}
