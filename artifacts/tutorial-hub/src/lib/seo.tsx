import { useEffect } from "react";

const SITE_URL = "https://devdocs.replit.app";
const SITE_NAME = "DevDocs";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  keywords?: string[];
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMeta(selector: string, attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const JSON_LD_ID = "page-jsonld";

function setJsonLd(data: Record<string, unknown> | Record<string, unknown>[] | undefined) {
  document.querySelectorAll(`script[data-seo="${JSON_LD_ID}"]`).forEach(s => s.remove());
  if (!data) return;
  const items = Array.isArray(data) ? data : [data];
  items.forEach(item => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", JSON_LD_ID);
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

export function SEO({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  keywords,
  publishedAt,
  updatedAt,
  author = "DevDocs",
  tags,
  jsonLd,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  useEffect(() => {
    document.title = fullTitle;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta('meta[name="author"]', "name", "author", author);
    if (keywords && keywords.length) {
      setMeta('meta[name="keywords"]', "name", "keywords", keywords.join(", "));
    }

    setLink("canonical", url);

    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", title);
    setMeta('meta[property="og:locale"]', "property", "og:locale", "en_US");

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

    if (type === "article" && publishedAt) {
      setMeta('meta[property="article:published_time"]', "property", "article:published_time", publishedAt);
      if (updatedAt) {
        setMeta('meta[property="article:modified_time"]', "property", "article:modified_time", updatedAt);
      }
      setMeta('meta[property="article:author"]', "property", "article:author", author);
      document.querySelectorAll('meta[property="article:tag"]').forEach(m => m.remove());
      (tags ?? []).forEach(tag => {
        const m = document.createElement("meta");
        m.setAttribute("property", "article:tag");
        m.setAttribute("content", tag);
        document.head.appendChild(m);
      });
    } else {
      document.querySelectorAll('meta[property^="article:"]').forEach(m => m.remove());
    }

    setJsonLd(jsonLd);

    window.scrollTo(0, 0);
  }, [fullTitle, description, url, image, type, noindex, author, publishedAt, updatedAt, JSON.stringify(keywords), JSON.stringify(tags), JSON.stringify(jsonLd)]);

  return null;
}

export function buildArticleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string | null;
  coverImageUrl?: string | null;
  tags?: string[];
  category?: string;
  readingTimeMinutes?: number;
}) {
  const url = `${SITE_URL}/posts/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": post.category === "tutorial" || post.category === "how-to" ? "TechArticle" : "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ?? DEFAULT_OG_IMAGE,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: (post.tags ?? []).join(", "),
    ...(post.readingTimeMinutes ? { timeRequired: `PT${post.readingTimeMinutes}M` } : {}),
  };
}

export function buildBreadcrumbsJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "In-depth tutorials, how-to guides, and blog posts on web development.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: "Technical tutorials and guides for modern web developers.",
  };
}

export function buildItemListJsonLd(items: { title: string; slug: string; excerpt: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/posts/${item.slug}`,
      name: item.title,
      description: item.excerpt,
    })),
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE };
