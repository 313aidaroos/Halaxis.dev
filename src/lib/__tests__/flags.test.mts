import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { paymentsEnabled, plansCheckoutEnabled } from "../flags.ts";

const previous = {
  plans: process.env.HALAXIS_PLANS_CHECKOUT,
  payments: process.env.ENABLE_PAYMENTS,
};

function restore() {
  if (previous.plans === undefined) delete process.env.HALAXIS_PLANS_CHECKOUT;
  else process.env.HALAXIS_PLANS_CHECKOUT = previous.plans;
  if (previous.payments === undefined) delete process.env.ENABLE_PAYMENTS;
  else process.env.ENABLE_PAYMENTS = previous.payments;
}

test("plan checkout is off unless the flag is exactly true", () => {
  try {
    delete process.env.HALAXIS_PLANS_CHECKOUT;
    assert.equal(plansCheckoutEnabled(), false);
    for (const value of ["", "false", "TRUE", "1", "yes"]) {
      process.env.HALAXIS_PLANS_CHECKOUT = value;
      assert.equal(plansCheckoutEnabled(), false, value);
    }
    process.env.HALAXIS_PLANS_CHECKOUT = "true";
    assert.equal(plansCheckoutEnabled(), true);
  } finally {
    restore();
  }
});

test("fund payments and plan checkout are separate switches", () => {
  try {
    process.env.HALAXIS_PLANS_CHECKOUT = "true";
    process.env.ENABLE_PAYMENTS = "false";
    assert.equal(plansCheckoutEnabled(), true);
    assert.equal(paymentsEnabled(), false);

    process.env.HALAXIS_PLANS_CHECKOUT = "false";
    process.env.ENABLE_PAYMENTS = "true";
    assert.equal(plansCheckoutEnabled(), false);
    assert.equal(paymentsEnabled(), true);
  } finally {
    restore();
  }
});

test("example env keeps plan checkout and fund payments off, with blank price ids", () => {
  const example = readFileSync(new URL("../../../.env.example", import.meta.url), "utf8");
  assert.match(example, /^HALAXIS_PLANS_CHECKOUT=false$/m);
  assert.match(example, /^ENABLE_PAYMENTS=false$/m);
  assert.match(example, /^STRIPE_PRICE_HALAXIS_STOCK_CHECKER_ACTIVATION=$/m);
  assert.match(example, /^STRIPE_PRICE_HALAXIS_STOCK_CHECKER_MONTHLY=$/m);
  assert.doesNotMatch(example, /STRIPE_PRICE_ONBOARDING=/);
});

test("vercel cron calls the agent tick route", () => {
  const vercel = JSON.parse(readFileSync(new URL("../../../vercel.json", import.meta.url), "utf8")) as {
    crons?: { path: string; schedule: string }[];
  };
  assert.ok(vercel.crons?.some((cron) => cron.path === "/api/agents/tick" && cron.schedule.length > 0));
});
