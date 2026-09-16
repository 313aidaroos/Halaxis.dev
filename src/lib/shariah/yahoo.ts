export type LiveFundamentals = {
  ticker: string;
  name: string | null;
  sector: string | null;
  industry: string | null;
  marketCap: number | null;
  totalDebt: number | null;
  totalCash: number | null;
};

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object" && "raw" in value) {
    const raw = (value as { raw?: unknown }).raw;
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  }
  return null;
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/** Best-effort public quote lookup. Fail closed to universe data — never invent ratios. */
export async function fetchLiveFundamentals(
  ticker: string,
): Promise<LiveFundamentals | null> {
  const symbol = encodeURIComponent(ticker.toUpperCase());
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price,assetProfile,defaultKeyStatistics,financialData`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "HalaxisScreen/1.0 (educational Shariah screen; not a trading bot)",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const json = (await response.json()) as {
      quoteSummary?: {
        result?: Array<{
          assetProfile?: { sector?: string; industry?: string };
          defaultKeyStatistics?: { marketCap?: unknown };
          financialData?: {
            totalDebt?: unknown;
            totalCash?: unknown;
            marketCap?: unknown;
          };
          price?: { longName?: string; shortName?: string; marketCap?: unknown };
        }>;
      };
    };
    const row = json.quoteSummary?.result?.[0];
    if (!row) return null;
    const marketCap =
      num(row.defaultKeyStatistics?.marketCap) ??
      num(row.financialData?.marketCap) ??
      num(row.price?.marketCap);
    return {
      ticker: ticker.toUpperCase(),
      name: str(row.price?.longName) ?? str(row.price?.shortName),
      sector: str(row.assetProfile?.sector),
      industry: str(row.assetProfile?.industry),
      marketCap,
      totalDebt: num(row.financialData?.totalDebt),
      totalCash: num(row.financialData?.totalCash),
    };
  } catch {
    return null;
  }
}

export function ratiosFromLive(live: LiveFundamentals) {
  const mc = live.marketCap;
  if (!mc || mc <= 0) {
    return {
      debtToMarketCap: null as number | null,
      cashPlusInterestToMarketCap: null as number | null,
      receivablesToMarketCap: null as number | null,
    };
  }
  return {
    debtToMarketCap: live.totalDebt != null ? live.totalDebt / mc : null,
    cashPlusInterestToMarketCap: live.totalCash != null ? live.totalCash / mc : null,
    receivablesToMarketCap: null as number | null,
  };
}
