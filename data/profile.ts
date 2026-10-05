export const profile = {
  name: "Md Saddam",
  firstName: "Saddam",
  role: "Full Stack Developer",
  roles: [
    "Full Stack Developer",
    "MERN Stack Engineer",
    "Next.js Developer",
    "Backend API Designer",
  ],
  location: "Bengaluru, India",
  email: "mmdh7277@gmail.com",
  githubUsername: "Mdsaddam0786",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  resume: "/resume.pdf",
  photo: "/images/saddam-cutout.webp",
  photoFull: "/images/saddam.webp",
  tagline:
    "I build scalable, production-grade web apps — from pixel-perfect frontends to fast, reliable APIs.",
  bio: [
    "I'm a Full Stack Developer who enjoys turning ideas into scalable, production-grade web applications. I work across the whole stack — React and Next.js on the frontend, Node.js and Express APIs on the backend, and MongoDB / MySQL underneath.",
    "At Foxconn Hon Hai I built an event management platform serving 1000+ users and cut database query latency by ~30%. Today I'm at IIFA Degree Institute designing and developing full stack products, including AI-powered features backed by Redis job queues.",
    "I care about clean, maintainable code and shipping reliable, high-performance software in collaborative teams.",
  ],
  stats: [
    { label: "Years Experience", value: 2, suffix: "+" },
    { label: "Projects Built", value: 8, suffix: "+" },
    { label: "Users Served", value: 1000, suffix: "+" },
    { label: "CodeChef Global Rank", value: 49, prefix: "#" },
  ],
  certificatesUrl: "https://certificate-gallary-xyz.vercel.app/",
} as const;
