import { Bracket } from "@/components/ui/Bracket";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <h2 className="text-xs font-sans font-bold text-text-tertiary uppercase tracking-widest mb-6 pb-3 border-b border-border-default">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({ label, hex, bgClass }: { label: string; hex: string; bgClass: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-12 w-full rounded-lg border border-border-subtle ${bgClass}`} />
      <p className="text-xs font-medium text-text-primary">{label}</p>
      <p className="text-xs font-sans text-text-tertiary">{hex}</p>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <header className="mb-20">
        <p className="text-xs font-sans text-text-tertiary uppercase tracking-widest mb-4">
          Bain Squared
        </p>
        <h1 className="text-4xl font-sans font-bold text-text-primary mb-4">
          Design System
        </h1>
        <p className="text-base text-text-secondary max-w-lg">
          Every token, component, and state. This page is the visual regression check for the scorecard build.
        </p>
      </header>

      {/* ── Colours: Surface ────────────────────────────────────────── */}
      <Section title="Colours — Surface">
        <div className="grid grid-cols-5 gap-4">
          <Swatch label="surface-canvas" hex="#F7F5F2" bgClass="bg-surface-canvas" />
          <Swatch label="surface-card" hex="#FFFFFF" bgClass="bg-surface-card" />
          <Swatch label="surface-card-soft" hex="#EFEDE8" bgClass="bg-surface-card-soft" />
          <Swatch label="surface-inverse" hex="#1A1A1A" bgClass="bg-surface-inverse" />
          <Swatch label="surface-accent" hex="#174C3C" bgClass="bg-surface-accent" />
        </div>
      </Section>

      {/* ── Colours: Text ───────────────────────────────────────────── */}
      <Section title="Colours — Text">
        <div className="grid grid-cols-5 gap-4">
          <Swatch label="text-primary" hex="#1A1A1A" bgClass="bg-text-primary" />
          <Swatch label="text-secondary" hex="#6B7280" bgClass="bg-text-secondary" />
          <Swatch label="text-tertiary" hex="#A3A3A3" bgClass="bg-text-tertiary" />
          <Swatch label="text-inverse" hex="#FFFFFF" bgClass="bg-text-inverse" />
          <Swatch label="text-accent" hex="#174C3C" bgClass="bg-text-accent" />
        </div>
      </Section>

      {/* ── Colours: Brand ──────────────────────────────────────────── */}
      <Section title="Colours — Brand">
        <div className="grid grid-cols-5 gap-4">
          <Swatch label="brand-primary" hex="#174C3C" bgClass="bg-brand-primary" />
          <Swatch label="brand-primary-pressed" hex="#103A2D" bgClass="bg-brand-primary-pressed" />
          <Swatch label="brand-primary-soft" hex="#E8F0EC" bgClass="bg-brand-primary-soft" />
        </div>
      </Section>

      {/* ── Colours: State ──────────────────────────────────────────── */}
      <Section title="Colours — State">
        <div className="grid grid-cols-5 gap-4">
          <Swatch label="state-success" hex="#16A34A" bgClass="bg-state-success" />
          <Swatch label="state-success-soft" hex="#DCFCE7" bgClass="bg-state-success-soft" />
          <Swatch label="state-warning" hex="#D97706" bgClass="bg-state-warning" />
          <Swatch label="state-warning-soft" hex="#FEF3C7" bgClass="bg-state-warning-soft" />
          <Swatch label="state-danger" hex="#B91C1C" bgClass="bg-state-danger" />
          <Swatch label="state-danger-soft" hex="#FEE2E2" bgClass="bg-state-danger-soft" />
          <Swatch label="state-info" hex="#3E5C76" bgClass="bg-state-info" />
          <Swatch label="state-info-soft" hex="#E5EAF0" bgClass="bg-state-info-soft" />
          <Swatch label="state-caution" hex="#CA8A04" bgClass="bg-state-caution" />
          <Swatch label="state-caution-soft" hex="#FEF9C3" bgClass="bg-state-caution-soft" />
        </div>
      </Section>

      {/* ── Colours: Score ramp ─────────────────────────────────────── */}
      <Section title="Colours — Score card tints">
        <div className="grid grid-cols-5 gap-4">
          <Swatch label="score-low-bg (0–30)" hex="#FCEAEA" bgClass="bg-score-low-bg" />
          <Swatch label="score-mid-bg (31–70)" hex="#FEF3C7" bgClass="bg-score-mid-bg" />
          <Swatch label="score-high-bg (71–100)" hex="#DCFCE7" bgClass="bg-score-high-bg" />
        </div>
      </Section>

      {/* ── Type scale ──────────────────────────────────────────────── */}
      <Section title="Type scale — Sans (Inter)">
        <div className="space-y-5">
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">text-xs · 12/16</span>
            <span className="text-xs text-text-primary font-sans">Intangible Asset Valuation Scorecard</span>
          </div>
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">text-sm · 14/20</span>
            <span className="text-sm text-text-primary font-sans">Intangible Asset Valuation Scorecard</span>
          </div>
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">text-base · 16/24</span>
            <span className="text-base text-text-primary font-sans">Intangible Asset Valuation Scorecard</span>
          </div>
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">text-lg · 18/28</span>
            <span className="text-lg text-text-primary font-sans">Intangible Asset Valuation</span>
          </div>
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">text-xl · 20/28</span>
            <span className="text-xl text-text-primary font-sans">Intangible Asset Valuation</span>
          </div>
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">text-2xl · 24/32</span>
            <span className="text-2xl text-text-primary font-sans">Intangible Asset</span>
          </div>
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">text-3xl · 30/36</span>
            <span className="text-3xl text-text-primary font-sans">Intangible Asset</span>
          </div>
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">text-4xl · 36/40</span>
            <span className="text-4xl text-text-primary font-sans">IA Valuation</span>
          </div>
          <div className="flex items-baseline gap-6 pb-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">text-5xl · 48/52</span>
            <span className="text-5xl text-text-primary font-sans">Bain Squared</span>
          </div>
        </div>
      </Section>

      <Section title="Type scale — display sizes">
        <div className="space-y-6">
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-40 shrink-0">text-4xl · 36/40</span>
            <span className="text-4xl font-sans font-bold text-text-primary">Bain Squared</span>
          </div>
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-40 shrink-0">text-6xl · 60/64</span>
            <span className="text-6xl font-sans font-bold text-text-primary leading-none">[ESOP]</span>
          </div>
          <div className="flex items-baseline gap-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-sans text-text-tertiary w-40 shrink-0">text-display · 80/84</span>
            <span className="text-display font-sans font-bold text-text-primary leading-none">[74]</span>
          </div>
          <div className="flex items-baseline gap-6 pb-4">
            <span className="text-xs font-sans text-text-tertiary w-40 shrink-0">text-score · 96/96</span>
            <span className="text-score font-sans font-bold text-brand-primary leading-none">[74]</span>
          </div>
        </div>
      </Section>

      {/* ── Spacing scale ───────────────────────────────────────────── */}
      <Section title="Spacing scale (4px base unit)">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-1 / 4px</span>
            <div className="h-3 w-1 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-2 / 8px</span>
            <div className="h-3 w-2 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-3 / 12px</span>
            <div className="h-3 w-3 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-4 / 16px</span>
            <div className="h-3 w-4 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-5 / 20px</span>
            <div className="h-3 w-5 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-6 / 24px</span>
            <div className="h-3 w-6 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-8 / 32px</span>
            <div className="h-3 w-8 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-10 / 40px</span>
            <div className="h-3 w-10 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-12 / 48px</span>
            <div className="h-3 w-12 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-16 / 64px</span>
            <div className="h-3 w-16 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-20 / 80px</span>
            <div className="h-3 w-20 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-24 / 96px</span>
            <div className="h-3 w-24 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-32 / 128px</span>
            <div className="h-3 w-32 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-text-tertiary w-36 shrink-0">space-40 / 160px</span>
            <div className="h-3 w-40 bg-brand-primary-soft border border-brand-primary rounded-sm" />
          </div>
        </div>
      </Section>

      {/* ── Shadow scale ────────────────────────────────────────────── */}
      <Section title="Shadow scale">
        <div className="grid grid-cols-4 gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-20 bg-surface-card rounded-xl shadow-xs" />
            <span className="text-xs font-sans text-text-tertiary">shadow-xs</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-20 bg-surface-card rounded-xl shadow-sm" />
            <span className="text-xs font-sans text-text-tertiary">shadow-sm</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-20 bg-surface-card rounded-xl shadow-md" />
            <span className="text-xs font-sans text-text-tertiary">shadow-md</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-20 bg-surface-card rounded-xl shadow-lg" />
            <span className="text-xs font-sans text-text-tertiary">shadow-lg</span>
          </div>
        </div>
      </Section>

      {/* ── Border radius ───────────────────────────────────────────── */}
      <Section title="Border radius">
        <div className="flex items-end gap-8 flex-wrap">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-brand-primary-soft border border-brand-primary rounded-sm" />
            <span className="text-xs font-sans text-text-tertiary">rounded-sm / 4px</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-brand-primary-soft border border-brand-primary rounded-md" />
            <span className="text-xs font-sans text-text-tertiary">rounded-md / 8px</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-brand-primary-soft border border-brand-primary rounded-lg" />
            <span className="text-xs font-sans text-text-tertiary">rounded-lg / 12px</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-brand-primary-soft border border-brand-primary rounded-xl" />
            <span className="text-xs font-sans text-text-tertiary">rounded-xl / 16px</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-brand-primary-soft border border-brand-primary rounded-2xl" />
            <span className="text-xs font-sans text-text-tertiary">rounded-2xl / 24px</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-brand-primary-soft border border-brand-primary rounded-full" />
            <span className="text-xs font-sans text-text-tertiary">rounded-full</span>
          </div>
        </div>
      </Section>

      {/* ── Bracket ─────────────────────────────────────────────────── */}
      <Section title="Bracket">
        <div className="space-y-8">
          <div className="flex flex-wrap items-end gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans text-text-tertiary">Track name</span>
              <Bracket color="brand" className="text-4xl">[ESOP]</Bracket>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans text-text-tertiary">Track name</span>
              <Bracket color="brand" className="text-4xl">[Brand &amp; IP]</Bracket>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans text-text-tertiary">Score — display</span>
              <Bracket color="brand" className="text-display">74</Bracket>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans text-text-tertiary">Score — score size</span>
              <Bracket color="brand" className="text-score">74</Bracket>
            </div>
          </div>
          <div>
            <p className="text-xs font-sans text-text-tertiary mb-4">All colour variants</p>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <Bracket color="brand" className="text-2xl">42</Bracket>
                <span className="text-xs font-sans text-text-tertiary">brand</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Bracket color="primary" className="text-2xl">42</Bracket>
                <span className="text-xs font-sans text-text-tertiary">primary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Bracket color="secondary" className="text-2xl">42</Bracket>
                <span className="text-xs font-sans text-text-tertiary">secondary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Bracket color="tertiary" className="text-2xl">42</Bracket>
                <span className="text-xs font-sans text-text-tertiary">tertiary</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-surface-inverse p-3 rounded-lg">
                <Bracket color="inverse" className="text-2xl">42</Bracket>
                <span className="text-xs font-sans text-text-inverse">inverse</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Bracket color="success" className="text-2xl">42</Bracket>
                <span className="text-xs font-sans text-text-tertiary">success</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Bracket color="warning" className="text-2xl">42</Bracket>
                <span className="text-xs font-sans text-text-tertiary">warning</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Bracket color="danger" className="text-2xl">42</Bracket>
                <span className="text-xs font-sans text-text-tertiary">danger</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Bracket color="info" className="text-2xl">42</Bracket>
                <span className="text-xs font-sans text-text-tertiary">info</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Button ──────────────────────────────────────────────────── */}
      <Section title="Button">
        <div className="space-y-10">
          <div>
            <p className="text-xs font-sans text-text-tertiary mb-4">Primary — sizes and states</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Default</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" disabled size="md">Disabled</Button>
              <Button variant="primary" loading size="md">Loading</Button>
            </div>
          </div>
          <div>
            <p className="text-xs font-sans text-text-tertiary mb-4">Secondary — sizes and states</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm">Small</Button>
              <Button variant="secondary" size="md">Default</Button>
              <Button variant="secondary" size="lg">Large</Button>
              <Button variant="secondary" disabled size="md">Disabled</Button>
              <Button variant="secondary" loading size="md">Loading</Button>
            </div>
          </div>
          <div>
            <p className="text-xs font-sans text-text-tertiary mb-4">Ghost — sizes and states</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" size="sm">Small</Button>
              <Button variant="ghost" size="md">Default</Button>
              <Button variant="ghost" size="lg">Large</Button>
              <Button variant="ghost" disabled size="md">Disabled</Button>
              <Button variant="ghost" loading size="md">Loading</Button>
            </div>
          </div>
          <div className="bg-surface-inverse p-6 rounded-2xl">
            <p className="text-xs font-sans text-text-inverse mb-4">Primary on dark surface</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="md">Book a Call</Button>
              <Button variant="secondary" size="md">Learn more</Button>
              <Button variant="ghost" size="md">Dismiss</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Card ────────────────────────────────────────────────────── */}
      <Section title="Card">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <p className="text-xs font-sans text-text-tertiary mb-2">Default (shadow-sm)</p>
            <h3 className="text-xl font-sans font-bold text-text-primary mb-3">
              ESOP Valuation Gap
            </h3>
            <p className="text-base text-text-secondary">
              Your grant-date fair value has not been formally documented. This creates exposure at the next audit cycle.
            </p>
          </Card>
          <Card hover>
            <p className="text-xs font-sans text-text-tertiary mb-2">Hover (lifts to shadow-md)</p>
            <h3 className="text-xl font-sans font-bold text-text-primary mb-3">
              Brand IP Readiness
            </h3>
            <p className="text-base text-text-secondary">
              Your brand has regional licensing potential. A Relief-from-Royalty valuation would substantiate the rate.
            </p>
          </Card>
        </div>
        <div className="mt-6">
          <Card className="bg-surface-card-soft">
            <p className="text-xs font-sans text-text-tertiary mb-2">With className override (surface-card-soft)</p>
            <p className="text-base text-text-secondary">
              Card accepts a className prop for background overrides while keeping radius, shadow, and padding.
            </p>
          </Card>
        </div>
      </Section>

      {/* ── Badge ───────────────────────────────────────────────────── */}
      <Section title="Badge">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-sans text-text-tertiary mb-3">All variants</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>
          <div>
            <p className="text-xs font-sans text-text-tertiary mb-3">In context — scorecard outcome labels</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="danger">Immediate Action Required</Badge>
              <Badge variant="warning">Valuation Gap</Badge>
              <Badge variant="success">Valuation Ready</Badge>
              <Badge variant="info">Exploring Options</Badge>
              <Badge variant="default">Education Lead</Badge>
            </div>
          </div>
          <div>
            <p className="text-xs font-sans text-text-tertiary mb-3">In context — sales triage tags</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="danger">esop_hot_lead</Badge>
              <Badge variant="warning">esop_needs_report</Badge>
              <Badge variant="info">esop_education_lead</Badge>
              <Badge variant="success">fundraising_valuation_lead</Badge>
              <Badge variant="default">brand_valuation_lead</Badge>
              <Badge variant="warning">strategic_transaction_lead</Badge>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Progress ────────────────────────────────────────────────── */}
      <Section title="Progress">
        <div className="space-y-8 max-w-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-sans text-text-tertiary">0% — start</span>
              <span className="text-xs font-sans text-text-tertiary">Q0 of 8</span>
            </div>
            <Progress value={0} label="0% progress" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-sans text-text-tertiary">12.5%</span>
              <span className="text-xs font-sans text-text-tertiary">Q1 of 8</span>
            </div>
            <Progress value={12.5} label="12.5% progress" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-sans text-text-tertiary">37.5%</span>
              <span className="text-xs font-sans text-text-tertiary">Q3 of 8</span>
            </div>
            <Progress value={37.5} label="37.5% progress" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-sans text-text-tertiary">62.5%</span>
              <span className="text-xs font-sans text-text-tertiary">Q5 of 8</span>
            </div>
            <Progress value={62.5} label="62.5% progress" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-sans text-text-tertiary">87.5%</span>
              <span className="text-xs font-sans text-text-tertiary">Q7 of 8</span>
            </div>
            <Progress value={87.5} label="87.5% progress" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-sans text-text-tertiary">100% — complete</span>
              <span className="text-xs font-sans text-text-tertiary">Q8 of 8</span>
            </div>
            <Progress value={100} label="100% progress" />
          </div>
          <p className="text-xs text-text-tertiary pt-2">
            Animates from 0 to target value on mount (deliberate easing, 480ms). Refresh to replay.
          </p>
        </div>
      </Section>

      <footer className="mt-8 pt-8 border-t border-border-default">
        <p className="text-xs font-sans text-text-tertiary">
          Bain Squared Design System — Phase 1 complete
        </p>
      </footer>
    </div>
  );
}
