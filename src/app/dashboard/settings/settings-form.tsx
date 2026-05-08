"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Business } from "@/lib/db";
import type { ToneProfile } from "@/types/database";

const schema = z.object({
  name: z.string().min(2),
  industry: z.string().min(1),
  location: z.string().min(2),
  tone: z.enum(["professional", "friendly", "apologetic", "bold"]),
});

type FormData = z.infer<typeof schema>;

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

export function SettingsForm({ business }: { business: Business }) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: business.name,
      industry: business.industry,
      location: business.location,
      tone: business.tone,
    },
  });

  const selectedTone = watch("tone");

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSuccess(false);

    const res = await fetch("/api/business", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: business.id, ...data }),
    });

    if (!res.ok) {
      const body = await res.json();
      setServerError(body.error ?? "Failed to save settings");
      return;
    }

    setSuccess(true);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Business Details
        </h2>
        <div className="space-y-4">
          <Input
            id="name"
            label="Business Name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Select
            id="industry"
            label="Industry"
            options={INDUSTRIES}
            error={errors.industry?.message}
            {...register("industry")}
          />
          <Input
            id="location"
            label="Location"
            error={errors.location?.message}
            {...register("location")}
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
              onClick={() => setValue("tone", tone.value)}
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

      {success && (
        <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          Settings saved successfully.
        </p>
      )}
      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {serverError}
        </p>
      )}

      <Button type="submit" loading={isSubmitting}>
        Save Changes
      </Button>
    </form>
  );
}
