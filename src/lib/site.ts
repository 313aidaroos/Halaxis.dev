export const siteConfig = {
  name: "Halaxis",
  legalName: "Apixis Dev LLC",
  principal: "Awad Alaidaroos",
  domain: "halaxis.dev",
  description:
    "Halaxis is a Halal- and Sharia-aligned investment platform in formation. Formal scholar review is pending. Marketing and accredited-investor interest only — not an offer of securities.",
  url: (process.env.NEXT_PUBLIC_APP_URL || "https://halaxis.dev").replace(
    /\/$/,
    "",
  ),
  email: "hello@halaxis.dev",
  locale: "en_US",
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/strategy", label: "Vision" },
  { href: "/dashboard", label: "Ventures" },
  { href: "/screen", label: "Screen" },
  { href: "/compliance", label: "Principles" },
  { href: "/about", label: "About" },
  { href: "/cixy", label: "Cixy" },
] as const;

export const legalNavItems = [
  { href: "/risk", label: "Risk disclosure" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;
