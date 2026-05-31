export type OperationsMode = "review" | "schedule" | "order" | "general";
export type OperationsPriority = "low" | "medium" | "high" | "urgent";
export type ReviewSentiment = "positive" | "neutral" | "negative" | "complaint";

export type OperationsInput = {
  mode: OperationsMode;
  message: string;
  businessName?: string;
  customerName?: string;
  source?: string;
};

export type OperationsResult = {
  mode: OperationsMode;
  priority: OperationsPriority;
  summary: string;
  suggested_next_action: string;
  suggested_response: string;
  needs_human_attention: boolean;
  extracted_details: Record<string, string | boolean>;
  questions_to_ask: string[];
  sentiment?: ReviewSentiment;
};

const URGENT_WORDS = ["urgent", "asap", "emergency", "immediately", "today", "now", "angry", "refund", "lawsuit", "unsafe", "dangerous"];
const POSITIVE_WORDS = ["great", "amazing", "excellent", "love", "perfect", "helpful", "professional", "recommend", "five stars", "5 stars"];
const NEGATIVE_WORDS = ["bad", "terrible", "awful", "disappointed", "late", "rude", "broken", "never", "complaint", "problem", "issue"];
const SCHEDULE_WORDS = ["book", "schedule", "appointment", "tour", "consultation", "available", "tomorrow", "today", "next week", "morning", "afternoon", "evening"];
const ORDER_WORDS = ["order", "buy", "purchase", "quote", "estimate", "delivery", "pickup", "quantity", "invoice", "price", "how much"];

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function detectPriority(text: string): OperationsPriority {
  if (includesAny(text, URGENT_WORDS)) return "urgent";
  if (includesAny(text, ["today", "tomorrow", "book", "schedule", "quote", "estimate"])) return "high";
  if (text.length > 40) return "medium";
  return "low";
}

function detectReviewSentiment(text: string): ReviewSentiment {
  const hasNegative = includesAny(text, NEGATIVE_WORDS);
  const hasPositive = includesAny(text, POSITIVE_WORDS);
  if (hasNegative && includesAny(text, ["refund", "complaint", "never", "terrible", "awful"])) return "complaint";
  if (hasNegative) return "negative";
  if (hasPositive) return "positive";
  return "neutral";
}

function getCustomerName(input: OperationsInput) {
  return input.customerName?.trim() || "there";
}

function getBusinessName(input: OperationsInput) {
  return input.businessName?.trim() || "our team";
}

function buildReviewResult(input: OperationsInput, text: string): OperationsResult {
  const sentiment = detectReviewSentiment(text);
  const priority = sentiment === "complaint" ? "urgent" : sentiment === "negative" ? "high" : detectPriority(text);
  const customerName = getCustomerName(input);
  const businessName = getBusinessName(input);
  const needsHumanAttention = sentiment === "complaint" || priority === "urgent";

  const suggestedResponse =
    sentiment === "positive"
      ? `Hi ${customerName}, thank you for the kind words. We appreciate you choosing ${businessName} and we are glad you had a great experience.`
      : sentiment === "neutral"
        ? `Hi ${customerName}, thank you for sharing your feedback. We appreciate the opportunity to improve and we are glad you took the time to reach out.`
        : `Hi ${customerName}, thank you for bringing this to our attention. We are sorry the experience did not meet expectations. Please contact us directly so we can review what happened and work toward a resolution.`;

  return {
    mode: "review",
    priority,
    sentiment,
    summary: `Customer review detected with ${sentiment} sentiment.`,
    suggested_next_action: needsHumanAttention
      ? "Escalate this review to a human owner/operator before publishing a response."
      : "Review the suggested reply, adjust tone if needed, and publish the response.",
    suggested_response: suggestedResponse,
    needs_human_attention: needsHumanAttention,
    extracted_details: {
      source: input.source || "manual",
      sentiment,
      hasComplaintRisk: sentiment === "complaint",
    },
    questions_to_ask: needsHumanAttention
      ? ["What happened from the business side?", "Was this customer already contacted?", "Should we offer a direct call or resolution step?"]
      : ["Should the reply sound more formal or more friendly?", "Should we mention a specific staff member or service?"],
  };
}

