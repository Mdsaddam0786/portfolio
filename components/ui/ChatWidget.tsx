"use client";

import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HiOutlineChatAlt2, HiOutlinePaperAirplane, HiX } from "react-icons/hi";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const suggestions = [
  `What's ${profile.firstName}'s current role?`,
  "Tell me about the projects",
  "What's the tech stack?",
  `How can I contact ${profile.firstName}?`,
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t.slice(0, 600) });
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Chat about ${profile.name}`}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass neon-border bg-bg-soft/90 fixed right-4 bottom-24 z-[80] flex h-[min(560px,70svh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl"
          >
            <div className="border-line flex items-center justify-between border-b px-5 py-4">
              <div>
                <p className="font-display font-semibold text-white">Ask about me</p>
                <p className="text-muted text-xs">
                  AI answers based on {profile.firstName}&apos;s resume
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-muted rounded-full p-2 hover:text-white"
              >
                <HiX />
              </button>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/5 px-4 py-2.5 text-sm">
                Hi! 👋 I can answer questions about {profile.firstName}&apos;s experience, skills
                and projects.
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="border-primary/40 text-primary-light hover:bg-primary/15 rounded-full border px-3 py-1.5 text-xs transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-gradient-brand ml-auto rounded-tr-sm text-white"
                      : "text-text rounded-tl-sm bg-white/5",
                  )}
                >
                  {m.parts.map((p, i) =>
                    p.type === "text" ? <span key={i}>{p.text}</span> : null,
                  )}
                </div>
              ))}

              {status === "submitted" && (
                <div
                  className="flex w-16 gap-1 rounded-2xl bg-white/5 px-4 py-3"
                  aria-label="Assistant is typing"
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="bg-accent h-1.5 w-1.5 animate-bounce rounded-full"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
              {error && (
                <p className="text-xs text-red-400">
                  Sorry, I couldn&apos;t answer right now. You can email {profile.email}.
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-line flex gap-2 border-t p-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                Your question
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                maxLength={600}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something…"
                autoComplete="off"
                className="border-line focus:border-primary flex-1 rounded-full border bg-white/[0.03] px-4 py-2 text-sm text-white outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="bg-gradient-brand grid h-10 w-10 place-items-center rounded-full text-white disabled:opacity-50"
              >
                <HiOutlinePaperAirplane className="rotate-90" aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Ask about me"}
        aria-expanded={open}
        className="bg-gradient-brand shadow-glow fixed right-4 bottom-4 z-[80] flex h-14 items-center gap-2 rounded-full px-5 font-semibold text-white transition hover:scale-105"
      >
        {open ? <HiX className="text-xl" /> : <HiOutlineChatAlt2 className="text-xl" />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask about me"}</span>
      </button>
    </>
  );
}
