"use client";

import { useEffect, useRef } from "react";
import type { SequenceState } from "./sequence";

const EDUCATION_EXPERIENCE = [
    { year: "2025", text: "Started BS Computer Science at UET Lahore" },
    { year: "2026", text: "Full Stack Web Developer Intern at Nexsoft Solutions" },
];

const FOCUS = [
    { label: "Development", text: "Building robust and scalable apps" },
    { label: "Design", text: "Crafting clean and intuitive interfaces" },
    { label: "Performance", text: "Writing efficient and maintainable code" },
    { label: "Experience", text: "Creating meaningful digital experiences" },
];

/**
 * Real DOM content layered over the canvas — the monolith and archive panels
 * are the staging for this text, never its container.
 */
export function AboutOverlay({ s }: { s: SequenceState }) {
    const root = useRef<HTMLDivElement>(null);
    const center = useRef<HTMLDivElement>(null);
    const left = useRef<HTMLDivElement>(null);
    const right = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let raf = 0;
        const loop = () => {
            const a = s.about;
            if (root.current) {
                root.current.style.opacity = String(a);
                root.current.style.visibility = a < 0.01 ? "hidden" : "visible";
            }
            // counter-parallax so the panels feel pinned to the 3D walls
            const drift = s.camX;
            if (center.current) {
                center.current.style.transform = `translate3d(${-drift * 22}px, ${(1 - a) * 22}px, 0)`;
            }
            if (left.current) {
                const v = Math.max(0, -drift / 7.2);
                left.current.style.opacity = String(a * (0.75 + 0.25 * v));
                left.current.style.transform = `translate3d(${-drift * 34}px, 0, 0)`;
            }
            if (right.current) {
                const v = Math.max(0, drift / 7.2);
                right.current.style.opacity = String(a * (0.75 + 0.25 * v));
                right.current.style.transform = `translate3d(${-drift * 34}px, 0, 0)`;
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [s]);

    return (
        <div
            ref={root}
            className="pointer-events-none fixed inset-0 z-10 select-none opacity-0"
            style={{ visibility: "hidden" }}
        >
            {/* central monolith content */}
            <section
                ref={center}
                aria-label="About Maham Zafar"
                className="absolute left-1/2 top-[46%] w-[min(30rem,78vw)] -translate-x-1/2 -translate-y-1/2 text-center"
            >
                <p
                    className="font-sans text-[0.55rem] uppercase tracking-[0.52em]"
                    style={{ color: "rgba(242,240,234,0.55)" }}
                >
                    About
                </p>
                <h2
                    className="mt-4 font-display text-[clamp(1.5rem,4.4vw,2.8rem)] font-light uppercase leading-none"
                    style={{ color: "#F2F0EA", letterSpacing: "0.2em", textShadow: "0 0 34px rgba(201,168,76,0.45)" }}
                >
                    Maham Zafar
                </h2>
                <p
                    className="mt-4 font-sans text-[0.55rem] uppercase tracking-[0.4em]"
                    style={{ color: "#C9A84C" }}
                >
                    Computer Science · Developer
                </p>
                <span
                    className="mx-auto mt-7 block h-10 w-px"
                    style={{ background: "linear-gradient(rgba(201,168,76,0.7), transparent)" }}
                />
                <p
                    className="mx-auto mt-7 max-w-sm font-sans text-[0.78rem] leading-[2] tracking-[0.06em]"
                    style={{ color: "rgba(242,240,234,0.78)" }}
                >
                    I&apos;m a Computer Science student who likes building things that feel considered, interfaces with real craft behind them, not just working code. Lately that's meant learning to think in three dimensions: cameras, light, and motion, not just components and state. I care about the details most people won't notice until they're missing.
                </p>
            </section>

            {/* left archive panel — Education & Experience */}
            <section
                ref={left}
                aria-label="Education and Experience"
                className="absolute left-[4vw] top-1/2 w-[13rem] -translate-y-1/2"
            >
                <h3
                    className="font-sans text-[0.55rem] uppercase tracking-[0.46em]"
                    style={{ color: "rgba(242,240,234,0.6)" }}
                >
                    Education & Experience
                </h3>
                <ol className="mt-6 space-y-6">
                    {EDUCATION_EXPERIENCE.map((j) => (
                        <li key={j.year} className="relative pl-5">
                            <span
                                className="absolute left-0 top-[0.42rem] h-1 w-1 rounded-full"
                                style={{ background: "#C9A84C", boxShadow: "0 0 10px #C9A84C" }}
                            />
                            <p className="font-display text-[0.8rem] tracking-[0.16em]" style={{ color: "#C9A84C" }}>
                                {j.year}
                            </p>
                            <p
                                className="mt-1 font-sans text-[0.66rem] leading-[1.8]"
                                style={{ color: "rgba(242,240,234,0.62)" }}
                            >
                                {j.text}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* right archive panel — Focus */}
            <section
                ref={right}
                aria-label="Focus"
                className="absolute right-[4vw] top-1/2 w-[13rem] -translate-y-1/2"
            >
                <h3
                    className="font-sans text-[0.55rem] uppercase tracking-[0.46em]"
                    style={{ color: "rgba(242,240,234,0.6)" }}
                >
                    Focus
                </h3>
                <ul className="mt-6 space-y-6">
                    {FOCUS.map((f) => (
                        <li key={f.label} className="relative pl-5">
                            <span
                                className="absolute left-0 top-[0.42rem] h-1 w-1 rotate-45"
                                style={{ background: "#C9A84C", boxShadow: "0 0 10px #C9A84C" }}
                            />
                            <p
                                className="font-sans text-[0.62rem] uppercase tracking-[0.28em]"
                                style={{ color: "#C9A84C" }}
                            >
                                {f.label}
                            </p>
                            <p
                                className="mt-1 font-sans text-[0.66rem] leading-[1.8]"
                                style={{ color: "rgba(242,240,234,0.62)" }}
                            >
                                {f.text}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
