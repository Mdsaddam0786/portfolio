import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.email("Please enter a valid email").max(120),
  subject: z.string().trim().min(3, "Subject is too short").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(2000, "Message is too long"),
  // Honeypot: real users never see or fill this field.
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
