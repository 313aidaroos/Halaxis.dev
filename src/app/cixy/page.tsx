import type { Metadata } from "next";

import { CixyCustomizer } from "@/components/cixy-customizer";
import { LegalBanner } from "@/components/legal-banner";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Customize Cixy",
  description:
    "Preview Cixy’s modest professional look. Paid cosmetics are coming soon. Ixis is bought only in Apixis Wallet.",
};

export default function CixyPage() {
  return (
    <>
      <PageHero
        eyebrow="Cixy"
        title="Customize Cixy"
        description="Choose a modest, professional look for Halaxis’s educational assistant. Essentials are included. Paid looks are not priced yet."
      />
      <div className="container space-y-8 py-12 md:py-16">
        <LegalBanner compact />
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Cixy stays an educational assistant. A wardrobe change does not change her answers,
            and it is not a request for investment, a subscription, or a payment on this site.
          </p>
          <p>
            Cosmetics are appearance only. Halaxis does not claim a Sharia certification for
            any look. Paid slots say coming soon and show no Ixis amount until Apixis Wallet
            prices them. Dollars become Ixis only in Apixis Wallet.
          </p>
        </div>
        <CixyCustomizer />
      </div>
    </>
  );
}
