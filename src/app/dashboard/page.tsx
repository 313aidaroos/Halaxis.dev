import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth-helpers";
import { ensureHalaxisWorldAgent } from "@/lib/apixis-world-agent";
import { VentureWorkspace } from "@/components/venture-workspace";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your agent & ventures" };
export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  // Retry point if provisioning did not finish at sign-in (no-op once apixis_world_agent_at is set).
  await ensureHalaxisWorldAgent(user);
  return <VentureWorkspace />;
}
