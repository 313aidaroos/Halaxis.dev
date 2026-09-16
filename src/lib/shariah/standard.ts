/** Named Halaxis v1 screen. Stick to this; do not mix standards mid-run. */

export const HALAXIS_V1_STANDARD = {
  id: "halaxis-v1",
  name: "Halaxis v1",
  inspiredBy:
    "AAOIFI-style business activity screens + Dow Jones Islamic Market (DJIM) 33% financial-ratio caps",
  notAFatwa:
    "This is an engineering screen, not a fatwa, not scholar sign-off, and not investment advice.",
  debtToMarketCapMax: 0.33,
  cashPlusInterestToMarketCapMax: 0.33,
  receivablesToMarketCapMax: 0.33,
} as const;

export type ScreenVerdict = "pass" | "fail" | "review";

export type ScreenResult = {
  ticker: string;
  name: string | null;
  standard: typeof HALAXIS_V1_STANDARD.id;
  standardLabel: string;
  verdict: ScreenVerdict;
  businessPass: boolean;
  financialPass: boolean | null;
  sector: string | null;
  industry: string | null;
  failReasons: string[];
  notes: string[];
  ratios: {
    debtToMarketCap: number | null;
    cashPlusInterestToMarketCap: number | null;
    receivablesToMarketCap: number | null;
  };
  source: "universe" | "live" | "live+universe";
};
