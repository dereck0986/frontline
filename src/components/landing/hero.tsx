import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BellRing, PhoneCall, TrendingUp, Zap } from "lucide-react";

const STATS = [
  { label: "Avg. first response", value: "8 seconds" },
  { label: "Follow-up sequence", value: "7 days" },
  { label: "Revenue recovery focus", value: "24/7" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-50 blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-50 blur-3xl opacity-40 -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm text-brand-700 font-medium mb-8">
            <Zap size={14} className="fill-brand-600 text-brand-600" />
            AI lead follow-up in seconds
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight text-balance mb-6">
            Recover lost leads before they become{" "}
            <span className="gradient-text">lost revenue</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 text-balance">
            Frontline instantly responds to new leads, qualifies them with AI,
            triggers follow-up, books appointments, and keeps owners informed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Start Recovering Leads
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See how it works
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 relative max-w-3xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400">
                Frontline Lead Command Center
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
                <PhoneCall size={18} className="text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    New missed call from a high-intent lead asking for a quote
                    and availability this week.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Website form + missed call — 2 minutes ago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp size={16} className="text-brand-600" />
                <span>Qualifying lead and preparing follow-up...</span>
                <div className="flex gap-1 ml-auto">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Lead score: 87/100. Priority: High. Suggested next action:
                  ask for timeline, confirm budget, and offer two appointment
                  windows.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-medium text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                    AI qualified
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-orange-600 ml-auto">
                    <BellRing size={12} /> Owner alert ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
