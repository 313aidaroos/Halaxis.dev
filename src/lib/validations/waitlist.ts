import { z } from "zod";

export const waitlistSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  accreditedAttestation: z.literal(true, {
    errorMap: () => ({
      message:
        "You must attest that you are an accredited investor (or equivalent under applicable law) to submit interest.",
    }),
  }),
  understandNotOffer: z.literal(true, {
    errorMap: () => ({
      message: "Please confirm you understand this is not an offer of securities.",
    }),
  }),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
