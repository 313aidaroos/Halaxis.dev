import Stripe from "stripe";

import { isStripeConfigured, paymentsEnabled } from "@/lib/flags";
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

export function getStripePriceId(
  name: "ONBOARDING" | "ALLOCATION" | "SUBSCRIPTION" = "ONBOARDING",
): string | undefined {
  const key = `STRIPE_PRICE_${name}` as const;
  const value = process.env[key];
  return value || undefined;
}

export function assertPaymentsReady() {
  if (!paymentsEnabled()) {
    return {
      ok: false as const,
      status: 403,
      error: "Payments are disabled until ENABLE_PAYMENTS=true and counsel clears solicitation.",
    };
  }
  if (!getStripe()) {
    return {
      ok: false as const,
      status: 503,
      error: "Stripe is not configured.",
    };
  }
  return { ok: true as const };
}

export function checkoutUrls() {
  const base = siteConfig.url;
  return {
    success: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel: `${base}/checkout/cancel`,
  };
}

