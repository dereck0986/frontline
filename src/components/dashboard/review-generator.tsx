"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Sparkles, Star, Copy, Check, Save } from "lucide-react";
import type { ToneProfile } from "@/types/database";

const schema = z.object({
  review_text: z.string().min(10, "Review must be at least 10 characters"),
  star_rating: z.coerce.number().min(1).max(5),
  tone: z.enum(["professional", "friendly", "apologetic", "bold"]),
});

type FormData = z.infer<typeof schema>;

const TONES: { value: ToneProfile; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "apologetic", label: "Apologetic" },
  { value: "bold", label: "Bold" },
];

interface ReviewGeneratorProps {
  businessId: string;
  defaultTone: ToneProfile;
}

export function ReviewGenerator({
  businessId,
  defaultTone,
}: ReviewGeneratorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(
    null
  );
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState(0);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        tone: defaultTone,
        star_rating: 0,
      },
    });

  const selectedTone = watch("tone");
  const selectedStars = watch("star_rating");

  const onSubmit = async (data: FormData) => {
    setError(null);
    setGeneratedResponse(null);
    setSaved(false);
    setGenerating(true);

    try {
      const res = await fetch("/api/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review_text: data.review_text,
          star_rating: data.star_rating,
          tone: data.tone,
          business_id: businessId,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to generate response");
      }

      const { response, review_id } = await res.json();
      setGeneratedResponse(response);
      setReviewId(review_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedResponse) return;
    await navigator.clipboard.writeText(generatedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!reviewId) return;
    setSaving(true);

    const { error } = await supabase
      .from("reviews")
      .update({ status: "responded" })
      .eq("id", reviewId);

    if (!error) {
      setSaved(true);
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Star rating */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Star Rating
          </label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const val = i + 1;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setValue("star_rating", val)}
                  onMouseEnter={() => setHoveredStar(val)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={28}
                    className={cn(
                      "transition-colors",
                      val <= (hoveredStar || selectedStars)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200 hover:text-yellow-300"
                    )}
                  />
                </button>
              );
            })}
          </div>
          {errors.star_rating && (
            <p className="text-xs text-red-600 mt-1">Please select a rating</p>
          )}
        </div>

        {/* Tone */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Response Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((tone) => (
              <button
                key={tone.value}
                type="button"
                onClick={() => setValue("tone", tone.value)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
                  selectedTone === tone.value
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>

        {/* Review text */}
        <Textarea
          id="review_text"
          label="Paste the customer review"
          placeholder="The service was terrible and we waited over an hour for our food..."
          rows={5}
          error={errors.review_text?.message}
          {...register("review_text")}
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          loading={generating}
          size="lg"
          className="w-full gap-2"
        >
          <Sparkles size={18} />
          {generating ? "Generating response..." : "Generate AI Response"}
        </Button>
      </form>

      {/* Generated Response */}
      {generatedResponse && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-600" />
              <span className="text-sm font-semibold text-brand-700">
                AI Response
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-gray-600"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy
                  </>
                )}
              </Button>
              {!saved && (
                <Button
                  size="sm"
                  className="h-7 gap-1"
                  onClick={handleSave}
                  loading={saving}
                >
                  <Save size={13} /> Save
                </Button>
              )}
              {saved && (
                <span className="text-sm text-emerald-600 font-medium">
                  ✓ Saved
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {generatedResponse}
          </p>
        </div>
      )}
    </div>
  );
}
