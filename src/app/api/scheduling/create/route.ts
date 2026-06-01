import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { createSchedulingRequest, getBusinessByUserId } from "@/lib/db";

const schedulingSchema = z.object({
  customerName: z.string().min(2).max(120),
  channel: z.string().max(80).optional().default("manual"),
  requestedService: z.string().min(2).max(160),
  requestedTime: z.string().max(160).optional().nullable(),
  message: z.string().min(5).max(4000),
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
    const body = schedulingSchema.parse(await req.json());
    const business = await getBusinessByUserId(session.user.id);

    if (!business) {
      return NextResponse.json({ success: false, message: "Business profile not found." }, { status: 404 });
    }

    const request = await createSchedulingRequest({
      userId: session.user.id,
      businessId: business.id,
      customerName: body.customerName,
      channel: body.channel,
      requestedService: body.requestedService,
      requestedTime: body.requestedTime ?? null,
      message: body.message,
      priority: body.priority,
      suggestedResponse: body.suggestedResponse ?? null,
      nextAction: body.nextAction ?? "Confirm availability and schedule the requested appointment.",
    });

    return NextResponse.json({ success: true, request });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unable to create scheduling request.", error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
