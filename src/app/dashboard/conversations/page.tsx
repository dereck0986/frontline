const mockThreads = [
  {
    lead: "Michael Torres",
    channel: "Manual Intake",
    preview: "Looking for overnight security coverage for an event this weekend.",
    followUp: "Follow up in 2 hours",
  },
  {
    lead: "Sarah Mitchell",
    channel: "Coming Soon",
    preview: "Interested in furnished rental options near the hospital district.",
    followUp: "Appointment pending",
  },
];

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-500 mt-1">
          Communication tracking layer for Frontline.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-orange-300 bg-orange-50 p-4 text-sm text-orange-700">
        Twilio and VAPI integrations are marked as coming soon. This section currently previews conversation workflow architecture.
      </div>

      <div className="space-y-4">
        {mockThreads.map((thread) => (
          <div
            key={thread.lead}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-gray-900">{thread.lead}</h2>
                <p className="text-sm text-gray-500 mt-1">{thread.channel}</p>
              </div>

              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                {thread.followUp}
              </span>
            </div>

            <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
              {thread.preview}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
