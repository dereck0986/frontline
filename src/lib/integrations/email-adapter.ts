import { NormalizedInboundEvent } from "./types";

export function normalizeEmailPayload(payload: Record<string, unknown>): NormalizedInboundEvent {
  return {
    source: "email",
    channel: "email",
    intent: "conversation",
    customerEmail: String(payload.from ?? ""),
    subject: String(payload.subject ?? ""),
    message: String(payload.body ?? ""),
    rawPayload: payload,
    receivedAt: new Date().toISOString(),
  };
}
