import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { useListSubscribers, useDeleteSubscriber, getListSubscribersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Download } from "lucide-react";

export default function Subscribers() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useListSubscribers();
  const deleteSubscriber = useDeleteSubscriber();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const subscribers = data?.subscribers ?? [];

  async function handleDelete(id: number) {
    await deleteSubscriber.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListSubscribersQueryKey() });
    setConfirmId(null);
  }

  function exportCsv() {
    const rows = ["Email,Name,Subscribed At", ...subscribers.map(s =>
      `${s.email},${s.name ?? ""},${new Date(s.subscribedAt).toISOString()}`
    )];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminLayout title="Subscribers" subtitle={`${subscribers.length} newsletter subscribers`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Mail className="h-4 w-4" />
            {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
          </div>
          {subscribers.length > 0 && (
            <button
              onClick={exportCsv}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading subscribers…</div>
          ) : subscribers.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No subscribers yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">They'll appear here once people sign up for your newsletter.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subscribed</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {subscribers.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{sub.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{sub.name ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        {confirmId === sub.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(sub.id)}
                              disabled={deleteSubscriber.isPending}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(sub.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
