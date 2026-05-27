export type DemoLead = {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  industry: string;
  source: string;
  message: string;
  estimatedValue: string | null;
  status: string;
  priority: string;
  qualificationScore: number;
  aiSummary: string;
  suggestedNextAction: string;
  needsHumanAttention: boolean;
  questionsToAsk: string[];
  createdAt: string;
};

export type DemoReview = {
  id: string;
  customerName: string;
  rating: number;
  source: string;
  message: string;
  sentiment: "positive" | "neutral" | "negative" | "complaint";
  priority: "low" | "medium" | "high" | "urgent";
  suggestedResponse: string;
  nextAction: string;
  createdAt: string;
};

export type DemoScheduleRequest = {
  id: string;
  customerName: string;
  channel: string;
  requestedService: string;
  requestedTime: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  suggestedResponse: string;
  nextAction: string;
  createdAt: string;
};

export type DemoOrderRequest = {
  id: string;
  customerName: string;
  channel: string;
  requestType: "quote" | "order" | "service_request";
  message: string;
  estimatedValue: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  suggestedResponse: string;
  nextAction: string;
  createdAt: string;
};

export const demoAccount = {
  id: "demo-account-frontline",
  businessName: "Boston Premier Services",
  ownerName: "Demo Owner",
  ownerEmail: "demo@frontlineai.app",
  phone: "(617) 555-0147",
  industry: "multi_service",
  serviceArea: "Greater Boston, MA",
  mode: "demo",
  notice: "Demo data only. No real customer messages, calls, reviews, appointments, or orders are connected.",
};

export const demoLeads: DemoLead[] = [
  {
    id: "demo-lead-001",
    fullName: "Ian Stokovia",
    phone: "(617) 916-4890",
    email: "ian.demo@example.com",
    industry: "rentals",
    source: "website form",
    message: "Hi, I saw the apartment on 21 Legacy Ave in Newton and I am interested in renting. Can I book a tour?",
    estimatedValue: "$5,500/mo",
    status: "qualified",
    priority: "high",
    qualificationScore: 75,
    aiSummary: "High-intent rental lead asking to book a tour for a specific property.",
    suggestedNextAction: "Confirm availability, move-in timeline, occupants, pets, and offer two showing times.",
    needsHumanAttention: false,
    questionsToAsk: [
      "When are you looking to move in?",
      "How many occupants will live there?",
      "Do you have pets or any special requirements?",
    ],
    createdAt: "2026-05-27T14:12:00.000Z",
  },
  {
    id: "demo-lead-002",
    fullName: "Marisol Rivera",
    phone: "(781) 555-0199",
    email: "marisol.demo@example.com",
    industry: "contractors",
    source: "missed call note",
    message: "Need an estimate for a small kitchen remodel. Hoping to start next month if pricing works.",
    estimatedValue: "$18,000",
    status: "qualified",
    priority: "medium",
    qualificationScore: 65,
    aiSummary: "Contractor lead requesting a kitchen remodel estimate with a near-term project timeline.",
    suggestedNextAction: "Confirm scope, location, budget range, and schedule an estimate call.",
    needsHumanAttention: false,
    questionsToAsk: [
      "What parts of the kitchen are being remodeled?",
      "What is your target budget?",
      "What days work for an estimate appointment?",
    ],
    createdAt: "2026-05-27T15:25:00.000Z",
  },
  {
    id: "demo-lead-003",
    fullName: "Trevor Blake",
    phone: "(857) 555-0122",
    email: null,
    industry: "security",
    source: "text message",
    message: "We need overnight security this weekend after a break-in. Can someone call me ASAP?",
    estimatedValue: "$2,400",
    status: "qualified",
    priority: "urgent",
    qualificationScore: 95,
    aiSummary: "Urgent security lead requesting weekend overnight coverage after a break-in.",
    suggestedNextAction: "Call immediately, confirm site location, number of guards, guard type, and shift hours.",
    needsHumanAttention: true,
    questionsToAsk: [
      "What location needs coverage?",
      "Do you need armed or unarmed guards?",
      "What hours need coverage this weekend?",
    ],
    createdAt: "2026-05-27T16:05:00.000Z",
  },
];

