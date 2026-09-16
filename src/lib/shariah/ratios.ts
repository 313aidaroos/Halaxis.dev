import { HALAXIS_V1_STANDARD } from "@/lib/shariah/standard";

export function ratioScreen(input: {
  debtToMarketCap?: number | null;
  cashPlusInterestToMarketCap?: number | null;
  receivablesToMarketCap?: number | null;
}): { pass: boolean | null; reasons: string[] } {
  const reasons: string[] = [];
  const checks: Array<[number | null | undefined, number, string]> = [
    [
      input.debtToMarketCap,
      HALAXIS_V1_STANDARD.debtToMarketCapMax,
      `Interest-bearing debt / market cap exceeds ${pct(HALAXIS_V1_STANDARD.debtToMarketCapMax)} DJIM-style cap.`,
    ],
    [
      input.cashPlusInterestToMarketCap,
      HALAXIS_V1_STANDARD.cashPlusInterestToMarketCapMax,
      `Cash + interest-bearing securities / market cap exceeds ${pct(HALAXIS_V1_STANDARD.cashPlusInterestToMarketCapMax)} DJIM-style cap.`,
    ],
    [
      input.receivablesToMarketCap,
      HALAXIS_V1_STANDARD.receivablesToMarketCapMax,
      `Accounts receivable / market cap exceeds ${pct(HALAXIS_V1_STANDARD.receivablesToMarketCapMax)} DJIM-style cap.`,
    ],
  ];

  let sawNumber = false;
  for (const [value, max, reason] of checks) {
    if (value == null || Number.isNaN(value)) continue;
    sawNumber = true;
    if (value > max) reasons.push(reason);
  }

  if (!sawNumber) return { pass: null, reasons: [] };
  return { pass: reasons.length === 0, reasons };
}

export function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}
