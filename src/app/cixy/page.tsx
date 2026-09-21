import type { Metadata } from "next";

import { CixyCustomizer } from "@/components/cixy-customizer";
import { LegalBanner } from "@/components/legal-banner";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Cixy",
  description:
    "One Cixy. Wardrobe and Customize change hair, outfit, and office only. The face stays fixed. Essentials are owned. Ixis is bought only in Apixis Wallet.",
};

export default function CixyPage() {
  return (
    <>
      <PageHero
        eyebrow="Cixy"
        title="One Cixy"
        description="Same face in chat, wardrobe, and Customize. Only hair, outfit, and office change. Essentials are included. Paid looks are not priced yet."
      />
      <div className="container space-y-8 py-12 md:py-16">
        <LegalBanner compact />
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Cosmetics are bought with Ixis in Apixis Wallet, then owned looks appear in this
            wardrobe, then you equip them in Customize. This page does not charge a card.
          </p>
          <p>
            Cixy stays one educational assistant, with one face. A wardrobe change does not change her answers,
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
