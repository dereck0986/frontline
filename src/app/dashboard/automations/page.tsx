const sequence = [
  "0 min → instant response",
  "15 min → reminder",
  "2 hrs → soft follow-up",
  "24 hrs → value follow-up",
  "3 days → re-engagement",
  "7 days → nurture/recycle",
];

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
        <p className="text-gray-500 mt-1">
          Frontline lead recovery workflow engine.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-orange-300 bg-orange-50 p-4 text-sm text-orange-700">
        Live Twilio and VAPI automation is coming soon. This page currently demonstrates the follow-up logic structure.
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Default Recovery Sequence
        </h2>

        <div className="mt-6 space-y-4">
          {sequence.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                {index + 1}
              </div>

              <div>
                <p className="font-medium text-gray-900">{step}</p>
                <p className="text-sm text-gray-500 mt-1">
                  AI-driven engagement workflow stage.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
