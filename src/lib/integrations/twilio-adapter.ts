import { NormalizedInboundEvent } from "./types";

export function normalizeTwilioPayload(payload: Record<string, unknown>): NormalizedInboundEvent {
  return {
    source: "twilio_sms",
    channel: "sms",
    intent: "lead",
    customerPhone: String(payload.From ?? ""),
    message: String(payload.Body ?? ""),
    rawPayload: payload,
    receivedAt: new Date().toISOString(),
  };
}
