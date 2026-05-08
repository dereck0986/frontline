import { sql } from "@vercel/postgres";
import type { ToneProfile, SubscriptionPlan, SubscriptionStatus, ReviewStatus } from "@/types/database";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  industry: string;
  location: string;
  tone: ToneProfile;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  business_id: string;
  review_text: string;
  star_rating: number;
  tone: ToneProfile;
  ai_response: string | null;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  const { rows } = await sql`
    SELECT id, name, email, password, created_at FROM users WHERE email = ${email} LIMIT 1
  `;
  return (rows[0] as (User & { password: string })) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const { rows } = await sql`
    SELECT id, name, email, created_at FROM users WHERE id = ${id} LIMIT 1
  `;
  return (rows[0] as User) ?? null;
}

export async function createUser(data: {
  name: string;
  email: string;
  hashedPassword: string;
}): Promise<User> {
  const { rows } = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${data.name}, ${data.email}, ${data.hashedPassword})
    RETURNING id, name, email, created_at
  `;
  // Create a default free subscription
  await sql`
    INSERT INTO subscriptions (user_id, plan, status)
    VALUES (${rows[0].id}, 'free', 'active')
    ON CONFLICT (user_id) DO NOTHING
  `;
  return rows[0] as User;
}

// ─── Businesses ───────────────────────────────────────────────────────────────

export async function getBusinessByUserId(userId: string): Promise<Business | null> {
  const { rows } = await sql`
    SELECT * FROM businesses WHERE user_id = ${userId} LIMIT 1
  `;
  return (rows[0] as Business) ?? null;
}

export async function createBusiness(data: {
  userId: string;
  name: string;
  industry: string;
  location: string;
  tone: ToneProfile;
}): Promise<Business> {
  const { rows } = await sql`
    INSERT INTO businesses (user_id, name, industry, location, tone)
    VALUES (${data.userId}, ${data.name}, ${data.industry}, ${data.location}, ${data.tone})
    RETURNING *
  `;
  return rows[0] as Business;
}

export async function updateBusiness(
  id: string,
  data: { name: string; industry: string; location: string; tone: ToneProfile }
): Promise<Business> {
  const { rows } = await sql`
    UPDATE businesses
    SET name = ${data.name}, industry = ${data.industry},
        location = ${data.location}, tone = ${data.tone},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Business;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getReviewsByUserId(
  userId: string,
  limit?: number
): Promise<Review[]> {
  if (limit) {
    const { rows } = await sql`
      SELECT * FROM reviews WHERE user_id = ${userId}
      ORDER BY created_at DESC LIMIT ${limit}
    `;
    return rows as Review[];
  }
  const { rows } = await sql`
    SELECT * FROM reviews WHERE user_id = ${userId} ORDER BY created_at DESC
  `;
  return rows as Review[];
}

export async function createReview(data: {
  userId: string;
  businessId: string;
  reviewText: string;
  starRating: number;
  tone: ToneProfile;
  aiResponse?: string;
}): Promise<Review> {
  const { rows } = await sql`
    INSERT INTO reviews (user_id, business_id, review_text, star_rating, tone, ai_response, status)
    VALUES (
      ${data.userId}, ${data.businessId}, ${data.reviewText},
      ${data.starRating}, ${data.tone}, ${data.aiResponse ?? null}, 'pending'
    )
    RETURNING *
  `;
  return rows[0] as Review;
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus
): Promise<void> {
  await sql`
    UPDATE reviews SET status = ${status}, updated_at = NOW() WHERE id = ${id}
  `;
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function getSubscriptionByUserId(
  userId: string
): Promise<Subscription | null> {
  const { rows } = await sql`
    SELECT * FROM subscriptions WHERE user_id = ${userId} LIMIT 1
  `;
  return (rows[0] as Subscription) ?? null;
}

export async function getSubscriptionByStripeCustomerId(
  customerId: string
): Promise<Subscription | null> {
  const { rows } = await sql`
    SELECT * FROM subscriptions WHERE stripe_customer_id = ${customerId} LIMIT 1
  `;
  return (rows[0] as Subscription) ?? null;
}

export async function getSubscriptionByStripeSubId(
  subId: string
): Promise<Subscription | null> {
  const { rows } = await sql`
    SELECT * FROM subscriptions WHERE stripe_subscription_id = ${subId} LIMIT 1
  `;
  return (rows[0] as Subscription) ?? null;
}

export async function upsertSubscription(
  userId: string,
  data: Partial<Omit<Subscription, "id" | "user_id" | "created_at">>
): Promise<void> {
  await sql`
    INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end)
    VALUES (
      ${userId},
      ${data.stripe_customer_id ?? null},
      ${data.stripe_subscription_id ?? null},
      ${data.plan ?? "free"},
      ${data.status ?? "active"},
      ${data.current_period_end ?? null}
    )
    ON CONFLICT (user_id) DO UPDATE SET
      stripe_customer_id     = COALESCE(EXCLUDED.stripe_customer_id, subscriptions.stripe_customer_id),
      stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, subscriptions.stripe_subscription_id),
      plan                   = COALESCE(EXCLUDED.plan, subscriptions.plan),
      status                 = COALESCE(EXCLUDED.status, subscriptions.status),
      current_period_end     = COALESCE(EXCLUDED.current_period_end, subscriptions.current_period_end),
      updated_at             = NOW()
  `;
}

export async function updateSubscriptionByStripeSubId(
  stripeSubId: string,
  data: Partial<Omit<Subscription, "id" | "user_id" | "created_at">>
): Promise<void> {
  await sql`
    UPDATE subscriptions SET
      plan               = COALESCE(${data.plan ?? null}, plan),
      status             = COALESCE(${data.status ?? null}, status),
      current_period_end = COALESCE(${data.current_period_end ?? null}, current_period_end),
      stripe_subscription_id = COALESCE(${data.stripe_subscription_id ?? null}, stripe_subscription_id),
      updated_at         = NOW()
    WHERE stripe_subscription_id = ${stripeSubId}
  `;
}
