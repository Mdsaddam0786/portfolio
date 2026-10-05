import { FaJava } from "react-icons/fa";
import { TbApi, TbBinaryTree, TbLock } from "react-icons/tb";
import {
  SiCplusplus,
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiReact,
  SiRedis,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: [
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "Java", icon: FaJava, color: "#F89820" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "HTML", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS", icon: SiCss, color: "#1572B6" },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "Redux", icon: SiRedux, color: "#764ABC" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express.js", icon: SiExpress, color: "#FFFFFF" },
      { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
      { name: "REST APIs", icon: TbApi, color: "#22D3EE" },
      { name: "JWT Auth", icon: TbLock, color: "#8B5CF6" },
    ],
  },
  {
    title: "Database",
    skills: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "Redis", icon: SiRedis, color: "#FF4438" },
    ],
  },
  {
    title: "Tools & Core",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "DSA", icon: TbBinaryTree, color: "#22D3EE" },
    ],
  },
];

export const allSkills = skillGroups.flatMap((g) => g.skills);
