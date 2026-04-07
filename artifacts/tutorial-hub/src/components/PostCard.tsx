import { Link } from "wouter";
import { Clock, Calendar } from "lucide-react";
import { cn, formatDate, categoryLabel, categoryColor, difficultyColor } from "@/lib/utils";

interface PostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string;
  featured: boolean;
  coverImageUrl?: string | null;
  difficulty?: string | null;
}

interface PostCardProps {
  post: PostSummary;
  className?: string;
  featured?: boolean;
}

export function PostCard({ post, className, featured = false }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "group block bg-card border border-card-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200",
        className
      )}
    >
      {post.coverImageUrl && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className={cn("p-5", featured && "p-6")}>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", categoryColor(post.category))}>
            {categoryLabel(post.category)}
          </span>
          {post.difficulty && (
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", difficultyColor(post.difficulty))}>
              {post.difficulty.charAt(0).toUpperCase() + post.difficulty.slice(1)}
            </span>
          )}
        </div>

        <h3 className={cn(
          "font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2",
          featured ? "text-xl" : "text-base"
        )}>
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTimeMinutes} min read
          </span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
