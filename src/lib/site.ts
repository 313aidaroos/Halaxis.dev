export const siteConfig = {
  name: "Halaxis",
  legalName: "Apixis Dev LLC",
  principal: "Awad Alaidaroos",
  domain: "halaxis.dev",
  description:
    "Halaxis is a Halal and Sharia-compliant investment platform in formation. Marketing and accredited-investor interest only — not an offer of securities.",
  url: (process.env.NEXT_PUBLIC_APP_URL || "https://halaxis.dev").replace(
    /\/$/,
    "",
  ),
  email: "hello@halaxis.dev",
  locale: "en_US",
} as const;

export const navItems = [
  { href: "/about", label: "About" },
  { href: "/compliance", label: "Sharia & Compliance" },
  { href: "/strategy", label: "Strategy" },
  { href: "/contact", label: "Interest" },
] as const;

export const legalNavItems = [
  { href: "/risk", label: "Risk disclosure" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;
