import { z } from "zod";

export const tickerSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .refine((value) => /^[A-Z][A-Z0-9.]{0,9}$/.test(value), {
    message: "Enter a ticker like AAPL or BRK.B.",
  });

export const screenBodySchema = z.object({
  ticker: tickerSchema,
});
