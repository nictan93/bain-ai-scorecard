# Build Walkthrough — Bain Squared Scorecard

A step-by-step companion to `PROJECT_GUIDE.md`. Open this in one window, your Terminal in another, and work through it top to bottom. Don't skip steps. Where something says **STOP**, finish that step before moving on.

You have: PRD.md, CONTEXT.md, DESIGN_TOKENS.md, PROJECT_GUIDE.md. GitHub account. Vercel account. Mac.

You don't have yet: Node.js, Claude Code CLI, the project itself.

Total time end-to-end for Phase 0: about 45 minutes if nothing goes sideways.

---

## Step 1 — Install Node.js

Claude Code and Next.js both need Node.js. The cleanest install on Mac is via Homebrew. If you don't have Homebrew, install it first.

Open Terminal (Cmd+Space, type "Terminal"). Paste this and press Enter:

```bash
# Install Homebrew if you don't have it. Skip if `brew --version` already works.
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. It will ask for your Mac password. After it finishes, it usually prints two lines starting with `eval` that you need to run to add Homebrew to your shell. Run them.

Then install Node.js:

```bash
brew install node
```

Verify:

```bash
node -v
npm -v
```

You want Node v20 or higher. If you see `v20.x.x` or `v22.x.x`, you're good.

---

## Step 2 — Install Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
```

Verify:

```bash
claude --version
```

The first time you run `claude` in a project, it will ask you to authenticate. Use the same email as your Anthropic/Claude account. We'll do that in Step 5.

---

## Step 3 — Create the project folder

We'll keep the build code separate from this `Bain Squared` planning folder. Cleaner. Run:

```bash
cd ~/Desktop
mkdir bain-scorecard
cd bain-scorecard
```

You're now sitting in an empty folder at `~/Desktop/bain-scorecard`.

---

## Step 4 — Scaffold Next.js

```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"
```

That trailing `.` is important — it scaffolds into the current folder instead of a subfolder. Answer any remaining prompts with the defaults (Yes to Turbopack is fine).

When it finishes, run:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser. You should see the default Next.js welcome page. Press `Ctrl+C` in Terminal to stop the dev server.

**STOP.** If localhost:3000 didn't load, fix that before continuing. Common cause: another process on port 3000. Try `npm run dev -- -p 3001` and visit `localhost:3001`.

---

## Step 5 — Copy the planning docs into the repo

Claude Code reads files in the current project folder. Move PRD, CONTEXT, DESIGN_TOKENS, and PROJECT_GUIDE in so it can see them.

```bash
cp "/Users/nicholas/Desktop/Claude Cowork/Bain Squared/Bain Squared/PRD.md" .
cp "/Users/nicholas/Desktop/Claude Cowork/Bain Squared/Bain Squared/CONTEXT.md" .
cp "/Users/nicholas/Desktop/Claude Cowork/Bain Squared/Bain Squared/DESIGN_TOKENS.md" .
cp "/Users/nicholas/Desktop/Claude Cowork/Bain Squared/Bain Squared/PROJECT_GUIDE.md" .
cp "/Users/nicholas/Desktop/Claude Cowork/Bain Squared/Bain Squared/Bain_Squared_context.md" .
```

Verify:

```bash
ls *.md
```

You should see all five files plus the default `README.md` Next.js created.

Now rename `CONTEXT.md` to `CLAUDE.md`. Claude Code looks for `CLAUDE.md` by convention as its working memory.

```bash
cp CONTEXT.md CLAUDE.md
```

Keep both. `CONTEXT.md` is your reference; `CLAUDE.md` is what Claude Code auto-loads.

---

## Step 6 — Install the project dependencies

```bash
npm install framer-motion react-hook-form zod @radix-ui/react-radio-group @radix-ui/react-progress @vercel/postgres resend
```

Wait for it to finish. No errors expected.

---

## Step 7 — Initialise git and push to GitHub

`create-next-app` already ran `git init` for you. You just need to add the docs and connect a remote.

```bash
git add .
git commit -m "Initial scaffold: Next.js + planning docs"
```

Now create the GitHub repo. Two ways:

**Option A — through the website (easier for newbies):**
1. Go to github.com, click the green "New" button (or visit github.com/new).
2. Name it `bain-scorecard`. Private. Don't initialise with a README, .gitignore, or license — your local repo already has them.
3. Click "Create repository".
4. On the next screen, copy the two commands under "…or push an existing repository from the command line". They look like this:

```bash
git remote add origin git@github.com:yourusername/bain-scorecard.git
git branch -M main
git push -u origin main
```

Paste both into Terminal. If GitHub asks for authentication, set up an SSH key (one-time, instructions at github.com/settings/keys) or use HTTPS with a personal access token.

