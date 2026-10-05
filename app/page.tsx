import { Loader } from "@/components/canvas/Loader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Certificates } from "@/components/sections/Certificates";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { GitHubActivity } from "@/components/sections/GitHubActivity";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { ChatWidget } from "@/components/ui/ChatWidget";

export default function Home() {
  return (
    <>
      <Loader />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <GitHubActivity />
        <Certificates />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
