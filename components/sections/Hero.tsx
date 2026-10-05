import { HiArrowDown, HiOutlineMail } from "react-icons/hi";
import { ButtonLink } from "@/components/ui/Button";
import { Typewriter } from "@/components/ui/Typewriter";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { HeroCanvas } from "./HeroCanvas";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh items-center overflow-hidden pt-24 pb-16"
    >
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="bg-primary/25 absolute top-1/4 -left-32 h-96 w-96 rounded-full blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="bg-accent/15 absolute right-0 bottom-0 h-96 w-96 rounded-full blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 md:px-6 lg:grid-cols-2">
        <div className="order-2 min-w-0 text-center lg:order-1 lg:text-left">
          <p className="glass text-muted inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Open to new opportunities
          </p>

          <h1
            id="hero-title"
            className="font-display mt-6 text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl"
          >
            Hi, I&apos;m <span className="text-gradient">{profile.name}</span>
          </h1>
          <p className="font-display text-text mt-4 h-9 text-xl font-medium sm:text-2xl">
            <Typewriter words={profile.roles} />
          </p>
          <p className="text-muted mx-auto mt-6 max-w-xl md:text-lg lg:mx-0">{profile.tagline}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink href="#projects">
              View Projects <HiArrowDown aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost">
              <HiOutlineMail aria-hidden="true" /> Contact Me
            </ButtonLink>
          </div>

          <ul
            className="mt-8 flex justify-center gap-3 lg:justify-start"
            aria-label="Social profiles"
          >
            {socials.map(({ name, href, icon: Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="glass text-muted hover:text-accent hover:shadow-glow-sm grid h-11 w-11 place-items-center rounded-full text-lg transition hover:-translate-y-1"
                >
                  <Icon aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 h-[52svh] min-h-[340px] min-w-0 [mask-image:radial-gradient(closest-side,black_72%,transparent)] lg:order-2 lg:h-[78svh]">
          <HeroCanvas />
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="text-muted absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs md:flex"
      >
        <span className="border-muted/50 flex h-9 w-5 justify-center rounded-full border p-1">
          <span className="bg-accent h-2 w-1 animate-bounce rounded-full" />
        </span>
      </a>
    </section>
  );
}
