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

const RENTAL_INTENT_WORDS = [
  "rent",
  "renting",
  "rental",
  "lease",
  "move in",
  "move-in",
  "apartment",
  "unit",
  "tenant",
];

const RENTAL_QUESTIONS = [
  "When are you looking to move in?",
  "How many occupants will live there?",
  "Do you have pets or any special requirements?",
];

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

function hasRentalIntent(message: string) {
  const text = message.toLowerCase();
  return RENTAL_INTENT_WORDS.some((word) => text.includes(word));
}

function getQuestionsForInput(input: LeadQualificationInput) {
  if ((input.industry === "real_estate" || input.industry === "rentals") && hasRentalIntent(input.message)) {
    return RENTAL_QUESTIONS;
  }

  return INDUSTRY_QUESTIONS[input.industry].slice(0, 3);
}

function buildContextSummary(input: LeadQualificationInput) {
  const text = input.message.trim();
  const shortMessage = text.length > 150 ? `${text.slice(0, 147)}...` : text;

  if ((input.industry === "real_estate" || input.industry === "rentals") && hasRentalIntent(input.message)) {
    return `Lead is interested in renting or leasing. Message: "${shortMessage}"`;
  }

  if (input.industry === "security") {
    return `Security lead received. Message: "${shortMessage}"`;
  }

  if (input.industry === "contractors") {
    return `Contractor/service lead received. Message: "${shortMessage}"`;
  }

  if (input.industry === "med_spas") {
    return `Med spa lead received. Message: "${shortMessage}"`;
  }

  return `Lead received. Message: "${shortMessage}"`;
}

function buildNextAction(input: LeadQualificationInput) {
  if ((input.industry === "real_estate" || input.industry === "rentals") && hasRentalIntent(input.message)) {
    return "Follow up immediately to confirm move-in timeline, occupants, budget, and showing availability.";
  }

  if (input.industry === "security") {
    return "Confirm coverage location, guard type, number of guards, and required shifts before sending pricing or booking a call.";
  }

  if (input.industry === "contractors") {
    return "Confirm project type, urgency, location, budget range, and schedule an estimate if the lead is qualified.";
  }

  if (input.industry === "med_spas") {
    return "Confirm treatment interest, timing, prior experience, and move toward booking a consultation.";
  }

  return "Ask the strongest next qualification question and move toward booking an appointment.";
}

export function buildQualificationPrompt(input: LeadQualificationInput) {
  const questions = getQuestionsForInput(input);

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

Qualification questions for this lead:
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
  const valueWords = ["cash", "ready", "approved", "book", "schedule", "hire", "quote", "rent", "lease", "move in"];

  const urgencyBoost = urgentWords.some((word) => text.includes(word)) ? 30 : 0;
  const valueBoost = valueWords.some((word) => text.includes(word)) ? 20 : 0;
  const score = Math.min(100, 45 + urgencyBoost + valueBoost);

  const priority: LeadPriority =
    score >= 85 ? "urgent" : score >= 70 ? "high" : score >= 45 ? "medium" : "low";

  return {
    score,
    priority,
    summary: buildContextSummary(input),
    suggested_next_action: buildNextAction(input),
    needs_human_attention: priority === "urgent",
    questions_to_ask: getQuestionsForInput(input),
  };
}
