# DESIGN_TOKENS.md

The visual system for the Bain Squared Intangible Value Scorecard. Token-driven, semantic, no raw hex values in components.

The aesthetic is borrowed from cytd, which itself borrows from technical documentation tools (Linear, Vercel, Stripe Docs) crossed with editorial brutalism. The signature element is the `[bracket]` motif used as a typographic device. Lean into it.

---

## Typography

Two families. One mono display for headlines and numerics, one humanist sans for body and UI.

### Display: mono, slab-flavoured

**Font:** `JetBrains Mono` (free, Google Fonts) as default. Upgrade to `Cartograph CF` (paid, ~$200) post-launch for the closer match to cytd's character set.

Used for: page titles, hero headlines, large numerics, score displays, the `[bracket]` motif.

```
font-family: 'JetBrains Mono', 'Cartograph CF', ui-monospace, monospace
font-weight: 700 (display headlines), 800 (hero), 600 (numerics)
letter-spacing: -0.01em at large sizes
```

### Body: humanist sans

**Font:** `Inter` (free, Google Fonts) or system Helvetica Neue stack. The extracted design.md confirms Helvetica Neue is what cytd uses, but Inter is more reliable across platforms and free to host.

Used for: body copy, UI labels, button text, form inputs, captions.

```
font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif
font-weight: 400 (body), 500 (emphasis), 600 (UI labels)
letter-spacing: -0.005em at body sizes, 0 at UI sizes
```

### Type scale

Modular scale, base 16px, ratio ~1.25 (major third).

| Token              | Size  | Line height | Usage                          |
|--------------------|-------|-------------|--------------------------------|
| `text-xs`          | 12px  | 16px        | Captions, badges, footnotes    |
| `text-sm`          | 14px  | 20px        | Secondary body, UI labels      |
| `text-base`        | 16px  | 24px        | Body copy default              |
| `text-lg`          | 18px  | 28px        | Lead paragraphs                |
| `text-xl`          | 20px  | 28px        | Card titles                    |
| `text-2xl`         | 24px  | 32px        | Section subheadings            |
| `text-3xl`         | 30px  | 36px        | Section headings               |
| `text-4xl`         | 36px  | 40px        | Page titles                    |
| `text-5xl`         | 48px  | 52px        | Mid hero                       |
| `text-6xl`         | 60px  | 64px        | Hero (mobile)                  |
| `text-display`     | 80px  | 84px        | Hero (desktop)                 |
| `text-score`       | 96px  | 96px        | The big `[20]` score number    |

Hero and display sizes always use the mono font. Body sizes always use Inter.

---

## Colour

Semantic tokens only. Never reference raw hex values in components. Derived from the Bain Squared sales deck palette.

### Surface

```
--surface-canvas:    #F7F5F2    /* warm parchment page background */
--surface-card:      #FFFFFF    /* card backgrounds */
--surface-card-soft: #EFEDE8    /* secondary cards, FAQ blocks */
--surface-inverse:   #1A1A1A    /* footer, dark CTAs */
--surface-accent:    #174C3C    /* primary forest green blocks */
```

### Text

```
--text-primary:    #1A1A1A     /* default text */
--text-secondary:  #6B7280     /* descriptions, captions */
--text-tertiary:   #A3A3A3     /* meta, disabled */
--text-inverse:    #FFFFFF     /* text on dark surfaces */
--text-accent:     #174C3C     /* links, the [bracket] domain styling */
```

### Brand

```
--brand-primary:         #174C3C    /* deep forest green, the Bain Squared brand */
--brand-primary-pressed: #103A2D
--brand-primary-soft:    #E8F0EC
```

### State

```
--state-success:        #16A34A
--state-success-soft:   #DCFCE7
--state-warning:        #D97706
--state-warning-soft:   #FEF3C7
--state-danger:         #B91C1C
--state-danger-soft:    #FEE2E2
--state-info:           #3E5C76
--state-info-soft:      #E5EAF0
```

The "Needs Improvement" badge in cytd uses a dark red on a darker red background. That's `--state-danger` text on a custom `#3D0F0F` chip. Keep it.

### Score colour ramp

The score gauge transitions through these based on numeric value:

| Score range | Colour              | Token            |
|-------------|---------------------|------------------|
| 0 to 30     | Red                 | `--state-danger` |
| 31 to 50    | Orange              | `--state-warning`|
| 51 to 70    | Yellow              | `#CA8A04`        |
| 71 to 100   | Green               | `--state-success`|

---

## Spacing

