import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { sendInterestNotification } from "@/lib/email";
import type { WaitlistInput } from "@/lib/validations/waitlist";

export type WaitlistChannel = "supabase" | "resend" | "dev-log";

export async function persistWaitlist(
  payload: WaitlistInput,
): Promise<{ channel: WaitlistChannel }> {
  const admin = createAdminSupabaseClient();

  if (admin) {
    const { error } = await admin.from("accredited_interest").insert({
      full_name: payload.fullName,
      email: payload.email.toLowerCase(),
      organization: payload.organization || null,
      message: payload.message || null,
      accredited_attestation: true,
      understand_not_offer: true,
    });

    if (error) {
      if (error.code === "23505") {
        throw new Error("That email is already on the interest list.");
      }
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    return { channel: "supabase" };
  }

  if (await sendInterestNotification(payload)) {
    return { channel: "resend" };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[halaxis:waitlist:dev]", {
      nameLength: payload.fullName.length,
      emailDomain: payload.email.split("@")[1] ?? "unknown",
      attested: true,
    });
    return { channel: "dev-log" };
  }

  throw new Error(
    "No waitlist backend is configured. Set Supabase service role or RESEND_API_KEY.",
  );
}
