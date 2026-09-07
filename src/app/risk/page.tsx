import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Risk disclosure",
  description: "General risk disclosure for Halaxis — counsel-review draft. Not an offering document.",
};

export default function RiskPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal · counsel-review draft"
        title="Risk disclosure"
        description="General risks of private and public market investing. This is not a complete offering risk factor section."
      />
      <article className="container max-w-3xl space-y-6 py-12 text-sm leading-relaxed text-muted-foreground">
        <p>
          Investing involves the risk of loss, including loss of principal.
          Illiquidity, concentration, model error, operational failure, key-person
          risk, geopolitical events, and Sharia-screening constraints can all
          reduce returns or prevent a strategy from being implemented as
          described.
        </p>
        <p>
          Faith-aligned screens can exclude otherwise attractive securities and
          may cause tracking differences versus conventional benchmarks. Scholar
          views can differ; a screen is not a guarantee of spiritual or legal
          sufficiency for every investor.
        </p>
        <p>
          Regulatory, tax, and offering structures are unfinished. A vehicle may
          never launch. Interest-list members may never receive an allocation.
        </p>
        <p>
          Past performance — if it is ever shown in a later document — would not
          be indicative of future results. This website shows none.{" "}
          <span className="text-gold">
            [Counsel-review placeholder — replace with offering-specific risk
            factors before any solicitation.]
          </span>
        </p>
      </article>
    </>
  );
}
