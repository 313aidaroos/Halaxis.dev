import { Scale } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LegalBanner({ compact = false }: { compact?: boolean }) {
  return (
    <Alert variant="warning">
      <Scale className="h-4 w-4" />
      <AlertTitle>Important — not an offering</AlertTitle>
      <AlertDescription>
        {compact ? (
          <p>
            This website is informational only. It is not an offer of securities,
            not investment advice, and Halaxis is not publicly accepting
            investments. SEC registration and counsel review are pending.{" "}
            <span className="text-gold/90">[Counsel-review placeholder]</span>
          </p>
        ) : (
          <>
            <p>
              Materials on this site describe a platform in formation. Nothing
              here is an offer to sell, or a solicitation of an offer to buy,
              any security. Halaxis, {`Awad Alaidaroos`}, and Apixis Dev LLC
              are not currently registered as an investment adviser or broker-dealer
              with the U.S. Securities and Exchange Commission solely by virtue
              of this website, and no such registration or approval should be
              inferred.
            </p>
            <p className="mt-2">
              We are not publicly accepting investments. Payment and subscription
              flows remain disabled until counsel clears solicitation and any
              required filings. This copy is a{" "}
              <strong className="text-foreground">counsel-review placeholder</strong>{" "}
              and must be reviewed by qualified securities and Sharia counsel
              before any investor-facing use.
            </p>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
