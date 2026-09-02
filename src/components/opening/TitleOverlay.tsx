"use client";

import { useEffect, useRef } from "react";
import type { SequenceState } from "./sequence";

export function TitleOverlay({ s }: { s: SequenceState }) {
  const title = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (title.current) {
        title.current.style.opacity = String(s.title);
        const e = 1 - s.title;
        title.current.style.transform = `translate3d(0, ${e * 14}px, 0)`;
        title.current.style.letterSpacing = `${0.42 + e * 0.24}em`;
        title.current.style.filter = `blur(${e * 5}px)`;
      }
      if (hint.current) hint.current.style.opacity = String(s.hint);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [s]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={title} className="px-6 text-center opacity-0">
          <h1
            className="font-display text-[clamp(1.9rem,7.2vw,5.4rem)] font-light uppercase leading-none"
            style={{ color: "#F2F0EA" }}
          >
            Maham Zafar
          </h1>
          <p
            className="mt-7 font-sans text-[0.62rem] uppercase tracking-[0.58em] sm:text-[0.7rem]"
            style={{ color: "#C9A84C" }}
          >
            CS Student • Developer
          </p>
        </div>
      </div>

      <div
        ref={hint}
        className="absolute inset-x-0 bottom-9 flex flex-col items-center gap-3 opacity-0"
      >
        <span
          className="font-sans text-[0.58rem] uppercase tracking-[0.44em]"
          style={{ color: "rgba(242,240,234,0.5)" }}
        >
          Enter the gallery
        </span>
        <span className="h-9 w-px" style={{ background: "linear-gradient(#C9A84C, transparent)" }} />
      </div>
    </div>
  );
}
