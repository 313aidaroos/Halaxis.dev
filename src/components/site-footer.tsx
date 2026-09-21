import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { legalNavItems, navItems, siteConfig } from "@/lib/site";
export function SiteFooter() {
  return (
    <footer className="site-footer geometric-grid">
      <div className="container footer-grid">
        <div>
          <Link href="/" aria-label="Halaxis home">
            <Brand />
          </Link>
          <p className="footer-description">
            Faith at our foundation.
            <br />
            Purpose in every possibility.
          </p>
          <p className="footer-status">
            <span /> PLATFORM IN FORMATION
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Information</h2>
          <ul>
            {legalNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/contact">Contact & interest</Link>
            </li>
            <li>
              <Link href="/auth/login">Sign in / Create account</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Let’s build what comes next.</h2>
          <p className="footer-description">
            Learn more about Halaxis and express your interest in the platform.
          </p>
          <Link href="/contact" className="gold-button">
            Stay connected <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.legalName}. All rights
          reserved.
        </p>
        <p>A STRONGER COMMUNITY · A BRIGHTER WORLD</p>
      </div>
      <div className="container footer-legal">
        Investment platform in formation. Not accepting investments. Not an
        offer of securities or investment advice. Formal scholar review is
        pending.
      </div>
    </footer>
  );
}
