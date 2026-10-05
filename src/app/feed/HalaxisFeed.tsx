"use client";
import { useMemo } from "react";
import { createFeedClient } from "@/feed-client/api";
import { FeedView, type FeedSkin } from "@/feed-client/FeedView";
import { buttonVariants } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";

// Halaxis skin: only Halaxis's own ui primitives (Button/Badge/Card/Input class strings). Layout in ./feed.css.
// siteName "Halaxis" hides the Cixy auto-post toggle (Halaxis has no Cixy posting).
const input =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const skin: FeedSkin = {
  tabs: "hx-feed-tabs",
  tab: buttonVariants({ variant: "ghost", size: "sm" }),
  tabActive: "hx-feed-tab-on",
  card: "rounded-xl border border-border bg-card text-card-foreground shadow-sm p-5",
  cardHead: "",
  title: "font-serif text-xl text-foreground",
  button: buttonVariants({ variant: "gold", size: "sm" }),
  buttonSecondary: buttonVariants({ variant: "outline", size: "sm" }),
  buttonSmall: "",
  chip: badgeVariants({ variant: "default" }),
  aiChip: badgeVariants({ variant: "gold" }),
  input,
  label: "text-sm text-muted-foreground",
  muted: "text-muted-foreground",
  alert: "rounded-md border border-destructive/50 px-3 py-2 text-sm text-destructive",
  notice: "rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-foreground",
  empty: "text-muted-foreground text-sm",
  listRow: "border-b border-border py-3",
  signInUrl: "/auth/apixis/start?next=%2Ffeed",
  buyIxisUrl: "https://apixis-wallet.vercel.app/buy?product=halaxis",
};

export function HalaxisFeed() {
  const client = useMemo(() => createFeedClient({ client: "halaxis", sessionUrl: "/api/feed-session" }), []);
  return <FeedView client={client} skin={skin} siteName="Halaxis" />;
}
