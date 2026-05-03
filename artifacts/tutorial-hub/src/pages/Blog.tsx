import { useState } from "react";
import { useListPosts } from "@workspace/api-client-react";
import { PostCard } from "@/components/PostCard";
import { Search, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEO, buildBreadcrumbsJsonLd, buildItemListJsonLd } from "@/lib/seo";

const CATEGORIES = [
  { value: undefined, label: "All Posts" },
  { value: "blog", label: "Blog" },
  { value: "tutorial", label: "Tutorials" },
  { value: "how-to", label: "How-To" },
] as const;

const PAGE_SIZE = 9;

export default function Blog() {
  return <BlogPage />;
}

function BlogPage() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useListPosts(
    { category: category as "blog" | "tutorial" | "how-to" | undefined, tag, limit: PAGE_SIZE, offset: page * PAGE_SIZE },
    { query: { queryKey: ["posts", category, tag, page] } }
  );

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleCategoryChange = (val: string | undefined) => {
    setCategory(val);
    setPage(0);
  };

  const filteredCount = data?.total ?? 0;

  const seoTitle = category
    ? `${CATEGORIES.find(c => c.value === category)?.label} — Blog | DevDocs`
    : tag
      ? `Posts tagged "${tag}" | DevDocs`
      : "Blog — Tutorials, Guides & How-Tos | DevDocs";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        title={seoTitle}
        description={`Browse ${filteredCount > 0 ? filteredCount : 'all'} in-depth posts on React, TypeScript, JavaScript, Node.js, CSS, testing, DevOps, and modern web development.`}
        path={page > 0 ? `/blog?page=${page + 1}` : "/blog"}
        keywords={["blog", "web development", "tutorials", "typescript", "react", "javascript", "nodejs", "css", "testing", category, tag].filter(Boolean) as string[]}
        jsonLd={[
          buildBreadcrumbsJsonLd([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
          ]),
          ...(data?.posts && data.posts.length > 0 ? [buildItemListJsonLd(data.posts)] : []),
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Blog</h1>
          <p className="text-muted-foreground">Tutorials, how-to guides, and technical deep dives.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => handleCategoryChange(cat.value as string | undefined)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  category === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {tag && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">Filtering by tag:</span>
              <button
                onClick={() => setTag(undefined)}
                className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition"
              >
                #{tag} &times;
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="h-56 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium text-foreground">No posts found</p>
            <p className="text-sm mt-1">Try a different category or check back later.</p>
            {(category || tag) && (
              <button
                onClick={() => { setCategory(undefined); setTag(undefined); }}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} className={`animate-fade-up stagger-${Math.min(i + 1, 6)}`} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
