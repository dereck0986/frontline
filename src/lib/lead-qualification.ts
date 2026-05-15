import type { Industry, LeadPriority } from "@/types/database";

export type LeadQualificationInput = {
  industry: Industry;
  message: string;
  source?: string;
};

export type LeadQualificationResult = {
  score: number;
  priority: LeadPriority;
  summary: string;
  suggested_next_action: string;
  needs_human_attention: boolean;
  questions_to_ask: string[];
};

export const INDUSTRY_QUESTIONS: Record<Industry, string[]> = {
  real_estate: [
    "Are you buying, selling, or renting?",
    "What is your timeline?",
    "Are you already pre-approved or paying cash?",
    "What budget or property value are you working with?",
  ],
  security: [
    "Do you need armed or unarmed guards?",
    "What location needs coverage?",
    "How many guards do you need?",
    "What shifts or hours need coverage?",
  ],
  contractors: [
    "What type of project do you need help with?",
    "Is this urgent or scheduled work?",
    "What is your target budget?",
    "What timeline are you trying to hit?",
  ],
  med_spas: [
    "What treatment are you interested in?",
    "Have you received this treatment before?",
    "When would you prefer to come in?",
    "Do you have any specific concerns or goals?",
  ],
  rentals: [
    "When are you looking to move in?",
    "What is your monthly budget?",
    "How many occupants will live there?",
    "Do you have pets?",
  ],
};

export function buildQualificationPrompt(input: LeadQualificationInput) {
  const questions = INDUSTRY_QUESTIONS[input.industry];

  return `You are Frontline, an AI lead follow-up assistant for service businesses.

Your goals:
1. Respond quickly and naturally.
2. Qualify the lead.
3. Determine urgency.
4. Move toward appointment booking.
5. Keep communication professional.
6. Escalate important situations to humans.

Industry: ${input.industry}
Lead Source: ${input.source ?? "unknown"}
Lead Message:
"""
${input.message}
"""

Qualification questions for this industry:
${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}

Return a JSON object only with this exact shape:
{
  "score": number from 0 to 100,
  "priority": "low" | "medium" | "high" | "urgent",
  "summary": "one to two sentence summary",
  "suggested_next_action": "clear next action",
  "needs_human_attention": boolean,
  "questions_to_ask": ["up to three best next questions"]
}`;
}

export function fallbackQualification(input: LeadQualificationInput): LeadQualificationResult {
  const text = input.message.toLowerCase();
  const urgentWords = ["urgent", "asap", "today", "immediately", "emergency", "now"];
  const valueWords = ["cash", "ready", "approved", "book", "schedule", "hire", "quote"];

  const urgencyBoost = urgentWords.some((word) => text.includes(word)) ? 30 : 0;
  const valueBoost = valueWords.some((word) => text.includes(word)) ? 20 : 0;
  const score = Math.min(100, 45 + urgencyBoost + valueBoost);

  const priority: LeadPriority =
    score >= 85 ? "urgent" : score >= 70 ? "high" : score >= 45 ? "medium" : "low";

  return {
    score,
    priority,
    summary: "Lead received and ready for qualification follow-up.",
    suggested_next_action: "Ask the next qualification question and move toward booking an appointment.",
    needs_human_attention: priority === "urgent",
    questions_to_ask: INDUSTRY_QUESTIONS[input.industry].slice(0, 3),
  };
}
