import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { plansCheckoutEnabled } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Plan checkout",
  robots: { index: false, follow: false },
};

export default function PlanCheckoutSuccessPage() {
  const enabled = plansCheckoutEnabled();

  return (
    <>
      <PageHero
        title={enabled ? "Stock-checker checkout received" : "Plan checkout is off"}
        description={
          enabled
            ? "If Stripe completed the session, Halaxis records a receipt and a ledger line for the stock checker. This page does not confirm a fund subscription, and it is not a Halal or Sharia certification."
            : "HALAXIS_PLANS_CHECKOUT is off. No stock-checker charge should have been taken on this site. The fund remains waitlist only."
        }
      />
      <div className="container py-12">
        <Button asChild variant="outline">
          <Link href="/screen">Return to the screen</Link>
        </Button>
      </div>
    </>
  );
}
