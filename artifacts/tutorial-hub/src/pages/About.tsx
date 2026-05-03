import { BookOpen, Code2, Zap, Mail, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { SEO, buildBreadcrumbsJsonLd } from "@/lib/seo";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        title="About DevDocs — Built for Developers Who Want Real Answers"
        description="DevDocs is a technical blog and tutorial site covering React, TypeScript, JavaScript, Node.js, CSS, databases, testing, and modern web development."
        path="/about"
        keywords={["about devdocs", "web development blog", "tutorial site", "technical content", "react typescript javascript"]}
        jsonLd={buildBreadcrumbsJsonLd([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
            <BookOpen className="w-3 h-3" />
            About DevDocs
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-4">
            Built for developers who want real answers
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            DevDocs is a technical blog and tutorial site dedicated to practical, in-depth content across the full web development stack — React, TypeScript, JavaScript, Node.js, CSS, databases, testing, DevOps, security, and more.
          </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">What you'll find here</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose mb-6">
              {[
                { icon: Code2, title: "Tutorials", desc: "Step-by-step guides that actually work, with tested, production-ready code." },
                { icon: BookOpen, title: "Blog Posts", desc: "Deep dives, opinions, and technical breakdowns on modern dev topics." },
                { icon: Zap, title: "How-To Guides", desc: "Focused answers to specific development problems — no padding." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-4 rounded-xl border border-border bg-card">
                  <Icon className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Why DevDocs exists</h2>
            <p className="text-muted-foreground leading-relaxed">
              Too much content online is either too shallow, full of filler, or quickly outdated. DevDocs was created to be different — every post aims to be the single best resource on that topic. If there are code examples, they actually work. If there's a step-by-step guide, every step is tested. Topics are chosen based on what developers actually search for and struggle with day to day.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Topics covered</h2>
            <div className="flex flex-wrap gap-2 not-prose">
              {[
                "React", "React 19", "TypeScript", "JavaScript", "ES2024",
                "Node.js", "Express", "Next.js", "Vite",
                "CSS Grid", "Tailwind CSS", "CSS Custom Properties",
                "PostgreSQL", "Drizzle ORM", "REST APIs",
                "Vitest", "React Testing Library", "Playwright",
                "GitHub Actions", "Docker", "CI/CD",
                "Git", "Web Security", "Performance",
                "AI APIs", "OpenAI", "Embeddings",
                "Web Vitals", "Bundle Optimization", "Dark Mode",
              ].map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-muted text-muted-foreground rounded-full border border-border">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Monetization & Transparency</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              DevDocs earns revenue through two methods:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">→</span>
                <span><strong className="text-foreground">Google AdSense:</strong> Display ads shown across the site. These are served automatically by Google based on content relevance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">→</span>
                <span><strong className="text-foreground">Affiliate links:</strong> Some posts and the Resources page contain affiliate links to tools I genuinely use and recommend. If you purchase through these links, I may earn a commission at no extra cost to you.</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Affiliate relationships never influence what content gets written or how tools are reviewed. I only recommend things I've personally used.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Stay in touch</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The best way to follow new content is to subscribe to the newsletter — you'll get new posts and dev tips delivered to your inbox, no spam.
            </p>
            <div className="flex flex-wrap gap-3 not-prose">
              <Link
                href="/newsletter"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Subscribe to Newsletter
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Browse All Posts
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
