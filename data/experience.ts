import type { TimelineItem } from "@/types";

export const timeline: TimelineItem[] = [
  {
    title: "Full Stack Designer & Developer",
    org: "IIFA Degree Institute",
    location: "Bengaluru",
    period: "Aug 2026 – Present",
    current: true,
    kind: "work",
    points: [
      "Designed and optimized SQL tables and indexes, and wrote efficient aggregate queries — effectively leveraging Claude AI.",
      "Integrated AI-powered file tagging using Redis job queues for asynchronous processing, enabling smart file search & categorization.",
    ],
  },
  {
    title: "Full Stack Developer",
    org: "Foxconn Hon Hai Technology",
    location: "Bengaluru",
    period: "Jan 2024 – Aug 2026",
    kind: "work",
    points: [
      "Designed and implemented a scalable event management system supporting 1000+ users with role-based access control.",
      "Developed and maintained scalable REST APIs using Node.js and Express.js for high-performance web applications.",
      "Optimized database performance using MongoDB indexing strategies, reducing query latency by ~30%.",
    ],
  },
  {
    title: "B.E. Computer Science",
    org: "Gnanamani College of Technology — Anna University",
    period: "2020 – 2024",
    kind: "education",
    points: [
      "Bachelor of Engineering in Computer Science.",
      "Achieved 49th rank globally among 25k+ participants in CodeChef START 215A (Division 3).",
    ],
  },
];
