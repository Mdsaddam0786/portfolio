import type { Certificate } from "@/types";

const gallery = "https://certificate-gallary-xyz.vercel.app/certificates";

export const certificates: Certificate[] = [
  {
    title: "Fullstack Web Development with Angular and Spring",
    issuer: "Infosys Springboard",
    date: "Nov 2022",
    href: `${gallery}/Fullstack.png`,
  },
  {
    title: "MongoDB Essentials — A Complete MongoDB Guide",
    issuer: "Infosys Springboard",
    date: "Nov 2022",
    href: `${gallery}/MongoDb.png`,
  },
  {
    title: "Node.js",
    issuer: "Infosys Springboard",
    date: "Nov 2022",
    href: `${gallery}/Nodejs.png`,
  },
  {
    title: "Java Programming",
    issuer: "Great Learning Academy",
    href: `${gallery}/Java.png`,
  },
  {
    title: "Data Structures in C",
    issuer: "Great Learning Academy",
    href: `${gallery}/DSA.png`,
  },
  { title: "Cloud AI" },
];
