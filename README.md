# Md Saddam — 3D Portfolio

A dark neon 3D portfolio built with Next.js 16, React Three Fiber, Tailwind CSS v4 and Framer Motion.

## Features

- **3D hero**: photo on a floating glass card with neon rings, starfield, sparkles and bloom. Tilts with the mouse.
- **Sections**: About, Skills (draggable 3D icon sphere), Projects (filter, tilt cards, detail modal), Experience timeline, live GitHub activity, Certificates, Contact.
- **"Ask about me" AI chatbot**: Vercel AI SDK + AI Gateway. Answers only from the files in `data/`.
- **Contact form**: React Hook Form + Zod, sent by a Server Action through Resend. Includes a honeypot and rate limiting.
- **Polish**: asset loader, custom cursor, Lenis smooth scroll, Vercel Analytics and Speed Insights.
- **Good practices**:
  - Supports `prefers-reduced-motion`, keyboard navigation, a skip link, and ARIA labels.
  - SEO: metadata, generated OG image, JSON-LD, sitemap and robots.
  - Security headers.
  - Performance: the 3D scene loads lazily, adapts its pixel density (DPR), and degrades on slow devices.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the keys you have
npm run dev                  # http://localhost:3000
```

Every integration is optional locally. Without its key, each one falls back gracefully:

| Variable               | Used for                                     |
| ---------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, OG tags              |
| `RESEND_API_KEY`       | Contact form email                           |
| `CONTACT_TO_EMAIL`     | Inbox that receives messages                 |
| `CONTACT_FROM_EMAIL`   | Sender (must be a verified Resend domain)    |
| `AI_GATEWAY_API_KEY`   | Chatbot (not needed on Vercel — uses OIDC)   |
| `GITHUB_TOKEN`         | Contribution graph + higher GitHub API limit |

## Updating content

All content lives in typed files in `data/`, so you never need to touch components:

- `profile.ts`: name, roles, bio, stats, photo, resume
- `projects.ts`: projects (put screenshots in `public/images/projects/`)
- `experience.ts`, `skills.ts`, `certificates.ts`, `socials.ts`

The chatbot reads the same files, so it stays in sync automatically.

## Scripts

| Script                            | Description                            |
| --------------------------------- | -------------------------------------- |
| `npm run dev`                     | Dev server (Turbopack)                 |
| `npm run build` / `npm start`     | Production build / serve               |
| `npm run typecheck`               | Generate route types + `tsc`           |
| `npm run lint`                    | ESLint                                 |
| `npm run format` / `format:check` | Prettier (with Tailwind class sorting) |

CI (`.github/workflows/ci.yml`) runs typecheck, lint, format check and build on every push and PR.

## Deploy

Push to GitHub and import the repo in Vercel. Then add the environment variables above in **Project → Settings → Environment Variables**.
