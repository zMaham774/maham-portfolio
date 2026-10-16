import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/components/opening/projectsData";
import { PROJECT_DETAILS } from "@/data/projectDetails";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name} (${project.category}) | Maham Zafar`;
  return {
    title,
    description: project.description,
    openGraph: { title, description: project.description, type: "article" },
  };
}

const sectionLabel = "text-[0.7rem] uppercase tracking-[0.35em] text-[#c9a84c]";
const externalLink =
  "border-b border-[#c9a84c] pb-1 text-[0.7rem] uppercase tracking-[0.25em] transition-colors hover:text-[#c9a84c]";

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = PROJECTS[index];
  const detail = PROJECT_DETAILS[project.slug];
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const collaborators = (detail.collaborators ?? []).filter((c) => c.name.trim());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.name} (${project.category})`,
    description: project.description,
    author: { "@type": "Person", name: "Maham Zafar" },
    keywords: detail.stack.join(", "),
  };

  return (
    <main className="min-h-screen bg-[#050505] font-sans text-[#f2f0ea]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
        <Link
          href="/"
          className="text-[0.7rem] uppercase tracking-[0.3em] text-[#c9a84c] transition-opacity hover:opacity-70"
        >
          ← Back to the gallery
        </Link>

        <header className="mt-14">
          <p className={sectionLabel}>
            {project.number} / {String(PROJECTS.length).padStart(2, "0")} · {project.category}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2rem,6vw,3.6rem)] font-light uppercase leading-[1.05] tracking-[0.06em]">
            {project.name}
          </h1>
          <p className="mt-6 text-base leading-8 text-[#f2f0ea]/75">{project.description}</p>

          {detail.links && detail.links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {detail.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={externalLink}>
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </header>

        <section className="mt-16">
          <h2 className={sectionLabel}>Overview</h2>
          <div className="mt-5 space-y-5 text-[0.95rem] leading-8 text-[#f2f0ea]/80">
            {detail.overview.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className={sectionLabel}>Highlights</h2>
          <ul className="mt-5 space-y-3 text-[0.95rem] leading-8 text-[#f2f0ea]/80">
            {detail.highlights.map((h) => (
              <li key={h} className="flex gap-4">
                <span aria-hidden className="mt-3 h-1 w-1 shrink-0 rotate-45 bg-[#c9a84c]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className={sectionLabel}>Built with</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {detail.stack.map((t) => (
              <li
                key={t}
                className="border border-[#c9a84c]/40 px-4 py-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#f2f0ea]/85"
              >
                {t}
              </li>
            ))}
          </ul>
        </section>

        {detail.screenshots && detail.screenshots.length > 0 && (
          <section className="mt-16">
            <h2 className={sectionLabel}>Screens</h2>
            <div className="mt-6 space-y-10">
              {detail.screenshots.map((s) => (
                <figure key={s.src}>
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={s.height}
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="h-auto w-full border border-[#c9a84c]/25"
                  />
                  <figcaption className="mt-3 text-[0.75rem] leading-6 tracking-[0.04em] text-[#f2f0ea]/55">
                    {s.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {collaborators.length > 0 && (
          <section className="mt-14">
            <h2 className={sectionLabel}>Team</h2>
            <ul className="mt-5 space-y-5">
              {collaborators.map((c) => (
                <li key={c.name}>
                  <p className="font-display text-lg tracking-[0.06em]">
                    {c.name}
                    {c.role && (
                      <span className="ml-3 text-[0.7rem] uppercase tracking-[0.2em] text-[#f2f0ea]/55">
                        {c.role}
                      </span>
                    )}
                  </p>
                  {(c.github || c.linkedin) && (
                    <p className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                      {c.github && (
                        <a href={c.github} target="_blank" rel="noopener noreferrer" className={externalLink}>
                          GitHub ↗
                        </a>
                      )}
                      {c.linkedin && (
                        <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className={externalLink}>
                          LinkedIn ↗
                        </a>
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {detail.decisions && detail.decisions.length > 0 && (
          <section className="mt-14">
            <h2 className={sectionLabel}>Decisions</h2>
            <div className="mt-5 space-y-8">
              {detail.decisions.map((d) => (
                <div key={d.title}>
                  <h3 className="font-display text-lg tracking-[0.08em]">{d.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-8 text-[#f2f0ea]/75">{d.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <nav
          aria-label="More projects"
          className="mt-24 grid gap-8 border-t border-[#c9a84c]/25 pt-10 sm:grid-cols-2"
        >
          <Link href={`/projects/${prev.slug}`} className="group">
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[#c9a84c]">← Previous</span>
            <span className="mt-2 block font-display text-lg uppercase tracking-[0.08em] transition-colors group-hover:text-[#c9a84c]">
              {prev.name}
            </span>
            <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.2em] text-[#f2f0ea]/55">
              {prev.category}
            </span>
          </Link>
          <Link href={`/projects/${next.slug}`} className="group sm:text-right">
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[#c9a84c]">Next →</span>
            <span className="mt-2 block font-display text-lg uppercase tracking-[0.08em] transition-colors group-hover:text-[#c9a84c]">
              {next.name}
            </span>
            <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.2em] text-[#f2f0ea]/55">
              {next.category}
            </span>
          </Link>
        </nav>
      </div>
    </main>
  );
}