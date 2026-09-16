"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ScreenResult } from "@/lib/shariah/standard";
import { tickerSchema } from "@/lib/validations/screen";

function VerdictMark({ verdict }: { verdict: ScreenResult["verdict"] }) {
  const label =
    verdict === "pass" ? "Pass" : verdict === "fail" ? "Fail" : "Review";
  const className =
    verdict === "pass"
      ? "border-primary/40 bg-primary/15 text-primary"
      : verdict === "fail"
        ? "border-destructive/40 bg-destructive/15 text-destructive"
        : "border-gold/40 bg-gold/10 text-gold";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function pct(n: number | null) {
  if (n == null) return "—";
  return `${(n * 100).toFixed(1)}%`;
}

export function ScreenForm() {
  const [ticker, setTicker] = useState("AAPL");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (raw: string) => {
      const parsed = tickerSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Invalid ticker.");
      }
      const response = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: parsed.data }),
      });
      const data = (await response.json()) as {
        error?: string;
        result?: ScreenResult;
        stored?: boolean;
      };
      if (!response.ok || !data.result) {
        throw new Error(data.error ?? "Screen failed.");
      }
      return data;
    },
    onError: (error) => {
      setFieldError(error instanceof Error ? error.message : "Screen failed.");
    },
    onSuccess: () => setFieldError(null),
  });

  const result = mutation.data?.result;

  return (
    <div className="space-y-6">
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(ticker);
        }}
        noValidate
      >
        <div className="flex-1 space-y-2">
          <Label htmlFor="ticker">Ticker</Label>
          <Input
            id="ticker"
            name="ticker"
            value={ticker}
            autoCapitalize="characters"
            placeholder="AAPL"
            onChange={(event) => setTicker(event.target.value)}
          />
        </div>
        <Button type="submit" variant="gold" disabled={mutation.isPending}>
          {mutation.isPending ? "Screening…" : "Run Halaxis v1 screen"}
        </Button>
      </form>
      {fieldError ? (
        <p className="text-sm text-destructive" role="alert">
          {fieldError}
        </p>
      ) : null}
      {result ? (
        <div className="space-y-4 rounded-xl border border-border bg-card/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-serif text-2xl text-foreground">
                {result.ticker}
                {result.name ? (
                  <span className="ml-2 text-lg text-muted-foreground">
                    {result.name}
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {result.sector ?? "Unknown sector"} · {result.industry ?? "Unknown industry"} ·{" "}
                {result.source}
              </p>
            </div>
            <VerdictMark verdict={result.verdict} />
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-gold">
                Debt / mkt cap
              </dt>
              <dd>{pct(result.ratios.debtToMarketCap)} cap 33%</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-gold">
                Cash+int. / mkt cap
              </dt>
              <dd>{pct(result.ratios.cashPlusInterestToMarketCap)} cap 33%</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-gold">
                Receivables / mkt cap
              </dt>
              <dd>{pct(result.ratios.receivablesToMarketCap)} cap 33%</dd>
            </div>
          </dl>
          {result.failReasons.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-destructive">
              {result.failReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          ) : null}
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          {mutation.data?.stored ? (
            <p className="text-xs text-primary">Result stored in the Halaxis screen ledger.</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Result computed. Ledger write skipped (database not configured on this host).
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
