export default function LegalPrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Frontline</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: May 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-6 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            <p className="mt-2">Frontline is an AI-assisted business operations platform for lead handling, review responses, scheduling requests, and customer service workflows. This policy explains how information submitted through Frontline may be handled.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Information We May Collect</h2>
            <p className="mt-2">We may collect account details, business profile information, customer messages submitted by users, workflow notes, and technical information needed to operate and improve the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Demo Data</h2>
            <p className="mt-2">Demo screens may display mocked leads, reviews, scheduling requests, and service requests. Demo records are not real customer data and should not be treated as live business activity.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">How Information Is Used</h2>
            <p className="mt-2">Information is used to provide dashboards, generate AI-assisted drafts, organize customer requests, support workflow decisions, and help with pilot onboarding or support.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Third-Party Services</h2>
            <p className="mt-2">Frontline may use third-party infrastructure, authentication, database, payment, communication, or AI providers. Integrations such as SMS, email, calendar, and CRM tools may be added during pilot or paid deployments.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
            <p className="mt-2">For privacy questions, contact the Frontline team through the contact page.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
