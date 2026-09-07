import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Halaxis privacy notice — counsel-review draft.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal · counsel-review draft"
        title="Privacy notice"
        description="How we intend to handle interest-list information. This is a placeholder for qualified counsel."
      />
      <article className="container max-w-3xl space-y-6 py-12 text-sm leading-relaxed text-muted-foreground">
        <p>
          {siteConfig.legalName} (“we”) operates {siteConfig.domain}. If you
          submit the interest form, we collect your name, email, optional
          organization and message, and your accreditation / non-offer
          attestations.
        </p>
        <p>
          We use that information to record interest, contact you if a lawful
          communication path exists, and operate site security (including basic
          rate limiting). We do not sell personal information.
        </p>
        <p>
          Storage: if Supabase environment variables are present, records are
          written to the <code>accredited_interest</code> table. Otherwise we
          may email the submission via Resend, or, in local development only,
          log non-sensitive metadata.
        </p>
        <p>
          Chat messages sent to the educational assistant are processed by the
          configured model provider (Anthropic or OpenAI) and should not include
          account numbers, government IDs, or other sensitive data.
        </p>
        <p>
          Stripe is not used while <code>ENABLE_PAYMENTS</code> is false. If
          payments are later enabled, Stripe will process payment data under
          Stripe’s terms.
        </p>
        <p>
          Contact: {siteConfig.email}.{" "}
          <span className="text-gold">[Counsel-review placeholder — add
          jurisdiction-specific rights, retention, and DPA language.]</span>
        </p>
      </article>
    </>
  );
}
