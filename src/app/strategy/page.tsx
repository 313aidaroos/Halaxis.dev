import type { Metadata } from "next";

import { LegalBanner } from "@/components/legal-banner";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Strategy",
  description:
    "High-level Halaxis investment philosophy. No performance figures and no offer of securities.",
};

const themes = [
  {
    title: "Universe construction",
    body: "Start from a screenable universe. Apply qualitative and quantitative Sharia filters, then a conservative quality and liquidity overlay. Exact holdings are not published on this site.",
  },
  {
    title: "Real-economy bias",
    body: "Prefer participation in productive enterprise over layered leverage. Private and public exposures may both be studied; neither is promised.",
  },
  {
    title: "Risk, not theater",
    body: "Risk management will be described in offering documents if a vehicle is launched. This page does not list VaR, Sharpe, or any backtest.",
  },
  {
    title: "Cash & liquidity",
    body: "Idle cash cannot casually sit in conventional interest-bearing deposits if the program is to remain consistent with its stated screens. Design of a compliant liquidity sleeve is a counsel and scholar item.",
  },
];

export default function StrategyPage() {
  return (
    <>
      <PageHero
        eyebrow="Strategy"
        title="A philosophy, not a track record."
        description="Halaxis describes intended principles only. We do not invent performance, allocations, or a live book."
      />
      <div className="container max-w-3xl space-y-8 py-12 md:py-16">
        <LegalBanner compact />
        <div className="grid gap-4 sm:grid-cols-2">
          {themes.map((theme) => (
            <Card key={theme.title}>
              <CardHeader>
                <CardTitle className="text-lg">{theme.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {theme.body}
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="text-gold">[Counsel-review placeholder]</span> Any
          later strategy memorandum, factor model, or portfolio construction
          note must be reviewed before it is shown to prospective investors.
        </p>
      </div>
    </>
  );
}
