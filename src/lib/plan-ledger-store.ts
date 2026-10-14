import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { PlanLedgerDraft, PlanPurchaseStore, PlanReceiptDraft, StoredReceipt } from "@/lib/plan-ledger";

function asReceipt(row: { id: string; status: string; idempotency_key: string }): StoredReceipt {
  if (row.status !== "pending" && row.status !== "recorded" && row.status !== "voided") {
    throw new Error("Receipt status is not recognized.");
  }
  return { id: row.id, status: row.status, idempotency_key: row.idempotency_key };
}

/** Service-role writer. Returns null when Supabase admin is not configured. */
export function supabasePlanPurchaseStore(): PlanPurchaseStore | null {
  const db = createAdminSupabaseClient();
  if (!db) return null;

  return {
    async findReceipt(idempotencyKey) {
      const { data, error } = await db
        .from("plan_receipts")
        .select("id, status, idempotency_key")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();
      if (error) throw new Error("Receipt lookup failed.");
      return data ? asReceipt(data) : null;
    },

    async insertReceipt(receipt: PlanReceiptDraft) {
      const { data, error } = await db
        .from("plan_receipts")
        .insert({
          owner_ref: receipt.owner_ref,
          product: receipt.product,
          tier: receipt.tier,
          channel: receipt.channel,
          amount_usd_cents: receipt.amount_usd_cents,
          amount_ixis: receipt.amount_ixis,
          external_id: receipt.external_id,
          idempotency_key: receipt.idempotency_key,
          status: receipt.status,
        })
        .select("id, status, idempotency_key")
        .single();
      if (error?.code === "23505") {
        const { data: existing, error: readError } = await db
          .from("plan_receipts")
          .select("id, status, idempotency_key")
          .eq("idempotency_key", receipt.idempotency_key)
          .maybeSingle();
        if (readError || !existing) throw new Error("Receipt insert failed.");
        return asReceipt(existing);
      }
      if (error || !data) throw new Error("Receipt insert failed.");
      return asReceipt(data);
    },

    async markRecorded(id) {
      const { error } = await db
        .from("plan_receipts")
        .update({ status: "recorded", updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("status", "pending");
      if (error) throw new Error("Receipt update failed.");
    },

    async voidIfPending(id) {
      const { error } = await db
        .from("plan_receipts")
        .update({ status: "voided", updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("status", "pending");
      if (error) throw new Error("Receipt void failed.");
    },

    async findLedger(receiptId) {
      const { data, error } = await db
        .from("plan_ledger")
        .select("id")
        .eq("receipt_id", receiptId)
        .maybeSingle();
      if (error) throw new Error("Ledger lookup failed.");
      return data ? { id: data.id } : null;
    },

    async insertLedger(entry: PlanLedgerDraft & { receipt_id: string }) {
      const { data, error } = await db
        .from("plan_ledger")
        .insert({
          receipt_id: entry.receipt_id,
          owner_ref: entry.owner_ref,
          product: entry.product,
          tier: entry.tier,
          entry_type: entry.entry_type,
          channel: entry.channel,
          amount_usd_cents: entry.amount_usd_cents,
          amount_ixis: entry.amount_ixis,
        })
        .select("id")
        .single();
      if (error?.code === "23505") {
        const { data: existing, error: readError } = await db
          .from("plan_ledger")
          .select("id")
          .eq("receipt_id", entry.receipt_id)
          .maybeSingle();
        if (readError || !existing) throw new Error("Ledger insert failed.");
        return { id: existing.id };
      }
      if (error || !data) throw new Error("Ledger insert failed.");
      return { id: data.id };
    },
  };
}
