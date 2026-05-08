import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getBusinessByUserId, createReview } from "@/lib/db";

const client = new Anthropic();

const schema = z.object({
  review_text: z.string().min(1),
  star_rating: z.number().min(1).max(5),
  tone: z.enum(["professional", "friendly", "apologetic", "bold"]),
  business_id: z.string(),
});

const TONE_INSTRUCTIONS: Record<string, string> = {
  professional:
    "Write in a formal, polished, and authoritative tone. Use proper grammar and maintain a businesslike demeanor.",
  friendly:
    "Write in a warm, approachable, and conversational tone. Be personable and genuine.",
  apologetic:
    "Write in an empathetic, understanding tone. Acknowledge the customer's experience, apologize sincerely, and offer solutions.",
  bold:
    "Write in a confident, direct, and memorable tone. Be assertive and make a strong impression.",
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Verify business belongs to this user
  const business = await getBusinessByUserId(session.user.id);
  if (!business || business.id !== body.business_id) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const starLabel =
    body.star_rating <= 2 ? "negative" : body.star_rating === 3 ? "neutral" : "positive";

  const prompt = `You are a professional review response writer for a business.

Business details:
- Name: ${business.name}
- Industry: ${business.industry}
- Location: ${business.location}

Tone instruction: ${TONE_INSTRUCTIONS[body.tone]}

The customer left a ${body.star_rating}-star (${starLabel}) review:
"${body.review_text}"

Write a response to this review. The response should:
1. Be between 50-150 words
2. Match the specified tone exactly
3. Address the specific points in the review
4. Be genuine and not generic
5. If negative, acknowledge the issue and offer to make it right
6. If positive, express gratitude and reinforce the positive experience
7. Do NOT use quotation marks around the response
8. Sign off naturally without adding a formal signature

Write only the response text, nothing else.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    const review = await createReview({
      userId: session.user.id,
      businessId: body.business_id,
      reviewText: body.review_text,
      starRating: body.star_rating,
      tone: body.tone,
      aiResponse: responseText,
    });

    return NextResponse.json({ response: responseText, review_id: review.id });
  } catch (err) {
    console.error("Generate response error:", err);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
