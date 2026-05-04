# Business Value Copy Variations

## 1. Result Page Copy Variations

There are 3 core outcomes — **HOT**, **WARM**, and **COLD** — with sub-variants based on the specific path taken.

---

### HOT LEAD — Copy Variants

**Variant H1: Fundraising / New Investors + Hidden Value + Near-Term**

- **Headline:** Your business has [hidden value] that investors need to see
- **Status Badge:** Urgent Review
- **Description:** You are entering a valuation discussion soon, and your answers indicate that your business has significant value — such as brand, software, data, IP, or strong customer relationships — that is not fully captured by a standard profit or revenue multiple. If you do not formally evidence these intangible assets now, investors will likely control the narrative and value the business too cheaply.
- **Callout Label:** WHY THIS MATTERS
- **Callout Body:** Raising funds without a clear, documented view of your intangible assets often leads to unnecessary equity dilution. You must prove the value before the term sheet is drafted.
- **Primary CTA:** Schedule a call
- **CTA Body:** Your valuation event is approaching quickly. The best next step is to speak with us directly so we can understand your fundraising timeline and how to evidence your hidden value.

---

**Variant H2: M&A / Selling + Hidden Value + Near-Term**

- **Headline:** Do not let buyers [discount the value] of your business
- **Status Badge:** Urgent Review
- **Description:** You are preparing for a sale or succession, and your answers suggest your business holds valuable intangible assets that a basic financial multiple will miss. Buyers are actively looking for reasons to discount your price. To defend your valuation, you must formally document the strength of your brand, contracts, IP, and systems before due diligence begins.
- **Callout Label:** WHY THIS MATTERS
- **Callout Body:** In M&A, undocumented value is treated as zero value. If you cannot prove the commercial strength of your intangibles, the buyer will not pay for them.
- **Primary CTA:** Schedule a call
- **CTA Body:** Your transaction timeline is near-term. The best next step is to speak with us directly so we can identify the specific assets that will drive up your exit multiple.

---

### WARM LEAD — Copy Variants

**Variant W1: Transaction Planned + Far-Term Timing**

- **Headline:** It is time to start [evidencing the hidden value] in your business
- **Status Badge:** Planning Window
- **Description:** You are planning a valuation event in the future, and your answers point to business assets that may not be fully visible in your current financials. While you do not have an urgent deadline this month, the best time to map and document your brand, software, data, or IP is before the pressure of a transaction begins.
- **Callout Label:** PLANNING AHEAD
- **Callout Body:** A structured review now will help you decide which assets are worth investing in and documenting before investors, buyers, or shareholders set the narrative.
- **Primary CTA:** Get your Valuation Evidence Guide
- **Secondary CTA:** Book a call
- **CTA Body:** Review the guide to understand what buyers and investors look for, then book a call when you are ready to start mapping your specific assets.

---

**Variant W2: Strong Assets + No Immediate Transaction**

- **Headline:** Your business has [strong intangible assets] worth reviewing
- **Status Badge:** Value Discovery
- **Description:** Your answers suggest that your business has built significant value in areas like brand, customer relationships, software, data, or IP. Even though you are not actively selling or raising funds right now, understanding how these assets drive your company's true worth is a critical part of long-term strategic planning.
- **Callout Label:** UNLOCKING VALUE
- **Callout Body:** Many founders only realise what their business is truly worth when it is too late. Mapping your intangible assets now gives you a clearer picture of your competitive advantage.
- **Primary CTA:** Get your Intangible Asset Guide
- **Secondary CTA:** Book a call
- **CTA Body:** Review the guide to see how intangible assets are valued in your industry, then book a call if you would like to explore a formal value discovery session.

---

### COLD LEAD — Copy Variant

**Variant C1: Exploring / No Transaction / Weak Asset Signal**

- **Headline:** You are in the [early stages] of value discovery
- **Status Badge:** Education Stage
- **Description:** Your answers suggest that you are currently exploring how business valuation works, but you do not have an immediate transaction planned and the signals for hidden intangible value are still early. This does not mean your business lacks value. It simply means the value drivers may need to be developed or mapped more clearly over time.
- **Callout Label:** NO ACTION NEEDED YET
- **Callout Body:** Keep the guide for future planning. It will help you identify which business assets are worth tracking and documenting as your company grows.
- **Primary CTA:** Get your Business Value Starter Guide
- **Secondary CTA:** None
- **CTA Body:** You may not have an immediate valuation need yet. The guide will help you understand the difference between standard financial value and true business value.

---

## 2. Standardized PDF Report Strategy (Business Value)

The assessment maps each user to one of **4 core static PDF reports** based on their primary goal and asset signals. The `deliverableKey` is passed to Zapier / Google Script, which pulls the matching PDF from Google Drive and emails it.

| Report Title | Deliverable Key | Who Gets It | Trigger |
|---|---|---|---|
| The Fundraising Valuation Guide | `bv_fundraising_guide` | Raising funds or bringing in investors | Q5_BV = A or C |
| The M&A / Exit Valuation Guide | `bv_mna_guide` | Selling the business or succession planning | Q5_BV = B or D |
| The Intangible Asset Discovery Guide | `bv_intangibles_guide` | Explaining value to board/bank or wanting to understand true worth + strong asset signals | Q5_BV = E or F + Strong Asset Signal |
| The Business Value Starter Guide | `bv_starter_guide` | Just curious, or weak asset signals | Q5_BV = G, or default for Cold |
