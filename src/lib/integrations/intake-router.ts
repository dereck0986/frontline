import { NormalizedInboundEvent, RoutedIntakeResult } from "./types";

export function routeInboundEvent(event: NormalizedInboundEvent): RoutedIntakeResult {
  return {
    intent: event.intent,
    source: event.source,
    channel: event.channel,
    priority: "medium",
    summary: `Inbound ${event.intent} received from ${event.source}`,
    nextAction: "Review event and route to the appropriate Frontline workflow.",
    shouldPersist: true,
    normalized: event,
  };
}
