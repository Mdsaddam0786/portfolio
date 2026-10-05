import "server-only";
import { certificates } from "@/data/certificates";
import { timeline } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { socials } from "@/data/socials";

// The chatbot only knows what's in the data files, so it can't drift from the site.
export function buildSystemPrompt() {
  const experience = timeline
    .map((t) => `- ${t.title} at ${t.org} (${t.period})\n  ${t.points.join("\n  ")}`)
    .join("\n");
  const projectList = projects
    .map(
      (p) =>
        `- ${p.title} [${p.tech.join(", ")}]: ${p.summary} ${p.highlights.join(" ")}${p.live ? ` Live: ${p.live}` : ""}${p.github ? ` Code: ${p.github}` : ""}`,
    )
    .join("\n");
  const skills = skillGroups
    .map((g) => `${g.title}: ${g.skills.map((s) => s.name).join(", ")}`)
    .join("\n");

  return `You are the assistant on ${profile.name}'s portfolio website. Answer visitors' questions about ${profile.firstName} in a friendly, concise, professional way (2–4 short sentences unless more detail is asked for). Refer to ${profile.firstName} by name.

Only use the facts below. If something isn't covered, say you don't know and suggest emailing ${profile.email}. Never invent employers, dates, numbers or projects. Politely decline unrelated requests (coding help, general trivia, etc.) and steer back to ${profile.firstName}'s work.

## Profile
Name: ${profile.name}
Role: ${profile.role}
Location: ${profile.location}
Email: ${profile.email}
Summary: ${profile.bio.join(" ")}

## Experience & education
${experience}

## Skills
${skills}

## Projects
${projectList}

## Certifications
${certificates.map((c) => c.title).join(", ")} — gallery: ${profile.certificatesUrl}

## Links
${socials.map((s) => `${s.name}: ${s.href}`).join("\n")}
Resume: available via the "Resume" button on the site.`;
}
