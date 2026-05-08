import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { createBusiness, updateBusiness, getBusinessByUserId } from "@/lib/db";

const createSchema = z.object({
  userId: z.string(),
  name: z.string().min(2),
  industry: z.string().min(1),
  location: z.string().min(2),
  tone: z.enum(["professional", "friendly", "apologetic", "bold"]),
});

const updateSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  industry: z.string().min(1),
  location: z.string().min(2),
  tone: z.enum(["professional", "friendly", "apologetic", "bold"]),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = createSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await getBusinessByUserId(session.user.id);
  if (existing) {
    return NextResponse.json({ error: "Business already exists" }, { status: 409 });
  }

  const business = await createBusiness({
    userId: session.user.id,
    name: body.name,
    industry: body.industry,
    location: body.location,
    tone: body.tone,
  });

  return NextResponse.json(business, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = updateSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Verify ownership
  const existing = await getBusinessByUserId(session.user.id);
  if (!existing || existing.id !== body.id) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const business = await updateBusiness(body.id, {
    name: body.name,
    industry: body.industry,
    location: body.location,
    tone: body.tone,
  });

  return NextResponse.json(business);
}
