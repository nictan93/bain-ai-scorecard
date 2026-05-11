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

  // Form field labels
  emailLabel: "Business email *",
  emailPlaceholder: "your@company.com",
  namePlaceholder: "Name",
  nameOptional: "(optional)",
  companyPlaceholder: "Company",
  companyOptional: "(optional)",
  newsletterCheckboxLabel: "I would like to receive newsletters from Bain Squared.",
  privacyNote:
    "Your email is used to send your report and track requested follow-up.\nWe do not send marketing newsletters unless you opt in.",

  // Submit states
  submittingLabel: "Sending...",

  // Post-submit: HOT — report sent, show booking button
  hotSubmitBadge: "Details saved",
  hotBookingButtonLabel: "Book a discovery call",

  // Post-submit: WARM / WARM_LOW — report sent, no booking button
  warmSubmitBadge: "Sent",

  // Post-submit: COLD — report sent, no booking button, no prompt
  coldSubmitBadge: "Sent",

  // 10% offer block (shown for ESOP A2 and A3 result codes)
  offerBlockTitle: "Your company is eligible for our invoice review.",
  offerBlockBody:
    "Send us your most recent ESOP valuation invoice and get 10% off your next ESOP valuation report with Bain Squared. You do not need to be unhappy with your current provider to use this. The review is also useful for benchmarking price, quality, speed, and defensibility before your next renewal.",

  retakeLabel: "Retake the assessment",
} as const;
