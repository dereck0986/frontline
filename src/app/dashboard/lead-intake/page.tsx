const questions = [
  "What service does the lead need?",
  "How urgent is the request?",
  "What budget or project value is attached?",
];

export default function LeadIntakePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Intake</h1>
        <p className="text-gray-500 mt-1">Manual lead capture and AI qualification preview.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Capture a Lead</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Full name" />
            <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Phone" />
            <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Email" />
            <select className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white" defaultValue="real_estate">
              <option value="real_estate">Real Estate</option>
              <option value="security">Security</option>
              <option value="contractors">Contractors</option>
              <option value="med_spas">Med Spas</option>
              <option value="rentals">Rentals</option>
            </select>
          </div>
          <textarea className="mt-4 min-h-32 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Lead message or missed-call notes..." />
          <div className="mt-4 flex justify-end">
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Qualify Lead</button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">AI Preview</h2>
          <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
            <p className="text-sm text-emerald-700 font-semibold">Score: 87/100</p>
            <p className="text-sm text-gray-700 mt-2">High-intent lead. Follow up fast and offer appointment windows.</p>
          </div>
          <div className="mt-5 space-y-2">
            {questions.map((question) => (
              <div key={question} className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-sm text-gray-700">{question}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
