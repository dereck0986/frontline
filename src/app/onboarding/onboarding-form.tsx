"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createBusinessAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Building2, MapPin, Briefcase, MessageSquare } from "lucide-react";
import type { ToneProfile } from "@/types/database";

const INDUSTRIES = [
  { value: "", label: "Select an industry" },
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
  { value: "professional", label: "Professional", description: "Formal, polished, and authoritative" },
  { value: "friendly", label: "Friendly", description: "Warm, approachable, and conversational" },
  { value: "apologetic", label: "Apologetic", description: "Empathetic, understanding, and solution-focused" },
  { value: "bold", label: "Bold", description: "Confident, direct, and memorable" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full" size="lg">
      Complete Setup
    </Button>
  );
}

export function OnboardingForm({ userId }: { userId: string }) {
  const [selectedTone, setSelectedTone] = useState<ToneProfile>("professional");

  return (
    <form action={createBusinessAction} className="space-y-6">
      {/* Hidden userId */}
      <input type="hidden" name="userId" value={userId} />
      {/* Hidden tone — updated by button clicks */}
      <input type="hidden" name="tone" value={selectedTone} />

      <div className="flex items-center gap-3">
        <Building2 size={18} className="text-brand-600 shrink-0" />
        <Input id="name" name="name" label="Business Name" placeholder="Acme Coffee Co." required />
      </div>

      <div className="flex items-center gap-3">
        <Briefcase size={18} className="text-brand-600 shrink-0 mt-6" />
        <Select
          id="industry"
          name="industry"
          label="Industry"
          options={INDUSTRIES}
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <MapPin size={18} className="text-brand-600 shrink-0 mt-6" />
        <Input
          id="location"
          name="location"
          label="Location (City, State)"
          placeholder="Austin, TX"
          required
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={18} className="text-brand-600" />
          <label className="text-sm font-medium text-gray-700">
            Default Tone Profile
          </label>
        </div>
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
      </div>

      <SubmitButton />
    </form>
  );
}
