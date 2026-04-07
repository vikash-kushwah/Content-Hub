import { Link } from "wouter";
import { BookOpen, Github, Twitter, Rss } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>DevDocs</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              In-depth guides, tutorials, and how-tos on Astro, static sites, performance, TypeScript, and modern web development.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              This site contains affiliate links. I only recommend tools I actually use and trust.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">Content</h3>
            <ul className="space-y-2">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/tutorials", label: "Tutorials" },
                { href: "/tutorials?category=how-to", label: "How-To Guides" },
                { href: "/newsletter", label: "Newsletter" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">More</h3>
            <ul className="space-y-2">
              {[
                { href: "/resources", label: "Resources" },
                { href: "/newsletter", label: "Free Cheat Sheet" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="/api/rss" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="RSS">
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DevDocs. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Disclosure: Posts may contain affiliate links.
          </p>
        </div>
      </div>
    </footer>
  );
}
