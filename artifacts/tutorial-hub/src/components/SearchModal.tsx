import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Search, X, FileText, Clock } from "lucide-react";
import { useListPosts } from "@workspace/api-client-react";
import { categoryLabel, categoryColor, cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = useListPosts({ limit: 100 });

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const allPosts = data?.posts ?? [];
  const q = query.trim().toLowerCase();

  const results = q.length < 2
    ? allPosts.slice(0, 6)
    : allPosts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.tags ?? []).some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 8);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search posts, tutorials, tags…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 border border-border rounded text-xs text-muted-foreground ml-1">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
            </div>
          ) : (
            <ul className="p-2">
              {!q && (
                <li className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Posts</li>
              )}
              {results.map(post => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    onClick={onClose}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", categoryColor(post.category))}>
                          {categoryLabel(post.category)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="w-3 h-3" />
                      {post.readingTimeMinutes}m
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-border bg-muted/30 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 border border-border rounded bg-card">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 border border-border rounded bg-card">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 border border-border rounded bg-card">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
