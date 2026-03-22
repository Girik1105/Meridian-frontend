import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-lg font-bold text-white md:text-xl">
            Ready to find your path?
          </p>
          <p className="mt-2 text-sm text-white/50 leading-relaxed md:text-base">
            Your career journey starts with a single conversation.
          </p>
          <a
            href="#hero"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-secondary px-7 py-3 font-heading text-sm font-medium text-white hover:bg-secondary/90 transition-colors min-h-[44px]"
          >
            Get Started Free
          </a>
        </div>

        <hr className="my-10 border-white/10" />

        <div className="flex items-center justify-center gap-6 text-xs font-heading text-white/40 mb-6">
          <span>Built with</span>
          <span className="font-semibold text-white/60">Claude by Anthropic</span>
          <span className="text-white/20">&middot;</span>
          <span className="font-semibold text-white/60">Next.js</span>
          <span className="text-white/20">&middot;</span>
          <span className="font-semibold text-white/60">Tailwind CSS</span>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 font-heading text-sm font-medium text-white/60">
            <Compass className="h-4 w-4 text-secondary" />
            Meridian
          </div>
          <p className="text-xs text-white/40 text-center">
            Built at HackASU 2026 &middot; Powered by Claude &middot; Track 3:
            Economic Empowerment &amp; Education
          </p>
        </div>
      </div>
    </footer>
  );
}
