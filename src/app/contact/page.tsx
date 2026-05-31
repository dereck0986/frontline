export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Frontline</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Contact</h1>
        <p className="mt-3 text-sm text-gray-500">Pilot access, partnership inquiries, implementation questions, and support.</p>

        <div className="mt-8 space-y-6 text-sm text-gray-700">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900">Request Pilot Access</h2>
            <p className="mt-2">Interested businesses can request onboarding, implementation assistance, or pilot access for Frontline.</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900">Support</h2>
            <p className="mt-2">Questions about operations workflows, lead handling, reviews, scheduling, or service requests can be routed through the Frontline team.</p>
          </div>

          <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
            <h2 className="font-semibold text-gray-900">Current Status</h2>
            <p className="mt-2">Frontline is currently operating in pilot mode while integrations and production workflows continue to expand.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
