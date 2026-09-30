import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth-helpers";
import { VentureWorkspace } from "@/components/venture-workspace";
import { getWorldAgentStatus } from "@/app/actions/world-agent";
import { ApixisWelcomeCard } from "@/components/apixis-welcome-card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your agent & ventures" };

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const worldAgent = await getWorldAgentStatus();

  return (
    <div className="space-y-6">
      {worldAgent.showWelcome && (
        <ApixisWelcomeCard agentName={worldAgent.agentName} status={worldAgent.status} />
      )}
      <VentureWorkspace />
    </div>
  );
}
