import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const setupSecret = process.env.FRONTLINE_DB_SETUP_SECRET;
  const providedSecret = req.headers.get("x-frontline-setup-secret");

  if (!setupSecret || providedSecret !== setupSecret) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await sql`
    CREATE TABLE IF NOT EXISTS operations_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'manual',
      channel TEXT NOT NULL DEFAULT 'manual',
      priority TEXT NOT NULL DEFAULT 'medium',
      title TEXT NOT NULL,
      summary TEXT,
      next_action TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      related_entity_type TEXT,
      related_entity_id UUID,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_operations_events_user_created ON operations_events(user_id, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_operations_events_business_status ON operations_events(business_id, status, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_operations_events_priority ON operations_events(priority, created_at DESC)`;

  return NextResponse.json({
    success: true,
    message: "Operations events table is ready.",
    tables: ["operations_events"],
  });
}
