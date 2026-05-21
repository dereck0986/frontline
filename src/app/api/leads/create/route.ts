import { NextResponse } from "next/server";
import { z } from "zod";
import { fallbackQualification } from "@/lib/lead-qualification";

const leadCreateSchema = z.object({
  fullName: z.string().optional().default("Unknown Lead"),
  name: z.string().optional(),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  industry: z
    .enum(["real_estate", "security", "contractors", "med_spas", "rentals"])
    .optional()
    .default("real_estate"),
  source: z.string().optional().default("manual"),
  estimatedValue: z.union([z.string(), z.number()]).optional().default(0),
  message: z.string().optional().default(""),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = leadCreateSchema.parse(json);

    const leadMessage =
      data.message || data.notes || "Lead submitted without a message.";

    const leadName = data.fullName || data.name || "Unknown Lead";

    const qualification = fallbackQualification({
      industry: data.industry,
      message: leadMessage,
      source: data.source,
    });

    return NextResponse.json({
      success: true,
      ok: true,
      message: "Lead created and qualified.",
      lead: {
        id: `LD-${Date.now()}`,
        fullName: leadName,
        phone: data.phone || null,
        email: data.email || null,
        industry: data.industry,
        source: data.source,
        message: leadMessage,
        estimatedValue: Number(data.estimatedValue) || null,
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
        message: "Unable to create lead.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}