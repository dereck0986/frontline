export type IntegrationSource =
  | "manual"
  | "web_form"
  | "twilio_sms"
  | "twilio_call"
  | "vapi_call"
  | "email"
  | "chat"
  | "review"
  | "calendar"
  | "unknown";

export type WorkflowIntent =
  | "lead"
  | "review"
  | "schedule_request"
  | "order_request"
  | "service_request"
  | "conversation"
  | "unknown";

export type IntegrationChannel = "sms" | "call" | "email" | "web" | "chat" | "voice" | "manual" | "unknown";

export type NormalizedInboundEvent = {
  source: IntegrationSource;
  channel: IntegrationChannel;
  intent: WorkflowIntent;
  externalId?: string | null;
  businessId?: string | null;
  userId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  subject?: string | null;
  message: string;
  transcript?: string | null;
  rawPayload?: Record<string, unknown>;
  receivedAt: string;
};

export type RoutedIntakeResult = {
  intent: WorkflowIntent;
  source: IntegrationSource;
  channel: IntegrationChannel;
  priority: "low" | "medium" | "high" | "urgent";
  summary: string;
  nextAction: string;
  shouldPersist: boolean;
  normalized: NormalizedInboundEvent;
};
