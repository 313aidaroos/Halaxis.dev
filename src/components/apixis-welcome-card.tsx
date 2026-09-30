"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { enterApixisUrl } from "@/lib/apixis-world";
import { dismissWelcomeCard } from "@/app/actions/world-agent";
import { ExternalLink, X } from "lucide-react";

type ApixisWelcomeCardProps = {
  agentName: string | null;
  status: "ready" | "invite";
};

export function ApixisWelcomeCard({ agentName, status }: ApixisWelcomeCardProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = async () => {
    setDismissed(true);
    await dismissWelcomeCard();
  };

  const enterUrl = enterApixisUrl("halaxis");
  const title = status === "ready" ? "Your Agent is Ready" : "Enter the Apixis World";
  const description =
    status === "ready"
      ? `Welcome, ${agentName || "investor"}! Your personal agent is ready in the Apixis Virtual World.`
      : "Create your avatar and join the Apixis ecosystem.";

  return (
    <Card className="relative border-primary/20 bg-card">
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      <CardHeader>
        <CardTitle className="font-serif">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The Apixis Virtual World is a shared space for all Apixis family products. Your avatar, wallet, and progress
          carry across Halaxis, Renoxis, Socixis, and more.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="font-serif">
          <a href={enterUrl} target="_blank" rel="noopener noreferrer">
            Enter the World <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" onClick={handleDismiss} className="font-serif">
          Not now
        </Button>
      </CardFooter>
    </Card>
  );
}
