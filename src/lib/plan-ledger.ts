import { checkoutTier, type PlanTierId } from "./pricing";

export type PurchaseChannel = "card" | "ixis";
export type ReceiptStatus = "pending" | "recorded" | "voided";

export type PlanReceiptDraft = {
  owner_ref: string;
  product: "halaxis";
  tier: PlanTierId;
  channel: PurchaseChannel;
  amount_usd_cents: number;
  amount_ixis: number | null;
  external_id: string;
  idempotency_key: string;
  status: ReceiptStatus;
};

export type PlanLedgerDraft = {
  owner_ref: string;
  product: "halaxis";
  tier: PlanTierId;
  entry_type: "plan_purchase";
  channel: PurchaseChannel;
  amount_usd_cents: number;
  amount_ixis: number | null;
};

export type StoredReceipt = {
  id: string;
  status: ReceiptStatus;
  idempotency_key: string;
};

export type PlanPurchaseStore = {
  findReceipt(idempotencyKey: string): Promise<StoredReceipt | null>;
  insertReceipt(receipt: PlanReceiptDraft): Promise<StoredReceipt>;
  markRecorded(id: string): Promise<void>;
  voidIfPending(id: string): Promise<void>;
  findLedger(receiptId: string): Promise<{ id: string } | null>;
  insertLedger(entry: PlanLedgerDraft & { receipt_id: string }): Promise<{ id: string }>;
};

export class PlanPurchaseError extends Error {
  code: "not_a_plan" | "owner" | "external_id" | "channel" | "voided";
  constructor(code: PlanPurchaseError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

export type PlanPurchaseInput = {
  ownerRef: string;
  tier: string;
  channel: PurchaseChannel;
  externalId: string;
};

export function buildPlanPurchase(input: PlanPurchaseInput): {
  receipt: PlanReceiptDraft;
  ledger: PlanLedgerDraft;
} {
  const tier = checkoutTier(input.tier);
  if (!tier) {
    throw new PlanPurchaseError("not_a_plan", "Not a purchasable Halaxis plan.");
  }
  const owner = input.ownerRef.trim();
  if (!owner) throw new PlanPurchaseError("owner", "Owner is required.");
  const externalId = input.externalId.trim();
  if (!externalId) throw new PlanPurchaseError("external_id", "External id is required.");
  if (input.channel !== "card" && input.channel !== "ixis") {
    throw new PlanPurchaseError("channel", "Unknown payment channel.");
  }

  const idempotencyKey = `${input.channel}:${tier.id}:${externalId}`;
  const amountIxis = input.channel === "ixis" ? tier.ixis : null;
  return {
    receipt: {
      owner_ref: owner,
      product: "halaxis",
      tier: tier.id,
      channel: input.channel,
      amount_usd_cents: tier.usdCents,
      amount_ixis: amountIxis,
      external_id: externalId,
      idempotency_key: idempotencyKey,
      status: "recorded",
    },
    ledger: {
      owner_ref: owner,
      product: "halaxis",
      tier: tier.id,
      entry_type: "plan_purchase",
      channel: input.channel,
      amount_usd_cents: tier.usdCents,
      amount_ixis: amountIxis,
    },
  };
}

/**
 * Record a purchase that has already been charged (Stripe webhook, or Ixis
 * after Wallet capture). Writes one receipt and one ledger line. A repeat
 * call with the same channel, tier, and external id does not add a second line.
 */
export async function recordChargedPurchase(
  store: PlanPurchaseStore,
  input: PlanPurchaseInput,
): Promise<{ receiptId: string; created: boolean }> {
  const { receipt, ledger } = buildPlanPurchase(input);
  const existing = await store.findReceipt(receipt.idempotency_key);

  if (existing?.status === "voided") {
    throw new PlanPurchaseError("voided", "Receipt was voided.");
  }

  let receiptId = existing?.id;
  let created = false;

  if (!existing) {
    const inserted = await store.insertReceipt({ ...receipt, status: "recorded" });
    receiptId = inserted.id;
    created = true;
  } else if (existing.status === "pending") {
    await store.markRecorded(existing.id);
    created = true;
  }

  if (!receiptId) throw new PlanPurchaseError("external_id", "Receipt was not stored.");

  const line = await store.findLedger(receiptId);
  if (!line) {
    await store.insertLedger({ ...ledger, receipt_id: receiptId });
  }
  return { receiptId, created };
}

/** Hold a receipt open while Wallet reserve is in flight. No ledger line yet. */
export async function openPendingReceipt(
  store: PlanPurchaseStore,
  input: PlanPurchaseInput,
): Promise<{ receiptId: string; externalId: string }> {
  const { receipt } = buildPlanPurchase(input);
  const existing = await store.findReceipt(receipt.idempotency_key);
  if (existing?.status === "voided") {
    throw new PlanPurchaseError("voided", "Receipt was voided.");
  }
  if (existing) return { receiptId: existing.id, externalId: receipt.external_id };
  const inserted = await store.insertReceipt({ ...receipt, status: "pending" });
  return { receiptId: inserted.id, externalId: receipt.external_id };
}

export type CheckoutSessionSnapshot = {
  id?: string | null;
  payment_status?: string | null;
  amount_total?: number | null;
  client_reference_id?: string | null;
  metadata?: Record<string, string | null | undefined> | null;
};

/**
 * Turn a paid Stripe Checkout session into a plan purchase.
 * Rejects anything that is not product=halaxis on a stock-checker tier.
 */
export function purchaseFromCheckoutSession(session: CheckoutSessionSnapshot):
  | { ok: true; purchase: PlanPurchaseInput }
  | { ok: false; reason: "not_halaxis" | "not_a_plan" | "unpaid" | "amount_mismatch" | "missing_owner" | "missing_session" } {
  if (session.metadata?.product !== "halaxis") return { ok: false, reason: "not_halaxis" };
  const tierId = session.metadata.tier ?? "";
  const tier = checkoutTier(tierId);
  if (!tier) return { ok: false, reason: "not_a_plan" };
  if (session.payment_status !== "paid") return { ok: false, reason: "unpaid" };
  if (session.amount_total !== tier.usdCents) return { ok: false, reason: "amount_mismatch" };
  const owner = (session.client_reference_id || session.metadata.owner_ref || "").trim();
  if (!owner) return { ok: false, reason: "missing_owner" };
  const id = session.id?.trim() ?? "";
  if (!id) return { ok: false, reason: "missing_session" };
  return {
    ok: true,
    purchase: { ownerRef: owner, tier: tier.id, channel: "card", externalId: id },
  };
}
