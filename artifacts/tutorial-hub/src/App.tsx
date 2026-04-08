import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import Tutorials from "@/pages/Tutorials";
import Resources from "@/pages/Resources";
import Newsletter from "@/pages/Newsletter";
import PostDetail from "@/pages/PostDetail";
import About from "@/pages/About";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPostList from "@/pages/admin/PostList";
import { NewPostPage, EditPostPage } from "@/pages/admin/PostEditor";
import AdminSubscribers from "@/pages/admin/Subscribers";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminAuthProvider, useAdminAuth, getAdminToken } from "@/lib/adminAuth";
import { setAuthTokenGetter } from "@workspace/api-client-react";

setAuthTokenGetter(() => getAdminToken());

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <AdminGuard>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/posts" component={AdminPostList} />
          <Route path="/admin/posts/new" component={NewPostPage} />
          <Route path="/admin/posts/:slug/edit" component={EditPostPage} />
          <Route path="/admin/subscribers" component={AdminSubscribers} />
          <Route component={NotFound} />
        </Switch>
      </AdminGuard>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/blog" component={Blog} />
          <Route path="/tutorials" component={Tutorials} />
          <Route path="/resources" component={Resources} />
          <Route path="/newsletter" component={Newsletter} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/posts/:slug" component={PostDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <CookieBanner />
      <ScrollToTop />
    </>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRoutes />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AdminAuthProvider>
  );
}

export default App;
