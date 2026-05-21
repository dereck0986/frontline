"use client";

import { useState } from "react";

const STORAGE_KEY = "frontline_demo_qualified_leads";

type QualificationResult = {
  summary: string;
  score: number;
  priority: string;
  suggested_next_action?: string;
  suggestedNextAction?: string;
};

type SavedLeadResult = {
  fullName: string;
  qualification?: QualificationResult;
  aiSummary?: string;
  qualificationScore?: number;
  priority?: string;
  suggestedNextAction?: string;
};

const industryOptions = [
  { value: "real_estate", label: "Real Estate" },
  { value: "rentals", label: "Rentals" },
  { value: "security", label: "Security" },
  { value: "contractors", label: "Contractors" },
  { value: "med_spas", label: "Med Spas" },
];

function saveLeadToLocalStorage(lead: unknown) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  localStorage.setItem(STORAGE_KEY, JSON.stringify([lead, ...existing]));
}

export default function ManualIntakePage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    industry: "real_estate",
    source: "manual",
    estimatedValue: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SavedLeadResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : 0,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Lead submission failed");
      }

      saveLeadToLocalStorage(data.lead);
      setResult(data.lead);

      setForm({
        fullName: "",
        phone: "",
        email: "",
        industry: "real_estate",
        source: "manual",
        estimatedValue: "",
        message: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lead submission failed");
    } finally {
      setLoading(false);
    }
  }

  const summary = result?.qualification?.summary ?? result?.aiSummary ?? "";
  const score = result?.qualification?.score ?? result?.qualificationScore ?? 0;
  const priority = result?.qualification?.priority ?? result?.priority ?? "medium";
  const nextAction =
    result?.qualification?.suggested_next_action ??
    result?.qualification?.suggestedNextAction ??
    result?.suggestedNextAction ??
    "Follow up with the lead and confirm next steps.";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Manual Assisted AI
        </p>
        <h1 className="text-3xl font-bold text-slate-950">Manual Lead Intake</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Paste a lead message from a call, text, DM, voicemail, form submission, or notes from a conversation.
          Frontline will qualify it and save it to Lead Records for this demo session.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Lead Name
            <input required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Ian Vaugh" />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Phone
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="(555) 555-5555" />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Email
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="lead@example.com" />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Industry
            <select value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
              {industryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Source
            <input value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="manual, missed call, DM, form" />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Estimated Value
            <input type="number" value={form.estimatedValue} onChange={(event) => setForm({ ...form, estimatedValue: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="5500" />
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Lead Request / Customer Message
          <textarea required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Example: Customer called asking to rent the property at 21 Kwann St and wants to know the next steps." />
          <span className="block text-xs text-slate-500">
            Paste what the lead said — form submission, text, DM, voicemail summary, missed-call notes, or rough notes from a conversation.
          </span>
        </label>

        <button disabled={loading} className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto">
          {loading ? "Qualifying lead..." : "Qualify Lead"}
        </button>
      </form>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {result && (
        <div className="rounded-3xl border border-green-200 bg-green-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">Saved to Lead Records</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{result.fullName}</h2>
          <p className="mt-2 text-slate-700">{summary}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs uppercase text-slate-500">Score</p>
              <p className="text-2xl font-bold text-slate-950">{score}/100</p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs uppercase text-slate-500">Priority</p>
              <p className="text-2xl font-bold capitalize text-slate-950">{priority}</p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs uppercase text-slate-500">Next Action</p>
              <p className="text-sm font-semibold text-slate-950">{nextAction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}