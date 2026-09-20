import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentPanel() {
  return (
    <Card className="border-gold/25">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Redeem with Ixis</CardTitle>
          <Badge variant="outline">Apixis Wallet</Badge>
        </div>
        <CardDescription>
          All Halaxis access is redeemed with Ixis points. Buy Ixis in Apixis Wallet (100 Ixis = $1 USD). 
          Ixis is closed-loop platform credit — NOT an investment, non-withdrawable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Redemption flow coming soon. For now, express interest on the{" "}
          <Link href="/contact" className="text-gold underline-offset-4 hover:underline">
            accredited-investor form
          </Link>.
        </p>
      </CardContent>
    </Card>
  );
}
