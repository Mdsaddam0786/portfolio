import type { Project } from "@/types";

const gh = (repo: string) => `https://github.com/Mdsaddam0786/${repo}`;

export const projects: Project[] = [
  {
    slug: "personal-cloud-storage",
    title: "Personal Cloud Storage",
    summary:
      "A secure cloud storage app with JWT auth, role-based file access and AI-powered file tagging.",
    highlights: [
      "Secure authentication with JWT and role-based file access controls.",
      "File upload, rename, delete and share built with Node.js, Express, MongoDB and Multer.",
      "AI-powered file tagging processed asynchronously through Redis job queues for smart search & categorization.",
      "Backend deployed on Railway, frontend on Vercel, with CORS-configured API communication.",
    ],
    tech: ["React.js", "Tailwind CSS", "Express.js", "MongoDB", "Redis", "JWT"],
    category: "Full Stack",
    featured: true,
    github: gh("cloude-storage"),
    live: "https://cloude-storage-vqof.vercel.app/",
    image: "/images/projects/personal-cloud-storage.webp",
  },
  {
    slug: "samcart",
    title: "SamCart Marketplace",
    summary:
      "A marketplace where sellers list products and buyers browse, add to cart and check out.",
    highlights: [
      "Separate seller and buyer flows — product listings, search & category filters, cart and checkout.",
      "Authentication with NextAuth and bcrypt-hashed credentials; forms validated with React Hook Form + Zod.",
      "Prisma ORM data layer and Stripe-powered payments.",
      "Deployed on Vercel.",
    ],
    tech: ["Next.js", "TypeScript", "Prisma", "NextAuth", "Stripe", "Tailwind CSS"],
    category: "Full Stack",
    featured: true,
    github: gh("samcart"),
    live: "https://samcart-three.vercel.app",
    image: "/images/projects/samcart.webp",
  },
  {
    slug: "e-commerce-api",
    title: "E-Commerce REST API",
    summary:
      "A RESTful e-commerce API with 7 resource modules and atomic, oversell-proof order transactions.",
    highlights: [
      "7 resource modules — users, products, categories, inventory, orders, payments and stats — with full CRUD.",
      "Relational integrity via foreign keys and cascading deletes.",
      "Atomic order processing: stock validation, inventory deduction, price snapshotting and payment creation in a single DB transaction — no overselling under concurrent requests.",
    ],
    tech: ["Node.js", "Express.js", "SQLite", "REST"],
    category: "Backend",
    featured: true,
  },
  {
    slug: "uber-clone",
    title: "Uber Clone",
    summary: "A full stack ride-booking app inspired by Uber, with real-time updates and maps.",
    highlights: [
      "React frontend with Google Maps integration and GSAP-animated booking panels.",
      "Express + MongoDB backend with JWT auth, bcrypt hashing and request validation.",
      "Real-time ride updates between riders and captains over Socket.io.",
    ],
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.io", "Google Maps"],
    category: "Full Stack",
    featured: false,
    github: gh("Uber-Clone"),
    // live: "https://uber-clone-khaki.vercel.app", — deployment currently 404s
  },
  {
    slug: "shopping-mart",
    title: "Shopping Mart",
    summary: "A shopping app with global cart state managed by Redux Toolkit.",
    highlights: [
      "Product listing and cart powered by Redux Toolkit.",
      "Client-side routing with React Router and toast notifications.",
    ],
    tech: ["React.js", "Redux Toolkit", "React Router", "Tailwind CSS"],
    category: "Frontend",
    featured: false,
    github: gh("Shopping-Mart-Redux-App"),
    live: "https://redux-app-main-project.vercel.app",
  },
  {
    slug: "certificate-gallery",
    title: "Certificate Gallery",
    summary: "A gallery site showcasing my certifications.",
    highlights: ["Responsive certificate gallery built with React and Tailwind CSS."],
    tech: ["React.js", "Tailwind CSS"],
    category: "Frontend",
    featured: false,
    github: gh("Certificate-Gallary"),
    live: "https://certificate-gallary-xyz.vercel.app/",
    image: "/images/projects/certificate-gallery.webp",
  },
  {
    slug: "e-wallet",
    title: "E-Wallet App",
    summary: "A full stack digital wallet with a Spring Boot API and a React dashboard.",
    highlights: [
      "Spring Boot REST API with Spring Security + JWT, JPA and PostgreSQL.",
      "Flyway database migrations and OpenAPI (Swagger) docs.",
      "React + Material UI dashboard with ApexCharts; Dockerized with docker-compose.",
    ],
    tech: ["Java", "Spring Boot", "PostgreSQL", "React.js", "Material UI", "Docker"],
    category: "Full Stack",
    featured: false,
    github: gh("e-wallet-app"),
  },
];

export const projectCategories = [
  "All",
  ...Array.from(new Set(projects.map((p) => p.category))),
] as const;
