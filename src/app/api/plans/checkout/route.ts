import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth-helpers";
import { buyerOwner, purchasePlanWithCard, purchasePlanWithIxis } from "@/lib/plan-checkout";
import { plansCheckoutEnabled } from "@/lib/flags";
import { checkoutTier } from "@/lib/pricing";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  tier: z.string().min(1).max(80),
  channel: z.enum(["card", "ixis"]),
  idempotencyKey: z.string().max(80).optional(),
});

/**
 * Non-fund plan checkout. Off unless HALAXIS_PLANS_CHECKOUT=true.
 * Card uses the shared Stripe account. Ixis redeems through Apixis Wallet.
 * The fund is rejected here; ENABLE_PAYMENTS is a separate switch and stays false.
 */
export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "plans-checkout"), 8, 10 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
  }

  if (!plansCheckoutEnabled()) {
    return NextResponse.json({ error: "Plan checkout is off." }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Tier and channel are required." }, { status: 400 });
  }

  const plan = checkoutTier(parsed.data.tier);
  if (!plan) {
    return NextResponse.json(
      { error: "The fund is waitlist only and is not sold here. Banks and advisors contact sales." },
      { status: 400 },
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in with Apixis to buy a plan." }, { status: 401 });
  }
  const owner = await buyerOwner(user.email);
  if (!owner) {
    return NextResponse.json({ error: "Sign in with Apixis to buy a plan." }, { status: 401 });
  }

  if (parsed.data.channel === "card") {
    const card = await purchasePlanWithCard({ owner, tier: plan.id });
    if (!card.ok) return NextResponse.json({ error: card.error }, { status: card.status });
    return NextResponse.json({ url: card.url });
  }

  const idempotencyKey = parsed.data.idempotencyKey ?? "";
  const ixis = await purchasePlanWithIxis({ owner, tier: plan.id, idempotencyKey });
  if (!ixis.ok) {
    return NextResponse.json(
      {
        error: ixis.error,
        insufficient: ixis.insufficient ?? false,
        buyUrl: ixis.buyUrl,
        needed: ixis.needed,
      },
      { status: ixis.status },
    );
  }
  return NextResponse.json({ ok: true, receiptId: ixis.receiptId });
}
