import { siteConfig } from "@/lib/site";

/**
 * Apixis Wallet is the only place dollars become Ixis.
 * Live app: https://apixis-wallet.vercel.app
 *
 * Deep link contract (Wallet docs/WALLET_EMBED.md):
 *   /buy?product=halaxis&return_url=<encoded absolute https>
 * `product` is the query key. Wallet also accepts `app` as an alias;
 * Halaxis sends `product` only. The old `origin` query is retired.
 *
 * Return path is `/cixy` (Customize Cixy), chosen over `/contact` so a
 * finished pack lands on the wardrobe. Header Buy Ixis, the contact
 * PaymentPanel, and the customizer all use `apixisWalletBuyUrl()`.
 *
 * Allowlist gap (Wallet repo, not this app): `halaxis` is not a known
 * product in Wallet `lib/checkout/destinations.ts`, and `halaxis.dev` is
 * not an allowlisted return host (`halaxis.vercel.app` is). Checkout
 * rejects an unknown product and a non-allowlisted return_url until the
 * hub adds both. This helper still sends the contract.
 */
export const APIXIS_WALLET_URL = "https://apixis-wallet.vercel.app";

/** Origin product slug. Must match the `product` query Wallet expects. */
export const HALAXIS_WALLET_PRODUCT = "halaxis";

/** Post-pay return path on this app. */
export const HALAXIS_WALLET_RETURN_PATH = "/cixy";

/**
 * Absolute HTTPS URL of this Halaxis app.
 * `siteConfig.url` is `NEXT_PUBLIC_APP_URL` with a trailing slash removed,
 * or `https://halaxis.dev` when that env var is unset.
 * Non-HTTPS values (local `http://localhost`) fall back to the public
 * HTTPS origin instead of sending an http return.
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
  const url = new URL("/buy", APIXIS_WALLET_URL);
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
 * connected. Do not invent shared auth, a second Stripe Checkout, or a
 * local Ixis ledger. Cash credit happens only on Wallet via its Stripe webhook.
 */
