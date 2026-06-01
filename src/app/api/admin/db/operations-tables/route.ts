import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const setupSecret = process.env.FRONTLINE_DB_SETUP_SECRET;
  const providedSecret = req.headers.get("x-frontline-setup-secret");

  if (!setupSecret || providedSecret !== setupSecret) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await sql`
    CREATE TABLE IF NOT EXISTS scheduling_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT 'manual',
      requested_service TEXT NOT NULL,
      requested_time TEXT,
      message TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      suggested_response TEXT,
      next_action TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS order_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT 'manual',
      request_type TEXT NOT NULL,
      message TEXT NOT NULL,
      estimated_value TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      suggested_response TEXT,
      next_action TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_scheduling_requests_user_created ON scheduling_requests(user_id, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_order_requests_user_created ON order_requests(user_id, created_at DESC)`;

  return NextResponse.json({
    success: true,
    message: "Operations tables are ready.",
    tables: ["scheduling_requests", "order_requests"],
  });
}
