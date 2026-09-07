import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[50vh] flex-col items-start justify-center gap-4 py-20">
      <p className="text-xs uppercase tracking-[0.18em] text-gold">404</p>
      <h1 className="font-serif text-4xl">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        That path is not part of the Halaxis marketing site.
      </p>
      <Button asChild variant="gold">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
