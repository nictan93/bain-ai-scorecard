import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LANDING_COPY } from "@/content/copy";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border-subtle">
        <span className="text-sm font-mono font-bold text-text-primary tracking-tight">
          Bain Squared
        </span>
        <a
          href="https://bainsquared.com"
          className="text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors duration-[180ms]"
        >
          bainsquared.com
        </a>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="flex-1 flex items-center">
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-32">
            <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest mb-8">
              {LANDING_COPY.eyebrow}
            </p>

            <h1 className="text-4xl md:text-6xl font-mono font-bold text-text-primary leading-tight mb-6">
              {LANDING_COPY.headline}
              <br />
              <span className="text-brand-primary">{LANDING_COPY.headlineSuffix}</span>
            </h1>

            <p className="text-lg text-text-secondary max-w-xl mb-12 leading-relaxed">
              {LANDING_COPY.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link href="/scorecard">
                <Button variant="primary" size="lg">
                  {LANDING_COPY.ctaLabel}
                </Button>
              </Link>
            </div>

            <p className="text-xs text-text-tertiary mt-6 max-w-sm">
              {LANDING_COPY.disclaimer}
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t border-border-subtle bg-surface-card">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              {LANDING_COPY.benefits.map((benefit) => (
                <div key={benefit.title} className="space-y-3">
                  <h2 className="text-base font-mono font-bold text-text-primary leading-snug">
                    {benefit.title}
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {benefit.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-5 border-t border-border-subtle">
        <p className="text-xs font-mono text-text-tertiary">
          Bain Squared — Intangible Asset Valuation
        </p>
      </footer>
    </div>
  );
}
