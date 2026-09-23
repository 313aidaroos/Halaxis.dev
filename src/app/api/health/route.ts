import { NextResponse } from "next/server";
import { createAIProvider } from "@/lib/ai/provider";

const CACHE_TTL = 5 * 60 * 1000; // 5 min
let cachedHealth: { anthropic: boolean; timestamp: number } | null = null;

export async function GET() {
  const now = Date.now();
  if (cachedHealth && now - cachedHealth.timestamp < CACHE_TTL) {
    return NextResponse.json(cachedHealth);
  }

  let anthropicOk = false;
  try {
    const provider = createAIProvider();
    // Minimal test call
    await provider.complete({
      messages: [{ role: "user", content: "test" }],
      system: "Respond with OK.",
      maxTokens: 5,
    });
    anthropicOk = true;
  } catch {
    anthropicOk = false;
  }

  cachedHealth = { anthropic: anthropicOk, timestamp: now };
  return NextResponse.json(cachedHealth);
}
