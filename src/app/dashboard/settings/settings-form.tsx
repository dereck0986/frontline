"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateBusinessAction, type SettingsState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Business } from "@/lib/db";
import type { ToneProfile } from "@/types/database";

const INDUSTRIES = [
  { value: "restaurant", label: "Restaurant / Food & Beverage" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "hotel", label: "Hotel / Hospitality" },
  { value: "salon", label: "Salon / Beauty" },
  { value: "automotive", label: "Automotive" },
  { value: "fitness", label: "Fitness / Gym" },
  { value: "legal", label: "Legal Services" },
  { value: "finance", label: "Finance / Accounting" },
  { value: "realestate", label: "Real Estate" },
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
  return (
    <Button type="submit" loading={pending}>
      Save Changes
    </Button>
  );
}

export function SettingsForm({ business }: { business: Business }) {
  const [selectedTone, setSelectedTone] = useState<ToneProfile>(business.tone);
  const [state, formAction] = useFormState<SettingsState, FormData>(
    updateBusinessAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={business.id} />
      <input type="hidden" name="tone" value={selectedTone} />

      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Business Details
        </h2>
        <div className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Business Name"
            defaultValue={business.name}
            required
          />
          <Select
            id="industry"
            name="industry"
            label="Industry"
            defaultValue={business.industry}
            options={INDUSTRIES}
            required
          />
          <Input
            id="location"
            name="location"
            label="Location"
            defaultValue={business.location}
            required
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Default Tone Profile
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {TONES.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => setSelectedTone(tone.value)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                selectedTone === tone.value
                  ? "border-brand-600 bg-brand-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="font-semibold text-sm text-gray-900">{tone.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{tone.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {state?.success && (
        <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          Settings saved successfully.
        </p>
      )}
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
