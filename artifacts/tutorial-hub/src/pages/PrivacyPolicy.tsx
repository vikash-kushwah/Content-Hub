import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "April 8, 2026";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
            <Shield className="w-3 h-3" />
            Legal
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">

          <section>
            <h2>Introduction</h2>
            <p>
              Welcome to DevDocs ("we", "us", or "our"). This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website at devdocs.replit.app. By using our site, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2>Information We Collect</h2>

            <h3>Information you provide voluntarily</h3>
            <ul>
              <li><strong>Email address and name</strong> — when you subscribe to our newsletter.</li>
              <li><strong>Feedback</strong> — when you click "helpful" or "not helpful" on a post (no personal data is stored with this action).</li>
            </ul>

            <h3>Information collected automatically</h3>
            <ul>
              <li><strong>Cookies and similar tracking technologies</strong> — used by Google AdSense to serve relevant advertising.</li>
              <li><strong>Usage data</strong> — pages visited, referrer URLs, browser type, and device information, collected via standard web logs.</li>
            </ul>
          </section>

          <section>
            <h2>Google AdSense & Cookies</h2>
            <p>
              We use Google AdSense to display advertisements on our site. Google AdSense uses cookies to serve ads based on your prior visits to our website and other websites on the internet. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the internet.
            </p>
            <p>
              You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. You can also opt out via the <a href="http://www.networkadvertising.org/managing/opt_out.asp" target="_blank" rel="noopener noreferrer">Network Advertising Initiative opt-out page</a>.
            </p>
            <p>
              For more information on how Google uses data, visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses information from sites or apps that use our services</a>.
            </p>
          </section>

          <section>
            <h2>Affiliate Links</h2>
            <p>
              Some links on this website are affiliate links. This means we may earn a small commission if you click through and make a purchase, at no extra cost to you. We only recommend products and services we genuinely use and trust. Affiliate relationships do not influence our editorial content.
            </p>
          </section>

          <section>
            <h2>Newsletter</h2>
            <p>
              When you subscribe to our newsletter, your email address (and optionally your name) is stored in our database. We use this information solely to send you new posts and occasional updates. We do not sell, rent, or share your email address with third parties.
            </p>
            <p>
              You can unsubscribe at any time by contacting us. Your data will be deleted from our records upon request.
            </p>
          </section>

          <section>
            <h2>Data Retention</h2>
            <p>
              Newsletter subscriber data is retained until you unsubscribe or request deletion. Server access logs are retained for up to 30 days.
            </p>
          </section>

          <section>
            <h2>Your Rights (GDPR)</h2>
            <p>If you are in the European Economic Area (EEA), you have the following rights:</p>
            <ul>
              <li>The right to access personal data we hold about you</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to request deletion of your data</li>
              <li>The right to withdraw consent at any time</li>
              <li>The right to opt out of personalized advertising</li>
            </ul>
          </section>

          <section>
            <h2>Third-Party Services</h2>
            <p>We use the following third-party services that may collect data:</p>
            <ul>
              <li><strong>Google AdSense</strong> — advertising (see Google's <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
              <li><strong>Google Fonts</strong> — web fonts loaded from Google servers</li>
            </ul>
          </section>

          <section>
            <h2>Children's Privacy</h2>
            <p>
              Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the site after changes constitutes acceptance of the new policy.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have questions about this Privacy Policy or would like to exercise your data rights, please reach out via the newsletter subscription page.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
