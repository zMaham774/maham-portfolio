"use client";

import { type RefObject } from "react";

type IntroTitleProps = {
  titleRef: RefObject<HTMLDivElement | null>;
  subtitleRef: RefObject<HTMLDivElement | null>;
};

export default function IntroTitle({ titleRef, subtitleRef }: IntroTitleProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center">
          <div
            className="absolute h-[18rem] w-[52rem] rounded-full bg-[radial-gradient(circle,_rgba(219,170,83,0.62),_rgba(219,170,83,0.2)_28%,_rgba(0,0,0,0)_70%)] blur-[28px]"
            style={{ transform: "translateY(8px)" }}
          />

          <div
            ref={titleRef}
            className="relative font-sans text-[clamp(2.5rem,5.8vw,6.25rem)] uppercase leading-[0.9] tracking-[0.32em] text-[#f5ebdc] opacity-0"
            style={{
              textTransform: "uppercase",
              textShadow: "0 0 18px rgba(242, 191, 99, 0.6), 0 0 34px rgba(242, 191, 99, 0.36)",
            }}
          >
            MAHAM ZAFAR
          </div>
        </div>

        <div
          ref={subtitleRef}
          className="mt-5 font-sans text-[0.7rem] uppercase tracking-[0.58em] text-[#d9c7a0] opacity-0 sm:text-[0.8rem]"
          style={{
            textTransform: "uppercase",
            textShadow: "0 0 18px rgba(217, 183, 125, 0.32)",
          }}
        >
          COMPUTER SCIENCE · DEVELOPER
        </div>
      </div>
    </div>
  );
}
