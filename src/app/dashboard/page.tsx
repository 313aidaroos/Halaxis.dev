import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth-helpers";
import { VentureWorkspace } from "@/components/venture-workspace";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your agent & ventures" };
export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return <VentureWorkspace />;
}
