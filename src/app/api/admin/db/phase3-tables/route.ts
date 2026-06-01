import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const setupSecret = process.env.FRONTLINE_DB_SETUP_SECRET;
  const providedSecret = req.headers.get("x-frontline-setup-secret");

  if (!setupSecret || providedSecret !== setupSecret) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id UUID,
      summary TEXT,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'unread',
      related_entity_type TEXT,
      related_entity_id UUID,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      read_at TIMESTAMPTZ
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_business_created ON audit_logs(business_id, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_notifications_user_status_created ON notifications(user_id, status, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_notifications_priority_created ON notifications(priority, created_at DESC)`;

  return NextResponse.json({
    success: true,
    message: "Phase 3 audit and notification tables are ready.",
    tables: ["audit_logs", "notifications"],
  });
}
