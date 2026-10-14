/**
 * Locked Halaxis prices (NOTES/PRICING.md, Awad, 2026-10-06).
 * Display and checkout both read this module so a page cannot invent a tier.
 * The fund is not a tier. Banks and advisors are contact-sales, not a tier.
 */

export const IXIS_PER_USD = 100;

export const FREE_CHECKS = {
  count: 3,
  /** Awad has not confirmed the free allowance. Keep this marked TBD. */
  status: "tbd" as const,
  line: "3 free checks (assumed) — TBD",
};

export type PlanTierId = "stock_checker_activation" | "stock_checker_monthly";

export type PlanTier = {
  id: PlanTierId;
  product: "halaxis";
  name: string;
  kind: "one_time" | "subscription";
  usd: number;
  usdCents: number;
  ixis: number;
  stripePriceEnv:
    | "STRIPE_PRICE_HALAXIS_STOCK_CHECKER_ACTIVATION"
    | "STRIPE_PRICE_HALAXIS_STOCK_CHECKER_MONTHLY";
  walletProductKey: string;
};

export const PLAN_TIERS: Record<PlanTierId, PlanTier> = {
  stock_checker_activation: {
    id: "stock_checker_activation",
    product: "halaxis",
    name: "Halal stock checker — activation",
    kind: "one_time",
    usd: 50,
    usdCents: 5000,
    ixis: 50 * IXIS_PER_USD,
    stripePriceEnv: "STRIPE_PRICE_HALAXIS_STOCK_CHECKER_ACTIVATION",
    walletProductKey: "halaxis.stock_checker.activation",
  },
  stock_checker_monthly: {
    id: "stock_checker_monthly",
    product: "halaxis",
    name: "Halal stock checker — monthly",
    kind: "subscription",
    usd: 50,
    usdCents: 5000,
    ixis: 50 * IXIS_PER_USD,
    stripePriceEnv: "STRIPE_PRICE_HALAXIS_STOCK_CHECKER_MONTHLY",
    walletProductKey: "halaxis.stock_checker.monthly",
  },
};

/** Copy shown on the existing pages. Not a certification and not a fund price. */
export const pricingCopy = {
  freeChecks: FREE_CHECKS.line,
  stockChecker:
    "Halal stock checker: 3 free checks (assumed) — TBD, then $50 one-time activation and $50/month, renewing automatically, for unlimited checks and alerts. Pay by card or with Ixis (100 Ixis = $1).",
  fund: "Fund: no price. Waitlist only. Investment-fund money stays off until counsel clears it (ENABLE_PAYMENTS remains false).",
  advisors: "Banks and advisors: contact sales.",
  notCertification:
    "These figures are tool fees for the stock checker. They are not a Halal or Sharia certification, not a fatwa, and not an offer of securities.",
} as const;

const FUND_IDS = new Set(["fund", "investment_fund", "halaxis_fund"]);

export function isPlanTierId(value: string): value is PlanTierId {
  return Object.prototype.hasOwnProperty.call(PLAN_TIERS, value);
}

export function planTierById(id: string): PlanTier | null {
  return isPlanTierId(id) ? PLAN_TIERS[id] : null;
}

/** Fund money and contact-sales paths cannot enter plan checkout. */
export function checkoutTier(id: string): PlanTier | null {
  if (FUND_IDS.has(id)) return null;
  return planTierById(id);
}

/** Blank unless Developer Bot sets the price id. Never invent one. */
export function readPlanPriceId(
  tier: PlanTier,
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  const raw = env[tier.stripePriceEnv];
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed || undefined;
}

export function ixisForUsd(usd: number): number {
  return usd * IXIS_PER_USD;
}
