import { NextResponse } from "next/server";

import { plansCheckoutEnabled } from "@/lib/flags";
import { purchaseFromCheckoutSession, recordChargedPurchase } from "@/lib/plan-ledger";
import { supabasePlanPurchaseStore } from "@/lib/plan-ledger-store";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Card receipts for non-fund plans. Ignored unless HALAXIS_PLANS_CHECKOUT=true.
 * ENABLE_PAYMENTS is not consulted: fund money never lands here.
 * The handler does not log the payload, signature, or Stripe key.
 */
export async function POST(request: Request) {
  if (!plansCheckoutEnabled()) {
    return NextResponse.json(
      { error: "Webhook ignored while HALAXIS_PLANS_CHECKOUT is not true." },
      { status: 403 },
    );
  }

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true, recorded: false });
  }

  const session = event.data.object;
  const parsed = purchaseFromCheckoutSession({
    id: session.id,
    payment_status: session.payment_status,
    amount_total: session.amount_total,
    client_reference_id: session.client_reference_id,
    metadata: session.metadata,
  });

  if (!parsed.ok) {
    return NextResponse.json({ received: true, recorded: false, reason: parsed.reason });
  }

  const store = supabasePlanPurchaseStore();
  if (!store) {
    return NextResponse.json({ error: "Receipt store is not configured." }, { status: 503 });
  }

  try {
    await recordChargedPurchase(store, parsed.purchase);
  } catch {
    return NextResponse.json({ error: "Receipt was not recorded." }, { status: 500 });
  }

  return NextResponse.json({ received: true, recorded: true });
}
