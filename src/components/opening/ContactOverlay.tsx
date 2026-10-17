"use client";

import { useEffect, useRef } from "react";
import type { SequenceState } from "./sequence";

export const CONTACT = {
  email: "zmaham536@gmail.com",
  github: "https://github.com/zMaham774",
  linkedin: "https://www.linkedin.com/in/maham-zafar-10b8983a1/",
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function ContactOverlay({ s }: { s: SequenceState }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = () => {
      const el = root.current;
      if (el) {
        const c = s.contact;
        el.style.visibility = c < 0.01 ? "hidden" : "visible";
        el.inert = c < 0.5;
        // staggered: heading, then line, then links
        el.querySelectorAll<HTMLElement>("[data-step]").forEach((node) => {
          const step = Number(node.dataset["step"]);
          const o = reduced ? (c > 0.01 ? 1 : 0) : clamp01((c - step * 0.18) / 0.46);
          node.style.opacity = String(o);
          node.style.transform = reduced ? "none" : `translate3d(0, ${(1 - o) * 14}px, 0)`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [s]);

  return (
    <section ref={root} className="contact-overlay" aria-label="Contact" style={{ visibility: "hidden" }}>
      <div className="contact-block">
        <p className="contact-eyebrow" data-step="0">CONTACT</p>
        <h2 className="contact-heading" data-step="0">Let&apos;s talk</h2>
        <p className="contact-line" data-step="1">If something here caught your eye, I&apos;d like to hear from you.</p>
        <ul className="contact-links" data-step="2">
          {CONTACT.email && (
            <li>
              <a className="contact-email" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
          )}
          {CONTACT.github && (
            <li>
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </li>
          )}
          {CONTACT.linkedin && (
            <li>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </li>
          )}
        </ul>
      </div>
      <p className="contact-copy" data-step="3">© 2026 Maham Zafar</p>
    </section>
  );
}
