import { NextResponse } from "next/server";

import { paymentsEnabled } from "@/lib/flags";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!paymentsEnabled()) {
    return NextResponse.json(
      { error: "Webhook ignored while ENABLE_PAYMENTS is not true." },
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

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.expired":
      // Persist to Supabase once counsel and fund ops are live.
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true, type: event.type });
}
