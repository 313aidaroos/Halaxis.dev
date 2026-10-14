import assert from "node:assert/strict";
import test from "node:test";

import {
  FREE_CHECKS,
  IXIS_PER_USD,
  PLAN_TIERS,
  checkoutTier,
  ixisForUsd,
  pricingCopy,
  readPlanPriceId,
} from "../pricing.ts";

test("locked stock-checker prices are $50 and 5,000 Ixis", () => {
  assert.equal(IXIS_PER_USD, 100);
  assert.equal(ixisForUsd(50), 5000);
  for (const tier of Object.values(PLAN_TIERS)) {
    assert.equal(tier.product, "halaxis");
    assert.equal(tier.usd, 50);
    assert.equal(tier.usdCents, 5000);
    assert.equal(tier.ixis, 5000);
  }
  assert.equal(PLAN_TIERS.stock_checker_activation.kind, "one_time");
  assert.equal(PLAN_TIERS.stock_checker_monthly.kind, "subscription");
});

test("free checks stay marked TBD", () => {
  assert.equal(FREE_CHECKS.status, "tbd");
  assert.match(FREE_CHECKS.line, /3 free checks \(assumed\) — TBD/);
  assert.match(pricingCopy.freeChecks, /TBD/);
  assert.match(pricingCopy.stockChecker, /\$50 one-time/);
  assert.match(pricingCopy.stockChecker, /\$50\/month/);
  assert.match(pricingCopy.stockChecker, /100 Ixis = \$1/);
});

test("fund has no checkout tier and banks are contact sales", () => {
  assert.equal(checkoutTier("fund"), null);
  assert.equal(checkoutTier("investment_fund"), null);
  assert.equal(checkoutTier("not-a-plan"), null);
  assert.equal(checkoutTier("stock_checker_activation")?.id, "stock_checker_activation");
  assert.match(pricingCopy.fund, /no price/i);
  assert.match(pricingCopy.fund, /ENABLE_PAYMENTS/);
  assert.match(pricingCopy.advisors, /contact sales/i);
  assert.doesNotMatch(pricingCopy.stockChecker, /certified halal|shariah-certified|we are certified/i);
  assert.match(pricingCopy.notCertification, /not a Halal or Sharia certification/);
});

test("stripe price ids are read from the blank plan env vars", () => {
  const activation = PLAN_TIERS.stock_checker_activation;
  const monthly = PLAN_TIERS.stock_checker_monthly;
  assert.equal(activation.stripePriceEnv, "STRIPE_PRICE_HALAXIS_STOCK_CHECKER_ACTIVATION");
  assert.equal(monthly.stripePriceEnv, "STRIPE_PRICE_HALAXIS_STOCK_CHECKER_MONTHLY");
  assert.equal(readPlanPriceId(activation, {}), undefined);
  assert.equal(readPlanPriceId(activation, { [activation.stripePriceEnv]: "  " }), undefined);
  assert.equal(
    readPlanPriceId(monthly, { [monthly.stripePriceEnv]: "price_test_monthly" }),
    "price_test_monthly",
  );
});
