import { Link } from "wouter";
import { ArrowRight, BookOpen, Code2, Zap, Users } from "lucide-react";
import { useGetFeaturedPosts, useGetRecentPosts, useGetPostsStats, useSubscribeNewsletter } from "@workspace/api-client-react";
import { PostCard } from "@/components/PostCard";
import { NewsletterForm } from "@/components/NewsletterForm";

function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-6 animate-fade-up">
            <Zap className="w-3 h-3" />
            Deep technical tutorials for real developers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight mb-6 animate-fade-up stagger-1">
            Learn to build{" "}
            <span className="text-primary">fast, modern</span>{" "}
            web projects
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 animate-fade-up stagger-2">
            Step-by-step guides on Astro, TypeScript, performance, deployment, and AI integrations. No filler — just code that works.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-up stagger-3">
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all"
            >
              Browse Tutorials
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-muted transition-all"
            >
              Read the Blog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const { data } = useGetPostsStats();

  const stats = [
    {
      icon: BookOpen,
      label: "Total Posts",
      value: data?.totalPosts ?? 0,
    },
    {
      icon: Code2,
      label: "Tutorials",
      value: data ? (data.byCategory?.tutorial ?? 0) + (data.byCategory?.["how-to"] ?? 0) : 0,
    },
    {
      icon: Users,
      label: "Subscribers",
      value: data?.totalSubscribers ?? 0,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-16">
      <div className="grid grid-cols-3 gap-4 bg-card border border-card-border rounded-xl p-5 shadow-sm">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="text-center">
            <Icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedPosts() {
  const { data, isLoading } = useGetFeaturedPosts();

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Featured</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const posts = data?.posts ?? [];

  if (posts.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Featured</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} featured className={`animate-fade-up stagger-${i + 1}`} />
        ))}
      </div>
    </section>
  );
}

function RecentPosts() {
  const { data, isLoading } = useGetRecentPosts({ limit: 6 });

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Recent Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const posts = data?.posts ?? [];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Recent Posts</h2>
        <Link href="/blog" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No posts yet</p>
          <p className="text-sm mt-1">Check back soon — content is on its way.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} className={`animate-fade-up stagger-${i + 1}`} />
          ))}
        </div>
      )}
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20 rounded-2xl p-8 sm:p-12 text-center">
        <div className="max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
            Free cheat sheet included
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Stay up to date
          </h2>
          <p className="text-muted-foreground mb-6">
            Get new tutorials, tips, and the free{" "}
            <strong className="text-foreground">Astro Performance Cheat Sheet</strong>{" "}
            delivered to your inbox.
          </p>
          <NewsletterForm className="max-w-sm mx-auto" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsBar />
      <FeaturedPosts />
      <RecentPosts />
      <NewsletterSection />
    </div>
  );
}
