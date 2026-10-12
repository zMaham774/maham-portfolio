"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { SequenceState } from './sequence';
import { PROJECTS } from './projectsData';

export function ProjectsOverlay({ s, selected, onSelect }: { s: SequenceState; selected: number; onSelect: (i: number) => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = root.current;
      if (el) {
        el.style.opacity = String(s.gallery);
        el.style.visibility = s.gallery < 0.02 ? 'hidden' : 'visible';
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [s]);

  return (
    <div ref={root} className="projects-overlay" style={{ opacity: 0, visibility: 'hidden' }}>
      <header className="projects-heading">
        <h2>PROJECTS</h2>
        <p className="projects-eyebrow">EXHIBITION GALLERY</p>
        <p className="projects-intro">A curated collection of experiences I&apos;ve designed and built with intention and craft.</p>
      </header>

      <nav className="projects-directory" aria-label="Project exhibits">
        {PROJECTS.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => onSelect(i)}
            className={`projects-directory-item ${selected === i ? 'is-current' : ''}`}
            aria-current={selected === i ? 'true' : undefined}
          >
            <span className="projects-directory-number">{project.number}</span>
            <span className="projects-directory-name">{project.name}</span>
          </button>
        ))}
      </nav>

      <section className="projects-feature" aria-live="polite" aria-label="Featured project">
        {PROJECTS.map((project, i) => (
          <div key={project.slug} className={`projects-feature-content ${i === selected ? 'is-current' : ''}`} aria-hidden={i !== selected}>
            <span className="projects-feature-number">{project.number} / 04</span>
            <h3>{project.name}</h3>
            <p className="projects-feature-category">{project.category}</p>
            <p className="projects-feature-description">{project.description}</p>
            <Link
              href={`/projects/${project.slug}`}
              className="projects-view-link"
              tabIndex={i === selected ? 0 : -1}
            >
              VIEW PROJECT <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </div>
        ))}
      </section>

      <p className="projects-plaque">Each project is an exploration.<br />Each detail is intentional.</p>

      <div className="projects-mobile-switcher" aria-label="Choose an exhibit">
        {PROJECTS.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            className={selected === i ? 'is-current' : ''}
            onClick={() => onSelect(i)}
            aria-label={`Feature ${project.name}, ${project.category}`}
          >
            {project.number}
          </button>
        ))}
      </div>
    </div>
  );
}