import type { Metadata } from "next";

import { LegalBanner } from "@/components/legal-banner";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}, ${siteConfig.principal}, and ${siteConfig.legalName}.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A platform in formation, not a live fund raise."
        description={`${siteConfig.name} is being built as a Halal- and Sharia-aligned investment platform associated with ${siteConfig.principal} and ${siteConfig.legalName}. Formal scholar review is pending.`}
      />
      <div className="container max-w-3xl space-y-8 py-12 md:py-16">
        <LegalBanner compact />
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            {siteConfig.principal} is developing {siteConfig.name} through{" "}
            {siteConfig.legalName}. This page does not invent a biography,
            credentials, prior fund performance, or regulatory status. Those
            facts will be stated only when they can be documented and
            counsel-reviewed.
          </p>
          <p>
            {siteConfig.legalName} is the operating entity named on this
            marketing site. Entity good-standing, ownership, and any adviser or
            fund vehicles that may later sit beside it are{" "}
            <strong className="text-foreground">counsel-review placeholders</strong>{" "}
            and should not be treated as complete corporate disclosure.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What we will say</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Intent to build a faith-aligned, professionally run investment
              platform. Invitation for accredited-investor interest. Clear
              legal limits on this website.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What we will not say</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Guaranteed returns, unverified AUM, “SEC approved,” or that we
              are currently accepting subscriptions. Those claims are
              prohibited on this site.
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
