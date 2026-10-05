"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink, HiOutlineSparkles, HiX } from "react-icons/hi";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { projectCategories, projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { ProjectCover } from "./ProjectCover";

type Category = (typeof projectCategories)[number];

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex gap-2">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} source code on GitHub`}
          className="glass text-muted grid h-9 w-9 place-items-center rounded-full transition hover:text-white"
        >
          <FaGithub aria-hidden="true" />
        </a>
      )}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} live demo`}
          className="glass text-muted hover:text-accent grid h-9 w-9 place-items-center rounded-full transition"
        >
          <HiOutlineExternalLink aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function TechTags({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
      {tech.map((t) => (
        <li
          key={t}
          className="bg-primary/10 text-primary-light rounded-full px-2.5 py-0.5 font-mono text-xs"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Category>("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visible = projects.filter((p) => filter === "All" || p.category === filter);

  const open = (p: Project) => {
    setSelected(p);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          id="projects-title"
          eyebrow="Projects"
          title="Things I've built"
          description="A selection of full stack apps, APIs and frontends — click a card for details."
        />

        <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
          {projectCategories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition",
                filter === c
                  ? "bg-gradient-brand shadow-glow-sm text-white"
                  : "glass text-muted hover:text-white",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.ul layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={p.featured ? "lg:col-span-3" : "lg:col-span-2"}
              >
                <TiltCard className="h-full rounded-2xl">
                  <article className="glass neon-border flex h-full flex-col rounded-2xl p-4">
                    <button
                      type="button"
                      onClick={() => open(p)}
                      className="group block text-left"
                      aria-label={`Open details for ${p.title}`}
                    >
                      <ProjectCover
                        project={p}
                        className="group-hover:shadow-glow transition duration-500"
                      />
                    </button>
                    <div className="mt-4 flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-xl font-semibold text-white">
                          {p.title}
                          {p.featured && (
                            <span className="bg-accent/10 text-accent ml-2 inline-flex translate-y-[-2px] items-center gap-1 rounded-full px-2 py-0.5 align-middle text-[10px] font-medium tracking-wide uppercase">
                              <HiOutlineSparkles aria-hidden="true" /> Featured
                            </span>
                          )}
                        </h3>
                        <ProjectLinks project={p} />
                      </div>
                      <p className="text-muted mt-2 flex-1 text-sm">{p.summary}</p>
                      <div className="mt-4">
                        <TechTags tech={p.tech} />
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <Reveal className="mt-10 text-center">
          <a
            href="https://github.com/Mdsaddam0786?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent inline-flex items-center gap-2 text-sm transition"
          >
            <FaGithub aria-hidden="true" /> See all repositories on GitHub
          </a>
        </Reveal>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setSelected(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-labelledby="project-dialog-title"
        className="text-text m-auto w-[min(92vw,720px)] rounded-3xl bg-transparent p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {selected && (
          <div
            data-lenis-prevent
            className="glass neon-border bg-bg-soft/95 max-h-[88svh] overflow-y-auto rounded-3xl p-5 md:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-accent font-mono text-xs tracking-widest uppercase">
                  {selected.category}
                </p>
                <h3
                  id="project-dialog-title"
                  className="font-display mt-1 text-2xl font-bold text-white md:text-3xl"
                >
                  {selected.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close project details"
                className="glass text-muted grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl hover:text-white"
              >
                <HiX />
              </button>
            </div>
            <ProjectCover project={selected} />
            <p className="text-muted mt-5">{selected.summary}</p>
            <ul className="mt-5 space-y-3">
              {selected.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full shadow-[0_0_8px_#22d3ee]"
                  />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <TechTags tech={selected.tech} />
              <ProjectLinks project={selected} />
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
