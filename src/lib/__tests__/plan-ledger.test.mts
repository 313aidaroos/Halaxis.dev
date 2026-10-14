import assert from "node:assert/strict";
import test from "node:test";

import {
  PlanPurchaseError,
  buildPlanPurchase,
  openPendingReceipt,
  purchaseFromCheckoutSession,
  recordChargedPurchase,
  type PlanLedgerDraft,
  type PlanPurchaseStore,
  type PlanReceiptDraft,
  type StoredReceipt,
} from "../plan-ledger.ts";

function memoryStore(): PlanPurchaseStore & {
  receipts: StoredReceipt[];
  lines: (PlanLedgerDraft & { receipt_id: string; id: string })[];
} {
  const receipts: (StoredReceipt & PlanReceiptDraft)[] = [];
  const lines: (PlanLedgerDraft & { receipt_id: string; id: string })[] = [];
  return {
    receipts,
    lines,
    async findReceipt(idempotencyKey) {
      return receipts.find((row) => row.idempotency_key === idempotencyKey) ?? null;
    },
    async insertReceipt(receipt) {
      if (receipts.some((row) => row.idempotency_key === receipt.idempotency_key)) {
        throw new Error("duplicate receipt");
      }
      const row = { ...receipt, id: `rcpt_${receipts.length + 1}` };
      receipts.push(row);
      return row;
    },
    async markRecorded(id) {
      const row = receipts.find((item) => item.id === id);
      if (!row || row.status !== "pending") throw new Error("not pending");
      row.status = "recorded";
    },
    async voidIfPending(id) {
      const row = receipts.find((item) => item.id === id);
      if (row?.status === "pending") row.status = "voided";
    },
    async findLedger(receiptId) {
      const line = lines.find((item) => item.receipt_id === receiptId);
      return line ? { id: line.id } : null;
    },
    async insertLedger(entry) {
      if (lines.some((item) => item.receipt_id === entry.receipt_id)) {
        throw new Error("duplicate ledger");
      }
      const row = { ...entry, id: `led_${lines.length + 1}` };
      lines.push(row);
      return { id: row.id };
    },
  };
}

test("a charged purchase writes one receipt and one ledger line from the locked price", async () => {
  const store = memoryStore();
  const first = await recordChargedPurchase(store, {
    ownerRef: "apixis-sub-1",
    tier: "stock_checker_monthly",
    channel: "card",
    externalId: "cs_test_123",
  });
  assert.equal(first.created, true);
  assert.equal(store.receipts.length, 1);
  assert.equal(store.lines.length, 1);
  assert.equal(store.receipts[0].product, "halaxis");
  assert.equal(store.receipts[0].amount_usd_cents, 5000);
  assert.equal(store.receipts[0].amount_ixis, null);
  assert.equal(store.receipts[0].status, "recorded");
  assert.equal(store.lines[0].entry_type, "plan_purchase");
  assert.equal(store.lines[0].amount_usd_cents, 5000);
  assert.equal(store.lines[0].receipt_id, first.receiptId);

  const again = await recordChargedPurchase(store, {
    ownerRef: "apixis-sub-1",
    tier: "stock_checker_monthly",
    channel: "card",
    externalId: "cs_test_123",
  });
  assert.equal(again.created, false);
  assert.equal(again.receiptId, first.receiptId);
  assert.equal(store.receipts.length, 1);
  assert.equal(store.lines.length, 1);
});

test("an Ixis purchase records 5,000 Ixis and a repeat does not add a line", async () => {
  const store = memoryStore();
  const pending = await openPendingReceipt(store, {
    ownerRef: "owner@example.com",
    tier: "stock_checker_activation",
    channel: "ixis",
    externalId: "res_1",
  });
  assert.equal(store.receipts[0].status, "pending");
  assert.equal(store.lines.length, 0);

  const recorded = await recordChargedPurchase(store, {
    ownerRef: "owner@example.com",
    tier: "stock_checker_activation",
    channel: "ixis",
    externalId: pending.externalId,
  });
  assert.equal(recorded.receiptId, pending.receiptId);
  assert.equal(store.receipts[0].status, "recorded");
  assert.equal(store.lines[0].amount_ixis, 5000);
  assert.equal(store.lines[0].channel, "ixis");

  await recordChargedPurchase(store, {
    ownerRef: "owner@example.com",
    tier: "stock_checker_activation",
    channel: "ixis",
    externalId: "res_1",
  });
  assert.equal(store.lines.length, 1);
});

test("a voided receipt is not a purchase and the fund cannot be recorded", async () => {
  const store = memoryStore();
  const pending = await openPendingReceipt(store, {
    ownerRef: "apixis-sub-1",
    tier: "stock_checker_activation",
    channel: "ixis",
    externalId: "res_void",
  });
  await store.voidIfPending(pending.receiptId);
  await assert.rejects(
    () =>
      recordChargedPurchase(store, {
        ownerRef: "apixis-sub-1",
        tier: "stock_checker_activation",
        channel: "ixis",
        externalId: "res_void",
      }),
    (error: unknown) => error instanceof PlanPurchaseError && error.code === "voided",
  );
  assert.equal(store.lines.length, 0);

  assert.throws(
    () =>
      buildPlanPurchase({
        ownerRef: "apixis-sub-1",
        tier: "fund",
        channel: "card",
        externalId: "cs_fund",
      }),
    (error: unknown) => error instanceof PlanPurchaseError && error.code === "not_a_plan",
  );
});

test("stripe sessions become a receipt only for a paid halaxis plan at the locked amount", () => {
  const paid = purchaseFromCheckoutSession({
    id: "cs_test_paid",
    payment_status: "paid",
    amount_total: 5000,
    client_reference_id: "apixis-sub-9",
    metadata: { product: "halaxis", tier: "stock_checker_activation" },
  });
  assert.equal(paid.ok, true);
  if (paid.ok) {
    assert.equal(paid.purchase.channel, "card");
    assert.equal(paid.purchase.externalId, "cs_test_paid");
    const built = buildPlanPurchase(paid.purchase);
    assert.equal(built.receipt.amount_usd_cents, 5000);
    assert.equal(JSON.stringify(built).includes("sk_"), false);
  }

  assert.deepEqual(
    purchaseFromCheckoutSession({
      id: "cs_other",
      payment_status: "paid",
      amount_total: 5000,
      metadata: { product: "other", tier: "stock_checker_activation" },
      client_reference_id: "apixis-sub-9",
    }),
    { ok: false, reason: "not_halaxis" },
  );
  assert.equal(
    purchaseFromCheckoutSession({
      id: "cs_fund",
      payment_status: "paid",
      amount_total: 5000,
      client_reference_id: "apixis-sub-9",
      metadata: { product: "halaxis", tier: "fund" },
    }).ok,
    false,
  );
  assert.equal(
    purchaseFromCheckoutSession({
      id: "cs_unpaid",
      payment_status: "unpaid",
      amount_total: 5000,
      client_reference_id: "apixis-sub-9",
      metadata: { product: "halaxis", tier: "stock_checker_monthly" },
    }).ok,
    false,
  );
  assert.equal(
    purchaseFromCheckoutSession({
      id: "cs_wrong",
      payment_status: "paid",
      amount_total: 100,
      client_reference_id: "apixis-sub-9",
      metadata: { product: "halaxis", tier: "stock_checker_monthly" },
    }).ok,
    false,
  );
});
