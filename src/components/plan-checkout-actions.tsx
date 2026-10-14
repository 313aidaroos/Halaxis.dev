"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PLAN_TIERS } from "@/lib/pricing";

const tiers = [PLAN_TIERS.stock_checker_activation, PLAN_TIERS.stock_checker_monthly];

export function PlanCheckoutActions({ enabled }: { enabled: boolean }) {
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  async function start(tier: string, channel: "card" | "ixis") {
    setMessage(null);
    setFailed(false);
    const key = `${channel}:${tier}`;
    setPending(key);
    try {
      const response = await fetch("/api/plans/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tier,
          channel,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const data = (await response.json()) as {
        url?: string;
        buyUrl?: string;
        error?: string;
        insufficient?: boolean;
        ok?: boolean;
      };
      if (data.insufficient && data.buyUrl) {
        window.location.assign(data.buyUrl);
        return;
      }
      if (!response.ok) {
        throw new Error(data.error ?? "Checkout failed.");
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      if (data.ok) {
        setMessage("Purchase recorded.");
        return;
      }
      throw new Error(data.error ?? "Checkout failed.");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-4">
      {tiers.map((tier) => (
        <div key={tier.id} className="space-y-2">
          <p className="text-sm text-foreground">
            {tier.name}: ${tier.usd}
            {tier.kind === "subscription" ? "/month" : " one-time"} · {tier.ixis.toLocaleString()} Ixis
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="gold"
              disabled={!enabled || pending !== null}
              onClick={() => start(tier.id, "card")}
            >
              {pending === `card:${tier.id}` ? "Opening Stripe…" : "Pay by card"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!enabled || pending !== null}
              onClick={() => start(tier.id, "ixis")}
            >
              {pending === `ixis:${tier.id}` ? "Redeeming Ixis…" : "Pay with Ixis"}
            </Button>
          </div>
        </div>
      ))}
      {enabled ? null : (
        <p className="text-sm text-muted-foreground">
          Plan checkout is off until HALAXIS_PLANS_CHECKOUT is turned on. The fund is not part of this checkout.
        </p>
      )}
      {message ? (
        <p className={failed ? "text-sm text-destructive" : "text-sm text-muted-foreground"} role={failed ? "alert" : "status"}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
