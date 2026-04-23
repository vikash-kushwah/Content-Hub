import { Link } from "wouter";
import { AlertCircle, Home, Search } from "lucide-react";
import { SEO } from "@/lib/seo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4">
      <SEO
        title="Page Not Found (404) | DevDocs"
        description="The page you're looking for doesn't exist or has been moved. Browse our blog, tutorials, or resources instead."
        path="/404"
        noindex
      />
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-extrabold text-foreground mb-3">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-3">Page not found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Try heading home or browsing our content.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
