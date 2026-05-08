import { Bot, Clock, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Bot,
    title: "AI-Powered Responses",
    description:
      "Claude AI crafts contextually aware, empathetic responses that match your brand voice perfectly — every single time.",
    color: "text-brand-600",
    bg: "bg-brand-50",
  },
  {
    icon: Clock,
    title: "Respond in Seconds",
    description:
      "No more spending hours crafting the perfect reply. Generate professional responses in under 10 seconds and keep your ratings climbing.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Shield,
    title: "Tone Profiles",
    description:
      "Choose from Professional, Friendly, Apologetic, or Bold — or mix and match per review type to fit your brand personality.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const PROBLEM_SOLUTION = [
  {
    problem: "You ignore bad reviews",
    solution: "Respond confidently to every 1-star review",
  },
  {
    problem: "Hours wasted writing responses",
    solution: "8-second AI generation, every time",
  },
  {
    problem: "Generic copy-paste replies",
    solution: "Context-aware, personalized responses",
  },
  {
    problem: "Inconsistent brand voice",
    solution: "Locked-in tone profiles across your team",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Problem / Solution */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Stop losing customers to bad review management
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Most businesses leave reviews unanswered. The ones that respond
            win.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-24">
          {PROBLEM_SOLUTION.map((item) => (
            <div
              key={item.problem}
              className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200"
            >
              <div className="shrink-0 mt-0.5">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-xs font-bold">✗</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 line-through">
                  {item.problem}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-emerald-600 text-xs font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.solution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Core Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Everything you need to manage your reputation
          </h2>
          <p className="text-lg text-gray-500">
            Built for businesses that care about every customer interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6`}
              >
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
