import type { Metadata } from "next";

import { LegalBanner } from "@/components/legal-banner";
import { PageHero } from "@/components/page-hero";
import { PaymentPanel } from "@/components/payment-panel";
import { WaitlistForm } from "@/components/waitlist-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accredited investor interest",
  description:
    "Express accredited-investor interest in Halaxis. Not a subscription and not an offer of securities.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Interest"
        title="Tell us you may want to hear more — later."
        description="This form records accredited-investor interest. It does not open an account, reserve capacity, or accept funds."
      />
      <div className="container grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Accredited-investor interest</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <LegalBanner compact />
            <WaitlistForm />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <PaymentPanel />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Direct contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Operational mail:{" "}
                <a className="text-gold hover:underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </p>
              <p className="mt-3">
                Do not send subscription agreements, wire instructions, or
                payment details to this address until counsel publishes an
                official channel.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
