import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

async function runInit() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      industry TEXT NOT NULL,
      location TEXT NOT NULL,
      tone TEXT NOT NULL CHECK (tone IN ('professional','friendly','apologetic','bold')),
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      review_text TEXT NOT NULL,
      star_rating INTEGER NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
      tone TEXT NOT NULL CHECK (tone IN ('professional','friendly','apologetic','bold')),
      ai_response TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','responded','published')),
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      stripe_customer_id TEXT UNIQUE,
      stripe_subscription_id TEXT UNIQUE,
      plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','starter','pro')),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','canceled','past_due','trialing')),
      current_period_end TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    )`;
    await sql`CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id)`;

    const email = "dereckvertyl300@gmail.com";
    const { rows: existing } = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    let status: string;
    if (existing.length === 0) {
      const hash = await bcrypt.hash("Frontline2026!", 12);
      const { rows } = await sql`
        INSERT INTO users (name, email, password)
        VALUES ('Dereck Admin', ${email}, ${hash})
        RETURNING id
      `;
      await sql`INSERT INTO subscriptions (user_id, plan, status) VALUES (${rows[0].id}, 'free', 'active')`;
      status = "Admin user created";
    } else {
      status = "Admin user already exists";
    }
    return { ok: true, status };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export default async function InitPage() {
  const result = await runInit();
  return (
    <div style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>Frontline Init</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      {result.ok && (
        <p>
          <a href="/login">Go to login →</a>
        </p>
      )}
    </div>
  );
}
