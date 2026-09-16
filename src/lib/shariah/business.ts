import type { ScreenVerdict } from "@/lib/shariah/standard";

/** Core-activity fails. Incidental exposure is review, not a silent pass. */
const FAIL_INDUSTRY = [
  { test: /bank|savings|thrifts|mortgage|credit services|capital markets|asset management/i, reason: "Conventional interest-centric finance (riba)." },
  { test: /insurance|reinsurance/i, reason: "Conventional insurance (gharar / riba)." },
  { test: /beverages[^\n]*brew|brewers|distill|wineries|alcoholic/i, reason: "Alcohol as a core activity." },
  { test: /gambling|casino|resorts & casinos/i, reason: "Gambling / maysir as a core activity." },
  { test: /tobacco/i, reason: "Tobacco as a core activity." },
  { test: /aerospace & defense|defense/i, reason: "Weapons / defense as a core activity." },
  { test: /adult/i, reason: "Adult entertainment." },
  { test: /cannabis/i, reason: "Cannabis as a core activity." },
];

const FAIL_SECTOR = [
  { test: /^financial services$/i, reason: "Financial-services sector — treat as riba-centric unless a named Islamic exception exists." },
];

const REVIEW_INDUSTRY = [
  { test: /restaurants|food distribution|grocery|discount stores|hypermarkets/i, reason: "Retail / food may include alcohol, pork, or gambling-adjacent sales — purification review." },
  { test: /entertainment|media/i, reason: "Media/entertainment mix can include haram content — review." },
];

export function businessScreen(input: {
  sector?: string | null;
  industry?: string | null;
  name?: string | null;
}): { pass: boolean; verdict: ScreenVerdict; reasons: string[] } {
  const hay = `${input.sector ?? ""} | ${input.industry ?? ""} | ${input.name ?? ""}`;
  const reasons: string[] = [];

  for (const rule of FAIL_INDUSTRY) {
    if (rule.test.test(hay)) reasons.push(rule.reason);
  }
  for (const rule of FAIL_SECTOR) {
    if (input.sector && rule.test.test(input.sector) && reasons.length === 0) {
      reasons.push(rule.reason);
    }
  }

  if (reasons.length > 0) {
    return { pass: false, verdict: "fail", reasons };
  }

  for (const rule of REVIEW_INDUSTRY) {
    if (rule.test.test(hay)) {
      return {
        pass: true,
        verdict: "review",
        reasons: [rule.reason],
      };
    }
  }

  if (!input.sector && !input.industry) {
    return {
      pass: false,
      verdict: "review",
      reasons: ["No sector/industry data — cannot complete the business screen."],
    };
  }

  return { pass: true, verdict: "pass", reasons: [] };
}
