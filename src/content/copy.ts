export const LANDING_COPY = {
  announcementBar: "Preparing for ESOP, fundraising, or M&A?",
  announcementCta: "Book a valuation scoping call →",
  subheadline1a: "Most companies are valued on revenue, profit, or industry benchmarks. But your brand, customers,",
  subheadline1b: "contracts, software, data, IP and employee option plan carry more value that you think.",
  subheadline2a: "Take the assessment to find out whether your business has hidden value that may support",
  subheadline2b: "ESOP valuation, fundraising, M&A, or a stronger valuation discussion.",
  ctaLabel: "Start the assessment",
  disclaimer: "No credit card. No login. Takes under 60 seconds.",
  benefits: [
    {
      title: "Know what is at stake before the auditor does.",
      body: "SFRS(I) 2 grant-date fair value, IRAS treatment of exercise, PPA obligations in M&A. The compliance exposure is specific. So is the diagnosis.",
    },
    {
      title: "Score your readiness, not your aspiration.",
      body: "Eight questions. Each one calibrated to the decisions that actually delay or derail an engagement. The score reflects where you are, not where you plan to be.",
    },
    {
      title: "Leave with a specific next step.",
      body: "The result page names the engagement, the methodology, and the call to book. No generic follow-up. The CTA is scoped to your situation.",
    },
  ],
} as const;

export const IDLE_COPY = {
  headline: "Let's get started",
  subheadline:
    "Add your email if you want us to save your result or send you a copy after the assessment. Your email is only used for tracking and requested follow-up. No newsletter or spam list.",
  ctaLabel: "Start the assessment",
  disclaimer: "Let's go.",
} as const;

export const RESULT_COPY = {
  scoreLabel: "Your readiness score",
  diagnosisLabel: "Diagnosis",
  nextStepLabel: "Recommended next step",
  emailGateHeadline: "Get your full readiness report.",
  emailGateBody:
    "Enter your details to unlock the specific next step and book a scoping call. We will also send you a copy of your result.",
  emailPlaceholder: "your@email.com",
  namePlaceholder: "Name (optional)",
  companyPlaceholder: "Company (optional)",
  submitLabel: "Unlock next step",
  submittingLabel: "Sending...",
  successHeadline: "You are in.",
  successBody:
    "Check your inbox for a copy of your result. The booking link below is scoped to your situation.",
  privacyNote:
    "Your details are used only to send your result and route it to the right person at Bain Squared. No marketing lists.",
  retakeLabel: "Retake the assessment",
} as const;
