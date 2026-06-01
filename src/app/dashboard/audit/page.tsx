export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ClipboardList, History, ShieldCheck } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getBusinessByUserId } from "@/lib/db";
import { getAuditLogsByUserId } from "@/lib/ops-side-effects";

export default async function AuditPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const business = await getBusinessByUserId(session.user.id);
  if (!business) redirect("/onboarding");

  const logs = await getAuditLogsByUserId(session.user.id, 100);
  const entityCount = new Set(logs.map((log) => log.entity_type).filter(Boolean)).size;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit History</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Operational trace of important actions, system events, future AI activity, and integration events.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-brand-600">
            <History size={16} />
            <p className="text-xs">Logs</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{logs.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck size={16} />
            <p className="text-xs">Entities</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{entityCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-indigo-600">
            <ClipboardList size={16} />
            <p className="text-xs">Source</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-indigo-600">Live</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">Event Trail</h2>
          <p className="mt-1 text-xs text-gray-500">System actions are stored for visibility, debugging, and operational accountability.</p>
        </div>

        {logs.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center p-6 text-center">
            <div>
              <History className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-900">No audit logs yet</p>
              <p className="mt-1 max-w-sm text-xs text-gray-500">
                Audit records will appear here once operation events trigger side effects.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-[560px] divide-y divide-gray-100 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 capitalize">{log.action.replaceAll("_", " ")}</h3>
                      {log.entity_type && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium capitalize text-gray-700">
                          {log.entity_type.replaceAll("_", " ")}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{log.summary ?? "No summary saved."}</p>
                    {log.entity_id && <p className="mt-1 text-[11px] text-gray-400">Entity ID: {log.entity_id}</p>}
                  </div>
                  <p className="shrink-0 text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
