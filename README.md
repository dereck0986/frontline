# Frontline — AI Lead Follow-Up System

Frontline is an AI-powered revenue recovery system for service businesses.

It helps businesses recover lost revenue from:

- missed calls
- slow lead response
- dead leads
- weak follow-up
- poor appointment conversion

Target industries:

- Real Estate
- Security Companies
- Contractors
- Med Spas
- Rentals

## Product Vision

Frontline is not just a chatbot.

It is revenue recovery infrastructure.

The platform helps businesses:

1. Capture leads
2. Respond instantly with AI
3. Qualify leads automatically
4. Trigger automated follow-up
5. Book appointments
6. Track conversations
7. Notify owners
8. Recover lost revenue opportunities

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Database**: Neon PostgreSQL / Vercel Postgres
- **ORM Direction**: Drizzle ORM
- **Auth**: NextAuth.js v4
- **AI**: OpenAI / Claude
- **Communications**: Twilio + VAPI
- **Automation**: Make.com
- **Payments**: Stripe

## Current MVP Direction

Phase 1 focuses on:

- authentication
- dashboard shell
- lead management foundation
- AI qualification structure
- business onboarding
- Stripe billing
- automation-ready architecture

## Planned MVP Modules

- Lead Inbox
- AI Qualification Engine
- Follow-Up Automation
- Appointment Booking
- Conversation Tracking
- Owner Dashboard
- Industry Templates
- Notifications

## Dashboard Structure

Main Views:

- Dashboard
- Leads
- Calendar
- Conversations
- Automations
- Templates
- Settings

Dashboard Metrics:

- Total Leads
- Qualified Leads
- Follow-Ups Due
- Appointments Booked
- Lost Leads
- Revenue Opportunity

## API Direction

```txt
POST /api/leads/create
POST /api/leads/qualify
POST /api/leads/follow-up
POST /api/webhooks/twilio
POST /api/webhooks/vapi
POST /api/webhooks/make
POST /api/appointments/create
GET /api/dashboard/metrics
GET /api/leads
PATCH /api/leads/:id
```

## Build Philosophy

Frontline wins by doing these extremely well:

- capture leads fast
- respond instantly
- follow up automatically
- book appointments
- keep owners informed

Avoid overbuilding the platform into a bloated enterprise CRM.

## Deployment

1. Push to GitHub
2. Import project into Vercel
3. Configure database
4. Add environment variables
5. Deploy
6. Run database migrations
