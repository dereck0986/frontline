import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  buildQualificationPrompt,
  fallbackQualification,
} from "@/lib/lead-qualification";

const schema = z.object({
  industry: z.enum([
    "real_estate",
    "security",
    "contractors",
    "med_spas",
    "rentals",
  ]),
  message: z.string().min(5),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());

    const prompt = buildQualificationPrompt(body);

    const qualification = fallbackQualification(body);

    return NextResponse.json({
      success: true,
      prompt,
      qualification,
    });
  } catch (error) {
    console.error("Lead qualification error", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to qualify lead.",
      },
      { status: 400 }
    );
  }
}
