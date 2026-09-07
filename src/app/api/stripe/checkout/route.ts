import { NextResponse } from "next/server";

import {
  assertPaymentsReady,
  checkoutUrls,
  getStripe,
  getStripePriceId,
} from "@/lib/stripe";

export async function POST() {
  const gate = assertPaymentsReady();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const price =
    getStripePriceId("ONBOARDING") ??
    getStripePriceId("ALLOCATION") ??
    getStripePriceId("SUBSCRIPTION");
  if (!price) {
    return NextResponse.json(
      { error: "No STRIPE_PRICE_* environment variable is set." },
      { status: 503 },
    );
  }

  const stripe = getStripe()!;
  const urls = checkoutUrls();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price, quantity: 1 }],
    success_url: urls.success,
    cancel_url: urls.cancel,
    allow_promotion_codes: false,
    metadata: {
      product: "halaxis_reserved_allocation",
      gated: "true",
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe did not return a Checkout URL." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: session.url, id: session.id });
}
