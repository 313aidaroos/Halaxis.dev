import { apixisOwner } from "@/lib/apixis-login";
import { redeem, WalletError } from "@/lib/apixis-wallet";
import { plansCheckoutEnabled } from "@/lib/flags";
import {
  openPendingReceipt,
  PlanPurchaseError,
  recordChargedPurchase,
} from "@/lib/plan-ledger";
import { supabasePlanPurchaseStore } from "@/lib/plan-ledger-store";
import { checkoutTier, PLAN_TIERS, type PlanTierId } from "@/lib/pricing";
import { createPlanCheckoutSession } from "@/lib/stripe";
import { apixisWalletBuyUrl } from "@/lib/wallet";

const IDEMPOTENCY = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function halaxisBuyUrl(): string {
  return apixisWalletBuyUrl();
}

export async function buyerOwner(email: string | null | undefined): Promise<string | null> {
  const owner = await apixisOwner(email);
  const trimmed = owner?.trim() ?? "";
  return trimmed || null;
}

/**
 * Ixis path: Wallet redeem (reserve → pending receipt → capture), then one ledger line.
 * Not enough Ixis returns the Wallet buy link (/buy?product=halaxis). 100 Ixis = $1.
 */
export async function purchasePlanWithIxis(opts: {
  owner: string;
  tier: PlanTierId;
  idempotencyKey: string;
}): Promise<
  | { ok: true; receiptId: string }
  | { ok: false; status: number; error: string; insufficient?: boolean; buyUrl?: string; needed?: number }
> {
  if (!plansCheckoutEnabled()) {
    return { ok: false, status: 403, error: "Plan checkout is off." };
  }
  if (!IDEMPOTENCY.test(opts.idempotencyKey)) {
    return { ok: false, status: 400, error: "A valid idempotency key is required." };
  }
  const plan = PLAN_TIERS[opts.tier];
  const store = supabasePlanPurchaseStore();
  if (!store) {
    return { ok: false, status: 503, error: "Receipt store is not configured." };
  }

  const walletKey = `halaxis|${encodeURIComponent(opts.owner)}|${plan.id}|${opts.idempotencyKey}`;
  const buyUrl = halaxisBuyUrl();

  try {
    const result = await redeem({
      owner: opts.owner,
      productKey: plan.walletProductKey,
      idempotencyKey: walletKey,
      provision: async (reservation) =>
        openPendingReceipt(store, {
          ownerRef: opts.owner,
          tier: plan.id,
          channel: "ixis",
          externalId: reservation.reservationId,
        }),
      unprovision: async (_reservation, pending) => {
        await store.voidIfPending(pending.receiptId);
      },
    });

    if (!result.ok) {
      return {
        ok: false,
        status: 402,
        error: "Not enough Ixis. Buy Ixis in Apixis Wallet (100 Ixis = $1).",
        insufficient: true,
        buyUrl,
        needed: result.needed,
      };
    }

    const recorded = await recordChargedPurchase(store, {
      ownerRef: opts.owner,
      tier: plan.id,
      channel: "ixis",
      externalId: result.result.externalId,
    });
    return { ok: true, receiptId: recorded.receiptId };
  } catch (error) {
    if (error instanceof PlanPurchaseError) {
      return { ok: false, status: 409, error: "This purchase could not be recorded." };
    }
    if (error instanceof WalletError && error.status === 503) {
      return { ok: false, status: 503, error: "Ixis checkout is not configured." };
    }
    if (error instanceof WalletError && error.insufficient) {
      return {
        ok: false,
        status: 402,
        error: "Not enough Ixis. Buy Ixis in Apixis Wallet (100 Ixis = $1).",
        insufficient: true,
        buyUrl,
        needed: 0,
      };
    }
    return { ok: false, status: 502, error: "Ixis checkout failed." };
  }
}

export async function purchasePlanWithCard(opts: {
  owner: string;
  tier: PlanTierId;
}): Promise<{ ok: true; url: string } | { ok: false; status: number; error: string }> {
  if (!checkoutTier(opts.tier)) {
    return { ok: false, status: 400, error: "That is not a Halaxis plan." };
  }
  return createPlanCheckoutSession(opts);
}
