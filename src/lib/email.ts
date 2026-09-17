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

export interface SupportIntakePayload {
  email: string;
  subject: string;
  message: string;
}

/**
 * Send support intake to halaxis@apixis.dev, forwarded to awad@apixis.dev.
 * Not investment advice; just support.
 */
export async function sendSupportIntake(payload: SupportIntakePayload) {
  if (!isResendConfigured()) return false;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || `Halaxis <hello@${siteConfig.domain}>`;

  const { error } = await resend.emails.send({
    from,
    to: "halaxis@apixis.dev",
    replyTo: payload.email,
    subject: `Support: ${payload.subject}`,
    text: [
      `From: ${payload.email}`,
      `Subject: ${payload.subject}`,
      "",
      payload.message,
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
