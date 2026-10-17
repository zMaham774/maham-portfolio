import gsap from "gsap";

// Use real elapsed time even on slow frames, so the sequence never stalls.
gsap.ticker.lagSmoothing(0);

export type SequenceState = {
  /** camera z position in world units */
  camZ: number;
  /** camera height */
  camY: number;
  /** world height the camera aims at */
  lookY: number;
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
  /** 0..1 hairlines drifting in the void before the lattice resolves */
  threads: number;
  /** 0..1 skill node points present */
  nodes: number;
  /** 0..1 connections drawn + labels resolved by proximity */
  links: number;
  /** network lines extend into a long architectural light field */
  lineBridge: number;
  /** 0..1 exhibition room and content reveal */
  gallery: number;
  /** 0..1 responsive camera framing for the exhibition; rises with the gallery and holds */
  frame: number;
  /** 0..1 Departure Chamber presence (floor, light) */
  departure: number;
  /** 0..1 monumental doorway outline emergence */
  door: number;
  /** 0..1 contact HTML content */
  contact: number;
  /** normalized scroll progress once the intro handed over */
  scroll: number;
};


export const START: SequenceState = {
  camZ: 46,
  camY: 1.85,
  lookY: 3.1,
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
  threads: 0,
  nodes: 0,
  links: 0,
  lineBridge: 0,
  gallery: 0,
  frame: 0,
  departure: 0,
  door: 0,
  contact: 0,
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
/** Where the camera settles inside the skills lattice. */
export const NETWORK_STOP_Z = -200;
export const GALLERY_STOP_Z = -336;
/** Where the camera settles facing the Departure doorway. */
export const DEPART_STOP_Z = -470;
export const DOOR_Z = -520;
/** Share of the runway used by corridor → gallery; the rest is the Departure Chamber. */
const JOURNEY_END = 0.8;

/**
 * Phase 2: scroll drives the same shared state object the intro timeline used,
 * so every consumer in the scene keeps reading plain numbers each frame.
 */
export function applyScroll(s: SequenceState, p: number, dt = 1 / 60) {
  const target = clamp01(p);
  // Frame-rate independent easing on top of Lenis: absorbs any wheel spike or
  // dropped frame so the corridor→chamber handover never snaps.
  const k = 1 - Math.pow(0.0001, Math.min(dt, 0.1));
  const real = (s.scroll = s.scroll + (target - s.scroll) * k);
  // earlier zones keep their original pacing, compressed into the first 80%
  const t = Math.min(1, real / JOURNEY_END);

  // forward travel: corridor → chamber → lattice → exhibition.
  // every leg eases to zero velocity at its seam, so it reads as one glide
  s.camZ =
    t < 0.28
      ? lerp(END.camZ, CORRIDOR_EXIT_Z, smooth(range(t, 0, 0.28)))
      : t < 0.6
        ? lerp(CORRIDOR_EXIT_Z, CHAMBER_STOP_Z, smooth(range(t, 0.28, 0.6)))
        : t < 0.83
          ? lerp(CHAMBER_STOP_Z, NETWORK_STOP_Z, smooth(range(t, 0.6, 0.83)))
          : lerp(NETWORK_STOP_Z, GALLERY_STOP_Z, smooth(range(t, 0.83, 0.98)));

  // walls widen / fall away, volume grows — long, overlapping ramps
  s.open = smooth(range(t, 0.19, 0.36));

  // chamber architecture rises, then dissolves back into the void
  const dissolve = 1 - smooth(range(t, 0.62, 0.78));
  s.chamber = smooth(range(t, 0.21, 0.39)) * dissolve;
  s.about = smooth(range(t, 0.35, 0.44)) * (1 - smooth(range(t, 0.58, 0.68)));

  // the floor keeps a soft light through the lattice — never full darkness
  s.floor = 1 - smooth(range(t, 0.62, 0.8)) * 0.45;

  // network beats: hairlines → isolated points → connections
  s.threads = smooth(range(t, 0.64, 0.73)) * (1 - smooth(range(t, 0.82, 0.9)));
  s.nodes = smooth(range(t, 0.7, 0.78)) * (1 - smooth(range(t, 0.83, 0.89)));
  s.links = smooth(range(t, 0.74, 0.81)) * (1 - smooth(range(t, 0.89, 0.95)));
  s.lineBridge = smooth(range(t, 0.84, 0.91)) * (1 - smooth(range(t, 0.96, 1)) * 0.6);
  s.frame = smooth(range(t, 0.89, 0.97));
  // gallery rises, then fully fades so it can unmount before the Departure Chamber
  const leave = smooth(range(real, 0.8, 0.85));
  s.gallery = s.frame * (1 - leave);
  s.lineBridge *= 1 - leave;
  s.departure = smooth(range(real, 0.851, 0.92));
  s.door = smooth(range(real, 0.86, 0.95));
  s.contact = smooth(range(real, 0.935, 0.99));

  s.fogFar = lerp(
    lerp(END.fogFar, 230, smooth(range(t, 0.18, 0.55))),
    320,
    smooth(range(t, 0.6, 0.88))
  );
  s.camY = lerp(lerp(lerp(END.camY, 2.35, smooth(range(t, 0.3, 0.55))), 5.2, smooth(range(t, 0.62, 0.83))), 5, smooth(range(t, 0.83, 0.97)));
  // raise the aim so the whole lattice sits above the floor, fully in frame
  s.lookY = lerp(lerp(3.1, 12.4, smooth(range(t, 0.6, 0.81))), 9.5, smooth(range(t, 0.85, 0.98)));
  // final leg: past the last exhibit to the doorway, settling low and calm
  const d = smooth(range(real, 0.8, 0.97));
  s.camZ = lerp(s.camZ, DEPART_STOP_Z, d);
  s.camY = lerp(s.camY, 3.2, d);
  s.lookY = lerp(s.lookY, 7, d);
  s.fogFar = lerp(s.fogFar, 150, d);
  s.glow = Math.max(0, 1 - s.open * 1.5);
  s.title = 0;
  s.hint = 1 - clamp01(t * 6);

  // lateral drift: sweep the chamber, then wander through the lattice
  const cp = smooth(range(t, 0.3, 0.6));
  const np = smooth(range(t, 0.66, 0.83));
  s.camX =
    Math.sin(cp * Math.PI * 2) * 7.2 * s.chamber + Math.sin(np * Math.PI * 2) * 2.6 * s.nodes;

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
