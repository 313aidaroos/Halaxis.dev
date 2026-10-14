import Stripe from "stripe";

import { isStripeConfigured, plansCheckoutEnabled } from "@/lib/flags";
import { PLAN_TIERS, readPlanPriceId, type PlanTierId } from "@/lib/pricing";
import { siteConfig } from "@/lib/site";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!isStripeConfigured()) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return stripeClient;
}

export function assertPlansCardReady():
  | { ok: true }
  | { ok: false; status: 403 | 503; error: string } {
  if (!plansCheckoutEnabled()) {
    return { ok: false, status: 403, error: "Plan checkout is off." };
  }
  if (!getStripe()) {
    return { ok: false, status: 503, error: "Card checkout is not configured." };
  }
  return { ok: true };
}

/**
 * Open Stripe Checkout for a non-fund plan on the shared Apixis Dev LLC account.
 * Metadata is product=halaxis and the tier. Price ids come from env and stay blank until set.
 * Errors returned to callers never include the secret key.
 */
export async function createPlanCheckoutSession(opts: {
  owner: string;
  tier: PlanTierId;
}): Promise<{ ok: true; url: string } | { ok: false; status: number; error: string }> {
  const ready = assertPlansCardReady();
  if (!ready.ok) return ready;

  const plan = PLAN_TIERS[opts.tier];
  const price = readPlanPriceId(plan);
  if (!price) {
    return { ok: false, status: 503, error: "Card price is not configured." };
  }

  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, status: 503, error: "Card checkout is not configured." };
  }

  const base = siteConfig.url;
  const owner = opts.owner.trim();
  try {
    const session = await stripe.checkout.sessions.create({
      mode: plan.kind === "subscription" ? "subscription" : "payment",
      line_items: [{ price, quantity: 1 }],
      success_url: `${base}/plans/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/plans/checkout/cancel`,
      client_reference_id: owner.slice(0, 200),
      metadata: {
        product: "halaxis",
        tier: plan.id,
        owner_ref: owner.slice(0, 500),
      },
      ...(plan.kind === "subscription"
        ? { subscription_data: { metadata: { product: "halaxis", tier: plan.id } } }
        : {}),
    });
    if (!session.url) {
      return { ok: false, status: 502, error: "Card checkout did not start." };
    }
    return { ok: true, url: session.url };
  } catch {
    return { ok: false, status: 502, error: "Card checkout failed." };
  }
}
