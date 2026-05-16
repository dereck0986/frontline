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
    const body = leadSubmitSchema.parse(json);

    const qualification = fallbackQualification({
      industry: body.industry,
      message: body.message,
      source: body.source,
    });

    return NextResponse.json({
      ok: true,
      lead: {
        id: `lead_${Date.now()}`,
        fullName: body.fullName,
        phone: body.phone,
        email: body.email ?? "",
        industry: body.industry,
        source: body.source,
        estimatedValue: body.estimatedValue,
        message: body.message,
        createdAt: new Date().toISOString(),
        qualification,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Invalid lead submission",
      },
      { status: 400 },
    );
  }
}
