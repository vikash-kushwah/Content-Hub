import { ExternalLink, AlertCircle, Server, Globe, Wrench, GraduationCap } from "lucide-react";
import { SEO, buildBreadcrumbsJsonLd } from "@/lib/seo";

interface ResourceLink {
  name: string;
  description: string;
  url: string;
  badge?: string;
  commission?: string;
}

const resources: { category: string; icon: React.ElementType; items: ResourceLink[] }[] = [
  {
    category: "Hosting & Deployment",
    icon: Server,
    items: [
      {
        name: "DigitalOcean",
        description: "My go-to for VPS and managed databases. Straightforward pricing, great docs, and an incredible control panel.",
        url: "https://www.digitalocean.com/?refcode=yourreferralcode",
        badge: "Recommended",
        commission: "10% recurring for 12 months",
      },
      {
        name: "Cloudflare Pages",
        description: "Free static hosting with a global CDN, custom domains, and instant cache invalidation. Great for React, Next.js, and any static frontend.",
        url: "https://pages.cloudflare.com/",
        badge: "Free Tier",
      },
      {
        name: "Netlify",
        description: "Excellent DX for frontend projects. Great for serverless functions, form handling, and A/B testing.",
        url: "https://www.netlify.com/",
        badge: "Free Tier",
      },
      {
        name: "Vultr",
        description: "Fast bare-metal and cloud compute at competitive prices. Great alternative to DigitalOcean for high-traffic apps.",
        url: "https://www.vultr.com/?ref=yourref",
        commission: "Up to $100 per referral",
      },
    ],
  },
  {
    category: "Domains & DNS",
    icon: Globe,
    items: [
      {
        name: "Namecheap",
        description: "Affordable domain registration with free WhoisGuard privacy protection. I've registered dozens of domains here.",
        url: "https://www.namecheap.com/?aff=youraff",
        badge: "Best Value",
        commission: "20-35% on first purchase",
      },
      {
        name: "Cloudflare Registrar",
        description: "Register domains at cost (no markup) and get Cloudflare DNS management for free. Highly recommended.",
        url: "https://www.cloudflare.com/products/registrar/",
        badge: "At-cost pricing",
      },
    ],
  },
  {
    category: "Development Tools",
    icon: Wrench,
    items: [
      {
        name: "VS Code",
        description: "My primary editor. Free, fast, and has incredible extension support for web development.",
        url: "https://code.visualstudio.com/",
        badge: "Free",
      },
      {
        name: "Warp Terminal",
        description: "A modern, GPU-accelerated terminal with AI completions. Dramatically improved my CLI productivity.",
        url: "https://app.warp.dev/referral/yourref",
      },
      {
        name: "Plausible Analytics",
        description: "Privacy-friendly, lightweight analytics. No cookie banners, no GDPR complexity — just clean data.",
        url: "https://plausible.io/",
        commission: "Affiliate program available",
      },
    ],
  },
  {
    category: "Courses & Learning",
    icon: GraduationCap,
    items: [
      {
        name: "Frontend Masters",
        description: "The best advanced JavaScript and TypeScript courses I've found. Courses taught by industry practitioners, not instructors.",
        url: "https://frontendmasters.com/",
        badge: "Premium",
        commission: "Affiliate program",
      },
      {
        name: "The Odin Project",
        description: "A free, high-quality full-stack web development curriculum. Best free resource for beginners and intermediates.",
        url: "https://www.theodinproject.com/",
        badge: "Free",
      },
    ],
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        title="Tools & Resources I Actually Use | DevDocs"
        description="A curated list of hosting providers, developer tools, courses, and books I personally use and recommend for modern web development."
        path="/resources"
        keywords={["developer tools", "web hosting", "digitalocean", "cloudflare", "netlify", "vultr", "vps", "developer resources"]}
        jsonLd={buildBreadcrumbsJsonLd([
          { name: "Home", url: "/" },
          { name: "Resources", url: "/resources" },
        ])}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Tools & Resources</h1>
          <p className="text-muted-foreground text-lg">
            Honest recommendations for tools I actually use.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 mb-10 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Affiliate disclosure:</strong> Some links on this page are affiliate links. If you purchase through them, I earn a small commission at no extra cost to you. I only recommend tools I genuinely use and believe in.
          </div>
        </div>

        <div className="space-y-12">
          {resources.map(section => {
            const Icon = section.icon;
            return (
              <div key={section.category}>
                <div className="flex items-center gap-2 mb-5">
                  <Icon className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">{section.category}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.items.map(item => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="group block bg-card border border-card-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      {item.commission && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                          {item.commission}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
