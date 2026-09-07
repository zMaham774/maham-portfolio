import { useSyncExternalStore } from "react";

export type SkillNode = {
    name: string;
    label: string;
    kind: string;
    blurb: string;
    uses: string[];
    /** position within the lattice plane, relative to the network centre */
    at: [number, number, number];
    cluster: string;
};

export type SkillCluster = {
    id: string;
    label: string;
    at: [number, number, number];
};

export const CLUSTERS: SkillCluster[] = [
    { id: "foundations", label: "Foundations", at: [-22.5, 15.5, 0] },
    { id: "web", label: "Web", at: [15, 15.5, 0] },
    { id: "frameworks", label: "Frameworks", at: [-1, 3.2, 0] },
    { id: "motion", label: "3D & Motion", at: [-23, -3.6, 0] },
];

export const NODES: SkillNode[] = [
    {
        name: "C#",
        label: "C#",
        kind: "Object-Oriented Language",
        cluster: "foundations",
        at: [-27, 10.5, 2],
        blurb:
            "A strongly-typed, object-oriented language I've used to practice OOP concepts more deliberately, still sharpening my fluency with it.",
        uses: ["OOP Concepts", "Classes & Objects", "Type Safety", "Still Learning"],
    },
    {
        name: "C++",
        label: "C++",
        kind: "Systems Language",
        cluster: "foundations",
        at: [-18, 12, -1],
        blurb:
            "My first serious language, object oriented design, classes and the discipline of structured code.",
        uses: ["OOP Concepts", "Classes & Objects", "Algorithms", "Performance"],
    },
    {
        name: "Data Structures",
        label: "Data Structures",
        kind: "Core CS",
        cluster: "foundations",
        at: [-28.5, 5.5, 1],
        blurb:
            "Arrays, lists, trees and graphs, the vocabulary I use to reason about any problem before writing code.",
        uses: ["Trees & Graphs", "Hash Maps", "Complexity", "Clean Modelling"],
    },
    {
        name: "Algorithms",
        label: "Algorithms",
        kind: "Core CS · Learning",
        cluster: "foundations",
        at: [-17.5, 6, -2],
        blurb:
            "Currently deepening my problem solving: searching, sorting, recursion and the habit of measuring cost.",
        uses: ["Recursion", "Sorting & Searching", "Big-O Analysis", "Practice Daily"],
    },
    {
        name: "HTML",
        label: "HTML",
        kind: "Markup",
        cluster: "web",
        at: [10, 12, -1],
        blurb: "Semantic structure first, accessible, meaningful documents before any styling.",
        uses: ["Semantic Markup", "Accessibility", "SEO Structure", "Forms"],
    },
    {
        name: "CSS",
        label: "CSS",
        kind: "Styling",
        cluster: "web",
        at: [20.5, 10.5, 2],
        blurb: "Layout, motion and atmosphere, where an interface stops being functional and starts feeling designed.",
        uses: ["Layout Systems", "Responsive Design", "Animation", "Design Tokens"],
    },
    {
        name: "JavaScript",
        label: "JavaScript",
        kind: "Language",
        cluster: "web",
        at: [15, 6, -2],
        blurb: "The language everything else here is built on, the browser runtime I think in every day.",
        uses: ["ES Modules", "Async Flows", "DOM & Events", "Tooling"],
    },
    {
        name: "React",
        label: "React",
        kind: "UI Library",
        cluster: "frameworks",
        at: [-9, -0.5, 2],
        blurb:
            "A library for building user interfaces with component based architecture and reusable UI systems.",
        uses: ["Component Architecture", "State Management", "Interactive Interfaces", "Scalable Frontends"],
    },
    {
        name: "Next.js",
        label: "Next.js",
        kind: "React Framework",
        cluster: "frameworks",
        at: [-1, -1.8, -1],
        blurb: "Routing, rendering and structure on top of React for full applications rather than pages.",
        uses: ["Routing", "Server Rendering", "Data Fetching", "Production Builds"],
    },
    {
        name: "Tailwind CSS",
        label: "Tailwind CSS",
        kind: "Styling System",
        cluster: "frameworks",
        at: [7, -0.5, 1],
        blurb: "A token driven styling system that keeps a design language consistent across a whole product.",
        uses: ["Utility Classes", "Design Tokens", "Rapid Iteration", "Consistency"],
    },
    {
        name: "Three.js",
        label: "Three.js",
        kind: "3D Engine",
        cluster: "motion",
        at: [-27, -6.5, 1],
        blurb: "WebGL scenes in the browser, geometry, materials, lighting and camera work like this one.",
        uses: ["Scene Graphs", "Materials", "Lighting", "Cameras"],
    },
    {
        name: "React Three Fiber",
        label: "React Three Fiber",
        kind: "3D Renderer",
        cluster: "motion",
        at: [-18, -8.2, -1],
        blurb: "Three.js expressed as React components, so 3D scenes compose the same way interfaces do.",
        uses: ["Declarative 3D", "Frame Loops", "Drei Helpers", "Performance"],
    },
    {
        name: "GSAP",
        label: "GSAP",
        kind: "Animation",
        cluster: "motion",
        at: [-9, -6.8, 2],
        blurb: "Timeline based animation, the tool that keeps every beat of a cinematic sequence in sync.",
        uses: ["Timelines", "Easing", "Sequencing", "Scroll Motion"],
    },
    {
        name: "Lenis",
        label: "Lenis",
        kind: "Scroll",
        cluster: "motion",
        at: [1, -8.2, -2],
        blurb: "Smooth, inertial scrolling that turns a page into a controllable camera track.",
        uses: ["Smooth Scroll", "Scroll Progress", "Inertia", "Sync With RAF"],
    },
    {
        name: "Drei",
        label: "Drei",
        kind: "3D Toolkit",
        cluster: "motion",
        at: [10, -6.5, 1],
        blurb: "Ready made helpers for R3F, reflections, HTML in 3D space and camera utilities.",
        uses: ["Reflections", "HTML Overlays", "Loaders", "Controls"],
    },
];

/** Tiny external store so the DOM info panel can live outside the Canvas. */
let selected: string | null = null;
const listeners = new Set<() => void>();

export function setSelectedSkill(name: string | null) {
    selected = name;
    listeners.forEach((l) => l());
}

export function useSelectedSkill() {
    return useSyncExternalStore(
        (l) => {
            listeners.add(l);
            return () => listeners.delete(l);
        },
        () => selected,
        () => null
    );
}

export function findSkill(name: string | null) {
    return name ? (NODES.find((n) => n.name === name) ?? null) : null;
}
