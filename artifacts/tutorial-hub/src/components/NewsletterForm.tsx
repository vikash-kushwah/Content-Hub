import { useState } from "react";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface NewsletterFormProps {
  compact?: boolean;
  className?: string;
}

export function NewsletterForm({ compact = false, className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const { mutate, isPending, error } = useSubscribeNewsletter({
    mutation: {
      onSuccess: (data) => {
        setSubmitted(true);
        setAlreadySubscribed(data.alreadySubscribed ?? false);
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    mutate({ data: { email, name: name || null } });
  };

  if (submitted) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3 py-6 text-center", className)}>
        <CheckCircle className="w-10 h-10 text-green-500" />
        <p className="font-semibold text-foreground text-lg">
          {alreadySubscribed ? "Already subscribed!" : "You're in!"}
        </p>
        <p className="text-sm text-muted-foreground">
          {alreadySubscribed
            ? "This email is already on the list. Stay tuned for new tutorials."
            : "Welcome to the list. Expect tutorials, guides, and the free Astro cheat sheet in your inbox."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      {!compact && (
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
      )}
      <div className={cn("flex gap-2", compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row")}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !email}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-60 transition whitespace-nowrap"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Subscribing...</>
          ) : "Subscribe"}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5" />
          Something went wrong. Please try again.
        </p>
      )}
      <p className="text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
    </form>
  );
}
