"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CIXY_EQUIPPED_STORAGE_KEY,
  CIXY_SLOTS,
  defaultEquipped,
  equippedOption,
  optionsForSlot,
  sanitizeEquipped,
  type CixyEquipped,
  type CixySlotId,
} from "@/lib/cixy/wardrobe";
import { apixisWalletBuyUrl } from "@/lib/wallet";
import { cn } from "@/lib/utils";

export function CixyCustomizer() {
  const buyIxisHref = apixisWalletBuyUrl();
  const [slot, setSlot] = useState<CixySlotId>("skin");
  const [equipped, setEquipped] = useState<CixyEquipped>(defaultEquipped);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CIXY_EQUIPPED_STORAGE_KEY);
      if (raw) setEquipped(sanitizeEquipped(JSON.parse(raw)));
    } catch {
      setEquipped(defaultEquipped());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(CIXY_EQUIPPED_STORAGE_KEY, JSON.stringify(equipped));
    } catch {
      // Preview still works when storage is blocked.
    }
  }, [equipped, ready]);

  const active = CIXY_SLOTS.find((item) => item.id === slot) ?? CIXY_SLOTS[0];
  const options = optionsForSlot(slot);

  function equip(id: string) {
    const option = options.find((item) => item.id === id);
    if (!option || option.access !== "essential") return;
    setEquipped((current) => ({ ...current, [slot]: option.id }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(16rem,22rem)_1fr] lg:items-start">
      <div className="space-y-4 lg:sticky lg:top-28">
        <figure className="overflow-hidden rounded-xl border border-gold/30 bg-card">
          <div
            className="flex aspect-[3/4] flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,hsl(345_32%_16%)_0%,hsl(345_36%_7%)_72%)] px-6 text-center"
            role="img"
            aria-label="Cixy portrait frame. Art pending. No figure is shown."
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Art pending</p>
            <p className="font-serif text-2xl text-foreground">Portrait coming soon</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Real PNG art for Cixy is not in the repo yet. This frame stays empty until those
              images land.
            </p>
          </div>
          <figcaption className="space-y-2 border-t border-border px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-wide text-gold">Equipped essentials</p>
            <ul className="space-y-1 text-muted-foreground">
              {CIXY_SLOTS.map((item) => {
                const option = equippedOption(equipped, item.id);
                return (
                  <li key={item.id} className="flex justify-between gap-3">
                    <span>{item.label}</span>
                    <span className="text-foreground">{option.label}</span>
                  </li>
                );
              })}
            </ul>
          </figcaption>
        </figure>
        <p className="text-sm text-muted-foreground">
          Need more Ixis? Buy a pack in Apixis Wallet. Buying a pack does not unlock a look.
          Paid looks stay coming soon until Wallet prices them.
        </p>
        <Button asChild variant="gold">
          <a href={buyIxisHref}>Buy Ixis</a>
        </Button>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Wardrobe slots">
          {CIXY_SLOTS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === slot}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                item.id === slot
                  ? "border-gold/50 bg-gold/15 text-gold"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setSlot(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div>
          <h2 className="font-serif text-2xl">{active.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{active.blurb}</p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const owned = option.access === "essential";
            const isEquipped = owned && equipped[slot] === option.id;
            return (
              <li key={option.id}>
                <article
                  className={cn(
                    "flex h-full flex-col gap-3 rounded-xl border p-4",
                    isEquipped ? "border-gold/50 bg-gold/5" : "border-border bg-card",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base text-foreground">{option.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{option.detail}</p>
                    </div>
                    <Badge variant={owned ? "gold" : "outline"}>
                      {owned ? "Owned" : "Coming soon"}
                    </Badge>
                  </div>
                  {owned ? (
                    <Button
                      type="button"
                      variant={isEquipped ? "outline" : "gold"}
                      size="sm"
                      className="mt-auto w-fit"
                      aria-pressed={isEquipped}
                      onClick={() => equip(option.id)}
                    >
                      {isEquipped ? "Equipped" : "Equip"}
                    </Button>
                  ) : (
                    <div className="mt-auto space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Not owned. No Ixis price until Apixis Wallet lists this look.
                      </p>
                      <Button asChild variant="outline" size="sm" className="w-fit">
                        <a href={buyIxisHref}>Buy Ixis</a>
                      </Button>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setEquipped(defaultEquipped())}
        >
          Reset to essentials
        </Button>
      </div>
    </div>
  );
}
