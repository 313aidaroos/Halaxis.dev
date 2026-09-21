"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send magic link.");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="eyebrow mb-3">WELCOME TO HALAXIS</p>
          <CardTitle className="font-serif text-3xl">
            Your next chapter starts here.
          </CardTitle>
          <p className="text-sm text-muted-foreground pt-3">
            Sign in or create an account with a secure email link.
          </p>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Check your email for a login link. Use the most recent link to
                  continue.
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Send another link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send magic link"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                We&apos;ll send you a secure login link via email.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
