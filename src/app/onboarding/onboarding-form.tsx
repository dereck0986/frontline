"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Building2, MapPin, Briefcase, MessageSquare } from "lucide-react";
import type { ToneProfile } from "@/types/database";

const schema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  tone: z.enum(["professional", "friendly", "apologetic", "bold"]),
});

type FormData = z.infer<typeof schema>;

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

export function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tone: "professional" },
  });

  const selectedTone = watch("tone");

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    const res = await fetch("/api/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...data }),
    });

    if (!res.ok) {
      const body = await res.json();
      setServerError(body.error ?? "Something went wrong");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Building2 size={18} className="text-brand-600" />
        <Input
          id="name"
          label="Business Name"
          placeholder="Acme Coffee Co."
          error={errors.name?.message}
          {...register("name")}
        />
      </div>

      <div className="flex items-center gap-3">
        <Briefcase size={18} className="text-brand-600 shrink-0 mt-6" />
        <Select
          id="industry"
          label="Industry"
          options={INDUSTRIES}
          error={errors.industry?.message}
          {...register("industry")}
        />
      </div>

      <div className="flex items-center gap-3">
        <MapPin size={18} className="text-brand-600 shrink-0 mt-6" />
        <Input
          id="location"
          label="Location (City, State)"
          placeholder="Austin, TX"
          error={errors.location?.message}
          {...register("location")}
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
      </div>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {serverError}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        Complete Setup
      </Button>
    </form>
  );
}
