import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { buildSystemPrompt } from "@/lib/chat-context";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const MAX_MESSAGES = 12;
const MAX_CHARS = 600;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`chat:${ip}`, 20, 10 * 60 * 1000)) {
    return new Response("Too many requests — please slow down.", { status: 429 });
  }

  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  // Keep cost bounded: recent turns only, and no giant pasted inputs.
  const recent = messages.slice(-MAX_MESSAGES);
  const tooLong = recent.some((m) =>
    m.parts.some((p) => p.type === "text" && p.text.length > MAX_CHARS),
  );
  if (tooLong) return new Response("Message too long", { status: 413 });

  const result = streamText({
    model: "anthropic/claude-haiku-4.5",
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(recent),
    maxOutputTokens: 400,
    temperature: 0.4,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
