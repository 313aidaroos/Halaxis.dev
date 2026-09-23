import { NextResponse } from "next/server";
import { z } from "zod";

import { HALAXIS_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { createAIProvider } from "@/lib/ai/provider";
import type { ChatMessage } from "@/lib/ai/types";
import { isAiConfigured } from "@/lib/flags";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
});

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "chat"), 8, 10 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Chat rate limit reached. Please wait a few minutes." },
      { status: 429 },
    );
  }

  if (!isAiConfigured()) {
    return NextResponse.json(
      {
        error:
          "Hala is not configured. Use the interest form at /contact instead.",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid chat payload." }, { status: 400 });
  }

  const messages = parsed.data.messages as ChatMessage[];

  try {
    const provider = createAIProvider();
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const token of provider.stream({
            messages,
            system: HALAXIS_SYSTEM_PROMPT,
          })) {
            controller.enqueue(encoder.encode(token));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-AI-Provider": provider.name,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Hala is unavailable.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
