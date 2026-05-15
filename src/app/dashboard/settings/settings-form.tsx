"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateBusinessAction, type SettingsState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Business } from "@/lib/db";
import type { ToneProfile } from "@/types/database";

const INDUSTRIES = [
  { value: "real_estate", label: "Real Estate" },
  { value: "security", label: "Security Company" },
  { value: "contractors", label: "Contractors" },
  { value: "med_spas", label: "Med Spas" },
  { value: "rentals", label: "Rentals / Property Management" },
  { value: "other", label: "Other" },
];

const TONES: { value: ToneProfile; label: string; description: string }[] = [
  { value: "professional", label: "Professional", description: "Formal and authoritative" },
  { value: "friendly", label: "Friendly", description: "Warm and conversational" },
  { value: "apologetic", label: "Apologetic", description: "Empathetic and solution-focused" },
  { value: "bold", label: "Bold", description: "Confident and direct" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" loading={pending}>Save Changes</Button>;
}

export function SettingsForm({ business }: { business: Business }) {
  const [selectedTone, setSelectedTone] = useState<ToneProfile>(business.tone);
  const [state, formAction] = useFormState<SettingsState, FormData>(updateBusinessAction, {});

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={business.id} />
      <input type="hidden" name="tone" value={selectedTone} />

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Business Identity</h2>
            <p className="text-sm text-gray-500 mt-1">This is the operational profile Frontline uses for lead routing and follow-up.</p>
          </div>
          <Badge variant="info">Manual-Assisted Mode</Badge>
        </div>
        <div className="space-y-4">
          <Input id="name" name="name" label="Business Name" defaultValue={business.name} required />
          <Select id="industry" name="industry" label="Industry" defaultValue={business.industry} options={INDUSTRIES} required />
          <Input id="location" name="location" label="Service Area / Location" defaultValue={business.location} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="businessEmail" name="businessEmail" label="Business Email" placeholder="contact@company.com" />
            <Input id="businessPhone" name="businessPhone" label="Business Phone" placeholder="617-555-1234" />
          </div>
          <Input id="website" name="website" label="Website or Booking Link" placeholder="https://company.com" />
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-2">Automation Mode</h2>
        <p className="text-sm text-gray-500 mb-4">Frontline launches in Manual-Assisted AI Mode. Twilio and VAPI activate later as paid upgrades.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-900">Manual</p>
            <p className="text-xs text-emerald-700 mt-1">AI scripts + owner sends manually.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 opacity-70">
            <p className="font-semibold text-gray-900">Twilio</p>
            <p className="text-xs text-gray-500 mt-1">SMS/call automation after revenue.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 opacity-70">
            <p className="font-semibold text-gray-900">VAPI</p>
            <p className="text-xs text-gray-500 mt-1">Voice workflows for premium clients.</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Default Tone Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TONES.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => setSelectedTone(tone.value)}
              className={cn("p-4 rounded-xl border-2 text-left transition-all", selectedTone === tone.value ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300")}
            >
              <div className="font-semibold text-sm text-gray-900">{tone.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{tone.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {state?.success && <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">Settings saved successfully.</p>}
      {state?.error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}
