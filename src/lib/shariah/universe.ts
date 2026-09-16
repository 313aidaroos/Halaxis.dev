import type { ScreenVerdict } from "@/lib/shariah/standard";

export type UniverseName = {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  /** Illustrative snapshot — not live prices. */
  debtToMarketCap: number | null;
  cashPlusInterestToMarketCap: number | null;
  receivablesToMarketCap: number | null;
  notes: string;
  /** Optional override when the keyword screen is too coarse. */
  businessOverride?: ScreenVerdict;
};

/**
 * Illustrative watchlist only. Not Halaxis holdings. Not a live book.
 * Ratios are rounded educational snapshots for the screen engine, not a market-data feed.
 */
export const ILLUSTRATIVE_UNIVERSE: UniverseName[] = [
  {
    ticker: "AAPL",
    name: "Apple",
    sector: "Technology",
    industry: "Consumer Electronics",
    debtToMarketCap: 0.03,
    cashPlusInterestToMarketCap: 0.04,
    receivablesToMarketCap: 0.02,
    notes: "Typically passes DJIM-style caps. Cash sleeve still needs a non-riba home if held in size.",
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    sector: "Technology",
    industry: "Software — Infrastructure",
    debtToMarketCap: 0.04,
    cashPlusInterestToMarketCap: 0.05,
    receivablesToMarketCap: 0.02,
    notes: "Real-economy software. Cash drag on the issuer balance sheet is a purification topic, not an automatic fail at these caps.",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet",
    sector: "Communication Services",
    industry: "Internet Content & Information",
    debtToMarketCap: 0.02,
    cashPlusInterestToMarketCap: 0.08,
    receivablesToMarketCap: 0.02,
    notes: "Business screen passes; advertising mix is not a classical sector fail.",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA",
    sector: "Technology",
    industry: "Semiconductors",
    debtToMarketCap: 0.01,
    cashPlusInterestToMarketCap: 0.04,
    receivablesToMarketCap: 0.03,
    notes: "Semiconductor real-economy exposure. Not a performance claim.",
  },
  {
    ticker: "ASML",
    name: "ASML Holding",
    sector: "Technology",
    industry: "Semiconductor Equipment & Materials",
    debtToMarketCap: 0.03,
    cashPlusInterestToMarketCap: 0.05,
    receivablesToMarketCap: 0.04,
    notes: "Equipment maker. Illustrative pass under Halaxis v1.",
  },
  {
    ticker: "UNH",
    name: "UnitedHealth Group",
    sector: "Healthcare",
    industry: "Healthcare Plans",
    debtToMarketCap: 0.08,
    cashPlusInterestToMarketCap: 0.04,
    receivablesToMarketCap: 0.06,
    notes: "Managed care is not conventional insurance under this coarse industry map — still a scholar item.",
  },
  {
    ticker: "PG",
    name: "Procter & Gamble",
    sector: "Consumer Defensive",
    industry: "Household & Personal Products",
    debtToMarketCap: 0.09,
    cashPlusInterestToMarketCap: 0.02,
    receivablesToMarketCap: 0.02,
    notes: "Consumer staples. Illustrative pass.",
  },
  {
    ticker: "COST",
    name: "Costco",
    sector: "Consumer Defensive",
    industry: "Discount Stores",
    debtToMarketCap: 0.03,
    cashPlusInterestToMarketCap: 0.04,
    receivablesToMarketCap: 0.01,
    notes: "Sells alcohol. Business may pass with purification of incidental haram sales — review, not a silent pass.",
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase",
    sector: "Financial Services",
    industry: "Banks — Diversified",
    debtToMarketCap: null,
    cashPlusInterestToMarketCap: null,
    receivablesToMarketCap: null,
    notes: "Core conventional banking. Riba. Not Halaxis.",
  },
  {
    ticker: "BAC",
    name: "Bank of America",
    sector: "Financial Services",
    industry: "Banks — Diversified",
    debtToMarketCap: null,
    cashPlusInterestToMarketCap: null,
    receivablesToMarketCap: null,
    notes: "Core conventional banking. Riba. Not Halaxis.",
  },
  {
    ticker: "GS",
    name: "Goldman Sachs",
    sector: "Financial Services",
    industry: "Capital Markets",
    debtToMarketCap: null,
    cashPlusInterestToMarketCap: null,
    receivablesToMarketCap: null,
    notes: "Interest-centric capital markets. Not Halaxis.",
  },
  {
    ticker: "MET",
    name: "MetLife",
    sector: "Financial Services",
    industry: "Insurance — Life",
    debtToMarketCap: null,
    cashPlusInterestToMarketCap: null,
    receivablesToMarketCap: null,
    notes: "Conventional insurance. Not Halaxis.",
  },
  {
    ticker: "BUD",
    name: "Anheuser-Busch InBev",
    sector: "Consumer Defensive",
    industry: "Beverages — Brewers",
    debtToMarketCap: 0.25,
    cashPlusInterestToMarketCap: 0.04,
    receivablesToMarketCap: 0.04,
    notes: "Alcohol as core. Business fail regardless of ratios.",
  },
  {
    ticker: "MGM",
    name: "MGM Resorts",
    sector: "Consumer Cyclical",
    industry: "Resorts & Casinos",
    debtToMarketCap: 0.4,
    cashPlusInterestToMarketCap: 0.05,
    receivablesToMarketCap: 0.05,
    notes: "Gambling as core (maysir). Not Halaxis.",
  },
  {
    ticker: "LMT",
    name: "Lockheed Martin",
    sector: "Industrials",
    industry: "Aerospace & Defense",
    debtToMarketCap: 0.15,
    cashPlusInterestToMarketCap: 0.02,
    receivablesToMarketCap: 0.08,
    notes: "Weapons as core activity. Not Halaxis.",
  },
  {
    ticker: "PM",
    name: "Philip Morris International",
    sector: "Consumer Defensive",
    industry: "Tobacco",
    debtToMarketCap: 0.2,
    cashPlusInterestToMarketCap: 0.03,
    receivablesToMarketCap: 0.04,
    notes: "Tobacco as core. Not Halaxis.",
  },
  {
    ticker: "AIG",
    name: "American International Group",
    sector: "Financial Services",
    industry: "Insurance — Diversified",
    debtToMarketCap: null,
    cashPlusInterestToMarketCap: null,
    receivablesToMarketCap: null,
    notes: "Conventional insurance. Not Halaxis.",
  },
  {
    ticker: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare",
    industry: "Drug Manufacturers — General",
    debtToMarketCap: 0.06,
    cashPlusInterestToMarketCap: 0.04,
    receivablesToMarketCap: 0.03,
    notes: "Healthcare manufacturer. Illustrative pass under Halaxis v1.",
  },
];

export function findUniverse(ticker: string) {
  const key = ticker.trim().toUpperCase();
  return ILLUSTRATIVE_UNIVERSE.find((row) => row.ticker === key) ?? null;
}
