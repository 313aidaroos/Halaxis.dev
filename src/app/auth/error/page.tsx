import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const message = searchParams.message || "Authentication failed.";

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <a href="/auth/login" className="text-sm text-gold hover:underline">
              Try again
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
