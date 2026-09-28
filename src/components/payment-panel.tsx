import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apixisWalletBuyUrl } from "@/lib/wallet";

export function PaymentPanel() {
  const buyIxisHref = apixisWalletBuyUrl();

  return (
    <Card className="border-gold/25">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Redeem with Ixis</CardTitle>
          <Badge variant="outline">Apixis Wallet</Badge>
        </div>
        <CardDescription>
          All Halaxis access is redeemed with Ixis points. Buy Ixis in Apixis Wallet — cash is credited only there (100 Ixis = $1 USD).
          Ixis is closed-loop platform credit, non-withdrawable, and not an investment. Halaxis does not run a separate card checkout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/*
          TODO(ixis-balance): see src/lib/wallet.ts. Do not call Wallet
          GET /api/v1/wallet with a Halaxis session.
        */}
        <p className="text-sm">
          <a
            href={buyIxisHref}
            className="font-medium text-gold underline-offset-4 hover:underline"
          >
            Buy Ixis
          </a>
        </p>
        <p className="text-sm text-muted-foreground">
          Redemption of Ixis on Halaxis is coming soon. For now, express interest on the{" "}
          <Link href="/contact" className="text-gold underline-offset-4 hover:underline">
            accredited-investor form
          </Link>.
        </p>
      </CardContent>
    </Card>
  );
}
