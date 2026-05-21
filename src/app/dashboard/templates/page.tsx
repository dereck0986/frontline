import { INDUSTRY_QUESTIONS } from "@/lib/lead-qualification";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Industry Templates</h1>
        <p className="text-gray-500 mt-1">
          Frontline qualification logic for each business category.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(INDUSTRY_QUESTIONS).map(([industry, questions]) => (
          <div
            key={industry}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {industry.replace(/_/g, " ")}
            </h2>

            <div className="mt-4 space-y-3">
              {questions.map((question) => (
                <div
                  key={question}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700"
                >
                  {question}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