4px base unit. Tight at small scales, generous at large.

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
--space-24:  96px
--space-32:  128px
--space-40:  160px
```

Vertical rhythm between sections is generous. Between hero and first content block: `--space-32` to `--space-40`. Between adjacent cards in a grid: `--space-6` to `--space-8`.

---

## Radius

```
--radius-sm:    4px      /* badges, pills */
--radius-md:    8px      /* buttons, inputs */
--radius-lg:    12px     /* cards */
--radius-xl:    16px     /* large cards, score card */
--radius-2xl:   24px     /* hero blocks, the big forest green panels */
--radius-full:  9999px   /* pill buttons, the "Get Seen By AI" CTA */
```

The score card uses `--radius-2xl`. The CTA buttons are `--radius-full`. Don't mix.

---

## Shadow

Soft, subtle, almost imperceptible. Cytd uses very light shadows; lean into that restraint.

```
--shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.04)
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)
--shadow-md:  0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)
--shadow-lg:  0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)
```

Cards use `--shadow-sm`. Hovered cards use `--shadow-md`. Avoid `--shadow-lg` outside of modals.

---

## Motion

```
--motion-instant:  0ms
--motion-fast:     120ms
--motion-base:     180ms
--motion-slow:     280ms
--motion-deliberate: 480ms     /* score reveal, progress fill */

--ease-standard:   cubic-bezier(0.2, 0, 0, 1)
--ease-emphasized: cubic-bezier(0.3, 0, 0, 1)
```

Default transition: `all var(--motion-base) var(--ease-standard)`.

The score number on the results page should count up from 0 to its final value over `--motion-deliberate`. The progress bar during scanning should ease, never jerk.

Respect `prefers-reduced-motion`. Disable all non-essential animation when set.

---

## The [bracket] motif

Cytd's signature pattern. The brand uses square brackets around dynamic values: domain names, scores, numerics. It signals "this is a slot, this is the data."

**Use it for:**
- The user's domain when echoed back: `[bainsquared.com]`
- Score numerics: `[20]`, `[56]`, `[74]`
- The wordmark itself: `cytd.[ai]` style

**Don't use it for:**
- Body copy
- Generic emphasis
- Marketing headlines without a real "slot" concept

The brackets should always be in the same colour as the value they wrap, and should be in the mono display font, not the body font.

---

## Component patterns

### Buttons

Three variants. No fourth.

**Primary:** Pill (`--radius-full`), `--brand-primary` background, white text, `--space-3` vertical padding, `--space-6` horizontal. Hover: `--brand-primary-pressed`.

**Secondary:** Pill, `--surface-card` background, `--text-primary` text, 1px `--border-default` border. Hover: `--surface-card-soft`.

**Ghost:** No background, no border. `--text-primary` text. Hover: `--surface-card-soft`. Used for navigation links.

States required for all: default, hover, focus-visible, active, disabled, loading. Loading shows a spinner that uses `currentColor`.

### Cards

`--surface-card` background, `--radius-xl`, `--shadow-sm`, `--space-8` padding internally. Title uses `text-2xl` mono. Body uses `text-base` Inter. Card titles never use sentence-case marketing copy; they're labels.

### Score card (the marquee component)

Takes the full screenshot treatment. Two stacked sections:

1. Top: pink-tinted background (`#FCEAEA` for low scores, `#FEF3C7` for medium, `#DCFCE7` for high). Half-circle gauge animated to fill based on score. The big `[##]` number in mono display. Status badge ("Needs Improvement", "Good Standing", etc.) in a chip.
2. Bottom: white background. "Cytd Score" label. One sentence describing what the score means.

Always animate the score reveal. Always.

### Platform badges

`--surface-card-soft` background, `--radius-lg`, `--space-6` padding. Platform logo on top, name in `text-sm` Inter, status ("Found" / "Not found") in `text-sm` with state colour. Four side by side on desktop, two by two on mobile.

### Question grid

Two columns: question text on the left in italic mono `text-base`, status badge on the right. Each row separated by 1px `--border-subtle`. Italic differentiates "this is a quoted question" from headings or body.

---

## Accessibility

Non-negotiable.

- All interactive elements must have a `:focus-visible` state with a 2px `--brand-primary` ring offset by 2px.
- Text contrast: 4.5:1 minimum for body, 3:1 for large text.
- Touch targets: 44px minimum on mobile.
- All form inputs must have visible labels. No placeholder-only inputs.
- All images must have meaningful `alt` text or `alt=""` if decorative.
- All animations must respect `prefers-reduced-motion`.
- Tab order must follow visual order. No `tabIndex` hacks.
- Keyboard-only users must be able to complete the entire scan flow.

---

## What this system rejects

- Gradients on text or buttons (except the score gauge ring)
- Drop shadows heavier than `--shadow-md` outside modals
- More than two font families
- Coloured backgrounds on body text
- Decorative emoji in product copy
- Glassmorphism, neumorphism, or any other "morphism"
- Stock illustrations
- AI-generated imagery in marketing surfaces

The design language is technical, considered, and earnest. Every visual decision should feel like it was made by an operator, not a marketer.
