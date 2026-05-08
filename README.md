# Frontline — AI-Powered Review Management

Turn every customer review into a reputation win. Frontline uses Claude AI to craft perfect, on-brand responses in seconds.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (Postgres + Auth)
- **AI**: Claude API (`claude-sonnet-4-6`)
- **Payments**: Stripe
- **Deployment**: Vercel

## Features

- Landing page with hero, features, pricing, CTA
- Auth (sign up / login / logout) via Supabase
- Business onboarding (name, industry, location, tone profile)
- Dashboard with reputation score, stats, and recent reviews
- AI review responder — paste review → select tone → Claude generates response
- Stripe subscription management (Starter $49/mo, Pro $129/mo)
- Stripe webhook handling for subscription lifecycle events

## Getting Started

### 1. Clone and install

```bash
git clone <repo>
cd frontline
npm install
```

### 2. Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `ANTHROPIC_API_KEY` | Claude API key from console.anthropic.com |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret |
| `STRIPE_STARTER_PRICE_ID` | Stripe Price ID for Starter plan |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for Pro plan |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g. `http://localhost:3000`) |

### 3. Supabase setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration in the Supabase SQL editor:

```bash
# Contents of supabase/migrations/001_initial_schema.sql
```

3. Enable **Email** auth in Authentication → Providers

### 4. Stripe setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create two recurring products:
   - **Starter**: $49/month
   - **Pro**: $129/month
3. Copy the Price IDs into `.env.local`
4. Set up a webhook endpoint pointing to `https://your-domain.com/api/webhook` with these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── pricing/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── onboarding/page.tsx   # Business setup (post-signup)
│   ├── dashboard/
│   │   ├── page.tsx          # Overview + stats
│   │   ├── reviews/page.tsx  # AI review responder
│   │   ├── settings/page.tsx # Business settings
│   │   └── billing/page.tsx  # Stripe subscription
│   └── api/
│       ├── generate-response/ # Claude API call
│       ├── stripe/            # Checkout session
│       ├── stripe/portal/     # Billing portal
│       └── webhook/           # Stripe webhooks
├── components/
│   ├── landing/  (navbar, hero, features, pricing, cta, footer)
│   ├── dashboard/ (sidebar, mobile-nav, stat-card, review-card, review-generator)
│   ├── auth/     (login-form, signup-form)
│   └── ui/       (button, input, select, textarea, card, badge)
├── lib/
│   ├── supabase/ (client.ts, server.ts)
│   ├── stripe.ts
│   └── utils.ts
└── types/
    └── database.ts
```

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local.example`
4. Deploy

Update `NEXT_PUBLIC_APP_URL` to your production URL, and update your Stripe webhook endpoint to the production URL.
