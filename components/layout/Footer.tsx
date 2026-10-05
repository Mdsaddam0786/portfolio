import { socials } from "@/data/socials";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-line border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row md:px-6">
        <p className="text-muted text-sm">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js & Three.js.
        </p>
        <ul className="flex items-center gap-3">
          {socials.map(({ name, href, icon: Icon }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="glass text-muted hover:text-accent hover:shadow-glow-sm grid h-10 w-10 place-items-center rounded-full text-lg transition"
              >
                <Icon aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
