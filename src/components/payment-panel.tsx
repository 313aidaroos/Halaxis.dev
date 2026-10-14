import Link from "next/link";

import { PlanCheckoutActions } from "@/components/plan-checkout-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { plansCheckoutEnabled } from "@/lib/flags";
import { pricingCopy } from "@/lib/pricing";
import { siteConfig } from "@/lib/site";
import { apixisWalletBuyUrl } from "@/lib/wallet";

export function PaymentPanel() {
  const buyIxisHref = apixisWalletBuyUrl();
  const checkoutOn = plansCheckoutEnabled();

  return (
    <Card className="border-gold/25">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Stock checker</CardTitle>
          <Badge variant="outline">Card or Ixis</Badge>
        </div>
        <CardDescription>
          {pricingCopy.stockChecker} Ixis is closed-loop platform credit bought in Apixis Wallet,
          non-withdrawable, and not an investment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PlanCheckoutActions enabled={checkoutOn} />
        <p className="text-sm">
          <a
            href={buyIxisHref}
            className="font-medium text-gold underline-offset-4 hover:underline"
          >
            Buy Ixis
          </a>
          <span className="text-muted-foreground"> · 100 Ixis = $1</span>
        </p>
        <p className="text-sm text-muted-foreground">{pricingCopy.fund}</p>
        <p className="text-sm text-muted-foreground">
          {pricingCopy.advisors} Use the interest form on this page or{" "}
          <a className="text-gold underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          {pricingCopy.notCertification} Express fund interest on the{" "}
          <Link href="/contact" className="text-gold underline-offset-4 hover:underline">
            accredited-investor form
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
