"use client";

import { Brand } from "@/components/brand";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems, siteConfig } from "@/lib/site";
import { apixisWalletBuyUrl } from "@/lib/wallet";
import { cn } from "@/lib/utils";
import { ApixisWalletChip, HALAXIS_WORLD_ENTER_URL, useApixisWallet } from "@/components/ApixisWalletChip";

export function SiteHeader() {
  const pathname = usePathname();
  const buyIxisHref = apixisWalletBuyUrl();
  const wallet = useApixisWallet();
  // Sign-in is "Log in with Apixis ID" (Wallet SSO); the email link stays at /auth/login as a fallback.
  const apixisLogin = `/auth/apixis/start?next=${encodeURIComponent(pathname || "/")}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Brand />
          <span className="sr-only">{siteConfig.name} home</span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname === item.href && "text-gold",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-3">
          <ApixisWalletChip className="text-sm text-muted-foreground" />
          <a href={buyIxisHref} className="text-sm text-foreground px-3 py-2">
            Buy Ixis
          </a>
          {!wallet.signedIn && (
            <Button asChild variant="gold" size="sm">
              <a href={apixisLogin}>Get started</a>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ApixisWalletChip className="text-xs text-muted-foreground" hideSignedOut hideWorld />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="xl:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{siteConfig.name}</SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-4" aria-label="Mobile">
              {navItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "text-base text-muted-foreground",
                      pathname === item.href && "text-gold",
                    )}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a href={buyIxisHref} className="text-base text-muted-foreground">
                  Buy Ixis
                </a>
              </SheetClose>
              {wallet.signedIn && wallet.worldAgent && (
                <SheetClose asChild>
                  <a href={HALAXIS_WORLD_ENTER_URL} className="text-base text-muted-foreground">
                    Your agent is in the Apixis world ↗
                  </a>
                </SheetClose>
              )}
              {!wallet.signedIn && (
                <SheetClose asChild>
                  <Button asChild variant="gold" className="mt-2">
                    <a href={apixisLogin}>Log in with Apixis ID</a>
                  </Button>
                </SheetClose>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
