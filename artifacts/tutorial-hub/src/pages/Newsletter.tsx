import { FileText, Bell, BookOpen, Zap } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SEO, buildBreadcrumbsJsonLd } from "@/lib/seo";

const benefits = [
  {
    icon: FileText,
    title: "Free Web Dev Cheat Sheet",
    description: "A concise reference covering TypeScript utility types, React hooks, CSS Grid, common Git commands, and more — all on one page.",
  },
  {
    icon: Bell,
    title: "New tutorials delivered",
    description: "Get notified when new guides, tutorials, and how-tos are published — React, Node.js, CSS, testing, DevOps, and more.",
  },
  {
    icon: BookOpen,
    title: "Curated reading picks",
    description: "Occasional roundups of the best dev articles, tools, and resources from around the web — filtered so you don't have to.",
  },
  {
    icon: Zap,
    title: "Early access to products",
    description: "Subscribers get early access and discounts on any digital products, boilerplates, and courses we release.",
  },
];

export default function Newsletter() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        title="Newsletter — Free Web Dev Cheat Sheet | DevDocs"
        description="Subscribe to the DevDocs newsletter and get a free developer cheat sheet plus new tutorials on React, TypeScript, Node.js, and more delivered to your inbox."
        path="/newsletter"
        keywords={["newsletter", "developer newsletter", "web dev cheat sheet", "react tutorials", "typescript tips", "subscribe"]}
        jsonLd={buildBreadcrumbsJsonLd([
          { name: "Home", url: "/" },
          { name: "Newsletter", url: "/newsletter" },
        ])}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-5">
            Free to subscribe
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            The DevDocs Newsletter
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Practical web development knowledge in your inbox. Tutorials, tips, and resources — without the noise.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="font-semibold text-foreground mb-5">What you get:</h2>
          <div className="space-y-4 mb-8">
            {benefits.map(benefit => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{benefit.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Subscribe now</h3>
            <NewsletterForm />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Join developers who read DevDocs every week. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
