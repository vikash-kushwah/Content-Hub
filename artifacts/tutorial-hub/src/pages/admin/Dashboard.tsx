import { Link } from "wouter";
import { AdminLayout } from "./AdminLayout";
import { useGetPostsStats, useListPosts, useListSubscribers } from "@workspace/api-client-react";
import { FileText, Users, Tag, TrendingUp, Plus, ArrowRight } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetPostsStats();
  const { data: postsData } = useListPosts({ limit: 5 });
  const { data: subsData } = useListSubscribers();

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your DevDocs site">
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Posts"
            value={statsLoading ? "—" : (stats?.totalPosts ?? 0)}
            icon={FileText}
            color="bg-blue-500"
          />
          <StatCard
            label="Subscribers"
            value={statsLoading ? "—" : (stats?.totalSubscribers ?? 0)}
            icon={Users}
            color="bg-green-500"
          />
          <StatCard
            label="Blog Posts"
            value={statsLoading ? "—" : (stats?.byCategory?.blog ?? 0)}
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <StatCard
            label="Tutorials"
            value={statsLoading ? "—" : (stats?.byCategory?.tutorial ?? 0)}
            icon={Tag}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Posts</h2>
              <Link href="/admin/posts" className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {postsData?.posts?.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No posts yet.</p>
              )}
              {postsData?.posts?.map((post) => (
                <div key={post.slug} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.category === "tutorial"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                      : post.category === "how-to"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}>
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200 flex-1 truncate">{post.title}</span>
                  <Link
                    href={`/admin/posts/${post.slug}/edit`}
                    className="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/admin/posts/new"
                  className="flex items-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Post
                </Link>
                <Link
                  href="/admin/subscribers"
                  className="flex items-center gap-2 w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  <Users className="h-4 w-4" />
                  View Subscribers
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Top Tags</h2>
              <div className="flex flex-wrap gap-2">
                {stats?.popularTags?.slice(0, 8).map(({ tag, count }) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                    {tag} ({count})
                  </span>
                ))}
                {!stats?.popularTags?.length && (
                  <p className="text-sm text-gray-400">No tags yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Latest Subscribers</h2>
              <div className="space-y-2">
                {subsData?.subscribers?.slice(0, 4).map((sub) => (
                  <div key={sub.id} className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {sub.email}
                  </div>
                ))}
                {!subsData?.subscribers?.length && (
                  <p className="text-sm text-gray-400">No subscribers yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
