export default function LegalTermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Frontline</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: May 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-6 text-gray-700">
          <section><h2 className="text-lg font-semibold text-gray-900">Use of Service</h2><p className="mt-2">Frontline provides AI-assisted workflow tools intended to support business operations. Users remain responsible for reviewing communications and business decisions before taking action.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900">Pilot Features</h2><p className="mt-2">Some features may be provided as pilot, beta, or demonstration functionality and may change over time.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900">AI Generated Content</h2><p className="mt-2">AI-generated drafts, recommendations, summaries, and classifications should be reviewed by the user before use with customers or business partners.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900">Availability</h2><p className="mt-2">We may modify, suspend, improve, or discontinue features at any time while the platform evolves.</p></section>
          <section><h2 className="text-lg font-semibold text-gray-900">Contact</h2><p className="mt-2">Questions about these terms may be submitted through the contact page.</p></section>
        </div>
      </div>
    </main>
  );
}