export const demoReviews: DemoReview[] = [
  {
    id: "demo-review-001",
    customerName: "Alyssa Grant",
    rating: 5,
    source: "Google Review",
    message: "Amazing service. They replied fast, answered every question, and made the process easy.",
    sentiment: "positive",
    priority: "low",
    suggestedResponse: "Hi Alyssa, thank you for the kind words. We appreciate you choosing Boston Premier Services and we are glad the process felt easy and responsive.",
    nextAction: "Review and publish the positive response.",
    createdAt: "2026-05-27T12:30:00.000Z",
  },
  {
    id: "demo-review-002",
    customerName: "Marcus Lee",
    rating: 2,
    source: "Google Review",
    message: "I called twice and nobody followed up. Very frustrating experience.",
    sentiment: "negative",
    priority: "high",
    suggestedResponse: "Hi Marcus, thank you for bringing this to our attention. We are sorry for the missed follow-up. Please contact us directly so we can review what happened and help resolve it.",
    nextAction: "Escalate to owner before publishing. Check call logs and follow up directly.",
    createdAt: "2026-05-27T13:45:00.000Z",
  },
];

export const demoScheduleRequests: DemoScheduleRequest[] = [
  {
    id: "demo-schedule-001",
    customerName: "Nadia Brooks",
    channel: "Website chat",
    requestedService: "Apartment tour",
    requestedTime: "Tomorrow afternoon",
    message: "Can I tour the Newton unit tomorrow afternoon after 3pm?",
    priority: "high",
    suggestedResponse: "Hi Nadia, thanks for reaching out. Tomorrow after 3pm may work. Can you confirm your best phone number and whether 3:30pm or 4:30pm is better?",
    nextAction: "Confirm showing availability and book the tour slot.",
    createdAt: "2026-05-27T17:05:00.000Z",
  },
  {
    id: "demo-schedule-002",
    customerName: "Keisha Martin",
    channel: "Instagram DM",
    requestedService: "Med spa consultation",
    requestedTime: "Friday morning",
    message: "Do you have any Friday morning openings for a consultation?",
    priority: "medium",
    suggestedResponse: "Hi Keisha, we can help with that. What treatment are you interested in, and would you prefer early morning or late morning Friday?",
    nextAction: "Ask treatment type and offer available Friday time windows.",
    createdAt: "2026-05-27T17:32:00.000Z",
  },
];

export const demoOrderRequests: DemoOrderRequest[] = [
  {
    id: "demo-order-001",
    customerName: "Derrick Hall",
    channel: "Email",
    requestType: "quote",
    message: "Can you send a quote for weekly cleaning service for a small office in Quincy?",
    estimatedValue: "$1,200/mo",
    priority: "medium",
    suggestedResponse: "Hi Derrick, thanks for reaching out. We can prepare a quote. How many square feet is the office, how many days per week do you need service, and what time of day works best?",
    nextAction: "Collect square footage, frequency, service window, and send estimate.",
    createdAt: "2026-05-27T18:00:00.000Z",
  },
  {
    id: "demo-order-002",
    customerName: "Priya Shah",
    channel: "Website form",
    requestType: "service_request",
    message: "Need someone to check a leaking sink. Is anyone available today?",
    estimatedValue: "$250",
    priority: "urgent",
    suggestedResponse: "Hi Priya, thanks for reaching out. We may be able to help today. Can you send the property address, a photo if possible, and the best callback number?",
    nextAction: "Escalate same-day service request and confirm location/contact details.",
    createdAt: "2026-05-27T18:18:00.000Z",
  },
];

export const demoDashboardMetrics = {
  totalLeads: demoLeads.length,
  urgentItems: demoLeads.filter((lead) => lead.priority === "urgent").length + demoOrderRequests.filter((request) => request.priority === "urgent").length,
  reviewsPending: demoReviews.length,
  scheduleRequests: demoScheduleRequests.length,
  orderRequests: demoOrderRequests.length,
  estimatedOpenOpportunity: "$27,350+",
};

export const frontlineDemoData = {
  account: demoAccount,
  leads: demoLeads,
  reviews: demoReviews,
  scheduleRequests: demoScheduleRequests,
  orderRequests: demoOrderRequests,
  metrics: demoDashboardMetrics,
};
