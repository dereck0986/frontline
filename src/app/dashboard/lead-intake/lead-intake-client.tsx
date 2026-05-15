"use client";

import { useState } from "react";

type LeadResult = {
  fullName: string;
  priority: string;
  qualificationScore: number;
  aiSummary: string;
  suggestedNextAction: string;
  needsHumanAttention: boolean;
  questionsToAsk: string[];
};

export function LeadIntakeClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LeadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      industry: String(formData.get("industry") ?? "real_estate"),
      source: String(formData.get("source") ?? "manual"),
      estimatedValue: String(formData.get("estimatedValue") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Lead qualification failed.");
      }

      setResult(data.lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <form action={handleSubmit} className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Capture a Lead</h2>
        <p className="text-sm text-gray-500 mt-1">Manual intake stays active until Twilio and VAPI are connected.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <input name="fullName" required className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Full name" />
          <input name="phone" className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Phone" />
          <input name="email" type="email" className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Email" />
          <select name="industry" className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white" defaultValue="real_estate">
            <option value="real_estate">Real Estate</option>
            <option value="security">Security</option>
            <option value="contractors">Contractors</option>
            <option value="med_spas">Med Spas</option>
            <option value="rentals">Rentals</option>
          </select>
          <input name="source" className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Lead source" defaultValue="manual" />
          <input name="estimatedValue" className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Estimated value" />
        </div>

        <textarea name="message" required className="mt-4 min-h-32 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Lead message, missed-call notes, form submission, or inquiry..." />

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-4 flex justify-end">
          <button disabled={loading} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {loading ? "Qualifying..." : "Qualify Lead"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">AI Qualification Result</h2>
        <p className="text-sm text-gray-500 mt-1">Live response from the lead creation endpoint.</p>

        {result ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-sm text-emerald-700 font-semibold">Score: {result.qualificationScore}/100</p>
              <p className="text-sm text-gray-700 mt-2">{result.aiSummary}</p>
            </div>
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-3">
              <p className="text-xs font-semibold text-orange-700">Priority</p>
              <p className="text-sm text-gray-800 capitalize">{result.priority}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">Suggested Next Action</p>
              <p className="text-sm text-gray-800">{result.suggestedNextAction}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Questions to ask</p>
              <div className="mt-2 space-y-2">
                {result.questionsToAsk.map((question) => (
                  <div key={question} className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-sm text-gray-700">{question}</div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
            Submit a lead to see scoring, priority, summary, and next questions.
          </div>
        )}
      </div>
    </div>
  );
}
