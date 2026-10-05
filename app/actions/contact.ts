"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { profile } from "@/data/profile";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, type ContactInput } from "@/lib/validations";

export type ContactResult = { ok: true } | { ok: false; error: string };

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the form fields and try again." };

  const { name, email, subject, message, company } = parsed.data;
  // Bots fill the hidden field — pretend success so they don't retry.
  if (company) return { ok: true };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`contact:${ip}`, 3, 10 * 60 * 1000)) {
    return { ok: false, error: "Too many messages — please try again in a few minutes." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return {
      ok: false,
      error: `Email isn't configured yet — reach me directly at ${profile.email}.`,
    };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL ?? profile.email,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${escape(name)} &lt;${escape(email)}&gt;</p><p>${escape(message).replace(/\n/g, "<br/>")}</p>`,
  });

  if (error) {
    console.error("Resend error", error);
    return { ok: false, error: `Something went wrong — please email me at ${profile.email}.` };
  }
  return { ok: true };
}
