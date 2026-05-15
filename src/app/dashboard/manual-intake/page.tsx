"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

type IntakeResult = {
  id: string;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  industry: string;
  priority: string;
  qualificationScore: number;
  aiSummary: string;
  suggestedNextAction: string;
  needsHumanAttention: boolean;
  questionsToAsk: string[];
};

function buildSms(result: IntakeResult) {
  return `Hi ${result.fullName}, this is the team following up on your request. We received your message and can help. When is the best time for a quick call today?`;
}

function buildEmail(result: IntakeResult) {
  return `Subject: Following up on your request\n\nHi ${result.fullName},\n\nThanks for reaching out. We reviewed your request and would like to help.\n\nA quick next step would be to confirm a few details so we can point you in the right direction.\n\nBest,\nThe Team`;
}

function buildCallOpener(result: IntakeResult) {
  return `Hey ${result.fullName}, thanks for reaching out. I saw your request come through and wanted to ask a few quick questions so we can understand exactly what you need and how urgent it is.`;
}

export default function ManualIntakePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntakeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      industry: String(formData.get("industry") || "real_estate"),
      source: String(formData.get("source") || "manual"),
      estimatedValue: String(formData.get("estimatedValue") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Lead qualification failed.");
      }

      setResult(data.lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-800">Manual-Assisted AI Mode Active</p>
        <p className="mt-1 text-sm text-emerald-700">
          Frontline qualifies the lead and generates scripts. The owner sends the message or makes the call manually until Twilio is activated after first revenue.
        </p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Intake</h1>
        <p className="text-gray-500 mt-1">Capture, qualify, and create copy-ready follow-up actions.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Full Name</span>
              <input name="fullName" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Robert James" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <input name="phone" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="617-555-1234" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input name="email" type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="lead@example.com" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Industry</span>
              <select name="industry" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="real_estate">Real Estate</option>
                <option value="security">Security</option>
                <option value="contractors">Contractors</option>
                <option value="med_spas">Med Spas</option>
                <option value="rentals">Rentals</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Source</span>
              <input name="source" defaultValue="manual" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Estimated Value</span>
              <input name="estimatedValue" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="4500" />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-sm font-medium text-gray-700">Lead Message</span>
            <textarea name="message" required rows={5} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="I need overnight security for my warehouse this weekend. We had two break-ins recently and need help ASAP." />
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <Button disabled={loading} className="w-full sm:w-auto">
            {loading ? "Qualifying..." : "Qualify Lead"}
          </Button>
        </form>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">AI Qualification</h2>
          {!result ? (
            <p className="mt-3 text-sm text-gray-500">Submit a lead to generate a qualification result and manual follow-up scripts.</p>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-xs text-emerald-700">Score</p>
                  <p className="text-xl font-bold text-emerald-800">{result.qualificationScore}/100</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-3">
                  <p className="text-xs text-orange-700">Priority</p>
                  <p className="text-xl font-bold text-orange-800 capitalize">{result.priority}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">AI Summary</p>
                <p className="mt-1 text-sm text-gray-600">{result.aiSummary}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Next Action</p>
                <p className="mt-1 text-sm text-gray-600">{result.suggestedNextAction}</p>
              </div>
              {result.phone && (
                <a href={`tel:${result.phone}`} className="block rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white">Tap to Call Lead</a>
              )}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-gray-900">Copy-ready SMS</h3>
            <p className="mt-3 text-sm text-gray-600">{buildSms(result)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-gray-900">Email Reply</h3>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-600 font-sans">{buildEmail(result)}</pre>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-gray-900">Call Opener</h3>
            <p className="mt-3 text-sm text-gray-600">{buildCallOpener(result)}</p>
            <h4 className="mt-4 text-sm font-semibold text-gray-900">Questions</h4>
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
              {result.questionsToAsk.map((question) => <li key={question}>{question}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
