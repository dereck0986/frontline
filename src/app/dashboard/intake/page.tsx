import { LeadIntakeClient } from "../lead-intake/lead-intake-client";

export default function IntakePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Intake</h1>
        <p className="text-gray-500 mt-1">
          Capture leads manually and qualify them with Frontline AI.
        </p>
      </div>

      <LeadIntakeClient />
    </div>
  );
}
