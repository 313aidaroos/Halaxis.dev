# Halaxis visual redesign

## Scope

Gold, wine red, warm ivory, geometric ornament, and architectural photography inspired by the supplied reference. Responsive homepage and shared navigation/footer/theme; new `/resources` directory links to implemented tools and educational pages. Existing investment-platform scope, disclosures, API contracts, and payment gate are retained. No invented membership or investment statistics, dummy videos, untranslated language menu, or false subscription confirmation.

## Route and integration map

- Home and four discovery cards → `/strategy`, `/screen`, `/contact`, `/resources`.
- Sign in and Get started → `/auth/login`; passwordless sign-in also creates accounts through existing `/api/auth/signup`.
- Fixed signup redirect to the implemented `/api/auth/callback` route. Add `https://<your-domain>/api/auth/callback` to the Supabase redirect allowlist and set `NEXT_PUBLIC_APP_URL` to that origin. Use the local origin for local tests.
- Screening → existing `/api/screen`; holdings → `/api/holdings`.
- Express interest / Stay connected → existing validated `/contact` form and `/api/waitlist`. These are interest requests, not a newsletter signup.
- Chat → existing `/api/chat`; configure the existing AI provider variables.
- Authentication requires the existing Supabase public environment variables. Waitlist persistence requires Supabase server credentials or Resend. Production correctly returns unavailable when storage is not configured.
- Stripe remains gated by `ENABLE_PAYMENTS`; the redesign does not enable payments or create paid products.
- Resources is included in the sitemap. Legal, strategy, screening, checkout-result, and dashboard routes remain available.

## Assets

`public/images/halaxis-arch.png` generated with the built-in image generation tool. Prompt: “Create a photorealistic cinematic website hero background, landscape 1536x1024. Islamic architecture, an exquisitely carved dark sandstone pointed arch with delicate gold geometric details frames a luminous cream and gold sunset view of a beautiful mosque city with domes and slender minarets, palms in foreground, hanging antique brass lantern. Arch occupies right 65% of frame, left 35% deeply shadowed wine red and near-black architectural wall to allow HTML heading overlay. Sophisticated warm gold and burgundy palette, premium editorial photography, rich natural material detail, atmospheric sunlight. No text, no lettering, no logo, no UI, no borders. Asset for Halaxis website inspired by ornate Islamic architecture.”

Supporting images are stored locally; no third-party runtime image dependency:
- City: https://images.unsplash.com/photo-1512453979798-5ea266f8880c
- Community architecture: https://images.unsplash.com/photo-1519817650390-64a93db51149
- Library: https://images.unsplash.com/photo-1507842217343-583bb7270b66

The reference is visual direction, not evidence of live product capabilities. Architectural hero is illustrative. Brand monogram is rendered in HTML/CSS.

## Run

`npm ci`, `npm run build`, `npm run start -- --port 3017`.

No secrets are included. See `.env.example` and the existing README for deployment wiring. The domain halaxis.dev failed DNS resolution during this session.

## Verification

Production build and ESLint pass. HTTP checks pass for every homepage destination, resources, sitemap, holdings, invalid auth/waitlist/screen input, and an AAPL screening response. Local auth returns the expected 503 without credentials. Browser visual verification was interrupted by local browser permissions and was not completed. The actual live target is https://halaxis.vercel.app, verified against the repository’s homepage setting and fetched live HTML. No full-screen or audio permission is required.
