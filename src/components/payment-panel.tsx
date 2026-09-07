import Link from "next/link";

import { CheckoutButton } from "@/components/checkout-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentsEnabled } from "@/lib/flags";

export function PaymentPanel() {
  const enabled = paymentsEnabled();

  return (
    <Card className="border-gold/25">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Future allocation (gated)</CardTitle>
          <Badge variant={enabled ? "gold" : "outline"}>
            {enabled ? "Payments enabled" : "Disabled"}
          </Badge>
        </div>
        <CardDescription>
          Subscription and capital-account onboarding stay behind{" "}
          <code className="text-xs">ENABLE_PAYMENTS</code> until SEC and counsel
          gates are cleared. This is not a live offering.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabled ? (
          <CheckoutButton />
        ) : (
          <p className="text-sm text-muted-foreground">
            Checkout is hidden while payments are off. Express interest on the{" "}
            <Link href="/contact" className="text-gold underline-offset-4 hover:underline">
              accredited-investor form
            </Link>{" "}
            instead. Do not send funds.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
