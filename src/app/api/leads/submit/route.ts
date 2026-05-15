import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fallbackQualification } from "@/lib/lead-qualification";

const leadSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")),
  industry: z.enum(["real_estate", "security", "contractors", "med_spas", "rentals"]),
  source: z.string().optional().default("manual"),
  message: z.string().min(5, "Lead message is required."),
  estimatedValue: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = leadSchema.parse(body);

    const qualification = fallbackQualification({
      industry: data.industry,
      message: data.message,
      source: data.source,
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: `demo-${Date.now()}`,
        fullName: data.fullName,
        phone: data.phone ?? null,
        email: data.email || null,
        industry: data.industry,
        source: data.source,
        message: data.message,
        estimatedValue: data.estimatedValue ?? null,
        status: "qualified",
        priority: qualification.priority,
        qualificationScore: qualification.score,
        aiSummary: qualification.summary,
        suggestedNextAction: qualification.suggested_next_action,
        needsHumanAttention: qualification.needs_human_attention,
        questionsToAsk: qualification.questions_to_ask,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit lead.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