function buildScheduleResult(input: OperationsInput, text: string): OperationsResult {
  const priority = detectPriority(text);
  const customerName = getCustomerName(input);
  const hasDateSignal = includesAny(text, ["today", "tomorrow", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "next week"]);
  const hasTimeSignal = includesAny(text, ["morning", "afternoon", "evening", "am", "pm", ":"]);

  return {
    mode: "schedule",
    priority,
    summary: "Customer appears to be requesting or discussing an appointment, tour, consultation, or booking time.",
    suggested_next_action: "Confirm availability, collect missing scheduling details, and move toward booking the appointment.",
    suggested_response: `Hi ${customerName}, thanks for reaching out. We can help with scheduling. What day and time works best for you, and what service or appointment type are you looking for?`,
    needs_human_attention: priority === "urgent",
    extracted_details: {
      hasDateSignal,
      hasTimeSignal,
      source: input.source || "manual",
    },
    questions_to_ask: [
      "What day and time works best?",
      "What service or appointment type do you need?",
      "What is the best phone number or email to confirm the booking?",
    ],
  };
}

function buildOrderResult(input: OperationsInput, text: string): OperationsResult {
  const priority = detectPriority(text);
  const customerName = getCustomerName(input);
  const isQuote = includesAny(text, ["quote", "estimate", "price", "how much"]);
  const isDelivery = includesAny(text, ["delivery", "deliver", "ship"]);
  const isPickup = includesAny(text, ["pickup", "pick up"]);

  return {
    mode: "order",
    priority,
    summary: isQuote ? "Customer appears to be requesting pricing or a quote." : "Customer appears to be placing or discussing an order/service request.",
    suggested_next_action: "Confirm item/service, quantity, timing, location, and preferred delivery or pickup details.",
    suggested_response: `Hi ${customerName}, thanks for reaching out. We can help with that. Can you confirm what you need, the quantity or scope, and when you need it by?`,
    needs_human_attention: priority === "urgent",
    extracted_details: {
      isQuote,
      isDelivery,
      isPickup,
      source: input.source || "manual",
    },
    questions_to_ask: [
      "What exactly do you need?",
      "What quantity, size, or service scope should we prepare for?",
      "Do you need delivery, pickup, or an appointment?",
    ],
  };
}

export function inferOperationsMode(message: string): OperationsMode {
  const text = message.toLowerCase();
  if (includesAny(text, ["review", "stars", "rating"]) || includesAny(text, POSITIVE_WORDS) || includesAny(text, NEGATIVE_WORDS)) return "review";
  if (includesAny(text, SCHEDULE_WORDS)) return "schedule";
  if (includesAny(text, ORDER_WORDS)) return "order";
  return "general";
}

export function analyzeOperationsMessage(input: OperationsInput): OperationsResult {
  const text = input.message.toLowerCase();
  const mode = input.mode === "general" ? inferOperationsMode(input.message) : input.mode;

  if (mode === "review") return buildReviewResult({ ...input, mode }, text);
  if (mode === "schedule") return buildScheduleResult({ ...input, mode }, text);
  if (mode === "order") return buildOrderResult({ ...input, mode }, text);

  const inferred = inferOperationsMode(input.message);
  if (inferred !== "general") return analyzeOperationsMessage({ ...input, mode: inferred });

  return {
    mode: "general",
    priority: detectPriority(text),
    summary: "General customer message detected. Frontline should clarify intent and route the request.",
    suggested_next_action: "Ask one clarifying question and route the message as a lead, review, schedule request, or order/request.",
    suggested_response: `Hi ${getCustomerName(input)}, thanks for reaching out. Can you share a little more detail about what you need so we can point you in the right direction?`,
    needs_human_attention: detectPriority(text) === "urgent",
    extracted_details: { source: input.source || "manual" },
    questions_to_ask: ["Is this about booking, pricing, an order, or feedback?", "What is the best way to contact you?"],
  };
}
