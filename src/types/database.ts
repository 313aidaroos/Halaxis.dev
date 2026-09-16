/**
 * Hand-written subset until `supabase gen types` is run against a live project.
 * Do not treat this as generated output.
 */
export type AccreditedInterestRow = {
  id: string;
  full_name: string;
  email: string;
  organization: string | null;
  message: string | null;
  accredited_attestation: boolean;
  understand_not_offer: boolean;
  created_at: string;
};

export type IllustrativeUniverseRow = {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  business_status: string;
  financial_status: string;
  verdict: string;
  fail_reasons: string[];
  debt_to_market_cap: number | null;
  cash_plus_interest_to_market_cap: number | null;
  receivables_to_market_cap: number | null;
  notes: string | null;
  snapshot_label: string;
  updated_at: string;
};

export type ScreenEventRow = {
  id: string;
  ticker: string;
  standard: string;
  verdict: string;
  business_pass: boolean;
  financial_pass: boolean | null;
  fail_reasons: string[];
  ratios: {
    debtToMarketCap: number | null;
    cashPlusInterestToMarketCap: number | null;
    receivablesToMarketCap: number | null;
  } | null;
  source: string;
  created_at: string;
};
