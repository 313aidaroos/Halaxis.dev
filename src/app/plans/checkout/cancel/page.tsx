import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Plan checkout canceled",
  robots: { index: false, follow: false },
};

export default function PlanCheckoutCancelPage() {
  return (
    <>
      <PageHero
        title="Plan checkout canceled"
        description="No stock-checker payment was completed. The fund is still waitlist only and has no price."
      />
      <div className="container py-12">
        <Button asChild variant="gold">
          <Link href="/contact">Back to plans</Link>
        </Button>
      </div>
    </>
  );
}
