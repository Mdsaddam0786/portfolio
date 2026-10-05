"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineDownload, HiOutlineMail, HiOutlinePaperAirplane } from "react-icons/hi";
import { sendContactMessage } from "@/app/actions/contact";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { cn } from "@/lib/utils";
import { contactSchema, type ContactInput } from "@/lib/validations";

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off" },
] as const;

const inputClass =
  "w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-white placeholder:text-muted/60 transition outline-none focus:border-primary focus:shadow-glow-sm";

export function Contact() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus(null);
    const res = await sendContactMessage(data);
    if (res.ok) {
      reset();
      setStatus({
        type: "success",
        message: "Thanks! Your message is on its way — I'll reply soon.",
      });
    } else {
      setStatus({ type: "error", message: res.error });
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="bg-primary/15 absolute bottom-0 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full blur-[140px]"
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          id="contact-title"
          eyebrow="Contact"
          title="Let's build something together"
          description="Have a role, project or idea in mind? Send a message and I'll get back to you."
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Reveal className="glass neon-border flex flex-col gap-6 rounded-3xl p-6 md:p-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-white">Reach me directly</h3>
              <a
                href={`mailto:${profile.email}`}
                className="text-muted hover:text-accent mt-3 flex items-center gap-2 break-all transition"
              >
                <HiOutlineMail aria-hidden="true" className="text-accent shrink-0 text-lg" />
                {profile.email}
              </a>
            </div>
            <ul className="flex flex-wrap gap-3">
              {socials.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass text-muted hover:shadow-glow-sm flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:text-white"
                  >
                    <Icon aria-hidden="true" /> {name}
                  </a>
                </li>
              ))}
            </ul>
            <ButtonLink
              href={profile.resume}
              download="Md-Saddam-Resume.pdf"
              variant="ghost"
              className="mt-auto self-start"
            >
              <HiOutlineDownload aria-hidden="true" /> Download resume
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="glass neon-border grid gap-5 rounded-3xl p-6 md:grid-cols-2 md:p-8"
            >
              {fields.map((f) => (
                <div key={f.name} className={cn(f.name === "subject" && "md:col-span-2")}>
                  <label htmlFor={f.name} className="text-text mb-2 block text-sm">
                    {f.label}
                  </label>
                  <input
                    id={f.name}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    aria-invalid={!!errors[f.name]}
                    aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
                    className={inputClass}
                    {...register(f.name)}
                  />
                  {errors[f.name] && (
                    <p id={`${f.name}-error`} className="mt-1.5 text-xs text-red-400">
                      {errors[f.name]?.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="md:col-span-2">
                <label htmlFor="message" className="text-text mb-2 block text-sm">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={cn(inputClass, "resize-y")}
                  {...register("message")}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-xs text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Honeypot — hidden from people and assistive tech */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="company">Company</label>
                <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
              </div>

              <div className="flex flex-col items-start gap-3 md:col-span-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send message"}
                  <HiOutlinePaperAirplane aria-hidden="true" className="rotate-90" />
                </Button>
                <p
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "text-sm",
                    status?.type === "error" ? "text-red-400" : "text-emerald-300",
                  )}
                >
                  {status?.message}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
