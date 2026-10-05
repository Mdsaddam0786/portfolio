"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiOutlineDownload, HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { navItems } from "@/data/navigation";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of navItems) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-x-0 border-t-0 py-3" : "py-5",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6"
      >
        <a href="#home" className="font-display text-xl font-bold text-white">
          <span className="text-gradient">&lt;</span>
          {profile.firstName}
          <span className="text-gradient"> /&gt;</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3 py-2 text-sm transition-colors",
                  active === id ? "text-white" : "text-muted hover:text-white",
                )}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="bg-primary/20 ring-primary/40 absolute inset-0 -z-10 rounded-full ring-1"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.resume}
            download="Md-Saddam-Resume.pdf"
            className="bg-gradient-brand shadow-glow-sm hover:shadow-glow hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition sm:inline-flex"
          >
            <HiOutlineDownload aria-hidden="true" /> Resume
          </a>
          <button
            type="button"
            className="glass rounded-full p-2 text-xl text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <HiX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass mx-4 mt-3 rounded-2xl p-4 lg:hidden"
          >
            <ul className="flex flex-col">
              {navItems.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-3",
                      active === id ? "bg-primary/20 text-white" : "text-muted",
                    )}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={profile.resume}
                  download="Md-Saddam-Resume.pdf"
                  className="text-accent mt-2 flex items-center gap-2 rounded-lg px-3 py-3"
                >
                  <HiOutlineDownload aria-hidden="true" /> Download Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
