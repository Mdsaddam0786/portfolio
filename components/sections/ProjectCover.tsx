import Image from "next/image";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

// Uses the project screenshot when one exists in data, otherwise a branded placeholder.
export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const initials = project.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className={cn("bg-bg-soft relative overflow-hidden rounded-xl", className)}>
      <div className="border-line flex items-center gap-1.5 border-b px-3 py-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="text-muted ml-2 truncate font-mono text-[10px]">
          {project.live?.replace(/^https?:\/\//, "") ?? `github.com/${project.slug}`}
        </span>
      </div>
      <div className="relative aspect-[16/9]">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="bg-grid absolute inset-0 grid place-items-center" aria-hidden="true">
            <div className="bg-gradient-brand absolute h-32 w-32 rounded-full opacity-40 blur-3xl" />
            <span className="text-gradient font-display relative text-6xl font-bold">
              {initials}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
