"use client";

/** "Log in with Apixis ID" (Wallet SSO): one Apixis account for every family site. Keeps the page's ?next=. */
export function SignInWithApixis({ next, className }: { next?: string; className?: string }) {
  const href = (target: string) => `/auth/apixis/start?next=${encodeURIComponent(target)}`;
  return (
    <p className={className} style={{ textAlign: "center", margin: "12px 0" }}>
      <a
        href={href(next ?? "/")}
        onClick={(event) => {
          if (next) return;
          const raw = new URLSearchParams(window.location.search).get("next");
          if (raw && raw.startsWith("/") && !raw.startsWith("//")) event.currentTarget.href = href(raw);
        }}
        style={{ fontWeight: 700, textDecoration: "underline" }}
      >
        Log in with Apixis ID
      </a>
      <br />
      <small>One Apixis ID, one Wallet and one world agent for every Ixis site.</small>
    </p>
  );
}