**Option B — through GitHub CLI (faster if you want to install it):**
```bash
brew install gh
gh auth login
gh repo create bain-scorecard --private --source=. --remote=origin --push
```

Either way: refresh the GitHub repo page and you should see your files.

---

## Step 8 — Connect Vercel for auto-deploys

1. Go to vercel.com, sign in.
2. Click "Add New" → "Project".
3. Find `bain-scorecard` in the GitHub repo list. If you don't see it, click "Adjust GitHub App Permissions" and grant Vercel access to that repo.
4. Click "Import".
5. Leave all defaults. Framework Preset should auto-detect as Next.js.
6. Click "Deploy".

Wait for the build (about a minute). When it finishes, you'll get a URL like `bain-scorecard.vercel.app`. Open it. You should see the default Next.js page on the live internet.

From now on, every push to `main` redeploys production. Every push to a feature branch gets its own preview URL. This is the deployment model — git is your ship button.

**STOP.** Phase 0 is done when this URL works. Don't move on until it does.

---

## Step 9 — DNS for ia.bainsquared.com (can do now or later)

You can skip this until you're closer to launch. If you want to wire it up now:

1. In Vercel, go to your project → Settings → Domains.
2. Type `ia.bainsquared.com`. Click Add.
3. Vercel shows you a CNAME record to add — usually `cname.vercel-dns.com`.
4. Wherever your `bainsquared.com` DNS lives (Cloudflare, GoDaddy, Namecheap, etc.), add a CNAME record:
   - Name: `ia`
   - Value: `cname.vercel-dns.com`
   - TTL: default (1 hour or auto)
5. Save. Within a few minutes Vercel verifies and issues the SSL cert automatically.

If you'd rather lock the build in first and do the domain later, skip this. The vercel.app URL is fine for the whole build.

---

## Step 10 — Open Claude Code in the project

Back in Terminal, make sure you're in the project folder:

```bash
cd ~/Desktop/bain-scorecard
claude
```

First run will ask you to authenticate. Follow the link, sign in with the same Anthropic account, paste the token back.

When it's ready, you'll see a prompt. Now you're talking to Claude Code with the full project (PRD.md, CONTEXT.md, DESIGN_TOKENS.md, etc.) as context.

---

## The phase prompts

Below are the exact prompts to paste into Claude Code, one phase at a time. Don't paste them all at once. Finish a phase, look at what was built, commit, push, deploy, then move to the next.

### Master kickoff (paste this first thing in a fresh Claude Code session)

```
Read PROJECT_GUIDE.md, PRD.md, CONTEXT.md, DESIGN_TOKENS.md, and Bain_Squared_context.md before doing anything. CONTEXT.md is your working memory — its rules override your defaults.

Constraints I want enforced for the whole build:
- TypeScript strict, no any, no @ts-ignore
- Tailwind only, no inline styles, no CSS modules
- All copy in src/content/, never inline
- All colors and spacing reference tailwind.config.ts tokens, no raw hex
- Server components by default; client components only where state, motion, or browser APIs require it
- One question schema is the source of truth (src/content/questions.ts)
- Brand voice: no em dashes, no corporate phrases (leverage, synergy, unlock value), answer-first

Confirm you've read all five docs and summarise back to me in 5 bullets: what we're building, the two tracks, the five primitive components, the file structure, and the brand voice rules. Then wait for my next instruction. Don't write code yet.
```

This first prompt is a comprehension check. If the summary is wrong, the build will be wrong. Re-prompt until the summary matches your docs.

### Phase 1 prompt (after Phase 0 is deployed)

```
Phase 1: Design system foundation. Per PROJECT_GUIDE.md section 5 and DESIGN_TOKENS.md.

1. Replace tailwind.config.ts with the token-driven config from PROJECT_GUIDE.md section 5.1. Every value comes from DESIGN_TOKENS.md.
2. Update src/app/layout.tsx with Inter and JetBrains Mono via next/font, exposing them as --font-inter and --font-jetbrains. Body should be bg-surface-canvas text-text-primary font-sans.
3. Update src/app/globals.css to set up CSS variables for runtime tokens.
4. Build five primitive components in src/components/ui/, in this order:
   - Bracket — wraps any value in [ ] using mono font, accepts a `color` prop
   - Button — variants primary/secondary/ghost, all states (default, hover, focus-visible, active, disabled, loading)
   - Card — surface-card bg, rounded-xl, shadow-sm, padding-8 inside, hover lifts to shadow-md
   - Badge — small status pill, variants for each state token
   - Progress — thin bar, brand-primary on brand-primary-soft track, animates with deliberate easing
5. Create a /styleguide route at src/app/styleguide/page.tsx that renders every component in every state, plus type ramp, color swatches, spacing scale, shadow scale.

Don't touch the assessment or landing page yet. When you're done, run npm run dev so I can review at localhost:3000/styleguide before we commit.
```

