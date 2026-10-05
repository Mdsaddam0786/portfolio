import Image from "next/image";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading id="about-title" eyebrow="About me" title="Building the web, end to end" />

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Reveal className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden="true"
              className="bg-gradient-brand absolute -inset-3 rounded-4xl opacity-40 blur-2xl"
            />
            <div className="neon-border bg-bg-soft relative overflow-hidden rounded-4xl">
              <Image
                src={profile.photoFull}
                alt={`Portrait of ${profile.name}`}
                width={900}
                height={1200}
                sizes="(min-width: 1024px) 384px, 90vw"
                className="h-auto w-full object-cover"
              />
              <div className="glass absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm">
                <HiOutlineLocationMarker className="text-accent" aria-hidden="true" />
                {profile.location}
              </div>
            </div>
          </Reveal>

          <div>
            {profile.bio.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-muted mb-5 leading-relaxed md:text-lg">{p}</p>
              </Reveal>
            ))}

            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {profile.stats.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={0.1 * i}
                  className="glass neon-border flex flex-col-reverse rounded-2xl p-5 text-center"
                >
                  <dt className="text-muted mt-1 text-xs">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold text-white">
                    <Counter
                      value={s.value}
                      prefix={"prefix" in s ? s.prefix : undefined}
                      suffix={"suffix" in s ? s.suffix : undefined}
                    />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
