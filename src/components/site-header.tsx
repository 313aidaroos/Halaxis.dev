"use client";

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
import { cn } from "@/lib/utils";

function Mark() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-md border border-gold/50 bg-gold/10"
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5 text-gold">
          <path
            fill="currentColor"
            d="M16 3.5 28 10v12L16 28.5 4 22V10L16 3.5Zm0 3.2L7.4 11.2v9.6L16 25.3l8.6-4.5v-9.6L16 6.7Zm0 3.6 6 3.1v6.2l-6 3.1-6-3.1v-6.2l6-3.1Z"
          />
        </svg>
      </span>
      <span className="font-serif text-lg tracking-wide text-foreground">
        {siteConfig.name}
      </span>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Mark />
          <span className="sr-only">{siteConfig.name} home</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname === item.href && "text-gold",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild variant="gold" size="sm">
            <Link href="/contact">Join interest list</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
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
                <Button asChild variant="gold" className="mt-2">
                  <Link href="/contact">Join interest list</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
