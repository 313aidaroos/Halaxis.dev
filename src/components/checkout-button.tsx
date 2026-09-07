"use client";

import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

export function CheckoutButton() {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout.");
      }
      window.location.assign(data.url);
    },
  });

  return (
    <div className="space-y-2">
      <Button
        variant="gold"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? "Opening Stripe…" : "Continue to Stripe Checkout"}
      </Button>
      {mutation.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Checkout failed."}
        </p>
      ) : null}
    </div>
  );
}
