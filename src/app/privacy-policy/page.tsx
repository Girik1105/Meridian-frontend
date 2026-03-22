import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Meridian",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-snow">
      {/* Header */}
      <div className="bg-ink py-8">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold text-xl text-accent">
            <Compass className="h-6 w-6" />
            Meridian
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-heading text-3xl font-bold text-ink mb-2">Privacy Policy</h1>
        <p className="text-slate text-sm font-body mb-10">Effective date: March 21, 2026</p>

        <div className="space-y-8 font-body text-charcoal leading-relaxed text-[15px]">
          <p>Your privacy matters to us. This policy explains what information we collect, how we use it, and your rights regarding your data.</p>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              <strong>Account information:</strong> When you register, we collect your username, email address, and password (stored securely using hashing).
            </p>
            <p className="mb-3">
              <strong>Profile data:</strong> Through conversations with our AI mentor, we collect information you share about your background, education, work experience, career interests, constraints, and preferences. This is stored as structured profile data to personalize your experience.
            </p>
            <p className="mb-3">
              <strong>Conversation data:</strong> We store the messages you exchange with our AI mentor, including onboarding conversations, career discovery sessions, and skill taster interactions.
            </p>
            <p>
              <strong>Usage data:</strong> We collect information about how you interact with skill tasters, including your responses to exercises and time spent on modules.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Provide personalized career recommendations and guidance</li>
              <li>Generate tailored skill tasters based on your background and interests</li>
              <li>Maintain context across conversations so your AI mentor can reference previous interactions</li>
              <li>Improve the quality and relevance of our AI-generated content</li>
              <li>Communicate with you about your account (e.g., welcome emails)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">3. AI Processing</h2>
            <p>
              Your profile data and conversation history are sent to our AI provider (Anthropic&apos;s Claude) to generate personalized responses. This data is used solely for generating your recommendations and is subject to our AI provider&apos;s data handling policies.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">4. Data Sharing</h2>
            <div className="bg-accent-light rounded-lg p-5 mb-4">
              <p className="text-ink text-sm font-semibold">We do not sell, rent, or trade your personal information to third parties.</p>
            </div>
            <p className="mb-3">We may share your information only in the following limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>AI processing:</strong> With our AI provider (Anthropic) as necessary to provide the service</li>
              <li><strong>Legal requirements:</strong> If required by law, regulation, or legal process</li>
              <li><strong>Safety:</strong> To protect the rights, safety, or property of Meridian, our users, or the public</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">5. Data Security</h2>
            <p className="mb-3">We implement reasonable security measures to protect your information, including:</p>
            <ul className="list-disc pl-6 space-y-1.5 mb-3">
              <li>Passwords are hashed and never stored in plain text</li>
              <li>Authentication via secure HTTP-only cookies with JWT tokens</li>
              <li>CORS restrictions limiting access to authorized origins</li>
            </ul>
            <p>However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. Conversation histories may be summarized over time to manage storage, but key information is preserved in your profile. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">7. Your Rights</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Access</strong> the personal information we hold about you</li>
              <li><strong>Correct</strong> inaccurate or incomplete information</li>
              <li><strong>Delete</strong> your account and associated data</li>
              <li><strong>Export</strong> your data in a portable format</li>
              <li><strong>Object</strong> to certain processing of your data</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a href="mailto:hello@meridian.dev" className="text-accent hover:underline">hello@meridian.dev</a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Meridian is not intended for children under 16. We do not knowingly collect information from children under 16. If we learn that we have collected data from a child under 16, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">9. Cookies</h2>
            <p>
              We use essential cookies only — specifically HTTP-only authentication cookies to keep you signed in. We do not use tracking cookies or third-party analytics cookies.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of significant changes via email or a notice on our platform. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink mb-3">11. Contact</h2>
            <p>
              For privacy-related questions or concerns, contact us at{" "}
              <a href="mailto:hello@meridian.dev" className="text-accent hover:underline">hello@meridian.dev</a>.
            </p>
          </section>
        </div>

        <hr className="border-silver my-10" />
        <p className="text-center text-slate text-xs font-body">
          Meridian &mdash; AI-Powered Career Guidance
        </p>
      </div>
    </div>
  );
}
