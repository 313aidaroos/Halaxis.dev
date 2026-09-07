import { Badge } from "@/components/ui/badge";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-border bg-card/30">
      <div className="container max-w-3xl py-14 md:py-20">
        {eyebrow ? (
          <Badge variant="gold" className="mb-4">
            {eyebrow}
          </Badge>
        ) : null}
        <h1 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
