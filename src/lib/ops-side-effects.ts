import { sql } from "@vercel/postgres";

export type AuditLog = {
  id: string;
  user_id: string | null;
  business_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  summary: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type NotificationRecord = {
  id: string;
  user_id: string;
  business_id: string;
  type: string;
  title: string;
  message: string | null;
  priority: string;
  status: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  read_at: string | null;
};

export async function createAuditLog(data: {
  userId?: string | null;
  businessId?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  summary?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<AuditLog> {
  const { rows } = await sql`
    INSERT INTO audit_logs (user_id, business_id, action, entity_type, entity_id, summary, metadata)
    VALUES (${data.userId ?? null}, ${data.businessId ?? null}, ${data.action}, ${data.entityType ?? null}, ${data.entityId ?? null}, ${data.summary ?? null}, ${JSON.stringify(data.metadata ?? {})}::jsonb)
    RETURNING *
  `;

  return rows[0] as AuditLog;
}

export async function getAuditLogsByUserId(userId: string, limit = 50): Promise<AuditLog[]> {
  const { rows } = await sql`SELECT * FROM audit_logs WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as AuditLog[];
}

export async function createNotification(data: {
  userId: string;
  businessId: string;
  type: string;
  title: string;
  message?: string | null;
  priority?: string;
  status?: string;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<NotificationRecord> {
  const { rows } = await sql`
    INSERT INTO notifications (user_id, business_id, type, title, message, priority, status, related_entity_type, related_entity_id, metadata)
    VALUES (${data.userId}, ${data.businessId}, ${data.type}, ${data.title}, ${data.message ?? null}, ${data.priority ?? "medium"}, ${data.status ?? "unread"}, ${data.relatedEntityType ?? null}, ${data.relatedEntityId ?? null}, ${JSON.stringify(data.metadata ?? {})}::jsonb)
    RETURNING *
  `;

  return rows[0] as NotificationRecord;
}

export async function getNotificationsByUserId(userId: string, limit = 50): Promise<NotificationRecord[]> {
  const { rows } = await sql`SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as NotificationRecord[];
}

export async function markNotificationRead(id: string, userId: string): Promise<void> {
  await sql`UPDATE notifications SET status = 'read', read_at = NOW() WHERE id = ${id} AND user_id = ${userId}`;
}

export async function createOperationalSideEffects(data: {
  userId: string;
  businessId: string;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  summary?: string | null;
  priority?: string;
  title?: string;
  metadata?: Record<string, unknown>;
}) {
  await createAuditLog({
    userId: data.userId,
    businessId: data.businessId,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    summary: data.summary,
    metadata: data.metadata,
  });

  if (data.priority === "urgent" || data.priority === "high") {
    await createNotification({
      userId: data.userId,
      businessId: data.businessId,
      type: data.action,
      title: data.title ?? "Priority operation needs attention",
      message: data.summary,
      priority: data.priority,
      relatedEntityType: data.entityType,
      relatedEntityId: data.entityId,
      metadata: data.metadata,
    });
  }
}
