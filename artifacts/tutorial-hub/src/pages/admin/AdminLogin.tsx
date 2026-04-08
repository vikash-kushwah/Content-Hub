import { useState } from "react";
import { useAdminAuth } from "@/lib/adminAuth";
import { BookOpen, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export function AdminLogin() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Invalid password");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
            <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DevDocs Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter your admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  error ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          This area is restricted to site administrators only.
        </p>
      </div>
    </div>
  );
}
