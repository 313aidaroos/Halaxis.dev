import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Checkout canceled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <>
      <PageHero
        title="Checkout canceled"
        description="No payment was completed. The accredited-investor interest form remains the correct path."
      />
      <div className="container py-12">
        <Button asChild variant="gold">
          <Link href="/contact">Back to interest</Link>
        </Button>
      </div>
    </>
  );
}
