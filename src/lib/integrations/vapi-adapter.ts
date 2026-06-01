import { NormalizedInboundEvent } from "./types";

export function normalizeVapiPayload(payload: Record<string, unknown>): NormalizedInboundEvent {
  return {
    source: "vapi_call",
    channel: "voice",
    intent: "lead",
    transcript: String(payload.transcript ?? ""),
    message: String(payload.transcript ?? ""),
    rawPayload: payload,
    receivedAt: new Date().toISOString(),
  };
}
