import { Resend } from "resend";

import { isResendConfigured } from "@/lib/flags";
import { siteConfig } from "@/lib/site";
import type { WaitlistInput } from "@/lib/validations/waitlist";

export async function sendInterestNotification(payload: WaitlistInput) {
  if (!isResendConfigured()) return false;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || `Halaxis <hello@${siteConfig.domain}>`;
  const to = process.env.EMAIL_TO || from;

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Halaxis accredited interest — ${payload.fullName}`,
    text: [
      "New accredited-investor interest (not a subscription).",
      "",
      `Name: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `Organization: ${payload.organization || "—"}`,
      `Accredited attestation: yes`,
      `Understood not an offer: yes`,
      "",
      payload.message || "(no message)",
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
