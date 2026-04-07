import { useState } from "react";
import { useListPosts } from "@workspace/api-client-react";
import { PostCard } from "@/components/PostCard";
import { BookOpen, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: undefined, label: "All" },
  { value: "tutorial", label: "Tutorials" },
  { value: "how-to", label: "How-To Guides" },
] as const;

const DIFFICULTIES = [
  { value: undefined, label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

const PAGE_SIZE = 9;

export default function Tutorials() {
  const [category, setCategory] = useState<string | undefined>("tutorial");
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useListPosts(
    { category: category as "blog" | "tutorial" | "how-to" | undefined, limit: PAGE_SIZE, offset: page * PAGE_SIZE },
    { query: { queryKey: ["tutorials", category, difficulty, page] } }
  );

  const allPosts = data?.posts ?? [];
  const posts = difficulty ? allPosts.filter(p => p.difficulty === difficulty) : allPosts;
  const total = difficulty ? posts.length : (data?.total ?? 0);
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

  const handleCategoryChange = (val: string | undefined) => {
    setCategory(val);
    setPage(0);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
            <Layers className="w-4 h-4" />
            Structured learning paths
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Tutorials & How-Tos</h1>
          <p className="text-muted-foreground">Step-by-step technical guides with real code.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
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

          <div className="flex gap-1 flex-wrap sm:ml-auto">
            {DIFFICULTIES.map(d => (
              <button
                key={d.label}
                onClick={() => setDifficulty(d.value as string | undefined)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  difficulty === d.value
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
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
            <p className="font-medium text-foreground">No tutorials found</p>
            <p className="text-sm mt-1">Try a different category or difficulty.</p>
            <button
              onClick={() => { setCategory("tutorial"); setDifficulty(undefined); setPage(0); }}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} className={`animate-fade-up stagger-${Math.min(i + 1, 6)}`} />
              ))}
            </div>

            {totalPages > 1 && !difficulty && (
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
