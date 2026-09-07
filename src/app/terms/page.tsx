import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Halaxis website terms — counsel-review draft.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal · counsel-review draft"
        title="Website terms"
        description="Terms for using the Halaxis marketing site. Not offering documents."
      />
      <article className="container max-w-3xl space-y-6 py-12 text-sm leading-relaxed text-muted-foreground">
        <p>
          By using {siteConfig.domain} you agree that the site is informational,
          that nothing on it is an offer of securities or investment advice, and
          that {siteConfig.name} is not publicly accepting investments.
        </p>
        <p>
          Content is provided “as is.” We make no warranty of completeness or
          fitness. You will not rely on this site as a basis to invest, and you
          will not send funds in response to it.
        </p>
        <p>
          The educational assistant is automated, may be incorrect, and cannot
          provide personalized advice or Sharia rulings for your situation.
        </p>
        <p>
          These terms are governed by the laws applicable to {siteConfig.legalName},
          without creating a client, advisory, or fiduciary relationship.{" "}
          <span className="text-gold">
            [Counsel-review placeholder — add governing law, venue, limitation
            of liability, and indemnification.]
          </span>
        </p>
      </article>
    </>
  );
}
