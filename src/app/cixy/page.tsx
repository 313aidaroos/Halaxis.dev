import type { Metadata } from "next";

import { CixyCustomizer } from "@/components/cixy-customizer";
import { LegalBanner } from "@/components/legal-banner";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Cixy",
  description:
    "Cixy’s wardrobe on Halaxis, and Customize to equip a look. Essentials are owned. Paid cosmetics are coming soon. Ixis is bought only in Apixis Wallet.",
};

export default function CixyPage() {
  return (
    <>
      <PageHero
        eyebrow="Cixy"
        title="One Cixy"
        description="Wardrobe is her inventory on Halaxis. Customize equips a look from what she owns. Essentials are included. Paid looks are not priced yet."
      />
      <div className="container space-y-8 py-12 md:py-16">
        <LegalBanner compact />
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Cosmetics are bought with Ixis in Apixis Wallet, then owned looks appear in this
            wardrobe, then you equip them in Customize. This page does not charge a card.
          </p>
          <p>
            Cixy stays one educational assistant. A wardrobe change does not change her answers,
            and it is not a request for investment. Halaxis does not claim a Sharia certification
            for any look. Paid slots say coming soon and show no Ixis amount until Wallet prices
            them.
          </p>
        </div>
        <CixyCustomizer />
      </div>
    </>
  );
}
