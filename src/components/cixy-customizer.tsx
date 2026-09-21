"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CIXY_EQUIPPED_STORAGE_KEY,
  CIXY_FACE,
  CIXY_SLOTS,
  defaultEquipped,
  equippedOption,
  isOwned,
  optionsForSlot,
  sanitizeEquipped,
  type CixyEquipped,
  type CixyOption,
  type CixySlotId,
} from "@/lib/cixy/wardrobe";
import { apixisWalletBuyUrl } from "@/lib/wallet";
import { cn } from "@/lib/utils";

type CixyPanel = "wardrobe" | "customize";

function panelFromLocation(): CixyPanel {
  if (typeof window === "undefined") return "wardrobe";
  return window.location.hash === "#customize" ? "customize" : "wardrobe";
}

export function CixyCustomizer() {
  const buyIxisHref = apixisWalletBuyUrl();
  const [panel, setPanel] = useState<CixyPanel>("wardrobe");
  const [slot, setSlot] = useState<CixySlotId>("hair");
  const [equipped, setEquipped] = useState<CixyEquipped>(defaultEquipped);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPanel(panelFromLocation());
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

  function showPanel(next: CixyPanel) {
    setPanel(next);
    const url = `${window.location.pathname}${window.location.search}#${next}`;
    window.history.replaceState(null, "", url);
  }

  function equip(slotId: CixySlotId, optionId: string) {
    const option = optionsForSlot(slotId).find((item) => item.id === optionId);
    if (!option || !isOwned(option)) return;
    setEquipped((current) => ({ ...current, [slotId]: option.id }));
  }

  function equipInCustomize(option: CixyOption) {
    if (!isOwned(option)) return;
    equip(option.slot, option.id);
    setSlot(option.slot);
    showPanel("customize");
  }

  const active = CIXY_SLOTS.find((item) => item.id === slot) ?? CIXY_SLOTS[0];

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
              One Cixy, same face everywhere. PNG art is not in the repo yet, so this frame stays
              empty.
            </p>
          </div>
          <figcaption className="space-y-2 border-t border-border px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-wide text-gold">Equipped</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex justify-between gap-3">
                <span>Face</span>
                <span className="text-foreground">{CIXY_FACE.label}</span>
              </li>
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
            <p className="text-xs text-muted-foreground">{CIXY_FACE.detail}</p>
          </figcaption>
        </figure>
        <p className="text-sm text-muted-foreground">
          Need more Ixis? Buy a pack in Apixis Wallet. A pack does not unlock a look. Paid
          looks stay coming soon until Wallet prices them.
        </p>
        <Button asChild variant="gold">
          <a href={buyIxisHref}>Buy Ixis</a>
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Cixy sections">
          {(
            [
              ["wardrobe", "Wardrobe"],
              ["customize", "Customize"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`cixy-tab-${id}`}
              aria-selected={panel === id}
              aria-controls={`cixy-panel-${id}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                panel === id
                  ? "border-gold/50 bg-gold/15 text-gold"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
              onClick={() => showPanel(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {panel === "wardrobe" ? (
          <section
            id="cixy-panel-wardrobe"
            role="tabpanel"
            aria-labelledby="cixy-tab-wardrobe"
            className="space-y-8"
          >
            <div>
              <h2 className="font-serif text-2xl">Wardrobe</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Inventory on Halaxis for hair, outfit, and office. The face stays the signature.
                Essentials are owned. Paid looks stay unowned until Apixis Wallet prices them.
              </p>
            </div>
            {CIXY_SLOTS.map((item) => (
              <div key={item.id} className="space-y-3">
                <h3 className="font-serif text-xl">{item.label}</h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {optionsForSlot(item.id).map((option) => (
                    <li key={option.id}>
                      <OptionCard
                        option={option}
                        equipped={isOwned(option) && equipped[item.id] === option.id}
                        buyHref={buyIxisHref}
                        action={
                          isOwned(option) ? (
                            <Button
                              type="button"
                              variant={equipped[item.id] === option.id ? "outline" : "gold"}
                              size="sm"
                              onClick={() => equipInCustomize(option)}
                            >
                              {equipped[item.id] === option.id ? "Equipped" : "Equip in Customize"}
                            </Button>
                          ) : (
                            <BuyLink href={buyIxisHref} label={option.label} />
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ) : (
          <section
            id="cixy-panel-customize"
            role="tabpanel"
            aria-labelledby="cixy-tab-customize"
            className="space-y-5"
          >
            <div>
              <h2 className="font-serif text-2xl">Customize</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Equip a look from the wardrobe. Only owned essentials can be worn. Unowned looks
                open Apixis Wallet.
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Customize slots">
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
            <p className="text-sm text-muted-foreground">{active.blurb}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {optionsForSlot(slot).map((option) => {
                const owned = isOwned(option);
                const wearing = owned && equipped[slot] === option.id;
                return (
                  <li key={option.id}>
                    <OptionCard
                      option={option}
                      equipped={wearing}
                      buyHref={buyIxisHref}
                      action={
                        owned ? (
                          <Button
                            type="button"
                            variant={wearing ? "outline" : "gold"}
                            size="sm"
                            aria-pressed={wearing}
                            onClick={() => equip(slot, option.id)}
                          >
                            {wearing ? "Equipped" : "Equip"}
                          </Button>
                        ) : (
                          <BuyLink href={buyIxisHref} label={option.label} />
                        )
                      }
                    />
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
          </section>
        )}
      </div>
    </div>
  );
}

function BuyLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="outline" size="sm" className="w-fit">
      <a href={href} aria-label={`Buy ${label} in Apixis Wallet`}>
        Buy
      </a>
    </Button>
  );
}

function OptionCard({
  option,
  equipped,
  buyHref,
  action,
}: {
  option: CixyOption;
  equipped: boolean;
  buyHref: string;
  action: ReactNode;
}) {
  const owned = isOwned(option);
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 rounded-xl border p-4",
        equipped ? "border-gold/50 bg-gold/5" : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base text-foreground">{option.label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{option.detail}</p>
        </div>
        <Badge variant={owned ? "gold" : "outline"}>{owned ? "Owned" : "Coming soon"}</Badge>
      </div>
      {owned ? null : (
        <p className="text-xs text-muted-foreground">
          Not owned. No Ixis price until Apixis Wallet lists this look.{" "}
          <a href={buyHref} className="text-gold underline-offset-4 hover:underline">
            Need more Ixis? Buy a pack in Apixis Wallet.
          </a>
        </p>
      )}
      <div className="mt-auto">{action}</div>
    </article>
  );
}
