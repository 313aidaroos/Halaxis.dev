import type { Metadata } from "next";

import { HoldingsTable } from "@/components/holdings-table";
import { LegalBanner } from "@/components/legal-banner";
import { PageHero } from "@/components/page-hero";
import { ScreenForm } from "@/components/screen-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HALAXIS_V1_STANDARD } from "@/lib/shariah/standard";

export const metadata: Metadata = {
  title: "Shariah screen",
  description:
    "Run the Halaxis v1 Shariah screen on a ticker. Illustrative universe — not a live book and not a fatwa.",
};

export default function ScreenPage() {
  return (
    <>
      <PageHero
        eyebrow="Product · Halaxis v1 screen"
        title="Screen first. Capital later."
        description="Named standard: AAOIFI-style business activity screens plus DJIM 33% financial-ratio caps. This is an engineering screen, not a fatwa, not a live fund, and not investment advice."
      />
      <div className="container space-y-10 py-12 md:py-16">
        <LegalBanner compact />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Run a ticker</CardTitle>
            </CardHeader>
            <CardContent>
              <ScreenForm />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What this screen does</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                <span className="text-foreground">{HALAXIS_V1_STANDARD.name}.</span>{" "}
                {HALAXIS_V1_STANDARD.inspiredBy}.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Business fail: conventional banks and insurers, alcohol, gambling,
                  tobacco, weapons as core, adult, cannabis as core.
                </li>
                <li>
                  Financial fail: debt, cash+interest securities, or receivables above
                  33% of market cap (DJIM-style).
                </li>
                <li>
                  Incidental haram revenue (for example a grocer selling alcohol) is
                  review — purification, not a silent pass.
                </li>
                <li>
                  No shorting, no interest-based margin, no live trading from this
                  page.
                </li>
              </ul>
              <p>{HALAXIS_V1_STANDARD.notAFatwa}</p>
            </CardContent>
          </Card>
        </div>
        <section className="space-y-4">
          <h2 className="font-serif text-3xl">Illustrative universe</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            These names are a worked example of the screen, stored in the Halaxis
            database when configured. They are not Halaxis holdings and not an offer
            to buy or sell anything.
          </p>
          <HoldingsTable />
        </section>
      </div>
    </>
  );
}
