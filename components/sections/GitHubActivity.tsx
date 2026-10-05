import { FaGithub, FaRegStar } from "react-icons/fa";
import { HiOutlineCode, HiOutlineCollection, HiOutlineFire } from "react-icons/hi";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";
import { getGitHubStats } from "@/lib/github";
import { cn } from "@/lib/utils";

const LEVEL_CLASSES = [
  "bg-white/5",
  "bg-primary/30",
  "bg-primary/55",
  "bg-primary-light/80",
  "bg-accent shadow-[0_0_6px_#22d3ee]",
];

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  Java: "#F89820",
  "C++": "#00599C",
  HTML: "#E34F26",
  CSS: "#1572B6",
};

export async function GitHubActivity() {
  const stats = await getGitHubStats(profile.githubUsername);
  const profileUrl = `https://github.com/${profile.githubUsername}`;

  return (
    <section id="github" aria-labelledby="github-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          id="github-title"
          eyebrow="Open source"
          title="GitHub activity"
          description="Live from my GitHub profile, refreshed every hour."
        />

        {!stats ? (
          <Reveal className="glass text-muted rounded-2xl p-8 text-center">
            GitHub stats are unavailable right now.{" "}
            <a
              href={profileUrl}
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit my profile
            </a>
            .
          </Reveal>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal className="grid grid-cols-2 gap-4 lg:col-span-1">
              {[
                { label: "Public repos", value: stats.publicRepos, icon: HiOutlineCollection },
                { label: "Total stars", value: stats.totalStars, icon: FaRegStar },
                {
                  label: "Contributions (1y)",
                  value: stats.totalContributions ?? "—",
                  icon: HiOutlineFire,
                },
                { label: "Languages", value: stats.languages.length, icon: HiOutlineCode },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="glass neon-border rounded-2xl p-5">
                  <Icon className="text-accent text-xl" aria-hidden="true" />
                  <p className="font-display mt-3 text-3xl font-bold text-white">{value}</p>
                  <p className="text-muted text-xs">{label}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.1} className="glass neon-border rounded-2xl p-6 lg:col-span-2">
              {stats.weeks.length > 0 ? (
                <>
                  <h3 className="font-display text-lg font-semibold text-white">
                    Contribution graph
                  </h3>
                  <div className="mt-4 overflow-x-auto pb-2" data-lenis-prevent>
                    <div
                      className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
                      role="img"
                      aria-label={`${stats.totalContributions} contributions in the last year`}
                    >
                      {stats.weeks.flatMap((week) =>
                        week.map((d) => (
                          <span
                            key={d.date}
                            title={`${d.count} contributions on ${d.date}`}
                            className={cn(
                              "h-[11px] w-[11px] rounded-[3px]",
                              LEVEL_CLASSES[d.level],
                            )}
                          />
                        )),
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <h3 className="font-display text-lg font-semibold text-white">Top languages</h3>
              )}

              {stats.languages.length > 0 && (
                <div className="mt-6">
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-white/5">
                    {stats.languages.map((l) => (
                      <span
                        key={l.name}
                        style={{
                          width: `${(l.count / stats.languages.reduce((s, x) => s + x.count, 0)) * 100}%`,
                          backgroundColor: LANG_COLORS[l.name] ?? "#8b5cf6",
                        }}
                      />
                    ))}
                  </div>
                  <ul className="text-muted mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    {stats.languages.map((l) => (
                      <li key={l.name} className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: LANG_COLORS[l.name] ?? "#8b5cf6" }}
                        />
                        {l.name} <span className="text-xs">({l.count})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {stats.topRepos.map((r) => (
                  <li key={r.name}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-line hover:border-primary/50 hover:bg-primary/5 block rounded-xl border bg-white/[0.02] p-4 transition"
                    >
                      <p className="flex items-center gap-2 font-mono text-sm text-white">
                        <FaGithub aria-hidden="true" className="text-muted" /> {r.name}
                      </p>
                      {r.description && (
                        <p className="text-muted mt-1 line-clamp-2 text-xs">{r.description}</p>
                      )}
                      <p className="text-muted mt-2 flex gap-3 text-xs">
                        {r.language && <span>{r.language}</span>}
                        <span className="flex items-center gap-1">
                          <FaRegStar aria-hidden="true" /> {r.stars}
                        </span>
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        )}

        <Reveal className="mt-8 text-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass text-text hover:text-accent hover:shadow-glow-sm inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition"
          >
            <FaGithub aria-hidden="true" /> @{profile.githubUsername}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
