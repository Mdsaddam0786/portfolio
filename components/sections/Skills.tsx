import { SkillsSphere } from "@/components/canvas/SkillsSphere";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/skills";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-24 md:py-32">
      <div
        aria-hidden="true"
        className="bg-accent/10 absolute top-1/3 right-0 h-80 w-80 rounded-full blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills"
          title="My tech stack"
          description="Tools I use to design, build and ship full stack products. Drag the sphere to spin it."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SkillsSphere />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map((group, i) => (
              <Reveal
                key={group.title}
                delay={i * 0.08}
                className="glass neon-border rounded-2xl p-5 last:sm:col-span-2"
              >
                <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.skills.map(({ name, icon: Icon, color }) => (
                    <li
                      key={name}
                      className="text-text flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm"
                    >
                      <Icon aria-hidden="true" style={{ color }} />
                      {name}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
