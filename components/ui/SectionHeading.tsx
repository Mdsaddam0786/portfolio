import { Reveal } from "./Reveal";

type Props = { id: string; eyebrow: string; title: string; description?: string };

export function SectionHeading({ id, eyebrow, title, description }: Props) {
  return (
    <Reveal className="mb-12 max-w-2xl md:mb-16">
      <p className="text-accent font-mono text-sm tracking-widest uppercase">
        <span aria-hidden="true">{"// "}</span>
        {eyebrow}
      </p>
      <h2 id={id} className="font-display mt-3 text-3xl font-bold text-white md:text-5xl">
        {title}
      </h2>
      {description && <p className="text-muted mt-4 md:text-lg">{description}</p>}
    </Reveal>
  );
}
