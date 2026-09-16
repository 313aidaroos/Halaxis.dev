import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ScreenResult } from "@/lib/shariah/standard";
import { evaluateUniverseRow } from "@/lib/shariah/evaluate";
import { ILLUSTRATIVE_UNIVERSE } from "@/lib/shariah/universe";

export async function persistScreenEvent(result: ScreenResult) {
  const admin = createAdminSupabaseClient();
  if (!admin) return { stored: false as const };

  const { error } = await admin.from("screen_events").insert({
    ticker: result.ticker,
    standard: result.standard,
    verdict: result.verdict,
    business_pass: result.businessPass,
    financial_pass: result.financialPass,
    fail_reasons: result.failReasons,
    ratios: result.ratios,
    source: result.source,
  });

  if (error) {
    console.error("[halaxis:screen_events]", error.message);
    return { stored: false as const };
  }
  return { stored: true as const };
}

export async function seedUniverseIfEmpty() {
  const admin = createAdminSupabaseClient();
  if (!admin) return { seeded: false as const, count: 0 };

  const { count, error: countError } = await admin
    .from("illustrative_universe")
    .select("ticker", { count: "exact", head: true });

  if (countError) {
    console.error("[halaxis:universe:count]", countError.message);
    return { seeded: false as const, count: 0 };
  }
  if ((count ?? 0) > 0) return { seeded: false as const, count: count ?? 0 };

  const rows = ILLUSTRATIVE_UNIVERSE.map((row) => {
    const evaluated = evaluateUniverseRow(row);
    return {
      ticker: row.ticker,
      name: row.name,
      sector: row.sector,
      industry: row.industry,
      business_status: evaluated.businessPass ? (evaluated.verdict === "review" ? "review" : "pass") : "fail",
      financial_status:
        evaluated.financialPass === null ? "unknown" : evaluated.financialPass ? "pass" : "fail",
      verdict: evaluated.verdict,
      fail_reasons: evaluated.failReasons,
      debt_to_market_cap: row.debtToMarketCap,
      cash_plus_interest_to_market_cap: row.cashPlusInterestToMarketCap,
      receivables_to_market_cap: row.receivablesToMarketCap,
      notes: row.notes,
      snapshot_label: "illustrative, not live prices",
    };
  });

  const { error } = await admin.from("illustrative_universe").upsert(rows, {
    onConflict: "ticker",
  });
  if (error) {
    console.error("[halaxis:universe:seed]", error.message);
    return { seeded: false as const, count: 0 };
  }
  return { seeded: true as const, count: rows.length };
}

export async function readUniverseFromDb() {
  const admin = createAdminSupabaseClient();
  if (!admin) return null;
  const { data, error } = await admin
    .from("illustrative_universe")
    .select(
      "ticker,name,sector,industry,business_status,financial_status,verdict,fail_reasons,debt_to_market_cap,cash_plus_interest_to_market_cap,receivables_to_market_cap,notes,snapshot_label,updated_at",
    )
    .order("ticker");
  if (error) {
    console.error("[halaxis:universe:read]", error.message);
    return null;
  }
  return data;
}
