import { NextResponse } from "next/server";
import { z } from "zod";
import { fallbackQualification } from "@/lib/lead-qualification";

const leadCreateSchema = z.object({
  fullName: z.string().optional().default("Unknown Lead"),
  name: z.string().optional(),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  industry: z.enum(["real_estate", "security", "contractors", "med_spas", "rentals"]).optional().default("real_estate"),
  source: z.string().optional().default("manual"),
  estimatedValue: z.union([z.string(), z.number()]).optional().default(0),
  message: z.string().optional().default(""),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = leadCreateSchema.parse(json);
    const leadMessage = body.message || body.notes || "Lead submitted without a message.";
    const leadName = body.fullName || body.name || "Unknown Lead";

    const qualification = fallbackQualification({
      industry: body.industry,
      message: leadMessage,
      source: body.source,
    });

    return NextResponse.json({
      success: true,
      ok: true,
      message: "Lead created and qualified.",
      lead: {
        id: `lead_${Date.now()}`,
        fullName: leadName,
        phone: body.phone,
        email: body.email,
        industry: body.industry,
        source: body.source,
        estimatedValue: Number(body.estimatedValue) || 0,
        message: leadMessage,
        createdAt: new Date().toISOString(),
        qualification,
      },
      qualification,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        ok: false,
        error: error instanceof Error ? error.message : "Invalid lead creation request",
      },
      { status: 400 },
    );
  }
}
