import type { IconType } from "react-icons";

export type SocialLink = {
  name: string;
  href: string;
  icon: IconType;
};

export type Skill = {
  name: string;
  icon: IconType;
  color: string;
};

export type SkillGroup = {
  title: string;
  skills: Skill[];
};

export type ProjectCategory = "Full Stack" | "Frontend" | "Backend";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  highlights: string[];
  tech: string[];
  category: ProjectCategory;
  featured: boolean;
  github?: string;
  live?: string;
  image?: string;
};

export type TimelineItem = {
  title: string;
  org: string;
  location?: string;
  period: string;
  current?: boolean;
  points: string[];
  kind: "work" | "education";
};

export type Certificate = {
  title: string;
  issuer?: string;
  date?: string;
  href?: string;
};
