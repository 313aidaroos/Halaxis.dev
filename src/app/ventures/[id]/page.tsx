import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { VentureWorkspace } from "@/components/venture-workspace";
export const dynamic = "force-dynamic";
export default async function VenturePage({
  params,
}: {
  params: { id: string };
}) {
  if (!(await getCurrentUser())) redirect("/auth/login");
  return <VentureWorkspace ventureId={params.id} />;
}
