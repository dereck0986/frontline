"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createBusinessAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Building2, MapPin, Briefcase, MessageSquare, Phone, Mail, Globe } from "lucide-react";
import type { ToneProfile } from "@/types/database";

const INDUSTRIES = [
  { value: "", label: "Select an industry" },
  { value: "real_estate", label: "Real Estate" },
  { value: "security", label: "Security Company" },
  { value: "contractors", label: "Contractors" },
  { value: "med_spas", label: "Med Spas" },
  { value: "rentals", label: "Rentals / Property Management" },
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
  return <Button type="submit" loading={pending} className="w-full" size="lg">Complete Setup</Button>;
}

export function OnboardingForm({ userId }: { userId: string }) {
  const [selectedTone, setSelectedTone] = useState<ToneProfile>("professional");

  return (
    <form action={createBusinessAction} className="space-y-6">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="tone" value={selectedTone} />

      <div className="flex items-center gap-3">
        <Building2 size={18} className="text-brand-600 shrink-0" />
        <Input id="name" name="name" label="Business Name" placeholder="Apex Roofing" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <Mail size={18} className="text-brand-600 shrink-0 mt-6" />
          <Input id="businessEmail" name="businessEmail" type="email" label="Business Email" placeholder="contact@apexroofing.com" required />
        </div>
        <div className="flex items-center gap-3">
          <Phone size={18} className="text-brand-600 shrink-0 mt-6" />
          <Input id="businessPhone" name="businessPhone" label="Business Phone" placeholder="617-555-1234" required />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Briefcase size={18} className="text-brand-600 shrink-0 mt-6" />
        <Select id="industry" name="industry" label="Industry" options={INDUSTRIES} required />
      </div>

      <div className="flex items-center gap-3">
        <MapPin size={18} className="text-brand-600 shrink-0 mt-6" />
        <Input id="location" name="location" label="Service Area / Location" placeholder="Boston Metro" required />
      </div>

      <div className="flex items-center gap-3">
        <Globe size={18} className="text-brand-600 shrink-0 mt-6" />
        <Input id="website" name="website" label="Website or Booking Link" placeholder="https://apexroofing.com" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={18} className="text-brand-600" />
          <label className="text-sm font-medium text-gray-700">Default Tone Profile</label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TONES.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => setSelectedTone(tone.value)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                selectedTone === tone.value ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300"
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
