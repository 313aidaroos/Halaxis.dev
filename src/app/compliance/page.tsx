import type { Metadata } from "next";

import { LegalBanner } from "@/components/legal-banner";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sharia & Compliance",
  description:
    "High-level Halal and Sharia positioning for Halaxis, plus securities-law limits. Scholar and counsel review pending.",
};

const screens = [
  {
    title: "Riba",
    body: "Avoid interest-bearing instruments and structures whose return is a disguised interest claim. Treasury-style cash sleeves require a designed, counsel-reviewed alternative before use.",
  },
  {
    title: "Gharar",
    body: "Limit excessive uncertainty and opaque payoff structures. Complex derivatives and poorly disclosed private terms are treated as suspect until reviewed.",
  },
  {
    title: "Maysir",
    body: "Avoid gambling-like exposures and pure speculative constructs that lack an underlying real-economy purpose.",
  },
  {
    title: "Prohibited sectors",
    body: "Screen issuers and counterparties involved in conventional interest-centric banking where applicable, alcohol, adult entertainment, gambling, pork, and other commonly excluded activities — subject to a published methodology once scholars sign off.",
  },
];

export default function CompliancePage() {
  return (
    <>
      <PageHero
        eyebrow="Sharia & Compliance"
        title="Principles first. Scholar and counsel review still pending."
        description="This page states intended screens, not a fatwa, not a completed methodology, and not a securities registration."
      />
      <div className="container max-w-3xl space-y-10 py-12 md:py-16">
        <LegalBanner />
        <div className="grid gap-4 sm:grid-cols-2">
          {screens.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-serif text-2xl text-foreground">
            Securities posture
          </h2>
          <p>
            Halaxis is not publicly soliciting or accepting investments. Do not
            infer that the firm, Awad Alaidaroos, or Apixis Dev LLC is
            registered, exempt, approved, or “cleared” by the U.S. Securities
            and Exchange Commission or any state regulator because this website
            exists.
          </p>
          <p>
            <span className="text-gold">[Counsel-review placeholder]</span>{" "}
            Formal Sharia board appointment, purification policy, purification
            of incidental income, and any Form ADV / Form D / state notice
            filings are not asserted here.
          </p>
        </div>
      </div>
    </>
  );
}
