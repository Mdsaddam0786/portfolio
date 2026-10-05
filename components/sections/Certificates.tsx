import { HiOutlineBadgeCheck, HiOutlineExternalLink } from "react-icons/hi";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certificates } from "@/data/certificates";
import { profile } from "@/data/profile";

export function Certificates() {
  return (
    <section
      id="certificates"
      aria-labelledby="certificates-title"
      className="relative py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="bg-primary/15 absolute top-1/2 left-0 h-80 w-80 rounded-full blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          id="certificates-title"
          eyebrow="Certifications"
          title="Always learning"
          description="Certifications I've earned along the way. The full gallery lives on its own site."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c, i) => (
            <li key={c.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <a
                  href={c.href ?? profile.certificatesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass neon-border group hover:shadow-glow-sm flex h-full items-center gap-4 rounded-2xl p-5 transition hover:-translate-y-1"
                >
                  <span className="bg-gradient-brand grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl text-white">
                    <HiOutlineBadgeCheck aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block font-semibold text-white">{c.title}</span>
                    <span className="text-muted mt-0.5 block text-xs">
                      {c.issuer ?? "Certification"}
                      {c.date && ` · ${c.date}`}
                    </span>
                  </span>
                  <HiOutlineExternalLink
                    aria-hidden="true"
                    className="text-muted group-hover:text-accent shrink-0 transition"
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10 text-center">
          <ButtonLink href={profile.certificatesUrl} target="_blank" rel="noopener noreferrer">
            View certificate gallery <HiOutlineExternalLink aria-hidden="true" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
