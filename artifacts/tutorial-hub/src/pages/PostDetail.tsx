import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useGetPost, useGetRelatedPosts, useSubmitFeedback, useGetPostNavigation } from "@workspace/api-client-react";
import { PostCard } from "@/components/PostCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { formatDate, categoryLabel, categoryColor, difficultyColor, cn } from "@/lib/utils";
import {
  Clock, Calendar, ArrowLeft, ThumbsUp, ThumbsDown, ExternalLink,
  CheckCircle, Loader2, BookOpen, Twitter, Linkedin, Link2, Check, ChevronLeft, ChevronRight
} from "lucide-react";
import { SEO, buildArticleJsonLd, buildBreadcrumbsJsonLd } from "@/lib/seo";

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      id="reading-progress"
      style={{ width: `${progress}%` }}
    />
  );
}

interface TocItem { id: string; text: string; level: number }

function TableOfContents({ items, activeId }: { items: TocItem[]; activeId: string }) {
  if (items.length === 0) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          On this page
        </p>
        <nav className="space-y-1">
          {items.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "block text-sm py-0.5 transition-colors",
                item.level === 2 ? "pl-0" : item.level === 3 ? "pl-3" : "pl-6",
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/posts/${slug}`
    : `/posts/${slug}`;

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-xs text-muted-foreground mr-1">Share:</span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
      >
        <Twitter className="w-3.5 h-3.5" />
        Twitter
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
      >
        <Linkedin className="w-3.5 h-3.5" />
        LinkedIn
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

function FeedbackSection({ slug }: { slug: string }) {
  const [voted, setVoted] = useState<boolean | null>(null);

  const { mutate, isPending, data } = useSubmitFeedback({
    mutation: {
      onSuccess: () => {},
    },
  });

  const helpfulCount = data?.helpfulCount ?? 0;
  const notHelpfulCount = data?.notHelpfulCount ?? 0;

  const handleVote = (helpful: boolean) => {
    if (voted !== null) return;
    setVoted(helpful);
    mutate({ data: { postSlug: slug, helpful } });
  };

  return (
    <div className="border-t border-border pt-8 mt-8">
      <h3 className="font-semibold text-foreground mb-4">Was this helpful?</h3>
      {voted !== null ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Thanks for the feedback!
          {data && (
            <span className="ml-2">
              {helpfulCount} helpful, {notHelpfulCount} not helpful
            </span>
          )}
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => handleVote(true)}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-foreground hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
            Yes
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-foreground hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4" />}
            Could be better
          </button>
        </div>
      )}
    </div>
  );
}

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useGetPost(slug ?? "", {
    query: { enabled: !!slug },
  });
  const { data: related } = useGetRelatedPosts(slug ?? "", {
    query: { enabled: !!slug },
  });
  const { data: nav } = useGetPostNavigation(slug ?? "", {
    query: { enabled: !!slug },
  });

  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!post?.tableOfContents?.length) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    post.tableOfContents.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse mb-4" />
          <div className="h-12 w-3/4 bg-muted rounded-lg animate-pulse mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <SEO
          title="Post not found | DevDocs"
          description="The post you're looking for doesn't exist or has been moved."
          path={`/posts/${slug}`}
          noindex
        />
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Post not found</h1>
          <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist or has been moved.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabelText = categoryLabel(post.category);

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/posts/${post.slug}`}
        type="article"
        image={post.coverImageUrl ?? undefined}
        publishedAt={typeof post.publishedAt === "string" ? post.publishedAt : new Date(post.publishedAt).toISOString()}
        updatedAt={post.updatedAt ? (typeof post.updatedAt === "string" ? post.updatedAt : new Date(post.updatedAt).toISOString()) : undefined}
        keywords={post.tags ?? []}
        tags={post.tags ?? []}
        author="DevDocs"
        jsonLd={[
          buildArticleJsonLd({
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            publishedAt: typeof post.publishedAt === "string" ? post.publishedAt : new Date(post.publishedAt).toISOString(),
            updatedAt: post.updatedAt ? (typeof post.updatedAt === "string" ? post.updatedAt : new Date(post.updatedAt).toISOString()) : null,
            coverImageUrl: post.coverImageUrl,
            tags: post.tags ?? [],
            category: post.category,
            readingTimeMinutes: post.readingTimeMinutes,
          }),
          buildBreadcrumbsJsonLd([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: categoryLabelText, url: `/blog?category=${post.category}` },
            { name: post.title, url: `/posts/${post.slug}` },
          ]),
        ]}
      />
      <ReadingProgress />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to blog
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", categoryColor(post.category))}>
                {categoryLabel(post.category)}
              </span>
              {post.difficulty && (
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", difficultyColor(post.difficulty))}>
                  {post.difficulty.charAt(0).toUpperCase() + post.difficulty.slice(1)}
                </span>
              )}
              {post.series && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Series: {post.series} — Part {post.seriesOrder}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-5">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              {post.updatedAt && (
                <span className="flex items-center gap-1.5 text-xs">
                  Updated {formatDate(post.updatedAt)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTimeMinutes} min read
              </span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="text-xs text-muted-foreground bg-muted hover:bg-secondary px-2 py-1 rounded transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {post.coverImageUrl && (
            <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-10">
              <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex gap-10">
            <article className="flex-1 min-w-0">
              <div
                className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-code:before:content-none prose-code:after:content-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* AdSense in-article ad */}
              <div className="my-10 text-center overflow-hidden rounded-xl bg-muted/40 border border-border py-4 px-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Advertisement</p>
                <ins
                  className="adsbygoogle"
                  style={{ display: "block", textAlign: "center" }}
                  data-ad-layout="in-article"
                  data-ad-format="fluid"
                  data-ad-client="ca-pub-6253053806009925"
                  data-ad-slot="1234567890"
                />
              </div>

              {/* Inline newsletter CTA */}
              <div className="my-10 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 p-2 bg-primary/15 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-base mb-1">
                      Enjoying this article?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get new tutorials, how-to guides, and deep dives delivered straight to your inbox — no spam, ever.
                    </p>
                    <NewsletterForm compact className="max-w-md" />
                  </div>
                </div>
              </div>

              {post.affiliateLinks.length > 0 && (
                <div className="mt-12 p-5 bg-card border border-card-border rounded-xl">
                  <h3 className="font-semibold text-foreground mb-1">Recommended Tools</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Affiliate links — I only recommend tools I use.
                  </p>
                  <div className="space-y-3">
                    {post.affiliateLinks.map(link => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted hover:bg-secondary transition-colors group"
                      >
                        <div>
                          <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                            {link.label}
                          </span>
                          {link.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <FeedbackSection slug={post.slug} />

              {related && related.posts.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-foreground mb-5">Related Posts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.posts.slice(0, 4).map(rp => (
                      <PostCard key={rp.id} post={rp} />
                    ))}
                  </div>
                </div>
              )}

              {/* Prev / Next navigation */}
              {nav && (nav.prev || nav.next) && (
                <nav className="mt-12 border-t border-border pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nav.prev ? (
                    <Link
                      href={`/posts/${nav.prev.slug}`}
                      className="group flex flex-col gap-1.5 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                    >
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Previous
                      </span>
                      <span className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {nav.prev.title}
                      </span>
                    </Link>
                  ) : <div />}

                  {nav.next ? (
                    <Link
                      href={`/posts/${nav.next.slug}`}
                      className="group flex flex-col gap-1.5 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all sm:text-right"
                    >
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium sm:justify-end">
                        Next
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {nav.next.title}
                      </span>
                    </Link>
                  ) : <div />}
                </nav>
              )}
            </article>

            <TableOfContents items={post.tableOfContents ?? []} activeId={activeId} />
          </div>
        </div>
      </div>
    </>
  );
}
