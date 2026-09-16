import { businessScreen } from "@/lib/shariah/business";
import { ratioScreen } from "@/lib/shariah/ratios";
import { HALAXIS_V1_STANDARD, type ScreenResult, type ScreenVerdict } from "@/lib/shariah/standard";
import { findUniverse, type UniverseName } from "@/lib/shariah/universe";

function combineVerdict(opts: {
  businessPass: boolean;
  businessVerdict: ScreenVerdict;
  financialPass: boolean | null;
  reasons: string[];
}): ScreenVerdict {
  if (!opts.businessPass) return "fail";
  if (opts.financialPass === false) return "fail";
  if (opts.businessVerdict === "review" || opts.financialPass === null || opts.reasons.length > 0) {
    return "review";
  }
  return "pass";
}

export function evaluateUniverseRow(row: UniverseName): ScreenResult {
  const business = businessScreen({
    sector: row.sector,
    industry: row.industry,
    name: row.name,
  });
  const financial = ratioScreen({
    debtToMarketCap: row.debtToMarketCap,
    cashPlusInterestToMarketCap: row.cashPlusInterestToMarketCap,
    receivablesToMarketCap: row.receivablesToMarketCap,
  });
  const failReasons = [
    ...(business.pass ? [] : business.reasons),
    ...financial.reasons,
  ];
  const notes = [
    ...(business.pass ? business.reasons : []),
    row.notes,
    HALAXIS_V1_STANDARD.notAFatwa,
  ];
  const verdict = combineVerdict({
    businessPass: business.pass,
    businessVerdict: business.verdict,
    financialPass: financial.pass,
    reasons: failReasons,
  });

  return {
    ticker: row.ticker,
    name: row.name,
    standard: HALAXIS_V1_STANDARD.id,
    standardLabel: `${HALAXIS_V1_STANDARD.name} (${HALAXIS_V1_STANDARD.inspiredBy})`,
    verdict,
    businessPass: business.pass,
    financialPass: financial.pass,
    sector: row.sector,
    industry: row.industry,
    failReasons,
    notes,
    ratios: {
      debtToMarketCap: row.debtToMarketCap,
      cashPlusInterestToMarketCap: row.cashPlusInterestToMarketCap,
      receivablesToMarketCap: row.receivablesToMarketCap,
    },
    source: "universe",
  };
}

export function evaluateLive(input: {
  ticker: string;
  name?: string | null;
  sector?: string | null;
  industry?: string | null;
  debtToMarketCap?: number | null;
  cashPlusInterestToMarketCap?: number | null;
  receivablesToMarketCap?: number | null;
}): ScreenResult {
  const universe = findUniverse(input.ticker);
  const sector = input.sector ?? universe?.sector ?? null;
  const industry = input.industry ?? universe?.industry ?? null;
  const name = input.name ?? universe?.name ?? null;
  const business = businessScreen({ sector, industry, name });
  const financial = ratioScreen({
    debtToMarketCap: input.debtToMarketCap ?? universe?.debtToMarketCap ?? null,
    cashPlusInterestToMarketCap:
      input.cashPlusInterestToMarketCap ?? universe?.cashPlusInterestToMarketCap ?? null,
    receivablesToMarketCap: input.receivablesToMarketCap ?? universe?.receivablesToMarketCap ?? null,
  });
  const failReasons = [
    ...(business.pass ? [] : business.reasons),
    ...financial.reasons,
  ];
  const notes = [
    ...(business.pass ? business.reasons : []),
    universe?.notes ?? "Live lookup. Not a fatwa.",
    HALAXIS_V1_STANDARD.notAFatwa,
  ];

  return {
    ticker: input.ticker.toUpperCase(),
    name,
    standard: HALAXIS_V1_STANDARD.id,
    standardLabel: `${HALAXIS_V1_STANDARD.name} (${HALAXIS_V1_STANDARD.inspiredBy})`,
    verdict: combineVerdict({
      businessPass: business.pass,
      businessVerdict: business.verdict,
      financialPass: financial.pass,
      reasons: failReasons,
    }),
    businessPass: business.pass,
    financialPass: financial.pass,
    sector,
    industry,
    failReasons,
    notes,
    ratios: {
      debtToMarketCap: input.debtToMarketCap ?? universe?.debtToMarketCap ?? null,
      cashPlusInterestToMarketCap:
        input.cashPlusInterestToMarketCap ?? universe?.cashPlusInterestToMarketCap ?? null,
      receivablesToMarketCap: input.receivablesToMarketCap ?? universe?.receivablesToMarketCap ?? null,
    },
    source: universe ? "live+universe" : "live",
  };
}

export function evaluateTickerFromUniverse(ticker: string): ScreenResult | null {
  const row = findUniverse(ticker);
  return row ? evaluateUniverseRow(row) : null;
}