Review the styleguide on localhost. If it looks right, commit and push:

```bash
git add .
git commit -m "Phase 1: design system foundation"
git push
```

Vercel will redeploy automatically. Check the live URL at `bain-scorecard.vercel.app/styleguide`.

### Phase 2 prompt — static screens

```
Phase 2: Static screens with hard-coded data per PROJECT_GUIDE.md section 4. No logic, no routing, no scoring yet.

Build three screens:
1. Landing page at src/app/page.tsx — hero with positioning copy from PRD.md, three benefit blocks, single CTA into /scorecard. Use the Bracket motif for the headline keyword.
2. Assessment shell at src/app/scorecard/page.tsx — Question component with options (radio group), Progress bar showing X of Y, "Next" button. Hard-code one sample question from CONTEXT.md style, single_select type.
3. Result page at src/app/scorecard/result/page.tsx — hard-code score=74, track=ESOP, sample outcome. Build the ScoreCard component here (PROJECT_GUIDE.md section 5.3 item 5). Animate the score from 0 to 74 over the deliberate duration (480ms).

Mobile first. Test at 380px. The score number must still feel marquee on a phone.

When done, run npm run dev so I can click through all three screens.
```

Commit, push, check the deploy. Same pattern from here on.

### Phase 3 prompt — core logic

```
Phase 3: Core logic per PROJECT_GUIDE.md section 4 (Phase 3) and section 6.3.

Pure functions only. No UI integration in this phase.

1. Define src/content/questions.ts with the full Question/Option/Outcome/Track/BackendTag types from PROJECT_GUIDE.md section 3.3, plus the full question content for both tracks (universal routing Q1/Q2 + 8 to 10 ESOP questions + 8 to 10 Brand/IP questions). Pull question copy from PRD.md and Bain_Squared_context.md. Show me the question copy as a draft before finalising — don't ship questions I haven't reviewed.
2. Define src/content/outcomes.ts — score-range to outcome mapping for both tracks, with title, description, recommendedNextStep, ctaLabel, ctaUrl. Use placeholder Calendly URLs for now.
3. Implement src/lib/routing.ts: determineTrack(answers): Track
4. Implement src/lib/scoring.ts: calculateScore(answers, questions): number, plus maxScore helper
5. Implement src/lib/tags.ts: deriveTags(state): BackendTag[] — see section 6.3 for the rule pattern
6. Implement src/lib/outcomes.ts: getOutcome(track, score): Outcome

Add a temporary /test route at src/app/test/page.tsx that renders sample answer sets and shows me track + score + tags + outcome. Delete it after Phase 4.

Stop and show me the question copy first. Don't write the lib code until I've signed off on the questions.
```

This is the phase where most projects stall. Lock the question copy before letting Claude Code wire it up. If you hate any wording, fix it at this step. Changing it later means changing scoring, tags, and outcomes too.

### Phase 4 prompt — happy path wiring

```
Phase 4: Wire the static UI to the logic. Per PROJECT_GUIDE.md section 4 (Phase 4).

1. Add state management to /scorecard route. Use a useReducer with the AssessmentState shape from PROJECT_GUIDE.md.
2. Wire question advance: select option -> store answer -> derive next question -> render. Use determineTrack after Q1 (and Q2 if "not sure") to set track in state.
3. On final track question: calculate score, derive tags, get outcome. Navigate to /scorecard/result, passing state via sessionStorage (URL search params would leak data into Vercel logs).
4. Result page reads state from sessionStorage on mount, renders the real score/outcome/CTA. If sessionStorage is empty, redirect back to /scorecard.
5. Delete the /test route from Phase 3.

Test the full happy path: click landing -> start -> answer through ESOP track -> result. Then again with Brand/IP. Then again with the "not sure" routing path. All three should land on the right outcome.
```

### Phase 5 prompt — backend

```
Phase 5: Backend. Per PROJECT_GUIDE.md section 6.

1. Provision Vercel Postgres from the Vercel dashboard, then add the schema from section 6.1 via the Vercel Postgres SQL editor. Tell me when you're ready and I'll do it manually — I want to see the table created.
2. Build the API route at src/app/api/submit/route.ts per section 6.2. Use the Zod SubmissionSchema as the validator.
3. Add the lead capture form to /scorecard/result. Email required, name and company optional. React Hook Form + Zod. Show score and outcome immediately on completion; gate ONLY the recommended-next-step CTA behind email submission.
4. Build two React Email templates in src/emails/:
   - UserResultEmail.tsx — their score, their outcome, the CTA
   - SalesLeadEmail.tsx — full submission with tags highlighted, formatted for fast triage
5. Wire Resend. I'll add RESEND_API_KEY to Vercel env vars myself once you tell me what to set up.

Failure modes to handle: network error on submit, validation error, Postgres unavailable. Show user-friendly errors, never lose data.

Don't touch RESEND_API_KEY or POSTGRES_URL in code. Read them from process.env. Log to console.error on failure but don't expose internal errors to the client.
```

