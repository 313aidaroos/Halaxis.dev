/**
 * Hand-written subset until `supabase gen types` is run against a live project.
 * Do not treat this as generated output.
 */
export type AccreditedInterestRow = {
  id: string;
  full_name: string;
  email: string;
  organization: string | null;
  message: string | null;
  accredited_attestation: boolean;
  understand_not_offer: boolean;
  created_at: string;
};
