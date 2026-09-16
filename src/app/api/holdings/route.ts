import { NextResponse } from "next/server";

import { evaluateUniverseRow } from "@/lib/shariah/evaluate";
import { HALAXIS_V1_STANDARD } from "@/lib/shariah/standard";
import { ILLUSTRATIVE_UNIVERSE } from "@/lib/shariah/universe";
import { readUniverseFromDb, seedUniverseIfEmpty } from "@/lib/shariah/persist";

export async function GET() {
  await seedUniverseIfEmpty();
  const fromDb = await readUniverseFromDb();

  if (fromDb && fromDb.length > 0) {
    return NextResponse.json({
      ok: true,
      source: "supabase",
      standard: HALAXIS_V1_STANDARD,
      holdings: fromDb,
      disclaimer:
        "Illustrative watchlist only. Not fund holdings, not a live book, not a fatwa, not investment advice.",
    });
  }

  const holdings = ILLUSTRATIVE_UNIVERSE.map((row) => {
    const evaluated = evaluateUniverseRow(row);
    return {
      ticker: row.ticker,
      name: row.name,
      sector: row.sector,
      industry: row.industry,
      business_status: evaluated.businessPass
        ? evaluated.verdict === "review"
          ? "review"
          : "pass"
        : "fail",
      financial_status:
        evaluated.financialPass === null
          ? "unknown"
          : evaluated.financialPass
            ? "pass"
            : "fail",
      verdict: evaluated.verdict,
      fail_reasons: evaluated.failReasons,
      debt_to_market_cap: row.debtToMarketCap,
      cash_plus_interest_to_market_cap: row.cashPlusInterestToMarketCap,
      receivables_to_market_cap: row.receivablesToMarketCap,
      notes: row.notes,
      snapshot_label: "illustrative, not live prices",
    };
  });

  return NextResponse.json({
    ok: true,
    source: "local",
    standard: HALAXIS_V1_STANDARD,
    holdings,
    disclaimer:
      "Illustrative watchlist only. Not fund holdings, not a live book, not a fatwa, not investment advice.",
  });
}
