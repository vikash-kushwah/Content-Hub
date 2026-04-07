import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Mail,
  ChevronRight,
  BookOpen,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
            <BookOpen className="h-5 w-5" />
            DevDocs
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? location === "/admin" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-5 sticky top-0 z-20">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