Before this phase, you'll need to set up Resend (resend.com) and verify the `bainsquared.com` domain there for sending email. That's a 10-minute task: add a few DNS records, click verify. Do it before pasting the Phase 5 prompt.

### Phase 6 prompt — polish

```
Phase 6: Polish. Per PROJECT_GUIDE.md section 4 (Phase 6).

1. Accessibility audit. Tab through the entire flow with keyboard. Run axe DevTools mentally and fix every violation. Focus rings visible everywhere. Radix primitives should give us most of this — verify they're wired correctly.
2. Mobile pass. 380px viewport. Score reveal must feel marquee. Question text not cramped. Form usable.
3. Performance. Lazy-load Framer Motion where possible. Use `next/font` (already done) for self-hosted fonts. Check there are no client components where server components would do.
4. SEO. Meta tags + OG image on landing. Sitemap.xml. Robots.txt allows /, disallows /scorecard and /scorecard/result.
5. Analytics events. Fire on scorecard_started, question_answered, scorecard_completed, email_submitted. Use Vercel Analytics. No third-party scripts unless I approve them.
6. Edge cases. Mid-assessment refresh: state resets, document this in CLAUDE.md. Postgres down at submit: log to console, show user a "we got your details, we'll be in touch" message — don't lose the lead. Same email twice: allow it.

Run Lighthouse on the production deploy. Target 95+ across the board. Send me the numbers.
```

---

## What to do between phases

Every time Claude Code finishes a phase:

1. Read the diff. `git diff` in Terminal, or just look at the files Claude touched. You don't need to understand every line. You need to spot anything that looks wrong — copy that doesn't sound like you, a hex value where a token should be, a weird new dependency.
2. Click through localhost:3000 yourself. Don't trust "looks good to me" from the model.
3. Commit with a descriptive message. `git add . && git commit -m "Phase 2: static screens"`.
4. Push. `git push`. Vercel redeploys.
5. Click through the live preview URL too. Production-like environments catch things localhost doesn't.

If a phase looks 80% right, push back. Specific feedback lands better than "redo it":
- "The headline copy on the landing page reads like marketing fluff. Use this instead: [...]"
- "The progress bar transition is too fast. Use the deliberate duration (480ms) per DESIGN_TOKENS.md."
- "You used a raw hex in Card.tsx line 14. Use the surface-card token."

---

## Common gotchas for newbies

**Authentication on first push to GitHub.** If `git push` asks for a password, GitHub doesn't accept passwords anymore. Either set up SSH keys (github.com/settings/keys) or generate a Personal Access Token (github.com/settings/tokens, "classic" with `repo` scope) and use that as the password.

**`npm run dev` works locally but Vercel deploy fails.** Almost always TypeScript or ESLint errors that `npm run dev` ignores but `npm run build` doesn't. Run `npm run build` locally before pushing if Vercel is unhappy. Tell Claude Code to fix the build errors specifically.

**`Module not found` after Claude adds a dependency.** Run `npm install` after every change to package.json. Claude Code usually does this; if it forgets, do it yourself.

**Environment variables.** Never paste a real API key into a chat or commit one to git. In Vercel: Project → Settings → Environment Variables. In local dev: create `.env.local` (already in .gitignore by default with create-next-app). Format: `RESEND_API_KEY=re_xxx`. Restart `npm run dev` after editing `.env.local`.

**The model goes off-script.** If Claude Code starts adding libraries you didn't ask for, picking different patterns than CONTEXT.md, or writing copy that sounds AI-generated, stop it. Re-paste the relevant section of CONTEXT.md into chat and tell it to redo. The CLAUDE.md file is the source of truth — point at it.

**Don't accept "I added a TODO comment for that".** If the model leaves a TODO instead of finishing the work, the build is half done. Push back: "Finish the implementation, no TODOs."

---

## When you finish

By the end of Phase 6, you should have:
- A live scorecard at ia.bainsquared.com (or the vercel.app URL)
- A Postgres table with sample submissions
- Two email templates that fire on submit
- Lighthouse 95+ on landing and result pages
- The full happy path working on iPhone and Android

Send to three friendly users. Watch them complete the assessment without coaching. Note where they hesitate. Fix those things. Then announce.

If you get stuck at any phase, paste your error and what you tried into Claude Code. Or tell me which phase, what's broken, and I'll help.
