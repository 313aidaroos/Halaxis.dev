import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Globe2,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  Moon,
  Sprout,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Faq } from "@/components/faq";

const pathways = [
  {
    title: "Explore the vision",
    description:
      "Discover a more purposeful approach to capital and opportunity.",
    href: "/strategy",
    image: "city",
    icon: Building2,
    label: "THE VISION",
  },
  {
    title: "Screen with confidence",
    description:
      "Explore our Shariah screening tool and understand the methodology.",
    href: "/screen",
    image: "arch",
    icon: ShieldCheck,
    label: "THE TOOLS",
  },
  {
    title: "Connect with Halaxis",
    description: "Express your interest and be part of the conversation.",
    href: "/contact",
    image: "community",
    icon: Users,
    label: "THE PEOPLE",
  },
  {
    title: "Learn & grow",
    description: "Understand our principles, approach, and commitments.",
    href: "/compliance",
    image: "library",
    icon: BookOpen,
    label: "THE KNOWLEDGE",
  },
];
const principles = [
  {
    icon: ShieldCheck,
    title: "Faith-led",
    text: "Principles at our foundation",
  },
  { icon: Compass, title: "Purposeful", text: "A considered approach" },
  { icon: Globe2, title: "Connected", text: "A shared global outlook" },
  { icon: Heart, title: "Transparent", text: "Clarity at every step" },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <Image
          src="/images/halaxis-arch.png"
          alt="Ornate Islamic arch overlooking a sunlit city of domes and minarets"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <div className="hero-copy">
            <p className="eyebrow rose">PEOPLE. CAPITAL. IDEAS. IMPACT.</p>
            <h1>
              Build Together.
              <br />
              <em>
                A Brighter
                <br className="desktop-break" /> Tomorrow.
              </em>
            </h1>
            <p className="hero-description">
              A shared vision. A principled foundation. Halaxis is building a
              space for faith-aligned capital, meaningful connections, and a
              more purposeful future.
            </p>
            <div className="hero-actions">
              <Link className="gold-button" href="/dashboard">
                Explore the platform <ArrowRight size={18} />
              </Link>
              <Link className="outline-button" href="/about">
                Our story <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-values">
              <span>
                <Sparkles /> Purposeful
                <br />
                innovation
              </span>
              <span>
                <Globe2 /> Global
                <br />
                perspective
              </span>
              <span>
                <Sprout /> Ethical
                <br />
                growth
              </span>
            </div>
          </div>
          <div className="hero-quote">
            <p lang="ar" dir="rtl">
              وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
            </p>
            <blockquote>
              “And cooperate in righteousness
              <br />
              and piety.”
            </blockquote>
            <span>QUR’AN 5:2</span>
          </div>
          <div className="hero-side" aria-hidden="true">
            FAITH
            <br />
            PURPOSE
            <br />
            CONNECTION<span>✦</span>A BRIGHTER
            <br />
            TOMORROW
          </div>
        </div>
      </section>
      <section className="principles-wrap" aria-label="Our principles">
        <div className="container">
          <div className="principles ornate-panel">
            {principles.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon />
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="pathways cream-section" id="explore">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR NEXT CHAPTER</p>
              <h2>Find your way forward.</h2>
            </div>
            <p>
              Big ideas begin with a first step.
              <br />
              Make yours a meaningful one.
            </p>
          </div>
          <div className="pathway-grid">
            {pathways.map(
              ({ title, description, href, image, icon: Icon, label }) => (
                <Link href={href} className="pathway-card" key={href}>
                  <div className="pathway-image">
                    <Image
                      src={
                        image === "arch"
                          ? "/images/halaxis-arch.png"
                          : `/images/${image}.jpg`
                      }
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw"
                    />
                    <span>{label}</span>
                  </div>
                  <div className="pathway-body">
                    <Icon className="pathway-icon" />
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <span className="round-arrow">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
      <section className="movement geometric-grid">
        <div className="container movement-grid">
          <div className="movement-emblem" aria-hidden="true">
            <Brand large />
            <span>
              ROOTED IN FAITH.
              <br />
              OPEN TO POSSIBILITY.
            </span>
          </div>
          <div className="movement-copy">
            <p className="eyebrow rose">A SHARED SENSE OF PURPOSE</p>
            <h2>
              More than a platform.
              <br />
              <em>A principled beginning.</em>
            </h2>
            <p>
              We believe progress begins with trust. Halaxis brings a
              faith-aligned perspective to capital, connecting thoughtful people
              with the tools and knowledge to move forward.
            </p>
            <p>
              Our investment platform is in formation. Explore the screening
              tool today, learn about our approach, and help shape what comes
              next.
            </p>
            <div className="movement-values">
              <span>
                <Moon />
                Faith-aligned
              </span>
              <span>
                <Users />
                People-centered
              </span>
              <span>
                <Sparkles />
                Technology-enabled
              </span>
            </div>
          </div>
          <aside className="vision-note ornate-panel">
            <span className="quote-mark">“</span>
            <p>
              A stronger community.
              <br />A brighter world.
              <br />
              <em>Built together.</em>
            </p>
            <span className="ornament">— ✦ —</span>
            <Link href="/about">
              Discover our vision <ArrowRight size={15} />
            </Link>
          </aside>
        </div>
      </section>
      <section className="cta-section">
        <div className="container">
          <div className="cta-panel ornate-panel">
            <div>
              <p className="eyebrow">THE FUTURE STARTS WITH A CONVERSATION</p>
              <h2>Ready to take the next step?</h2>
              <p>Explore the tools. Understand the vision. Stay connected.</p>
            </div>
            <div className="hero-actions">
              <Link href="/auth/login" className="outline-button">
                Sign in
              </Link>
              <Link href="/contact" className="gold-button">
                Express interest <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="cream-section audience">
        <div className="container">
          <p className="eyebrow">BUILT WITH A SHARED FUTURE IN MIND</p>
          <div>
            {[
              { icon: Building2, text: "Entrepreneurs" },
              { icon: Compass, text: "Investors" },
              { icon: Users, text: "Communities" },
              { icon: BookOpen, text: "Learners" },
              { icon: Heart, text: "Changemakers" },
            ].map(({ icon: Icon, text }) => (
              <span key={text}>
                <Icon />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="home-faq">
        <div className="container faq-grid">
          <div>
            <p className="eyebrow">CLARITY COMES FIRST</p>
            <h2>
              A few things
              <br />
              <em>worth knowing.</em>
            </h2>
            <p>Where we are today, and what comes next.</p>
            <Link href="/compliance" className="text-link">
              Our principles & commitments <ArrowRight size={16} />
            </Link>
          </div>
          <Faq />
        </div>
      </section>
    </>
  );
}
