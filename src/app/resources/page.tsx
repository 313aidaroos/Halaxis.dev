import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Compass,
  HelpCircle,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
export const metadata: Metadata = {
  title: "Resources",
  description:
    "Explore Halaxis screening tools, principles, and educational resources.",
};
const resources = [
  {
    href: "/screen",
    icon: ShieldCheck,
    title: "Shariah screening",
    text: "Evaluate a ticker with the Halaxis v1 screening tool and explore its illustrative holdings universe.",
  },
  {
    href: "/compliance",
    icon: BookOpen,
    title: "Principles & methodology",
    text: "Understand our screening approach, review status, and commitments to transparency.",
  },
  {
    href: "/strategy",
    icon: Compass,
    title: "Our investment approach",
    text: "Read about the intended mandate and the process behind the platform.",
  },
  {
    href: "/risk",
    icon: HelpCircle,
    title: "Understand the risks",
    text: "Read the risk disclosures before expressing interest. Screening does not establish suitability.",
  },
];
export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="LEARN & GROW"
        title="Knowledge for a purposeful future."
        description="Start with the fundamentals. Explore our tools, understand our principles, and make informed decisions."
      />
      <div className="container grid gap-6 py-16 md:grid-cols-2">
        {resources.map(({ href, icon: Icon, title, text }) => (
          <Link href={href} key={href} className="resource-card">
            <Icon className="text-gold" />
            <h2 className="font-serif text-2xl mt-5">{title}</h2>
            <p className="text-muted-foreground mt-3 mb-6">{text}</p>
            <span className="text-link">
              Explore resource <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
