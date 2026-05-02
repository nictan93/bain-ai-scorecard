import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LANDING_COPY } from "@/content/copy";

function IconStake() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconScore() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconNextStep() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 14h4m-4 4h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const benefitIcons = [IconStake, IconScore, IconNextStep];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas">

      {/* Announcement bar */}
      <div className="bg-surface-accent text-text-inverse text-sm font-sans font-medium py-2.5 px-6 text-center">
        <span className="opacity-80">{LANDING_COPY.announcementBar}</span>
        {" "}
        <a
          href="https://bainsquared.com"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity duration-[180ms]"
        >
          {LANDING_COPY.announcementCta}
        </a>
      </div>

      {/* Header — aligned to hero card width */}
      <header className="px-4 sm:px-6 py-4">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between">
          <span className="text-base font-sans font-extrabold text-text-primary tracking-tight">
            Bain Squared
          </span>
          <nav className="flex items-center gap-2">
            <a
              href="https://bainsquared.com"
              className="px-4 py-2 text-sm font-medium text-text-primary rounded-full hover:bg-surface-card-soft transition-colors duration-[180ms]"
            >
              About
            </a>
            <a
              href="https://bainsquared.com"
              className="px-4 py-2 text-sm font-medium bg-brand-primary text-text-inverse rounded-full hover:bg-brand-primary-pressed transition-colors duration-[180ms]"
            >
              Talk to us
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 sm:px-6 pb-6">

        {/* Hero card wrapper */}
        <div className="max-w-[1320px] w-full mx-auto bg-surface-card rounded-[32px] shadow-sm overflow-hidden">
          <div className="px-8 sm:px-16 md:px-24 pt-16 pb-16 flex flex-col items-center text-center">

            <h1 className="text-5xl md:text-6xl font-sans font-bold text-text-primary leading-[1.05] tracking-[-0.03em] mb-6">
              Your business could be{" "}
              <span className="text-state-warning">[worth]</span>{" "}
              more
              <br />
              than you think
            </h1>

            <p className="text-lg text-text-secondary mb-4 leading-relaxed">
              {LANDING_COPY.subheadline1a}<br />{LANDING_COPY.subheadline1b}
            </p>

            <p className="text-lg text-text-secondary mb-10 leading-relaxed">
              {LANDING_COPY.subheadline2a}<br />{LANDING_COPY.subheadline2b}
            </p>

            <Link href="/scorecard">
              <Button variant="primary" size="lg">
                {LANDING_COPY.ctaLabel}
              </Button>
            </Link>

            <p className="text-sm text-text-tertiary mt-4">
              {LANDING_COPY.disclaimer}
            </p>

          </div>
        </div>

        {/* Feature pillars — no cards, centered, icons above */}
        <div className="max-w-[1320px] w-full mx-auto mt-12 grid md:grid-cols-3 gap-12 px-4 sm:px-8">
          {LANDING_COPY.benefits.map((benefit, i) => {
            const Icon = benefitIcons[i];
            return (
              <div key={benefit.title} className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary-soft text-brand-primary flex items-center justify-center shrink-0">
                  <Icon />
                </div>
                <h2 className="text-base font-sans font-semibold text-text-primary leading-snug">
                  {benefit.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {benefit.body}
                </p>
              </div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 py-8">
        <p className="text-xs font-sans text-text-tertiary text-center">
          © Bain Squared
        </p>
      </footer>

    </div>
  );
}
