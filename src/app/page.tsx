import Link from "next/link";
import {
  Compass,
  Landmark,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Faq } from "@/components/faq";
import { LegalBanner } from "@/components/legal-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

const pillars = [
  {
    title: "Faith-aligned screens",
    icon: ShieldCheck,
    body: "The intended program excludes riba-based instruments, prohibited sectors, and structures that fail a conservative reading of gharar and maysir. Formal scholar review is pending.",
  },
  {
    title: "Institutional discipline",
    icon: Landmark,
    body: "Halaxis is designed as a professional investment platform — not a retail trading app. Process, documentation, and counsel come before any capital raise.",
  },
  {
    title: "No invented track record",
    icon: Scale,
    body: "We do not publish performance, AUM, or forecasts on this site. Any future figures will appear only in counsel-reviewed materials, if at all.",
  },
];

const steps = [
  {
    title: "Express interest",
    body: "Accredited investors (or equivalent) may join the list. This is not a subscription and does not reserve an allocation.",
  },
  {
    title: "Counsel & filings",
    body: "Securities, tax, and Sharia counsel review offering structure, disclosures, and any required registrations before any solicitation.",
  },
  {
    title: "Documented invitation",
    body: "If a lawful path exists, qualified persons would receive counsel-reviewed documents — never a checkout link from this marketing site by default.",
  },
  {
    title: "Onboarding (future)",
    body: "Payment and fund onboarding stay behind ENABLE_PAYMENTS. They remain off until compliance gates are cleared.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden geometric-grid">
        <div className="container grid gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
          <div>
            <Badge variant="gold">In formation · not accepting investments</Badge>
            <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-foreground md:text-6xl">
              Halal capital, stewarded with discipline.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {siteConfig.name} is a Halal- and Sharia-aligned investment
              platform being built by {siteConfig.principal} through{" "}
              {siteConfig.legalName}. Formal scholar review and a published
              methodology are pending. This site is for education and
              accredited-investor interest only.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="gold" size="lg">
                <Link href="/screen">Open the Shariah screen</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Join the interest list</Link>
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <LegalBanner compact />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Compass className="h-4 w-4 text-gold" />
                  High-level mandate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Screen listed and private exposures for Sharia compatibility.
                  Prefer real-economy participation over leveraged financial
                  engineering. Avoid interest-bearing cash structures where a
                  compliant alternative can be designed.
                </p>
                <p>
                  This is a statement of intent — not a prospectus, not a pitch
                  book, and not a promise of strategy or results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
            Positioning
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl md:text-4xl">
            Islamic finance principles, institutional posture.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar) => (
              <Card key={pillar.title}>
                <CardHeader>
                  <pillar.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {pillar.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/25">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
            How it works
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Interest first. Capital later — if ever lawful.
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-gold">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-serif text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container grid gap-10 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
              Questions
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">FAQ</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Conservative answers. If a topic needs counsel, we say so.
            </p>
          </div>
          <Faq />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container flex flex-col items-start gap-5 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-xl">
            <h2 className="flex items-center gap-2 font-serif text-3xl">
              <Sparkles className="h-5 w-5 text-gold" />
              Stay informed
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Join the accredited-investor interest list. We will not treat a
              form submission as a commitment, and we will not ask for wires
              from this website.
            </p>
          </div>
          <Button asChild variant="gold" size="lg">
            <Link href="/contact">Submit interest</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
