import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { fallbackQualification } from "@/lib/lead-qualification";

const leadSchema = z.object({
  fullName: z.string().min(2, "Full name is required.").max(120),
  phone: z.string().max(40).optional().nullable(),
  email: z.string().email().optional().or(z.literal("")),
  industry: z.enum(["real_estate", "security", "contractors", "med_spas", "rentals"]),
  source: z.string().max(80).optional().default("manual"),
  message: z.string().min(5, "Lead request is required.").max(4000),
  estimatedValue: z.string().max(80).optional().nullable(),
});

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ success: false, message: "Invalid content type" }, { status: 415 });
  }

  try {
    const body = leadSchema.parse(await req.json());
    const qualification = fallbackQualification({
      industry: body.industry,
      message: body.message,
      source: body.source,
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: `manual-${Date.now()}`,
        ownerUserId: session.user.id,
        fullName: body.fullName,
        phone: body.phone ?? null,
        email: body.email || null,
        industry: body.industry,
        source: body.source || "manual",
        message: body.message,
        estimatedValue: body.estimatedValue ?? null,
        status: "qualified",
        priority: qualification.priority,
        qualificationScore: qualification.score,
        aiSummary: qualification.summary,
        suggestedNextAction: qualification.suggested_next_action,
        needsHumanAttention: qualification.needs_human_attention,
        questionsToAsk: qualification.questions_to_ask,
      },
      security: {
        mode: "authenticated_manual_intake",
        ip: getClientIp(req),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to qualify lead. Check the lead details and try again.",
        error: error instanceof Error ? error.message : "Invalid request",
      },
      { status: 400 }
    );
  }
}
