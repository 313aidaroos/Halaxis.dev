import { siteConfig } from "@/lib/site";

/**
 * Apixis Wallet is the only place dollars become Ixis.
 * Live app: https://apixis-wallet.vercel.app
 * WALLET_EMBED buy contract:
 *   /buy?product=halaxis&return_url=<encoded https return>
 * Query key is `product` (not `origin`).
 * Cash credit happens only on Wallet. Ixis is closed-loop platform credit
 * and non-withdrawable. 100 Ixis = $1. Halaxis does not sell Ixis and does
 * not keep an Ixis balance. Non-fund plan card checkout (stock checker) uses
 * the shared Apixis Stripe account behind HALAXIS_PLANS_CHECKOUT.
 */
export const APIXIS_WALLET_URL = "https://apixis-wallet.vercel.app";

/** Product slug Wallet uses to know which family app sent the buyer. */
export const HALAXIS_WALLET_PRODUCT = "halaxis";

/**
 * Post-pay return path. `/contact` already exists and hosts Redeem with Ixis
 * plus the accredited-investor interest form, so a buyer lands back on the
 * page that explains redemption (still coming soon on Halaxis).
 * `/auth/login` is magic-link-first and does not mention Ixis.
 */
export const HALAXIS_WALLET_RETURN_PATH = "/contact";

/**
 * Absolute HTTPS URL of this Halaxis app.
 * `siteConfig.url` is `NEXT_PUBLIC_APP_URL` with a trailing slash removed,
 * or `https://halaxis.apixis.dev` when that env var is unset.
 * Non-HTTPS values (local `http://localhost`) are not allowlisted, so those
 * builds fall back to the public HTTPS origin instead of sending an http return.
 */
export function halaxisPublicUrl(): string {
  return siteConfig.url.startsWith("https://")
    ? siteConfig.url
    : "https://halaxis.apixis.dev";
}

export function halaxisWalletReturnUrl(): string {
  return `${halaxisPublicUrl()}${HALAXIS_WALLET_RETURN_PATH}`;
}

/** Buy Ixis in Apixis Wallet. Cash is charged only there. */
export function apixisWalletBuyUrl(): string {
  const url = new URL("/buy", `${APIXIS_WALLET_URL}/`);
  url.searchParams.set("product", HALAXIS_WALLET_PRODUCT);
  url.searchParams.set("return_url", halaxisWalletReturnUrl());
  return url.toString();
}

/*
 * TODO(ixis-balance): When a Halaxis session exists, show Ixis balance from
 * Wallet GET /api/v1/wallet. Skipped on purpose.
 * That route expects the Wallet app's Supabase bearer token
 * (Authorization: Bearer <USER_SESSION_TOKEN>), not a Halaxis session.
 * The live handler currently returns null balances until Wallet auth is
 * connected. Do not invent a local Ixis balance. Cash for Ixis packs is
 * credited only on Wallet. Plan receipts are purchase records, not balances.
 */
