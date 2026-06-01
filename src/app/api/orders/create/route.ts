import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { createOrderRequest, getBusinessByUserId } from "@/lib/db";

const orderSchema = z.object({
  customerName: z.string().min(2).max(120),
  channel: z.string().max(80).optional().default("manual"),
  requestType: z.string().min(2).max(160),
  message: z.string().min(5).max(4000),
  estimatedValue: z.string().max(120).optional().nullable(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional().default("medium"),
  suggestedResponse: z.string().max(4000).optional().nullable(),
  nextAction: z.string().max(1000).optional().nullable(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = orderSchema.parse(await req.json());
    const business = await getBusinessByUserId(session.user.id);

    if (!business) {
      return NextResponse.json({ success: false, message: "Business profile not found." }, { status: 404 });
    }

    const request = await createOrderRequest({
      userId: session.user.id,
      businessId: business.id,
      customerName: body.customerName,
      channel: body.channel,
      requestType: body.requestType,
      message: body.message,
      estimatedValue: body.estimatedValue ?? null,
      priority: body.priority,
      suggestedResponse: body.suggestedResponse ?? null,
      nextAction: body.nextAction ?? "Review request and prepare customer follow-up.",
    });

    return NextResponse.json({ success: true, request });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unable to create order request.", error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
