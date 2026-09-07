"use client";

import { findSkill, setSelectedSkill, useSelectedSkill } from "./skillsData";

/** The info plate that opens when a skill marker is clicked. */
export function SkillPanel() {
    const selected = useSelectedSkill();
    const skill = findSkill(selected);

    return (
        <div
            className="pointer-events-none fixed right-4 top-20 z-30 w-[21rem] max-w-[calc(100vw-2rem)] transition-all duration-500 md:right-10 md:top-24 md:w-[23rem]"
            style={{
                opacity: skill ? 1 : 0,
                transform: `translateX(${skill ? "0" : "1.5rem"})`,
            }}
            aria-hidden={!skill}
        >
            {skill && (
                <div
                    className="pointer-events-auto relative max-h-[calc(100vh-8rem)] overflow-y-auto px-7 py-8"
                    style={{
                        border: "1px solid rgba(201,168,76,0.55)",
                        background: "rgba(5,5,5,0.88)",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 0 60px rgba(201,168,76,0.12)",
                    }}
                >

                    <button
                        type="button"
                        onClick={() => setSelectedSkill(null)}
                        className="absolute right-3 top-2 font-sans text-lg leading-none"
                        style={{ color: "rgba(201,168,76,0.8)" }}
                        aria-label="Close skill details"
                    >
                        ×
                    </button>

                    <div className="flex items-center gap-4">
                        <span
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                            style={{ border: "1px solid rgba(201,168,76,0.7)" }}
                        >
                            <span
                                className="block h-2 w-2 rounded-full"
                                style={{ background: "#FFE3AC", boxShadow: "0 0 12px #C9A84C" }}
                            />
                        </span>
                        <div>
                            <h3
                                className="font-display text-[1.1rem] uppercase tracking-[0.32em]"
                                style={{ color: "#F2F0EA" }}
                            >
                                {skill.label}
                            </h3>
                            <p
                                className="mt-1 font-sans text-[0.68rem] uppercase tracking-[0.26em]"
                                style={{ color: "#C9A84C" }}
                            >
                                {skill.kind}
                            </p>
                        </div>
                    </div>

                    <p
                        className="mt-5 font-sans text-[0.86rem] leading-relaxed"
                        style={{ color: "rgba(242,240,234,0.78)" }}
                    >
                        {skill.blurb}
                    </p>

                    <p
                        className="mt-6 font-sans text-[0.62rem] uppercase tracking-[0.3em]"
                        style={{ color: "#C9A84C" }}
                    >
                        What I use it for
                    </p>
                    <ul className="mt-3 space-y-2">
                        {skill.uses.map((u) => (
                            <li
                                key={u}
                                className="font-sans text-[0.8rem]"
                                style={{ color: "rgba(242,240,234,0.72)" }}
                            >
                                <span style={{ color: "#C9A84C" }}>·</span> {u}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
