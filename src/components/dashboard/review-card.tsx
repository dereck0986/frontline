"use client";

import { useState } from "react";
import { Star, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRelativeDate } from "@/lib/utils";
import type { Database, ReviewStatus } from "@/types/database";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

const STATUS_VARIANT: Record<ReviewStatus, "default" | "warning" | "success" | "error" | "info"> = {
  pending: "warning",
  responded: "info",
  published: "success",
};

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!review.ai_response) return;
    await navigator.clipboard.writeText(review.ai_response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Stars */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={cn(
                    i < review.star_rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200"
                  )}
                />
              ))}
            </div>
            <Badge variant={STATUS_VARIANT[review.status]}>
              {review.status}
            </Badge>
            <Badge variant="default">{review.tone}</Badge>
            <span className="text-xs text-gray-400 ml-auto">
              {formatRelativeDate(review.created_at)}
            </span>
          </div>

          {/* Review text */}
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
            {review.review_text}
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 p-1 text-gray-400 hover:text-gray-600"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expanded AI response */}
      {expanded && review.ai_response && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              AI Response
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 h-7 gap-1"
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
          </div>
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
            {review.ai_response}
          </p>
        </div>
      )}

      {expanded && !review.ai_response && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400 italic">No AI response yet.</p>
        </div>
      )}
    </div>
  );
}
