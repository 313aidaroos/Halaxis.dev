import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { paymentsEnabled } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Checkout status",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  const enabled = paymentsEnabled();

  return (
    <>
      <PageHero
        title={enabled ? "Checkout session received" : "Payments are not active"}
        description={
          enabled
            ? "If you completed a test or authorized session, Stripe has a record. This page does not confirm a fund subscription."
            : "ENABLE_PAYMENTS is off. No live Halaxis subscription should have been taken on this site."
        }
      />
      <div className="container py-12">
        <Button asChild variant="outline">
          <Link href="/contact">Return to interest form</Link>
        </Button>
      </div>
    </>
  );
}
