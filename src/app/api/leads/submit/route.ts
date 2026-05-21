import { NextResponse } from "next/server";
import { z } from "zod";
import { fallbackQualification } from "@/lib/lead-qualification";

const leadSubmitSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  industry: z.enum(["real_estate", "security", "contractors", "med_spas", "rentals"]),
  source: z.string().optional().default("manual"),
  estimatedValue: z.coerce.number().optional().default(0),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = leadSubmitSchema.parse(json);

    const qualification = fallbackQualification({
      industry: data.industry,
      message: data.message,
      source: data.source,
    });

    return NextResponse.json({
      success: true,
      ok: true,
      message: "Lead submitted and qualified.",
      lead: {
        id: `demo-${Date.now()}`,
        fullName: data.fullName,
        phone: data.phone || null,
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
        qualification,
        createdAt: new Date().toISOString(),
      },
      qualification,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        ok: false,
        message: "Unable to submit lead.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}