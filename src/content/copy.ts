export const LANDING_COPY = {
  announcementBar: "Preparing for ESOP, fundraising, or M&A?",
  announcementCta: "Book a valuation scoping call →",
  subheadline1a: "Most companies are valued on revenue, profit, or industry benchmarks. But your brand, customers,",
  subheadline1b: "contracts, software, data, IP and employee option plan carry more value that you think.",
  subheadline2a: "Take the assessment to find out whether your business has hidden value that may support",
  subheadline2b: "ESOP valuation, fundraising, M&A, or a stronger valuation discussion.",
  ctaLabel: "Start the assessment",
  // Two-line footer note rendered via whitespace-pre-line
  disclaimer: "No credit card. No login. Takes under 60 seconds.\nComplete the assessment and receive a surprise reward if eligible.",
  benefits: [
    {
      title: "See what your numbers may not show.",
      body: "The assessment reviews the business assets that may not show clearly in your financials, including brand, customer relationships, contracts, software, data, IP, ESOPs, and operating systems.",
    },
    {
      title: "Know what needs to be proven.",
      body: "A higher valuation needs proof. The assessment shows whether your value drivers are clear enough for investors, auditors, buyers, or board members to understand.",
    },
    {
      title: "Leave with a clear next step.",
      body: "Your result tells you what to do next, whether that means ESOP valuation, a hidden value review, or preparing for fundraising, M&A, or shareholder discussions.",
    },
  ],
} as const;

export const IDLE_COPY = {
  headline: "Let's get started",
  subheadline:
    "Add your business email if you want us to save your result or send you a copy after the assessment. Your email is only used for tracking referrals and requested follow-up. No marketing newsletter spam.",
  ctaLabel: "Start the assessment",
  disclaimer: "No credit card. No login. Takes under 60 seconds.",
  referralPlaceholder: "e.g. ABC2026",
} as const;

export const RESULT_COPY = {
  yourResultLabel: "YOUR RESULT",

  // Email field
  emailLabel: "Business email *",
  emailPlaceholder: "your@company.com",

  // Name / Company labels
  namePlaceholder: "Name",
  nameOptional: "(optional)",
  companyPlaceholder: "Company",
  companyOptional: "(optional)",

  // Newsletter checkbox — updated label
  newsletterCheckboxLabel: "I would like to receive newsletters from Bain Squared.",

  // Submit states
  submittingLabel: "Sending...",

  // Privacy note — shown below the submit button
  // Replaces the old "We use your email..." text
  privacyNote:
    "Your email is only used for tracking referrals and requested follow-up.\nNo marketing newsletter spam.",

  // Post-submit: cold/nurture (checklist sent)
  successHeadline: "You are in.",
  successBody:
    "Your result and the relevant checklist will arrive in your inbox shortly.",

  // Post-submit: hot/warm (cal.com opened)
  calOpenedHeadline: "Your details are saved.",
  calOpenedBody:
    "The booking calendar should be open in a new tab. Pick a time that works for you.",
  calFallbackLabel: "Open booking calendar →",

  retakeLabel: "Retake the assessment",
} as const;
