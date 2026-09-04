import gsap from "gsap";

// Use real elapsed time even on slow frames, so the sequence never stalls.
gsap.ticker.lagSmoothing(0);

export type SequenceState = {
  /** camera z position in world units */
  camZ: number;
  /** camera height */
  camY: number;
  /** lateral camera offset — only used inside the chamber */
  camX: number;
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
  /** 0..1 corridor walls widen and dissolve into the chamber volume */
  open: number;
  /** 0..1 chamber architecture presence */
  chamber: number;
  /** 0..1 About HTML content opacity */
  about: number;
  /** normalized scroll progress once the intro handed over */
  scroll: number;
};

export const START: SequenceState = {
  camZ: 46,
  camY: 1.85,
  camX: 0,
  fogFar: 6,
  reveal: 0,
  glow: 0,
  floor: 0,
  title: 0,
  hint: 0,
  open: 0,
  chamber: 0,
  about: 0,
  scroll: 0,
};

export const END: SequenceState = {
  ...START,
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

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smooth = (v: number) => v * v * (3 - 2 * v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where the corridor phase ends and the chamber begins, in world Z. */
export const CORRIDOR_EXIT_Z = -70;
export const CHAMBER_STOP_Z = -110;

/**
 * Phase 2: scroll drives the same shared state object the intro timeline used,
 * so every consumer in the scene keeps reading plain numbers each frame.
 */
export function applyScroll(s: SequenceState, p: number, dt = 1 / 60) {
  const target = clamp01(p);
  // Frame-rate independent easing on top of Lenis: absorbs any wheel spike or
  // dropped frame so the corridor→chamber handover never snaps.
  const k = 1 - Math.pow(0.0001, Math.min(dt, 0.1));
  const t = (s.scroll = s.scroll + (target - s.scroll) * k);

  // forward travel: corridor, then into the chamber — both ends ease to zero
  // velocity at the doorway, so the handover reads as one continuous glide
  s.camZ =
    t < 0.62
      ? lerp(END.camZ, CORRIDOR_EXIT_Z, smooth(range(t, 0, 0.62)))
      : lerp(CORRIDOR_EXIT_Z, CHAMBER_STOP_Z, smooth(range(t, 0.62, 1)));

  // walls widen / fall away, volume grows — long, overlapping ramps
  s.open = smooth(range(t, 0.42, 0.8));
  s.chamber = smooth(range(t, 0.46, 0.86));
  s.about = smooth(range(t, 0.78, 0.96));

  s.fogFar = lerp(END.fogFar, 230, smooth(range(t, 0.4, 0.9)));
  s.camY = lerp(END.camY, 2.35, smooth(range(t, 0.6, 1)));
  s.glow = Math.max(0, 1 - s.open * 1.5);
  s.hint = 1 - clamp01(t * 6);

  // lateral drift only once the room is around you — sweeps left, then right
  const cp = smooth(range(t, 0.66, 1));
  s.camX = Math.sin(cp * Math.PI * 2) * 7.2 * s.chamber;
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

/** Total intro duration, after which scroll takes over. */
export const INTRO_DURATION = 14.6;
