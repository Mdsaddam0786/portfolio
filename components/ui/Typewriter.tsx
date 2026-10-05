"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

export function Typewriter({ words }: { words: readonly string[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const word = words[index % words.length];
    const done = !deleting && text === word;
    const cleared = deleting && text === "";
    const delay = done ? 1600 : cleared ? 300 : deleting ? 40 : 80;

    const t = setTimeout(() => {
      if (done) setDeleting(true);
      else if (cleared) {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, reduced]);

  return (
    <span>
      {/* Screen readers get the full, stable list instead of the animation. */}
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true" className="text-gradient">
        {reduced ? words[0] : text}
      </span>
      <span aria-hidden="true" className="animate-blink text-accent ml-0.5">
        |
      </span>
    </span>
  );
}
