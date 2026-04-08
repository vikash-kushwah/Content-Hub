import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { AdminLayout } from "./AdminLayout";
import {
  useCreatePost,
  useUpdatePost,
  useGetPost,
  getListPostsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EditorProps {
  mode: "create" | "edit";
  slug?: string;
}

const CATEGORIES = ["blog", "tutorial", "how-to"] as const;
const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

function estimateReadingTime(text: string) {
  const words = text.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function PostEditor({ mode, slug: slugProp }: EditorProps) {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: existingPost, isLoading: postLoading } = useGetPost(
    slugProp ?? "",
    { query: { enabled: mode === "edit" && !!slugProp } }
  );

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const [form, setForm] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    category: "blog" as "blog" | "tutorial" | "how-to",
    tags: "",
    readingTimeMinutes: 5,
    featured: false,
    coverImageUrl: "",
    difficulty: "" as "" | "beginner" | "intermediate" | "advanced",
    series: "",
    seriesOrder: "",
  });

  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingPost && mode === "edit") {
      setForm({
        slug: existingPost.slug,
        title: existingPost.title,
        excerpt: existingPost.excerpt,
        content: existingPost.content,
        category: existingPost.category as "blog" | "tutorial" | "how-to",
        tags: (existingPost.tags ?? []).join(", "),
        readingTimeMinutes: existingPost.readingTimeMinutes ?? 5,
        featured: existingPost.featured ?? false,
        coverImageUrl: existingPost.coverImageUrl ?? "",
        difficulty: (existingPost.difficulty ?? "") as "" | "beginner" | "intermediate" | "advanced",
        series: existingPost.series ?? "",
        seriesOrder: existingPost.seriesOrder?.toString() ?? "",
      });
    }
  }, [existingPost, mode]);

  function set(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  }

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = "Slug must be lowercase letters, numbers, and hyphens only";
    if (!form.excerpt.trim()) e.excerpt = "Excerpt is required";
    if (!form.content.trim()) e.content = "Content is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      slug: form.slug,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      category: form.category,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      readingTimeMinutes: form.readingTimeMinutes,
      featured: form.featured,
      coverImageUrl: form.coverImageUrl.trim() || undefined,
      difficulty: (form.difficulty || undefined) as "beginner" | "intermediate" | "advanced" | undefined,
      series: form.series.trim() || undefined,
      seriesOrder: form.seriesOrder ? parseInt(form.seriesOrder, 10) : undefined,
    };

    try {
      if (mode === "create") {
        await createPost.mutateAsync({ data: payload });
        toast({ title: "Post created", description: `"${form.title}" has been published.` });
      } else {
        await updatePost.mutateAsync({ slug: slugProp!, data: payload });
        toast({ title: "Post updated", description: `"${form.title}" has been saved.` });
      }
      queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
      navigate("/admin/posts");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  }

  const isPending = createPost.isPending || updatePost.isPending;
  const isEdit = mode === "edit";

  return (
    <AdminLayout
      title={isEdit ? "Edit Post" : "New Post"}
      subtitle={isEdit ? `Editing: ${existingPost?.title ?? slugProp}` : "Create a new post"}
    >
      {isEdit && postLoading ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">Loading post…</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/posts")}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Posts
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              >
                {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {preview ? "Hide Preview" : "Preview Content"}
              </button>
              <Button type="submit" disabled={isPending} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isPending ? "Saving…" : isEdit ? "Save Changes" : "Publish Post"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Content</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => {
                      set("title", e.target.value);
                      if (!isEdit && !form.slug) set("slug", autoSlug(e.target.value));
                    }}
                    placeholder="e.g. How to Build a REST API with Node.js"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                    }`}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Excerpt <span className="text-red-500">*</span>
                    <span className="ml-1 font-normal text-gray-400 dark:text-gray-500">(shown in post cards)</span>
                  </label>
                  <textarea
                    value={form.excerpt}
                    onChange={e => set("excerpt", e.target.value)}
                    rows={2}
                    placeholder="A short 1–2 sentence description of what this post covers…"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                      errors.excerpt ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                    }`}
                  />
                  {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Content (HTML) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => set("readingTimeMinutes", estimateReadingTime(form.content))}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Auto-calc reading time
                    </button>
                  </div>
                  {preview ? (
                    <div
                      className="min-h-[320px] p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 prose prose-sm dark:prose-invert max-w-none overflow-auto"
                      dangerouslySetInnerHTML={{ __html: form.content }}
                    />
                  ) : (
                    <textarea
                      value={form.content}
                      onChange={e => set("content", e.target.value)}
                      rows={16}
                      placeholder="<h2>Introduction</h2><p>Your post content goes here…</p>"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y ${
                        errors.content ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                      }`}
                    />
                  )}
                  {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Write your post as HTML. Use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;code&gt;, &lt;pre&gt;, &lt;ul&gt;, etc.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Settings</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    disabled={isEdit}
                    placeholder="my-post-title"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.slug ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                    }`}
                  />
                  {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
                  {isEdit && <p className="mt-1 text-xs text-gray-400">Slug cannot be changed after creation.</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => set("category", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Tags
                    <span className="ml-1 font-normal text-gray-400 dark:text-gray-500">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={e => set("tags", e.target.value)}
                    placeholder="react, typescript, api"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Reading Time (min)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.readingTimeMinutes}
                    onChange={e => set("readingTimeMinutes", parseInt(e.target.value, 10) || 1)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => set("featured", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured post
                    <span className="ml-1 font-normal text-gray-400 dark:text-gray-500">(shown on homepage)</span>
                  </label>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Optional</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={e => set("difficulty", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">None</option>
                    {DIFFICULTIES.map(d => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cover Image URL</label>
                  <input
                    type="url"
                    value={form.coverImageUrl}
                    onChange={e => set("coverImageUrl", e.target.value)}
                    placeholder="https://…"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Series Name</label>
                  <input
                    type="text"
                    value={form.series}
                    onChange={e => set("series", e.target.value)}
                    placeholder="e.g. Node.js Fundamentals"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {form.series && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Series Order</label>
                    <input
                      type="number"
                      min={1}
                      value={form.seriesOrder}
                      onChange={e => set("seriesOrder", e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}

export function NewPostPage() {
  return <PostEditor mode="create" />;
}

export function EditPostPage() {
  const params = useParams<{ slug: string }>();
  return <PostEditor mode="edit" slug={params.slug} />;
}
