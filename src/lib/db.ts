import { sql } from "@vercel/postgres";
import { createOperationalSideEffects } from "@/lib/ops-side-effects";
import type { ToneProfile, SubscriptionPlan, SubscriptionStatus, ReviewStatus } from "@/types/database";

export interface User { id: string; name: string | null; email: string; created_at: string; }
export interface Business { id: string; user_id: string; name: string; industry: string; location: string; tone: ToneProfile; created_at: string; updated_at: string; }
export interface Review { id: string; user_id: string; business_id: string; review_text: string; star_rating: number; tone: ToneProfile; ai_response: string | null; status: ReviewStatus; created_at: string; updated_at: string; }
export interface Subscription { id: string; user_id: string; stripe_customer_id: string | null; stripe_subscription_id: string | null; plan: SubscriptionPlan; status: SubscriptionStatus; current_period_end: string | null; created_at: string; updated_at: string; }

export interface Lead {
  id: string;
  business_id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  source: string;
  industry: string;
  status: string;
  priority: string;
  ai_summary: string | null;
  qualification_score: number;
  estimated_value: string | null;
  needs_human_attention: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchedulingRequest {
  id: string;
  business_id: string;
  user_id: string;
  customer_name: string;
  channel: string;
  requested_service: string;
  requested_time: string | null;
  message: string;
  priority: string;
  suggested_response: string | null;
  next_action: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderRequest {
  id: string;
  business_id: string;
  user_id: string;
  customer_name: string;
  channel: string;
  request_type: string;
  message: string;
  estimated_value: string | null;
  priority: string;
  suggested_response: string | null;
  next_action: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OperationEvent {
  id: string;
  business_id: string;
  user_id: string;
  event_type: string;
  source: string;
  channel: string;
  priority: string;
  title: string;
  summary: string | null;
  next_action: string | null;
  status: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export async function getUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  const { rows } = await sql`SELECT id, name, email, password, created_at FROM users WHERE email = ${email} LIMIT 1`;
  return (rows[0] as (User & { password: string })) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const { rows } = await sql`SELECT id, name, email, created_at FROM users WHERE id = ${id} LIMIT 1`;
  return (rows[0] as User) ?? null;
}

export async function createUser(data: { name: string; email: string; hashedPassword: string; }): Promise<User> {
  const { rows } = await sql`INSERT INTO users (name, email, password) VALUES (${data.name}, ${data.email}, ${data.hashedPassword}) RETURNING id, name, email, created_at`;
  await sql`INSERT INTO subscriptions (user_id, plan, status) VALUES (${rows[0].id}, 'free', 'active') ON CONFLICT (user_id) DO NOTHING`;
  return rows[0] as User;
}

export async function getBusinessByUserId(userId: string): Promise<Business | null> {
  const { rows } = await sql`SELECT * FROM businesses WHERE user_id = ${userId} LIMIT 1`;
  return (rows[0] as Business) ?? null;
}

export async function createBusiness(data: { userId: string; name: string; industry: string; location: string; tone: ToneProfile; }): Promise<Business> {
  const { rows } = await sql`INSERT INTO businesses (user_id, name, industry, location, tone) VALUES (${data.userId}, ${data.name}, ${data.industry}, ${data.location}, ${data.tone}) RETURNING *`;
  return rows[0] as Business;
}

export async function updateBusiness(id: string, data: { name: string; industry: string; location: string; tone: ToneProfile }): Promise<Business> {
  const { rows } = await sql`UPDATE businesses SET name = ${data.name}, industry = ${data.industry}, location = ${data.location}, tone = ${data.tone}, updated_at = NOW() WHERE id = ${id} RETURNING *`;
  return rows[0] as Business;
}

export async function createOperationEvent(data: { userId: string; businessId: string; eventType: string; source?: string; channel?: string; priority?: string; title: string; summary?: string | null; nextAction?: string | null; status?: string; relatedEntityType?: string | null; relatedEntityId?: string | null; metadata?: Record<string, unknown>; }): Promise<OperationEvent> {
  const { rows } = await sql`
    INSERT INTO operations_events (user_id, business_id, event_type, source, channel, priority, title, summary, next_action, status, related_entity_type, related_entity_id, metadata)
    VALUES (${data.userId}, ${data.businessId}, ${data.eventType}, ${data.source ?? "manual"}, ${data.channel ?? "manual"}, ${data.priority ?? "medium"}, ${data.title}, ${data.summary ?? null}, ${data.nextAction ?? null}, ${data.status ?? "open"}, ${data.relatedEntityType ?? null}, ${data.relatedEntityId ?? null}, ${JSON.stringify(data.metadata ?? {})}::jsonb)
    RETURNING *
  `;
  const event = rows[0] as OperationEvent;

  await createOperationalSideEffects({
    userId: event.user_id,
    businessId: event.business_id,
    action: event.event_type,
    entityType: event.related_entity_type,
    entityId: event.related_entity_id,
    summary: event.summary,
    priority: event.priority,
    title: event.title,
    metadata: event.metadata,
  });

  return event;
}

export async function getOperationEventsByUserId(userId: string, limit = 50): Promise<OperationEvent[]> {
  const { rows } = await sql`SELECT * FROM operations_events WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as OperationEvent[];
}

export async function updateOperationEventStatus(id: string, status: string): Promise<void> {
  await sql`UPDATE operations_events SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
}

export async function createLead(data: { userId: string; businessId: string; fullName: string; phone?: string | null; email?: string | null; source?: string; industry: string; status?: string; priority?: string; aiSummary?: string | null; qualificationScore?: number; estimatedValue?: string | null; needsHumanAttention?: boolean; }): Promise<Lead> {
  const { rows } = await sql`
    INSERT INTO leads (user_id, business_id, full_name, phone, email, source, industry, status, priority, ai_summary, qualification_score, estimated_value, needs_human_attention)
    VALUES (${data.userId}, ${data.businessId}, ${data.fullName}, ${data.phone ?? null}, ${data.email ?? null}, ${data.source ?? "manual"}, ${data.industry}, ${data.status ?? "new"}, ${data.priority ?? "medium"}, ${data.aiSummary ?? null}, ${data.qualificationScore ?? 0}, ${data.estimatedValue ?? null}, ${data.needsHumanAttention ?? false})
    RETURNING *
  `;
  const lead = rows[0] as Lead;
  await createOperationEvent({
    userId: lead.user_id,
    businessId: lead.business_id,
    eventType: "lead_created",
    source: lead.source,
    channel: "manual",
    priority: lead.priority,
    title: `Lead created: ${lead.full_name}`,
    summary: lead.ai_summary,
    nextAction: "Follow up and confirm the strongest next qualification step.",
    relatedEntityType: "lead",
    relatedEntityId: lead.id,
    metadata: { qualificationScore: lead.qualification_score, industry: lead.industry, estimatedValue: lead.estimated_value },
  });
  return lead;
}

export async function getLeadsByUserId(userId: string, limit = 50): Promise<Lead[]> {
  const { rows } = await sql`SELECT * FROM leads WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as Lead[];
}

export async function createSchedulingRequest(data: { userId: string; businessId: string; customerName: string; channel?: string; requestedService: string; requestedTime?: string | null; message: string; priority?: string; suggestedResponse?: string | null; nextAction?: string | null; status?: string; }): Promise<SchedulingRequest> {
  const { rows } = await sql`
    INSERT INTO scheduling_requests (user_id, business_id, customer_name, channel, requested_service, requested_time, message, priority, suggested_response, next_action, status)
    VALUES (${data.userId}, ${data.businessId}, ${data.customerName}, ${data.channel ?? "manual"}, ${data.requestedService}, ${data.requestedTime ?? null}, ${data.message}, ${data.priority ?? "medium"}, ${data.suggestedResponse ?? null}, ${data.nextAction ?? null}, ${data.status ?? "open"})
    RETURNING *
  `;
  const request = rows[0] as SchedulingRequest;
  await createOperationEvent({
    userId: request.user_id,
    businessId: request.business_id,
    eventType: "schedule_request_created",
    source: request.channel,
    channel: request.channel,
    priority: request.priority,
    title: `Scheduling request: ${request.customer_name}`,
    summary: request.message,
    nextAction: request.next_action,
    relatedEntityType: "scheduling_request",
    relatedEntityId: request.id,
    metadata: { requestedService: request.requested_service, requestedTime: request.requested_time },
  });
  return request;
}

export async function getSchedulingRequestsByUserId(userId: string, limit = 50): Promise<SchedulingRequest[]> {
  const { rows } = await sql`SELECT * FROM scheduling_requests WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as SchedulingRequest[];
}

export async function createOrderRequest(data: { userId: string; businessId: string; customerName: string; channel?: string; requestType: string; message: string; estimatedValue?: string | null; priority?: string; suggestedResponse?: string | null; nextAction?: string | null; status?: string; }): Promise<OrderRequest> {
  const { rows } = await sql`
    INSERT INTO order_requests (user_id, business_id, customer_name, channel, request_type, message, estimated_value, priority, suggested_response, next_action, status)
    VALUES (${data.userId}, ${data.businessId}, ${data.customerName}, ${data.channel ?? "manual"}, ${data.requestType}, ${data.message}, ${data.estimatedValue ?? null}, ${data.priority ?? "medium"}, ${data.suggestedResponse ?? null}, ${data.nextAction ?? null}, ${data.status ?? "open"})
    RETURNING *
  `;
  const request = rows[0] as OrderRequest;
  await createOperationEvent({
    userId: request.user_id,
    businessId: request.business_id,
    eventType: "order_request_created",
    source: request.channel,
    channel: request.channel,
    priority: request.priority,
    title: `Order request: ${request.customer_name}`,
    summary: request.message,
    nextAction: request.next_action,
    relatedEntityType: "order_request",
    relatedEntityId: request.id,
    metadata: { requestType: request.request_type, estimatedValue: request.estimated_value },
  });
  return request;
}

export async function getOrderRequestsByUserId(userId: string, limit = 50): Promise<OrderRequest[]> {
  const { rows } = await sql`SELECT * FROM order_requests WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as OrderRequest[];
}

export async function getReviewsByUserId(userId: string, limit?: number): Promise<Review[]> {
  if (limit) {
    const { rows } = await sql`SELECT * FROM reviews WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`;
    return rows as Review[];
  }
  const { rows } = await sql`SELECT * FROM reviews WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return rows as Review[];
}

export async function createReview(data: { userId: string; businessId: string; reviewText: string; starRating: number; tone: ToneProfile; aiResponse?: string; }): Promise<Review> {
  const { rows } = await sql`INSERT INTO reviews (user_id, business_id, review_text, star_rating, tone, ai_response, status) VALUES (${data.userId}, ${data.businessId}, ${data.reviewText}, ${data.starRating}, ${data.tone}, ${data.aiResponse ?? null}, 'pending') RETURNING *`;
  return rows[0] as Review;
}

export async function updateReviewStatus(id: string, status: ReviewStatus): Promise<void> {
  await sql`UPDATE reviews SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
}

export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
  const { rows } = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId} LIMIT 1`;
  return (rows[0] as Subscription) ?? null;
}

export async function getSubscriptionByStripeCustomerId(customerId: string): Promise<Subscription | null> {
  const { rows } = await sql`SELECT * FROM subscriptions WHERE stripe_customer_id = ${customerId} LIMIT 1`;
  return (rows[0] as Subscription) ?? null;
}

export async function getSubscriptionByStripeSubId(subId: string): Promise<Subscription | null> {
  const { rows } = await sql`SELECT * FROM subscriptions WHERE stripe_subscription_id = ${subId} LIMIT 1`;
  return (rows[0] as Subscription) ?? null;
}

export async function upsertSubscription(userId: string, data: Partial<Omit<Subscription, "id" | "user_id" | "created_at">>): Promise<void> {
  await sql`
    INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end)
    VALUES (${userId}, ${data.stripe_customer_id ?? null}, ${data.stripe_subscription_id ?? null}, ${data.plan ?? "free"}, ${data.status ?? "active"}, ${data.current_period_end ?? null})
    ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, subscriptions.stripe_customer_id), stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, subscriptions.stripe_subscription_id), plan = COALESCE(EXCLUDED.plan, subscriptions.plan), status = COALESCE(EXCLUDED.status, subscriptions.status), current_period_end = COALESCE(EXCLUDED.current_period_end, subscriptions.current_period_end), updated_at = NOW()
  `;
}

export async function updateSubscriptionByStripeSubId(stripeSubId: string, data: Partial<Omit<Subscription, "id" | "user_id" | "created_at">>): Promise<void> {
  await sql`UPDATE subscriptions SET plan = COALESCE(${data.plan ?? null}, plan), status = COALESCE(${data.status ?? null}, status), current_period_end = COALESCE(${data.current_period_end ?? null}, current_period_end), stripe_subscription_id = COALESCE(${data.stripe_subscription_id ?? null}, stripe_subscription_id), updated_at = NOW() WHERE stripe_subscription_id = ${stripeSubId}`;
}
