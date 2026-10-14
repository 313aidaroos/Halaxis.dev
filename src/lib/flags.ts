/**
 * Investment-fund kill switch. Only the string "true" would allow fund money.
 * It stays false until counsel clears solicitation. It does not turn on
 * stock-checker plan checkout.
 */
export function paymentsEnabled(): boolean {
  return process.env.ENABLE_PAYMENTS === "true";
}

/**
 * Non-fund plan checkout (stock checker: card or Ixis). Off unless the
 * string is exactly "true". Does not enable fund payments.
 */
export function plansCheckoutEnabled(): boolean {
  return process.env.HALAXIS_PLANS_CHECKOUT === "true";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isAiConfigured(): boolean {
  const provider = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
  if (provider === "openai") return Boolean(process.env.OPENAI_API_KEY);
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
