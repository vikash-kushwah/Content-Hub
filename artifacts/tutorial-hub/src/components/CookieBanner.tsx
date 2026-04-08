import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "devdocs_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-up">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Cookie className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm text-foreground font-medium mb-0.5">We use cookies</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use cookies for ads (Google AdSense) and analytics. By clicking "Accept", you consent to our use of cookies as described in our{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Accept All
          </button>
          <button onClick={decline} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
