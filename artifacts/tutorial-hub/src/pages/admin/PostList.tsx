import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "./AdminLayout";
import { useListPosts, useDeletePost, getListPostsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PostList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useListPosts({ limit: 100 });
  const deletePost = useDeletePost();
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const posts = data?.posts ?? [];
  const filtered = categoryFilter === "all" ? posts : posts.filter(p => p.category === categoryFilter);

  async function handleDelete(slug: string) {
    await deletePost.mutateAsync({ slug });
    queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
    setConfirmSlug(null);
  }

  return (
    <AdminLayout title="Posts" subtitle={`${posts.length} total posts`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {["all", "blog", "tutorial", "how-to"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  categoryFilter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <Link href="/admin/posts/new">
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading posts…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No posts found.{" "}
              <Link href="/admin/posts/new" className="text-blue-600 dark:text-blue-400 hover:underline">
                Create one
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tags</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Published</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(post => (
                  <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.featured && (
                          <Star className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{post.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        post.category === "tutorial"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                          : post.category === "how-to"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(post.tags ?? []).slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                            {tag}
                          </span>
                        ))}
                        {(post.tags ?? []).length > 3 && (
                          <span className="text-xs text-gray-400">+{(post.tags ?? []).length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/posts/${post.slug}`}>
                          <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            View
                          </button>
                        </Link>
                        <Link href={`/admin/posts/${post.slug}/edit`}>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Link>
                        {confirmSlug === post.slug ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(post.slug)}
                              disabled={deletePost.isPending}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmSlug(null)}
                              className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmSlug(post.slug)}
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
