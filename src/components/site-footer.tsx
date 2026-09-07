import Link from "next/link";

import { legalNavItems, navItems, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-serif text-xl text-foreground">{siteConfig.name}</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            A Halal and Sharia-compliant investment platform in formation.
            Operated in connection with {siteConfig.principal} and{" "}
            {siteConfig.legalName}.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-gold">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="text-muted-foreground hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-gold">
            Legal
          </p>
          <ul className="space-y-2 text-sm">
            {legalNavItems.map((item) => (
              <li key={item.href}>
                <Link className="text-muted-foreground hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container flex flex-col gap-2 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. {siteConfig.domain}.
          </p>
          <p>Not an offer of securities. Not investment advice. Counsel-review draft.</p>
        </div>
      </div>
    </footer>
  );
}
