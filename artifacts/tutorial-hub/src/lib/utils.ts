import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function categoryLabel(category: string) {
  const map: Record<string, string> = {
    blog: "Blog",
    tutorial: "Tutorial",
    "how-to": "How-To",
  };
  return map[category] ?? category;
}

export function difficultyColor(difficulty: string | null | undefined) {
  if (!difficulty) return "text-muted-foreground bg-muted";
  const map: Record<string, string> = {
    beginner: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40",
    intermediate: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/40",
    advanced: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40",
  };
  return map[difficulty] ?? "text-muted-foreground bg-muted";
}

export function categoryColor(category: string) {
  const map: Record<string, string> = {
    blog: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40",
    tutorial: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40",
    "how-to": "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40",
  };
  return map[category] ?? "text-muted-foreground bg-muted";
}

