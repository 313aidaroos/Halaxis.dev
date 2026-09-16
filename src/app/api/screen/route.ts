import { NextResponse } from "next/server";

import {
  evaluateLive,
  evaluateTickerFromUniverse,
} from "@/lib/shariah/evaluate";
import { persistScreenEvent } from "@/lib/shariah/persist";
import { fetchLiveFundamentals, ratiosFromLive } from "@/lib/shariah/yahoo";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { screenBodySchema, tickerSchema } from "@/lib/validations/screen";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = tickerSchema.safeParse(searchParams.get("ticker") ?? "");
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Missing ticker." },
      { status: 400 },
    );
  }
  return runScreen(parsed.data, request);
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = screenBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid ticker." },
      { status: 400 },
    );
  }
  return runScreen(parsed.data.ticker, request);
}

async function runScreen(ticker: string, request: Request) {
  const limited = rateLimit(clientKey(request, "screen"), 20, 10 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many screens. Please wait a few minutes." },
      { status: 429 },
    );
  }

  const live = await fetchLiveFundamentals(ticker);
  const universeHit = evaluateTickerFromUniverse(ticker);

  const result = live
    ? evaluateLive({
        ticker,
        name: live.name,
        sector: live.sector,
        industry: live.industry,
        ...ratiosFromLive(live),
      })
    : universeHit;

  if (!result) {
    return NextResponse.json(
      {
        error:
          "No data for that ticker. Try a name on the illustrative universe (AAPL, JPM, BUD) or another listed US symbol.",
      },
      { status: 404 },
    );
  }

  const persist = await persistScreenEvent(result);
  return NextResponse.json({
    ok: true,
    stored: persist.stored,
    result,
  });
}
