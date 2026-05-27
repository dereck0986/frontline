"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bot, CalendarDays, CheckCircle2, ClipboardList, MessageSquareReply, Users } from "lucide-react";

const WORKFLOW_STEPS = [
  {
    type: "Lead",
    icon: Users,
    title: "Rental lead captured",
    message: "Customer asks to book a tour for 21 Legacy Ave tomorrow.",
    classification: "Intent: rental tour",
    priority: "High",
    response: "Confirm move-in timeline, occupants, pets, and offer two showing windows.",
    tone: "orange",
  },
  {
    type: "Review",
    icon: MessageSquareReply,
    title: "Negative review detected",
    message: "Customer says nobody followed up after two calls.",
    classification: "Sentiment: negative",
    priority: "High",
    response: "Draft apology, flag owner review, and recommend direct follow-up before publishing.",
    tone: "purple",
  },
  {
    type: "Scheduling",
    icon: CalendarDays,
    title: "Appointment request routed",
    message: "Customer asks for a consultation this Friday morning.",
    classification: "Intent: booking",
    priority: "Medium",
    response: "Ask preferred time window and confirm appointment type.",
    tone: "indigo",
  },
  {
    type: "Service Request",
    icon: ClipboardList,
    title: "Urgent service request escalated",
    message: "Customer needs help with a leaking sink today.",
    classification: "Intent: urgent service",
    priority: "Urgent",
    response: "Request address, photo, callback number, and alert human operator.",
    tone: "red",
  },
];

function getToneClasses(tone: string) {
  if (tone === "red") return "border-red-200 bg-red-50 text-red-700";
  if (tone === "purple") return "border-purple-200 bg-purple-50 text-purple-700";
  if (tone === "indigo") return "border-indigo-200 bg-indigo-50 text-indigo-700";
  return "border-orange-200 bg-orange-50 text-orange-700";
}

export function OperationsDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = WORKFLOW_STEPS[activeIndex];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % WORKFLOW_STEPS.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  const completedCount = useMemo(() => activeIndex + 1, [activeIndex]);

  return (
    <section className="bg-gray-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-300">Live workflow simulation</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Watch Frontline turn scattered customer activity into clear next actions.
          </h2>
          <p className="mt-4 text-gray-400">
            This demo shows the manual-assisted AI workflow: classify the message, prioritize it, draft the response, and route the owner to the right action.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-white">Incoming activity</p>
                <p className="text-xs text-gray-400">Mocked demo stream</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">Running</span>
            </div>

            <div className="mt-5 space-y-3">
              {WORKFLOW_STEPS.map((step, index) => {
                const Icon = step.icon;
                const selected = index === activeIndex;
                return (
                  <button
                    key={step.title}
                    onClick={() => setActiveIndex(index)}
                    className={`w-full rounded-xl border p-4 text-left transition ${selected ? "border-brand-400 bg-brand-500/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg border p-2 ${getToneClasses(step.tone)}`}>
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{step.title}</p>
                        <p className="mt-1 text-xs text-gray-400">{step.message}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white p-6 text-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl border p-3 ${getToneClasses(active.tone)}`}>
                  <ActiveIcon size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">AI Operations Engine</p>
                  <p className="text-xs text-gray-500">Processing {active.type.toLowerCase()} workflow</p>
                </div>
              </div>
              <Bot className="text-brand-600" size={24} />
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer message</p>
                <p className="mt-2 text-sm text-gray-700">{active.message}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Classification</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{active.classification}</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Priority</p>
                  <p className="mt-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">{active.priority}</p>
                </div>
              </div>

              <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Suggested owner action</p>
                <p className="mt-2 text-sm text-gray-800">{active.response}</p>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-950 p-4 text-white">
                <div className="flex items-center gap-2">
                  {active.priority === "Urgent" ? <AlertTriangle className="text-red-300" size={18} /> : <CheckCircle2 className="text-emerald-300" size={18} />}
                  <span className="text-sm font-medium">{active.priority === "Urgent" ? "Human escalation recommended" : "Response draft ready"}</span>
                </div>
                <span className="text-xs text-gray-400">{completedCount}/{WORKFLOW_STEPS.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
