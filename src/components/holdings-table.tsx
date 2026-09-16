"use client";

import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";

type Holding = {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  verdict: "pass" | "fail" | "review";
  business_status: string;
  financial_status: string;
  fail_reasons: string[] | null;
  notes: string | null;
};

function VerdictBadge({ verdict }: { verdict: Holding["verdict"] }) {
  if (verdict === "pass") return <Badge>Pass</Badge>;
  if (verdict === "fail") {
    return (
      <Badge className="border-destructive/40 bg-destructive/15 text-destructive">
        Fail
      </Badge>
    );
  }
  return <Badge variant="gold">Review</Badge>;
}

export function HoldingsTable() {
  const query = useQuery({
    queryKey: ["holdings"],
    queryFn: async () => {
      const response = await fetch("/api/holdings");
      const data = (await response.json()) as {
        ok?: boolean;
        source?: string;
        holdings?: Holding[];
        error?: string;
      };
      if (!response.ok || !data.holdings) {
        throw new Error(data.error ?? "Unable to load universe.");
      }
      return data;
    },
  });

  if (query.isPending) {
    return <p className="text-sm text-muted-foreground">Loading universe…</p>;
  }
  if (query.isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {query.error instanceof Error ? query.error.message : "Load failed."}
      </p>
    );
  }

  const rows = query.data.holdings ?? [];

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Source: {query.data.source === "supabase" ? "database" : "local seed"} ·{" "}
        {rows.length} names
      </p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-card/80 text-xs uppercase tracking-[0.12em] text-gold">
            <tr>
              <th className="px-4 py-3 font-medium">Ticker</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.ticker} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{row.ticker}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.industry}</td>
                <td className="px-4 py-3">
                  <VerdictBadge verdict={row.verdict} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
