# Frontline — AI-Powered Review Management

Turn every customer review into a reputation win. Frontline uses Claude AI to craft perfect, on-brand responses in seconds.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres
- **Auth**: NextAuth.js v4 (credentials / JWT)
- **AI**: Claude API (`claude-sonnet-4-6`)
- **Payments**: Stripe
- **Deployment**: Vercel

## Features

- Landing page with hero, features, pricing, CTA
- Auth (sign up / login / logout) via NextAuth + bcrypt
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
| `POSTGRES_URL` | Vercel Postgres connection string |
| `POSTGRES_URL_NON_POOLING` | Direct (non-pooled) Postgres URL |
| `NEXTAUTH_SECRET` | Random secret ≥ 32 chars (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `ANTHROPIC_API_KEY` | Claude API key from console.anthropic.com |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret |
| `STRIPE_STARTER_PRICE_ID` | Stripe Price ID for Starter plan |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for Pro plan |
| `NEXT_PUBLIC_APP_URL` | Your app URL |

### 3. Database setup

Run the migration SQL in your Vercel Postgres console (or any Postgres client):

```bash
# File: db/migrations/001_initial_schema.sql
```

### 4. Stripe setup

1. Create two recurring products in Stripe:
   - **Starter**: $49/month
   - **Pro**: $129/month
2. Copy the Price IDs into `.env.local`
3. Set up a webhook pointing to `https://your-domain.com/api/webhook` with events:
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
│       ├── auth/
│       │   ├── [...nextauth]/ # NextAuth handler
│       │   └── register/      # User registration
│       ├── business/          # Business CRUD
│       ├── generate-response/ # Claude API call
│       ├── reviews/[id]/      # Review status update
│       ├── stripe/            # Checkout session
│       ├── stripe/portal/     # Billing portal
│       └── webhook/           # Stripe webhooks
├── components/
│   ├── landing/  (navbar, hero, features, pricing, cta, footer)
│   ├── dashboard/ (sidebar, mobile-nav, stat-card, review-card, review-generator)
│   ├── auth/     (login-form, signup-form)
│   ├── ui/       (button, input, select, textarea, card, badge)
│   └── providers.tsx  # SessionProvider wrapper
├── lib/
│   ├── auth.ts     # NextAuth config
│   ├── db.ts       # Vercel Postgres query helpers
│   ├── stripe.ts
│   └── utils.ts
└── types/
    ├── database.ts   # Shared enums (ToneProfile, etc.)
    └── next-auth.d.ts # Session type extension
```

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Create a **Vercel Postgres** store and link it to the project (env vars auto-populate)
4. Add remaining env vars from `.env.local.example`
5. Deploy
6. Run `db/migrations/001_initial_schema.sql` in the Vercel Postgres console
