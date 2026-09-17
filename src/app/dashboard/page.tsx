import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { isAdmin, getCurrentUser } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Halaxis admin dashboard.",
};

export default async function AdminPage() {
  const [user, admin] = await Promise.all([getCurrentUser(), isAdmin()]);

  if (!user) {
    redirect("/auth/login");
  }

  if (!admin) {
    redirect("/");
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gold">Admin Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome, {user.email}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">User ID</p>
              <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
            </div>
            <div>
              <form action="/api/auth/signout" method="POST">
                <Button type="submit" variant="outline">
                  Sign Out
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              More features coming soon. No live trading or live charges.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
