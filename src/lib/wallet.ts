import { siteConfig } from "@/lib/site";

/**
 * Apixis Wallet is the only place dollars become Ixis.
 * Live app (2026-09-21): https://apixis-wallet.vercel.app
 * There is no /buy route (HTTP 404). Buy is a client tab on `/`, and the page
 * does not read a tab query yet. Until docs/WALLET_EMBED.md lands, sister apps
 * link the wallet root and pass the embed query contract below.
 */
export const APIXIS_WALLET_URL = "https://apixis-wallet.vercel.app";

/** Product slug Wallet uses to know which family app sent the buyer. */
export const HALAXIS_WALLET_ORIGIN = "halaxis";

/**
 * Post-pay return path. `/contact` already exists and hosts Redeem with Ixis
 * plus the accredited-investor interest form, so a buyer lands back on the
 * page that explains redemption (still coming soon on Halaxis).
 * `/auth/login` is only a magic-link form and does not mention Ixis.
 */
export const HALAXIS_WALLET_RETURN_PATH = "/contact";

/**
 * Absolute HTTPS URL of this Halaxis app.
 * `siteConfig.url` is `NEXT_PUBLIC_APP_URL` with a trailing slash removed,
 * or `https://halaxis.dev` when that env var is unset.
 * Non-HTTPS values (local `http://localhost`) are not allowlisted, so those
 * builds fall back to the public HTTPS origin instead of sending an http return.
 */
export function halaxisPublicUrl(): string {
  return siteConfig.url.startsWith("https://")
    ? siteConfig.url
    : "https://halaxis.dev";
}

export function halaxisWalletReturnUrl(): string {
  return `${halaxisPublicUrl()}${HALAXIS_WALLET_RETURN_PATH}`;
}

/** Buy Ixis in Apixis Wallet. Cash is charged only there. */
export function apixisWalletBuyUrl(): string {
  const url = new URL(APIXIS_WALLET_URL);
  url.searchParams.set("origin", HALAXIS_WALLET_ORIGIN);
  url.searchParams.set("return_url", halaxisWalletReturnUrl());
  return url.toString();
}

/*
 * TODO(ixis-balance): When a Halaxis session exists, show Ixis balance from
 * Wallet GET /api/v1/wallet. Skipped on purpose.
 * That route expects the Wallet app's Supabase bearer token
 * (Authorization: Bearer <USER_SESSION_TOKEN>), not a Halaxis session.
 * The live handler currently returns null balances until Wallet auth is
 * connected. Do not invent shared auth, a second Stripe Checkout, or a
 * local Ixis ledger. Cash credit happens only on Wallet via its Stripe webhook.
 */
