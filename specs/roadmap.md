# Classe Master -- Roadmap & Implementation Plan

**Version:** 1.0
**Date:** 2026-02-12
**Status:** Implementation plan -- ready for team alignment
**Audience:** Development team, product stakeholders, project managers

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Development Methodology](#2-development-methodology)
3. [MVP Definition (Phase 1)](#3-mvp-definition-phase-1)
4. [Phase Breakdown](#4-phase-breakdown)
5. [Sprint-Level Detail for Phase 1](#5-sprint-level-detail-for-phase-1)
6. [Acceptance Criteria Framework](#6-acceptance-criteria-framework)
7. [Testing Strategy](#7-testing-strategy)
8. [Risk Register](#8-risk-register)
9. [Success Metrics & KPIs](#9-success-metrics--kpis)
10. [Launch Strategy](#10-launch-strategy)
11. [Post-Launch Roadmap](#11-post-launch-roadmap)

---

## 1. Project Overview

### 1.1 Project Name

**Classe Master**

### 1.2 Vision

Classe Master is the most engaging math learning game for French primary school children. It transforms mandatory math practice into a game that children aged 6-11 *want* to play -- combining adaptive difficulty aligned to the French national curriculum (CP-CM2) with the engagement systems kids love from Brawl Stars and Roblox. Free, ad-free, privacy-first, and accessible on any device.

### 1.3 Core Philosophy

**Math IS the game, not a gate to the game.** Every interaction involves math. Gamification wraps around the learning, not the other way around.

Five pillars:

1. **Learning through play** -- Solving problems feels like gameplay, not homework
2. **Adaptive challenge** -- Every child plays at their Zone of Proximal Development
3. **Positive reinforcement** -- Never subtract points, never show negative scores
4. **Privacy by design** -- Zero personal data collected from children
5. **Accessible to all** -- Free, offline-capable, runs on the cheapest devices

### 1.4 Key Specifications Reference

All specification documents are located in `/specs/`:

| Document | Purpose |
|----------|---------|
| `game-design-spec.md` | Complete game design: gameplay loop, question system, progression, economy, social features, avatar system, AI tutor, UX/UI, admin dashboard |
| `technical-spec.md` | Architecture, tech stack, data model, API design, PWA strategy, auth, privacy/compliance, security, i18n, performance targets, scalability, CI/CD |
| `curriculum-mapping-spec.md` | CP level: sub-level/micro-level tables, topic codes, operand ranges, question types, progression rules |
| `curriculum-mapping-ce1.md` | CE1 level curriculum mapping |
| `curriculum-mapping-ce2.md` | CE2 level curriculum mapping |
| `curriculum-mapping-cm1.md` | CM1 level curriculum mapping |
| `curriculum-mapping-cm2.md` | CM2 level curriculum mapping |
| `research-questions.md` | Research: question design, educational game analysis |
| `research-gamification.md` | Research: gamification patterns, engagement mechanics |
| `research-technical.md` | Research: technology choices, architecture trade-offs |
| `research-curriculum.md` | Research: French and UK curriculum analysis |

---

## 2. Development Methodology

### 2.1 Process

**Agile/Scrum** with 2-week sprints.

| Element | Detail |
|---------|--------|
| Sprint duration | 2 weeks (10 working days) |
| Sprint planning | Monday morning, Sprint Day 1 |
| Daily standup | 15 minutes, every working day |
| Sprint review/demo | Friday afternoon, Sprint Day 10 |
| Sprint retrospective | Friday afternoon, Sprint Day 10 (after review) |
| Backlog refinement | Wednesday afternoon, Sprint Day 8 |
| Sprint velocity tracking | Story points (Fibonacci: 1, 2, 3, 5, 8, 13) |

### 2.2 TDD Approach

Write tests first for all core logic:

- **Question generation:** Template-based generation must produce valid questions within defined operand ranges, with correct answers and plausible distractors for every (level, sub-level, micro-level) tuple
- **Scoring engine:** Points calculation, combo multipliers, hint penalties, session completion bonuses
- **Progression logic:** Micro-level advancement (80% rolling accuracy), sub-level gate quizzes (8/10), level-up exams (16/20)
- **Data validation:** Input sanitization, server-side score verification, session fingerprint validation

Test coverage requirements:

| Layer | Coverage Target |
|-------|----------------|
| Game engine (question generation, scoring, progression) | 90%+ |
| Svelte stores and utilities | 80%+ |
| UI components | 80%+ |
| API endpoints / Edge Functions | Key flows covered |
| RLS database policies | All policies tested |

### 2.3 CI/CD Pipeline

**Platform:** GitHub Actions

```
On Pull Request:
  1. Lint (ESLint + Prettier)
  2. Type check (svelte-check, strict mode)
  3. Unit tests (Vitest)
  4. Component tests (Vitest + @testing-library/svelte)
  5. Build (SvelteKit build)
  6. Bundle size check (fail if > 150 KB gzipped)
  7. Lighthouse CI (fail if score < 90)
  8. Integration tests (Playwright against local Supabase)

On Merge to main:
  1. All PR checks
  2. E2E tests (Playwright against staging Supabase)
  3. Deploy to Cloudflare Pages (staging)
  4. Run Supabase migrations (staging)
  5. Smoke tests against staging
  6. Manual approval gate

On Release tag:
  1. Deploy to Cloudflare Pages (production)
  2. Run Supabase migrations (production)
  3. Smoke tests against production
  4. Sentry release tracking
  5. Notify team (Slack)
```

### 2.4 Code Review

All PRs require at least one review before merge. PR checklist:

- [ ] Tests pass (unit, component, integration)
- [ ] No new ESLint/Prettier violations
- [ ] Bundle size within budget
- [ ] Lighthouse score >= 90
- [ ] Translations added for both locales (if UI text changed)
- [ ] Accessibility: no new axe-core violations
- [ ] Database migrations include rollback scripts

### 2.5 Feature Flags

All new features are deployed behind feature flags stored in the `feature_flags` table. Flags can be toggled globally or scoped to specific schools, classes, or levels.

Use cases:
- Gradual rollout of new question types
- A/B testing difficulty parameters
- Kill switch for AI tutor
- Seasonal event activation
- Beta testing with select schools

### 2.6 Environments

| Environment | Purpose | Hosting | Database |
|-------------|---------|---------|----------|
| **Development** | Local development and testing | `localhost:5173` (SvelteKit dev server) | Local Supabase (Docker) |
| **Staging** | Pre-production validation, E2E tests | Cloudflare Pages (staging branch) | Supabase staging project |
| **Production** | Live application | Cloudflare Pages (main branch) | Supabase production project |

### 2.7 Quality Gates

Every PR and release must pass:

| Gate | Threshold | Tool |
|------|-----------|------|
| Unit test coverage | > 80% overall, > 90% game engine | Vitest |
| E2E tests for critical paths | 100% pass | Playwright |
| Lighthouse Performance score | > 90 | Lighthouse CI |
| Lighthouse Accessibility score | > 90 | Lighthouse CI |
| Lighthouse Best Practices score | > 90 | Lighthouse CI |
| Lighthouse PWA score | 100 | Lighthouse CI |
| Bundle size (initial route) | < 100 KB gzipped | Vite build analysis |
| Total JS across all routes | < 150 KB gzipped | Vite build analysis |
| Zero critical/high Sentry errors | 0 unresolved | Sentry |
| axe-core accessibility violations | 0 critical | Playwright + axe-core |

---

## 3. MVP Definition (Phase 1)

The Minimum Viable Product is the smallest thing we can ship that delivers genuine educational value and validates core game mechanics with real children.

### 3.1 What Is In the MVP

| Feature | MVP Scope | Full Scope (Later) |
|---------|-----------|-------------------|
| **Game modes** | Single player practice mode only | Challenge mode, speed mode, class challenges |
| **Subject** | Math only | Math only (by design) |
| **Levels** | CP and CE1 (2 of 5) | CP through CM2 (all 5) |
| **Question types** | Multiple Choice, Fill-in-the-Blank, Free Input (3 of 14) | All 14 types |
| **Progression** | Sub-levels with basic advancement (no micro-levels yet) | Full 10x10 micro-level progression |
| **Curriculum topics** | CP: CNT, ORD, ADD, SUB (4 topics); CE1: ADD, SUB, MUL (3 topics) | All topics per level |
| **Avatars** | 10 pre-made avatars to choose from | Full customization + unlockable cosmetics |
| **Economy** | Coins only (earned per session) | Coins + Gems, full shop, power-ups |
| **Scoring** | Points + combo streaks | Full XP system, difficulty multipliers |
| **Hints** | Pre-written hints only (3 tiers) | Pre-written + AI tutor |
| **Language** | French only | French + English |
| **Platform** | PWA (installable, offline-capable) | Same |
| **Auth** | Solo play (username only, no class code) | Class codes, teacher accounts, parent accounts |
| **Leaderboards** | None | Class, school, global leaderboards |
| **AI Tutor** | Not included | Gemini 2.0 Flash with GPT-4o Mini fallback |
| **Admin dashboard** | Not included | Full admin back-office |
| **Teacher dashboard** | Not included | Class management, analytics |

### 3.2 MVP User Journey

1. Child opens the app and sees the welcome screen
2. Selects "Je joue seul" (I play alone)
3. Picks their grade level (CP or CE1)
4. Chooses a username and picks an avatar from 10 options
5. Plays a guided tutorial session (3 minutes)
6. Plays their first full 5-minute session with adaptive difficulty
7. Sees the results screen with score, accuracy, coins earned
8. Returns to the main menu with a "Play Again" prompt
9. On return visits: auto-recognized by device, streak tracked, daily reward claimed
10. Progress tracked per topic with visual progress bars

### 3.3 MVP Technical Scope

| Component | MVP Implementation |
|-----------|-------------------|
| Frontend | SvelteKit + Vite + Tailwind CSS |
| PWA | @vite-pwa/sveltekit with Workbox, offline play, install prompt |
| Backend | Supabase (Auth, PostgreSQL, Edge Functions) |
| Hosting | Cloudflare Pages (free tier) |
| State management | Svelte stores + IndexedDB (idb-keyval) for offline |
| Data model | players, game_sessions, answer_logs, progress tables |
| Question engine | Template-based generation, CP and CE1 topics only |
| Scoring | Base points + combo streak bonus, session completion bonus |
| Hints | Static JSON-based, 3-tier hints per question type |
| Analytics | Sentry (error tracking), basic custom analytics |
| i18n | French only (structure ready for English) |
| Testing | Vitest (unit), Playwright (E2E), Lighthouse CI |
| CI/CD | GitHub Actions, Cloudflare Pages deployment |

---

## 4. Phase Breakdown

### Phase Summary

| Phase | Name | Sprints | Duration | Key Deliverables |
|-------|------|---------|----------|------------------|
| **1** | Foundation & MVP | 1-8 | ~4 months | Playable game with CP + CE1, single player, basic progression, PWA |
| **2** | Full Game Loop | 9-16 | ~4 months | All 5 levels, all 14 question types, micro-level progression, gems, power-ups, English |
| **3** | Social & School Features | 17-22 | ~3 months | Class/school management, teacher dashboard, leaderboards, team challenges |
| **4** | AI Tutor & Advanced Features | 23-28 | ~3 months | AI tutor (Gemini), concept library, seasonal events, achievements, daily/weekly challenges |
| **5** | Scale & Polish | 29-34 | ~3 months | Admin dashboard, analytics, performance optimization, accessibility audit, parent dashboard |

---

### Phase 1: Foundation & MVP (Sprints 1-8, ~4 months)

**Goal:** Ship a playable, installable math game for CP and CE1 students playing solo. Validate that core game mechanics (question generation, scoring, progression) work correctly and that children find the experience engaging.

| Sprint | Focus | Key Deliverables |
|--------|-------|------------------|
| 1-2 | Project scaffolding, infrastructure, auth, PWA shell | Repo, CI/CD, Supabase setup, auth flow (solo play), PWA config, basic UI framework, design system |
| 3-4 | Question engine, CP content, game session flow | Template system, CP-ADD + CP-SUB + CP-CNT + CP-ORD generation, scoring engine, session timer, results screen |
| 5-6 | Progression, CE1 content, results polish, avatar selection | Sub-level progression, CE1-ADD + CE1-SUB + CE1-MUL content, 10 avatar options, daily streak, basic hint system |
| 7-8 | Polish, testing, PWA optimization, soft launch prep | E2E tests, Lighthouse optimization, offline play, install prompt, bug fixes, user testing with 5 families |

---

### Phase 2: Full Game Loop (Sprints 9-16, ~4 months)

**Goal:** Complete the full game experience with all 5 levels, all question types, the full micro-level progression system, the dual-currency economy, and English language support.

| Sprint | Focus | Key Deliverables |
|--------|-------|------------------|
| 9-10 | CE2 + CM1 levels, new question types (Word Problems, True/False, Comparison) | CE2 content (MUL tables, DIV intro, numbers to 10K), CM1 content (multi-digit ops, fractions, decimals), 3 new question types |
| 11-12 | CM2 level, remaining question types (Ordering, Matching, Pattern, Clock, Money, Geometry, Estimation, Mental Chain) | CM2 content (large numbers, long division, proportionality, percentages), all 14 question types implemented |
| 13-14 | Full micro-level progression (10x10), gem economy, power-ups | 500 micro-level steps, gate quizzes, level-up exams, gem currency, 5 power-up types, expanded shop |
| 15-16 | English language support, extended avatar/collectibles, leaderboard prep | Full i18n (fr + en), UK curriculum adaptation, 50+ cosmetic items, rarity tiers, themed collections, local leaderboard skeleton |

---

### Phase 3: Social & School Features (Sprints 17-22, ~3 months)

**Goal:** Enable classroom adoption with teacher accounts, class management, and social features that motivate students through healthy competition and collaboration.

| Sprint | Focus | Key Deliverables |
|--------|-------|------------------|
| 17-18 | School/class data model, teacher auth, class join codes | School + class tables, teacher email auth (magic link), join code generation + QR display, student-class association |
| 19-20 | Teacher dashboard, class analytics | Class overview (topic heatmap, accuracy trends), individual student view (radar chart, progression), teacher controls (leaderboard toggle, session limits) |
| 21-22 | Leaderboards (class, school), team challenges, pre-set messages | Windowed leaderboard (see 2 above + 2 below), weekly reset, multi-metric rankings, class cooperative challenges, pre-set encouragement messages, bottom-half anonymization |

---

### Phase 4: AI Tutor & Advanced Features (Sprints 23-28, ~3 months)

**Goal:** Integrate AI-powered explanations, build the concept library, and add engagement mechanics (seasonal events, achievements, daily/weekly challenges) that drive long-term retention.

| Sprint | Focus | Key Deliverables |
|--------|-------|------------------|
| 23-24 | AI tutor integration (Gemini 2.0 Flash + GPT-4o Mini fallback) | AI help endpoint, system prompt per grade level, safety guardrails (output filtering, blocklist, length limit, kill switch), response caching, cost monitoring |
| 25-26 | Concept library, achievement badges, daily/weekly challenge system | Browsable concept pages with visual aids and worked examples, 15+ achievement badges, daily quest system, weekly themed challenges |
| 27-28 | Seasonal events system, spaced repetition, advanced adaptive difficulty | Season creation/management, seasonal cosmetics + challenge tracks, spaced repetition scheduler, intra-micro-level adjustments (timer, distractor closeness) |

---

### Phase 5: Scale & Polish (Sprints 29-34, ~3 months)

**Goal:** Build the admin back-office, harden the platform for larger-scale adoption, and ensure compliance, accessibility, and performance meet production standards.

| Sprint | Focus | Key Deliverables |
|--------|-------|------------------|
| 29-30 | Admin dashboard (player management, school/class management, content management) | Admin auth (email + TOTP 2FA), RBAC (4 roles), player search/suspend/reset, school CRUD, question template management, audit log |
| 31-32 | Admin dashboard (economy management, analytics, moderation) | Economy rates tuning, avatar catalog management, season scheduling, platform analytics dashboards (DAU/MAU, retention, learning outcomes), username review queue, moderation rules |
| 33-34 | Performance optimization, accessibility audit, parent dashboard, scale preparation | answer_logs partitioning, read replicas assessment, Lighthouse audit (target 95+), WCAG 2.1 AA audit, parent email auth + child progress view, advanced moderation tools, load testing |

---

## 5. Sprint-Level Detail for Phase 1

### Sprint 1: Project Foundation (Weeks 1-2)

**Sprint Goal:** Set up the complete development infrastructure so the team can start building features in Sprint 2 with confidence in the toolchain, CI/CD, and deployment pipeline.

#### User Stories

**US-1.1:** As a developer, I want a fully configured SvelteKit project with Tailwind CSS, TypeScript, ESLint, Prettier, and Vitest, so that I can write type-safe, well-formatted code from day one.

*Acceptance Criteria:*
- `pnpm dev` starts the development server without errors
- `pnpm build` produces a production build under 50 KB (shell only)
- `pnpm test` runs Vitest with at least one passing test
- `pnpm lint` runs ESLint + Prettier with zero warnings on the initial codebase
- `svelte-check` passes in strict mode
- TypeScript strict mode enabled across all files
- Tailwind CSS configured with a basic design token set (colors, spacing, typography)

*Technical Tasks:*
- [ ] Initialize SvelteKit project with `pnpm create svelte@latest`
- [ ] Configure TypeScript in strict mode
- [ ] Install and configure Tailwind CSS 4.x
- [ ] Install and configure ESLint with Svelte plugin
- [ ] Install and configure Prettier with Svelte plugin
- [ ] Install and configure Vitest
- [ ] Set up Husky + lint-staged for pre-commit hooks
- [ ] Create initial design tokens (color palette, font sizes, spacing scale)
- [ ] Write first unit test (placeholder, confirms test infrastructure works)

**US-1.2:** As a developer, I want a local Supabase instance with the initial database schema, so that I can develop against a real PostgreSQL database locally.

*Acceptance Criteria:*
- `npx supabase start` launches local PostgreSQL, Auth, and Edge Functions
- Initial migration creates `schools`, `classes`, `players`, `game_sessions`, `answer_logs`, `progress`, `inventory`, `achievements` tables
- RLS policies are applied for all player-facing tables
- Seed data includes 1 test school, 2 test classes, 5 test players
- `npx supabase db push` applies migrations without errors

*Technical Tasks:*
- [ ] Install and configure Supabase CLI
- [ ] Write initial migration (`001_initial_schema.sql`) with all core tables
- [ ] Write RLS policies for all player-facing tables
- [ ] Create `seed.sql` with test data
- [ ] Configure `supabase/config.toml` for local development
- [ ] Create `.env.local` template with local Supabase credentials

**US-1.3:** As a developer, I want a CI/CD pipeline that runs lint, type-check, tests, and build on every PR, so that code quality is enforced automatically.

*Acceptance Criteria:*
- GitHub Actions workflow triggers on every PR to `main`
- Pipeline runs: lint, type-check, unit tests, build, bundle size check
- Pipeline fails if any step fails
- Bundle size check fails if gzipped JS > 150 KB
- Pipeline completes in under 5 minutes

*Technical Tasks:*
- [ ] Create `.github/workflows/ci.yml` with PR pipeline
- [ ] Configure bundle size check script
- [ ] Create `.github/workflows/deploy-staging.yml` for staging deployment
- [ ] Configure Cloudflare Pages project for staging
- [ ] Document environment variable requirements in README

**US-1.4:** As a developer, I want the PWA manifest and service worker configured, so that the app is installable from Sprint 1.

*Acceptance Criteria:*
- Web App Manifest includes all required fields (name, icons, display, orientation, theme_color)
- Service worker registers and precaches the app shell
- App scores 100 on Lighthouse PWA audit
- App is installable on Chrome (Android) and Safari (iOS instruction overlay ready)

*Technical Tasks:*
- [ ] Install and configure `@vite-pwa/sveltekit` with Workbox
- [ ] Create PWA icons (192px, 512px, maskable)
- [ ] Write web app manifest
- [ ] Configure service worker caching strategies (precache app shell, cache-first for assets)
- [ ] Add Lighthouse CI to the CI/CD pipeline

#### Definition of Done (Sprint 1)

- [ ] All acceptance criteria for US-1.1 through US-1.4 are met
- [ ] CI/CD pipeline runs green on the main branch
- [ ] Local development setup documented (README or CONTRIBUTING.md)
- [ ] Staging environment accessible at a Cloudflare Pages URL
- [ ] At least one team member has independently verified the local setup works on a clean clone

---

### Sprint 2: Auth Flow & UI Framework (Weeks 3-4)

**Sprint Goal:** Implement the solo-play authentication flow and build the foundational UI components (layout, navigation, design system) that all future features will use.

#### User Stories

**US-2.1:** As a child, I want to start playing by choosing "Je joue seul" and picking my grade level, so that I can begin a game session without needing a class code or email.

*Acceptance Criteria:*
- Welcome screen displays "Jouer" button prominently (center, large, colorful)
- Tapping "Jouer" shows two options: "J'ai un code de classe" (disabled/grayed, "Bientot !") and "Je joue seul"
- "Je joue seul" leads to grade selection: CP and CE1 displayed as large, tappable cards
- After selecting a grade, the child enters a username (3-20 characters, profanity-filtered)
- Optionally sets a 4-digit PIN
- On completion: player record created in Supabase, JWT stored in localStorage, redirected to main menu
- Flow works entirely offline (player created locally, synced when online)

*Technical Tasks:*
- [ ] Create welcome page route (`/`)
- [ ] Create join flow route (`/join`)
- [ ] Implement grade selection screen
- [ ] Implement username input with profanity filter (French blocklist)
- [ ] Implement optional PIN input
- [ ] Create Supabase Edge Function for solo-play account creation
- [ ] Implement JWT storage in localStorage
- [ ] Implement offline account creation (IndexedDB fallback)
- [ ] Write unit tests for profanity filter
- [ ] Write E2E test for the full join flow

**US-2.2:** As a returning child, I want to be automatically recognized when I open the app on the same device, so that I do not need to log in again.

*Acceptance Criteria:*
- If a valid JWT exists in localStorage, the app skips the join flow
- Main menu shows "Bienvenue, {username}!" with the child's chosen avatar
- If the JWT is expired but a refresh token exists, auto-refresh occurs silently
- If no valid session, the child is redirected to the join flow
- A "Switch Player" option is accessible from the settings menu

*Technical Tasks:*
- [ ] Implement session check on app load (SvelteKit load function)
- [ ] Implement JWT refresh logic
- [ ] Create main menu page route (`/menu`)
- [ ] Create settings page route (`/settings`) with "Switch Player" option
- [ ] Write integration test for returning player flow

**US-2.3:** As a developer, I want a reusable UI component library (buttons, cards, inputs, layout) following the design system, so that all screens have a consistent look and feel.

*Acceptance Criteria:*
- Button component: primary, secondary, ghost variants; disabled state; loading state; minimum 56px height
- Card component: with title, body, optional footer
- Input component: text and numeric variants, validation states (error, success), 56px minimum height
- Layout component: responsive, mobile-first, max-width container, safe-area padding
- NumPad component: 3x4 grid, digits 0-9, backspace, validate button, minimum 56x56dp buttons with 8dp gaps
- All components meet WCAG AA contrast ratios
- All interactive elements have minimum 48x48px touch targets
- Component tests written for all components

*Technical Tasks:*
- [ ] Create `Button.svelte` with variants
- [ ] Create `Card.svelte`
- [ ] Create `TextInput.svelte` and `NumericInput.svelte`
- [ ] Create `NumPad.svelte` (custom math numpad)
- [ ] Create `Layout.svelte` (app shell with header, content, footer)
- [ ] Create `ProgressBar.svelte`
- [ ] Create `Avatar.svelte` (display component for the 10 pre-made avatars)
- [ ] Set up Tailwind design tokens in `tailwind.config.js`
- [ ] Write component tests for all components
- [ ] Document components (Storybook optional, inline docs minimum)

#### Definition of Done (Sprint 2)

- [ ] A new user can go from the welcome screen to the main menu in under 60 seconds
- [ ] Returning users are auto-recognized
- [ ] All UI components pass accessibility checks (axe-core)
- [ ] All UI components render correctly at 320px, 768px, and 1024px widths
- [ ] CI/CD pipeline green with all new tests passing

---

### Sprint 3: Question Engine & CP Content (Weeks 5-6)

**Sprint Goal:** Build the core question generation engine and implement CP-level Addition and Subtraction content with full template-based generation, correct/incorrect answer handling, and the basic game session flow.

#### User Stories

**US-3.1:** As a child playing at the CP level, I want to answer multiple-choice, fill-in-the-blank, and free-input addition questions that match my skill level, so that I can practice addition within the ranges defined for my grade.

*Acceptance Criteria:*
- Given a player at CP level, sub-level 2 (Addition Basics), when a question is generated for CP-ADD:
  - Operand A is within the range defined in `curriculum-mapping-spec.md` for the current sub-level
  - Operand B is within the range defined in `curriculum-mapping-spec.md` for the current sub-level
  - The result is within the expected answer range for the current sub-level
  - Multiple-choice distractors include at least one "off-by-one" and one "wrong operation" distractor
  - All distractors are unique, different from the correct answer, and non-negative
- Question types are distributed according to the difficulty index: 70% MC, 20% FIB, 10% FI at lowest difficulty
- No two identical questions appear within the same session (same template + same parameters)
- Questions are generated client-side from cached templates (offline-capable)

*Technical Tasks:*
- [ ] Design and implement the `QuestionTemplate` interface
- [ ] Implement the `QuestionGenerator` class with template-based generation
- [ ] Implement the validation pipeline (parameter generation, constraint check, answer computation, range check, distractor generation)
- [ ] Create CP-ADD templates for sub-levels 1-10 (sums from 0-10 up to 0-100)
- [ ] Implement distractor strategies: `off_by_one`, `wrong_operation`, `random_nearby`, `forget_carry`
- [ ] Implement anti-repetition: session history (last 20 questions), template rotation
- [ ] Write unit tests for every CP-ADD template (validate operand ranges, answer correctness, distractor validity)
- [ ] Write unit tests for distractor generation strategies

**US-3.2:** As a child playing at the CP level, I want to answer subtraction questions with the same quality as addition, so that I can also practice subtraction.

*Acceptance Criteria:*
- Same criteria as US-3.1 but for CP-SUB (sub-levels 3-10, differences within 0-100)
- Subtraction results are always non-negative (constraint: A >= B)
- Distractors include `off_by_one`, `wrong_operation` (addition), `forget_borrow`

*Technical Tasks:*
- [ ] Create CP-SUB templates for sub-levels 3-10
- [ ] Implement `forget_borrow` distractor strategy
- [ ] Write unit tests for every CP-SUB template

**US-3.3:** As a child, I want to play a 5-minute game session where questions are served one after another with immediate feedback, so that I experience the core gameplay loop.

*Acceptance Criteria:*
- Session starts with a 5-minute countdown (displayed as a progress bar, not a visible timer with seconds)
- Questions appear one at a time with card transition animation
- On correct answer: green flash, star animation, satisfying sound, combo counter increments, points awarded
- On incorrect answer: gentle red pulse, soft sound, correct answer shown with brief explanation, combo resets to 0
- After timer expires: 15-second grace period to finish current question
- Session ends gracefully with results screen transition
- Session data (questions, answers, timings) stored in Svelte GameStore and written to IndexedDB

*Technical Tasks:*
- [ ] Create the game session page route (`/play`)
- [ ] Implement the `GameStore` (Svelte store managing session state)
- [ ] Implement the session timer (5 minutes + 15-second grace period)
- [ ] Implement the progress bar (green -> yellow -> orange, never red)
- [ ] Implement question display components for MC, FIB, and FI types
- [ ] Implement answer submission and validation flow
- [ ] Implement correct/incorrect feedback animations and sounds
- [ ] Implement combo counter with escalating visual effects
- [ ] Store session data in IndexedDB via idb-keyval
- [ ] Write E2E test for a full game session (start to results)

**US-3.4:** As a child playing at the CP level, I want to answer Counting (CP-CNT) and Ordering (CP-ORD) questions, so that I can practice number sense and comparison.

*Acceptance Criteria:*
- CP-CNT: counting objects in images (1-10), read/write digits, match digit to quantity
- CP-ORD: compare two numbers using < > = symbols, order 3-4 numbers
- Comparison questions use three-button layout (<, >, =)
- All questions within operand ranges defined in curriculum mapping

*Technical Tasks:*
- [ ] Create CP-CNT templates for sub-levels 1-10
- [ ] Create CP-ORD templates for sub-levels 1-10
- [ ] Implement the Comparison question type component (three buttons: <, >, =)
- [ ] Create placeholder counting images (simple SVG illustrations of objects)
- [ ] Write unit tests for CP-CNT and CP-ORD templates

#### Definition of Done (Sprint 3)

- [ ] A child can play a full 5-minute CP session with questions from 4 topics (CNT, ORD, ADD, SUB)
- [ ] All generated questions produce mathematically correct answers
- [ ] All distractors are plausible (not random numbers) and unique
- [ ] Question generation works fully offline
- [ ] Unit test coverage for the question engine is > 90%
- [ ] E2E test for a complete game session passes

---

### Sprint 4: Scoring Engine & Session Sync (Weeks 7-8)

**Sprint Goal:** Implement the complete scoring system with combo streaks and hint scoring, the results screen, and the server-side session sync with validation.

#### User Stories

**US-4.1:** As a child, I want to earn points for correct answers with bonus points for streaks, so that I feel rewarded for playing well.

*Acceptance Criteria:*
- Correct answer (no hints): 10 base points + speed bonus (1-5 based on time taken) + difficulty multiplier (x1 for easy, x2 for medium, x3 for hard)
- Correct answer with 1 hint: 70% of full points
- Correct answer with 2 hints: 40% of full points
- Correct answer with 3 hints: 20% of full points (minimum is always > 0)
- Wrong answer: 0 points (never negative)
- Combo streak: +2 points per consecutive correct answer, capping at +10
- Session completion bonus: 20 points flat
- Points are calculated client-side and validated server-side

*Technical Tasks:*
- [ ] Implement the `ScoringEngine` class
- [ ] Implement speed bonus calculation (based on time_taken_ms vs. expected time per question type and level)
- [ ] Implement difficulty multiplier calculation
- [ ] Implement hint scoring reduction (70% / 40% / 20%)
- [ ] Implement combo streak bonus (+2 per consecutive correct, cap at +10)
- [ ] Implement session completion bonus
- [ ] Write comprehensive unit tests for all scoring scenarios (TDD: tests first)

**US-4.2:** As a child, I want to see a results screen at the end of each session showing my performance, so that I know how I did and feel motivated to play again.

*Acceptance Criteria:*
- Results screen shows: questions answered, correct count (with star animation per correct), accuracy (shown as "X sur Y" for younger students), total points earned, coins earned, personal best comparison, current streak
- Coins earned: 1-3 per correct answer (scaled by difficulty) + 10 for session completion
- "Play Again" and "Back to Menu" buttons displayed prominently
- After 3 consecutive sessions: break reminder message displayed

*Technical Tasks:*
- [ ] Create results screen component (`ResultsScreen.svelte`)
- [ ] Implement coin earning calculation
- [ ] Implement personal best tracking (stored in progress table)
- [ ] Implement star animation for correct answer count
- [ ] Implement session counter for break reminders
- [ ] Write E2E test for results screen display

**US-4.3:** As a developer, I want completed sessions to sync to the server with validation, so that progress data is persisted and scores are verified.

*Acceptance Criteria:*
- On session end, client POSTs batched session data to `/sessions/sync` Edge Function
- Server validates: `questions_correct <= questions_total`, every answer's `time_taken_ms >= 500`, `duration_seconds` is plausible, score matches expected formula, client fingerprint matches hash
- Validated sessions are marked `is_validated = true`
- If offline: session is queued in IndexedDB and synced on next online event
- Sync conflicts: server wins for scores, merge for progress

*Technical Tasks:*
- [ ] Create Supabase Edge Function `sessions-sync`
- [ ] Implement server-side validation logic (6 checks from technical spec)
- [ ] Implement client fingerprint generation (SHA-256 of questions + answers + timings)
- [ ] Implement IndexedDB sync queue
- [ ] Implement Background Sync API (with fallback to sync-on-open)
- [ ] Write integration tests for the sync endpoint (valid session, tampered session, offline queue)

**US-4.4:** As a child, I want to use hints when I am stuck on a question, so that I can learn from the help and still make progress.

*Acceptance Criteria:*
- Lightbulb icon always visible during gameplay
- Icon gently bounces if no input for 10+ seconds
- Tier 1 hint: general strategy reminder (e.g., "Commence par additionner les unites")
- Tier 2 hint: partial solution (e.g., "C'est un nombre entre 1 et 10")
- Tier 3 hint: walkthrough (one step from the answer)
- Hints are pre-written, loaded from static JSON per topic and question type
- Hint usage recorded per answer for scoring and progression impact

*Technical Tasks:*
- [ ] Create hint data files (JSON) for CP-ADD, CP-SUB, CP-CNT, CP-ORD
- [ ] Create `HintButton.svelte` component with bounce animation
- [ ] Implement 3-tier hint display logic
- [ ] Integrate hint usage with scoring engine (70% / 40% / 20%)
- [ ] Track hint usage in answer_logs
- [ ] Write unit tests for hint selection logic

#### Definition of Done (Sprint 4)

- [ ] Scoring is accurate for all combinations (hints, streaks, difficulty)
- [ ] Results screen displays all required metrics with animations
- [ ] Session sync works online and offline (queued + synced)
- [ ] Server-side validation rejects tampered sessions
- [ ] Hint system provides appropriate help for all CP question types
- [ ] All scoring unit tests pass (> 95% coverage on ScoringEngine)

---

### Sprint 5: Progression System & CE1 Content (Weeks 9-10)

**Sprint Goal:** Implement the sub-level progression system, create CE1 level content (Addition, Subtraction, Multiplication), and display visual progress indicators.

#### User Stories

**US-5.1:** As a child, I want to advance to the next sub-level when I demonstrate mastery, so that I continuously face appropriately challenging questions.

*Acceptance Criteria:*
- Given a player has answered at least 8 questions at the current sub-level with a rolling accuracy of 80% on the last 10 questions, the player advances to the next sub-level
- Given a player with 2+ hints on a question, that question counts at 50% weight toward the accuracy threshold
- Given a player has failed to advance 3 times (3 consecutive windows of 10 where accuracy < 80%), a review session is triggered with questions from the previous sub-level
- Sub-level advancement triggers a celebration animation and notification
- Progress is displayed as a visual progress bar per topic

*Technical Tasks:*
- [ ] Implement the `ProgressionEngine` class
- [ ] Implement rolling accuracy window (last 10 questions per sub-level)
- [ ] Implement hint-weighted accuracy calculation
- [ ] Implement sub-level advancement logic with all criteria checks
- [ ] Implement review session trigger after 3 failed advancement attempts
- [ ] Create sub-level advancement celebration animation
- [ ] Update `progress` table on advancement
- [ ] Write unit tests for all progression scenarios (TDD: tests first)

**US-5.2:** As a child playing at the CE1 level, I want to practice addition, subtraction, and multiplication at CE1 difficulty, so that I can build on my CP skills.

*Acceptance Criteria:*
- CE1-ADD: sums up to 100, addition with carrying (two-digit + two-digit with regrouping)
- CE1-SUB: differences up to 100, subtraction with borrowing
- CE1-MUL: groups and repeated addition, multiplication tables x2, x5, x10
- All questions within operand ranges defined in `curriculum-mapping-ce1.md`
- Question type distribution follows the difficulty index tables

*Technical Tasks:*
- [ ] Create CE1-ADD templates for sub-levels 1-4 (review, extension, carrying)
- [ ] Create CE1-SUB templates for sub-levels 3-4 (review, extension, borrowing)
- [ ] Create CE1-MUL templates for sub-levels 5-6 (groups, repeated addition, x2/x5/x10 tables)
- [ ] Write unit tests for all CE1 templates
- [ ] Verify operand ranges match curriculum mapping

**US-5.3:** As a child, I want to see my progress across topics on a visual map, so that I know where I stand and what is coming next.

*Acceptance Criteria:*
- Progress page shows a progress bar per topic (current sub-level out of 10)
- Completed sub-levels glow green
- Current sub-level pulses with an animation
- Locked sub-levels are dimmed but visible (showing what is coming)
- Overall level indicator (CP or CE1) displayed on profile
- Progress page loads in under 1 second

*Technical Tasks:*
- [ ] Create progress page route (`/progress`)
- [ ] Create `TopicProgressBar.svelte` component
- [ ] Create `LevelMap.svelte` component (visual adventure map with 10 waypoints)
- [ ] Fetch progress data from Supabase (with IndexedDB cache)
- [ ] Write E2E test for progress page display

#### Definition of Done (Sprint 5)

- [ ] Sub-level progression works correctly for all criteria (accuracy, hints, review trigger)
- [ ] CE1 content generates valid questions for ADD, SUB, MUL topics
- [ ] Progress page accurately reflects the player's current state
- [ ] Unit test coverage for ProgressionEngine > 90%

---

### Sprint 6: Avatar Selection, Daily Streaks & Polish (Weeks 11-12)

**Sprint Goal:** Add avatar selection, daily login streaks, coin earning display, and polish the overall user experience with sound effects, animations, and UX improvements.

#### User Stories

**US-6.1:** As a child, I want to choose an avatar from 10 options when I create my account, so that I have a personal identity in the game.

*Acceptance Criteria:*
- 10 pre-made avatars displayed in a 2x5 grid during onboarding
- Diverse representation: varied skin tones, hair styles, and outfits
- Selected avatar is shown with a celebration animation ("This is you!")
- Avatar displayed on the main menu, results screen, and progress page
- Avatar can be changed later from the settings menu (free, unlimited changes in MVP)

*Technical Tasks:*
- [ ] Design and create 10 avatar SVG illustrations
- [ ] Create `AvatarSelector.svelte` component
- [ ] Integrate avatar selection into the onboarding flow
- [ ] Display avatar throughout the app (menu, results, progress)
- [ ] Add avatar change option in settings
- [ ] Write E2E test for avatar selection flow

**US-6.2:** As a child, I want to maintain a daily login streak, so that I feel motivated to return every day.

*Acceptance Criteria:*
- On first session of the day: daily streak counter increments, fire icon animation displays
- Streak counter shown on main menu with fire icon (growing flame at higher streaks)
- Daily login reward: 5-20 coins based on the 7-day cycle
- Missing a day resets the login reward cycle to Day 1 (streak counter is separate)
- Streak persists across sessions (stored in Supabase + IndexedDB)

*Technical Tasks:*
- [ ] Implement daily streak tracking logic
- [ ] Implement 7-day login reward cycle (5/5/10/10/10/15/20 coins)
- [ ] Create `StreakDisplay.svelte` component with fire icon animation
- [ ] Create `DailyReward.svelte` popup component
- [ ] Integrate streak into the returning player flow
- [ ] Write unit tests for streak calculation (edge cases: timezone, midnight rollover)

**US-6.3:** As a child, I want to hear satisfying sounds when I answer correctly and gentle sounds when I answer incorrectly, so that the game feels responsive and fun.

*Acceptance Criteria:*
- Correct answer: bright, short "ding" sound (< 1 second)
- Wrong answer: gentle, soft tone (not alarming, < 1 second)
- Combo increment: rising pitch sequence
- Coin earned: light "coin clink"
- Session end: gentle conclusion melody
- Mute button always accessible (top-right corner)
- Game is fully functional without sound
- Sound files cached by service worker (cache-first strategy)

*Technical Tasks:*
- [ ] Source or create 6 sound effect files (correct, wrong, combo, coin, session-end, button-tap)
- [ ] Implement `SoundManager` utility (play, mute/unmute, volume control)
- [ ] Integrate sounds into the game session flow
- [ ] Add mute toggle to the game UI and settings page
- [ ] Precache sound files in service worker

**US-6.4:** As a child, I want the game to remember my preferences and work offline, so that I can play even without internet.

*Acceptance Criteria:*
- Full game session playable without network connection
- Questions generated from cached templates stored in IndexedDB
- Session results stored locally and synced when online
- Sound/mute preference persisted in localStorage
- App loads from service worker cache in under 500ms when offline

*Technical Tasks:*
- [ ] Precache question templates in service worker (CP + CE1)
- [ ] Implement offline question generation from cached templates
- [ ] Verify offline session completion and sync queue
- [ ] Test offline-to-online sync flow end-to-end
- [ ] Optimize service worker precache list (app shell + assets + templates)

#### Definition of Done (Sprint 6)

- [ ] Avatar selection integrated into onboarding and displayed throughout the app
- [ ] Daily streak and login rewards functional
- [ ] Sound effects play correctly and mute works
- [ ] App works fully offline (play a session, see results, sync later)
- [ ] All new components have tests

---

### Sprint 7: Testing, Bug Fixes & Performance (Weeks 13-14)

**Sprint Goal:** Achieve comprehensive test coverage, fix all known bugs, and optimize performance to meet Lighthouse and bundle size targets on the reference device (Samsung Galaxy A03).

#### User Stories

**US-7.1:** As a product owner, I want comprehensive E2E tests covering the full user journey, so that I have confidence the MVP works correctly before launch.

*Acceptance Criteria:*
- E2E test: new user onboarding (welcome -> grade select -> username -> avatar -> tutorial -> first session -> results)
- E2E test: returning user (auto-login -> main menu -> play session -> results -> play again)
- E2E test: full CP game session with all 4 question types (MC, FIB, FI, CMP)
- E2E test: full CE1 game session
- E2E test: sub-level progression (play enough sessions to advance)
- E2E test: offline play and sync
- All E2E tests pass on Chrome and Firefox

*Technical Tasks:*
- [ ] Write E2E test suite (6+ scenarios)
- [ ] Configure Playwright for Chrome and Firefox
- [ ] Set up test fixtures for different player states (new, returning, CP, CE1, various sub-levels)
- [ ] Run E2E tests against staging environment

**US-7.2:** As a developer, I want the app to score 90+ on all Lighthouse categories, so that we meet our performance targets.

*Acceptance Criteria:*
- Lighthouse Performance score >= 90
- Lighthouse Accessibility score >= 90
- Lighthouse Best Practices score >= 90
- Lighthouse PWA score = 100
- LCP < 2.5s on simulated 3G
- TTI < 3.0s on simulated 3G
- CLS < 0.1
- Initial JS bundle < 100 KB gzipped

*Technical Tasks:*
- [ ] Run Lighthouse audit and identify performance bottlenecks
- [ ] Optimize bundle splitting (lazy-load non-critical routes)
- [ ] Optimize images (SVG where possible, WebP fallback, responsive sizes)
- [ ] Ensure all accessibility violations are resolved (axe-core)
- [ ] Verify service worker caching is optimal
- [ ] Test on Samsung Galaxy A03 (or equivalent via Chrome DevTools throttling)

**US-7.3:** As a developer, I want all known bugs fixed and the codebase clean, so that the MVP is stable for user testing.

*Acceptance Criteria:*
- All bugs from Sprints 1-6 triaged and resolved or deferred with rationale
- No critical or high-severity bugs remain open
- Code review backlog cleared
- All TODO comments addressed or converted to backlog items
- Technical debt documented

*Technical Tasks:*
- [ ] Triage and prioritize all open bugs
- [ ] Fix all critical and high-severity bugs
- [ ] Code cleanup: remove dead code, address TODO comments
- [ ] Update documentation where implementation diverged from spec

#### Definition of Done (Sprint 7)

- [ ] All E2E tests pass on Chrome and Firefox
- [ ] Lighthouse scores meet all targets (90+ across the board, 100 PWA)
- [ ] Zero critical/high bugs open
- [ ] Unit test coverage > 80% overall, > 90% game engine
- [ ] App tested on reference device (or simulated equivalent)

---

### Sprint 8: User Testing & Soft Launch Prep (Weeks 15-16)

**Sprint Goal:** Conduct user testing with 5 families, incorporate feedback, prepare deployment infrastructure and monitoring for soft launch.

#### User Stories

**US-8.1:** As a product owner, I want to observe 5 children (ages 6-8) playing the game, so that I can validate the UX, difficulty calibration, and engagement.

*Acceptance Criteria:*
- 5 test families recruited (at least 2 CP-age, 2 CE1-age, 1 mixed)
- Each child plays 3+ sessions while being observed
- Feedback collected on: ease of use, fun factor, difficulty, confusing elements, desired features
- At least 3 actionable UX improvements identified and prioritized

*Technical Tasks:*
- [ ] Prepare test protocol (observation script, feedback questions)
- [ ] Deploy MVP to production environment
- [ ] Create test accounts for each family
- [ ] Conduct user testing sessions (in person or remote)
- [ ] Document findings and prioritize fixes

**US-8.2:** As a product owner, I want critical user testing feedback addressed before soft launch, so that obvious friction points are resolved.

*Acceptance Criteria:*
- Top 3 UX issues from user testing fixed
- Any game-breaking bugs found during testing fixed
- Difficulty calibration adjusted if children found it too easy or too hard
- Tutorial flow adjusted if children were confused

*Technical Tasks:*
- [ ] Prioritize user testing findings
- [ ] Implement top 3 UX fixes
- [ ] Fix any new bugs discovered
- [ ] Re-test with at least 1 family to validate fixes

**US-8.3:** As a developer, I want production monitoring configured, so that we can detect and respond to issues after launch.

*Acceptance Criteria:*
- Sentry configured for client and server error tracking with source maps
- Basic uptime monitoring active (Better Uptime or equivalent)
- Cloudflare analytics accessible for traffic and performance data
- Alert thresholds configured: API error rate > 5%, P95 latency > 1s
- Status page URL available for public communication

*Technical Tasks:*
- [ ] Configure Sentry for production (client + Edge Functions)
- [ ] Upload source maps to Sentry on each deploy
- [ ] Set up uptime monitoring with alerting
- [ ] Configure Cloudflare analytics dashboard
- [ ] Set up alert rules (email/Slack notifications)
- [ ] Create a simple status page

**US-8.4:** As a developer, I want the production deployment pipeline fully automated, so that we can deploy with confidence.

*Acceptance Criteria:*
- Production deployment triggered by release tag
- Deployment runs all tests before going live
- Supabase migrations applied automatically
- Rollback procedure documented and tested
- Domain configured with HTTPS and HSTS

*Technical Tasks:*
- [ ] Configure production Cloudflare Pages project
- [ ] Configure production Supabase project
- [ ] Set up production environment variables
- [ ] Test full deployment pipeline (tag -> tests -> deploy -> smoke tests)
- [ ] Configure custom domain with SSL
- [ ] Write runbook for rollback procedure

#### Definition of Done (Sprint 8)

- [ ] User testing completed with 5 families, findings documented
- [ ] Top 3 UX issues resolved
- [ ] Production monitoring active (Sentry, uptime, Cloudflare)
- [ ] Production deployment pipeline tested end-to-end
- [ ] MVP is live on production URL, accessible to the public
- [ ] Team sign-off on MVP readiness

---

## 6. Acceptance Criteria Framework

### 6.1 Question Generation

**Template:** Given a player at level `{L}`, sub-level `{SL}`, when a question is generated for topic `{T}`:

| Criterion | Verification |
|-----------|-------------|
| Operand A is within `[min_a, max_a]` for `(L, SL)` | Assert `min_a <= operand_a <= max_a` |
| Operand B is within `[min_b, max_b]` for `(L, SL)` | Assert `min_b <= operand_b <= max_b` |
| Result is within `[min_result, max_result]` for `(L, SL)` | Assert `min_result <= answer <= max_result` |
| Result is non-negative (for subtraction) | Assert `answer >= 0` |
| Correct answer matches the formula | Assert `compute(operands, operator) === correct_answer` |
| Distractors are all unique | Assert `new Set(distractors).size === distractors.length` |
| Distractors are different from the correct answer | Assert `distractors.every(d => d !== correct_answer)` |
| At least one distractor is "close" (off-by-one or off-by-two) | Assert `distractors.some(d => Math.abs(d - correct_answer) <= 2)` |
| Question type matches the distribution for the difficulty index | Assert distribution across 100 questions matches expected percentages (within 10% tolerance) |
| No duplicate question in the session (same template + same parameters) | Assert no match in `session_history` |

### 6.2 Scoring

**Template:** Given a correct answer at difficulty multiplier `{M}`, with `{H}` hints used and a combo streak of `{N}`:

```
base_points     = 10
speed_bonus     = clamp(1, 5, expected_time / actual_time)
difficulty_mult = M (1, 2, or 3)
hint_mult       = { 0 hints: 1.0, 1 hint: 0.7, 2 hints: 0.4, 3 hints: 0.2 }
combo_bonus     = min(N * 2, 10)

total_points = floor((base_points + speed_bonus) * difficulty_mult * hint_mult) + combo_bonus
```

| Scenario | Expected |
|----------|----------|
| Correct, no hints, no combo, easy (x1), average speed | 10 + 3 = 13 points |
| Correct, no hints, combo x5, hard (x3), fast | (10 + 5) * 3 + 10 = 55 points |
| Correct, 2 hints, no combo, medium (x2), slow | floor((10 + 1) * 2 * 0.4) + 0 = 8 points |
| Correct, 3 hints, no combo, easy (x1), slow | floor((10 + 1) * 1 * 0.2) + 0 = 2 points (minimum > 0) |
| Wrong answer | 0 points (never negative) |

### 6.3 Progression

**Micro-level advancement (full system, Phase 2):**

Given a player has answered `Q` questions at micro-level `ML` of sub-level `SL`:

| Criterion | Rule |
|-----------|------|
| Minimum volume | `Q >= 8` |
| Rolling accuracy | Last 10 questions accuracy >= 80% |
| Hint adjustment | Questions with 2+ hints count at 50% weight |
| Consecutive errors | No more than 2 consecutive errors on the same sub-topic |
| Failed attempts | After 3 failed windows, trigger review session from previous micro-level |

**Sub-level advancement (MVP simplified, Phase 1):**

Given a player has been playing at sub-level `SL` for topic `T`:

| Criterion | Rule |
|-----------|------|
| Minimum questions | At least 8 questions answered at this sub-level |
| Rolling accuracy | 80% accuracy on the last 10 questions |
| Hint adjustment | Questions with 2+ hints count at 50% weight |
| On failure | After 3 failed windows, trigger review from previous sub-level |

**Gate quiz (Phase 2):**

Given a player has completed all 10 micro-levels of sub-level `SL`:

| Criterion | Rule |
|-----------|------|
| Quiz composition | 10 questions, 1 from each micro-level |
| Pass threshold | Score >= 8/10 |
| On failure | Identify failing micro-levels, require remediation, then re-attempt |

**Level-up exam (Phase 2):**

Given a player has completed all 10 sub-levels of level `L`:

| Criterion | Rule |
|-----------|------|
| Exam composition | 20 questions, at least 2 per sub-level, at least 1 per active topic |
| Pass threshold | Score >= 16/20 (80%) |
| No critical gaps | No single topic below 70% accuracy in the exam |
| On failure | Identify weak topics, require review, then re-attempt |

### 6.4 PWA

| Criterion | Target |
|-----------|--------|
| First load on 3G | LCP < 2.5s, TTI < 3.0s, FCP < 1.5s |
| Subsequent loads (cached) | Load < 500ms |
| Offline play | Full session playable with no network |
| Install prompt | Shown after first session completion, child-friendly copy |
| iOS install | Overlay with step-by-step instructions (Partager > Ajouter) |
| Service worker update | Silent auto-update, no user prompt |
| Storage budget | Total < 50 MB, typical < 12 MB |

---

## 7. Testing Strategy

### 7.1 Testing Layers

| Layer | Tool | Scope | When |
|-------|------|-------|------|
| **Unit tests** | Vitest | Question generation, scoring logic, progression rules, data validation, utility functions | Every PR |
| **Component tests** | Vitest + @testing-library/svelte | UI components in isolation (Button, NumPad, QuestionDisplay, ResultsScreen) | Every PR |
| **Integration tests** | Playwright | API endpoints, database operations, auth flows, session sync | Every PR |
| **E2E tests** | Playwright | Full user journeys (onboarding, play session, progression, offline play) | On merge to main |
| **Visual regression** | Playwright screenshots | Component rendering across viewports (320px, 768px, 1024px) | Weekly / on UI changes |
| **Performance tests** | Lighthouse CI | Core Web Vitals, bundle size, PWA audit | Every PR |
| **Accessibility tests** | axe-core via Playwright | WCAG 2.1 AA compliance on all pages | Every PR |
| **Database tests** | pgTAP or Supabase test helpers | RLS policies, migration correctness | On schema changes |
| **Manual QA** | Human testers | Game feel, UX with actual children, difficulty calibration | Per sprint (Sprint 7-8 intensive) |

### 7.2 Key Test Scenarios

| # | Scenario | Layer | Priority |
|---|----------|-------|----------|
| 1 | All question templates produce valid questions with correct answers and plausible distractors across all difficulty levels | Unit | P0 |
| 2 | Scoring calculation matches spec for all hint/combo/difficulty combinations | Unit | P0 |
| 3 | Progression advancement triggers at correct accuracy thresholds | Unit | P0 |
| 4 | Full session completes offline and syncs successfully on reconnection | E2E | P0 |
| 5 | New user onboarding: welcome -> grade -> username -> avatar -> tutorial -> first session | E2E | P0 |
| 6 | Returning user: auto-login -> play -> results | E2E | P0 |
| 7 | Server-side validation rejects tampered session data | Integration | P0 |
| 8 | RLS policies: students cannot access other students' data | Database | P0 |
| 9 | Students cannot access teacher-only endpoints | Integration | P1 |
| 10 | AI tutor output filter rejects non-math, too-long, or blocklisted responses | Unit (Phase 4) | P1 |
| 11 | All UI strings render correctly in both locales (Phase 2) | E2E | P1 |
| 12 | Number formatting matches locale (decimal separator, thousands) (Phase 2) | Unit | P1 |
| 13 | App loads and functions correctly at 320px width | Visual | P1 |
| 14 | All touch targets >= 48x48px | Accessibility | P1 |
| 15 | Leaderboard only shows windowed view (2 above + 2 below) (Phase 3) | E2E | P1 |

### 7.3 Test Data Management

- **Seed data:** `supabase/seed.sql` contains deterministic test data: 1 school, 2 classes, 5 players at various progression states
- **Test fixtures:** Playwright fixtures create players at specific states (new user, CP sub-level 5, CE1 sub-level 3, etc.)
- **Question template tests:** Parametric tests run each template 100 times with random seeds to verify constraint compliance
- **Snapshot testing:** Scoring engine snapshot tests capture expected output for canonical input sets

### 7.4 Testing with Children (Manual QA)

| Phase | Participants | Focus | Frequency |
|-------|-------------|-------|-----------|
| Sprint 7-8 (pre-launch) | 5 families (8-10 children, ages 6-8) | Usability, fun factor, difficulty, comprehension | 2 sessions |
| Phase 2 | 10-15 children across CP-CM2 | All levels, all question types, progression feel | 1 session per sprint |
| Phase 3 (beta) | 2-3 classes in 1-2 schools | Classroom use, teacher workflow, social features | Continuous |

---

## 8. Risk Register

### 8.1 Technical Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|------|-----------|--------|------------|-------|
| T1 | **Supabase free tier limitations** hit earlier than expected (storage, MAU, function invocations) | Medium | Medium | Monitor usage weekly. Budget for Pro upgrade ($25/mo) from launch. Avoid unnecessary data writes. | Backend Lead |
| T2 | **PWA on iOS** has limited capabilities (no Background Sync, no Push Notifications, storage may be cleared after 7 days of inactivity) | High | Medium | Implement sync-on-open fallback. Warn users about iOS limitations. Test extensively on Safari. Store critical data (progress) server-side, not only in IndexedDB. | Frontend Lead |
| T3 | **Offline sync conflicts** when the same player plays on two devices before syncing | Low | Medium | Server-wins strategy for leaderboard data. Merge strategy for progress (take highest sub-level). Display conflict resolution UI if needed. | Backend Lead |
| T4 | **Service worker update issues** cause stale app versions on children's devices | Medium | High | Use `autoUpdate` strategy. Include app version in UI footer. Implement "New version available" soft notification (not a blocking modal). | Frontend Lead |
| T5 | **IndexedDB storage quota** exceeded on low-end devices, losing offline session data | Low | High | Implement storage quota check. Purge old synced sessions. Keep IndexedDB footprint under 10 MB. | Frontend Lead |
| T6 | **Bundle size creep** as features are added, degrading load time on target device | Medium | High | CI/CD bundle size check enforced on every PR. Lazy-load non-critical routes. Monitor Lighthouse score weekly. Set budget alerts. | Frontend Lead |

### 8.2 Educational Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|------|-----------|--------|------------|-------|
| E1 | **Curriculum accuracy errors** in question templates (wrong operand ranges, incorrect distractor logic) | Medium | High | TDD for all templates. Cross-reference every template against curriculum-mapping spec. Peer review by a teacher or curriculum expert. | Content Lead |
| E2 | **Difficulty calibration wrong** -- too easy (no challenge) or too hard (frustration) | High | High | Test with real children in Sprints 7-8. Implement adaptive difficulty that adjusts based on real performance data. Plan recalibration cycle after launch. | Product Owner |
| E3 | **Progression system too slow** (children feel stuck) or too fast (no sense of achievement) | Medium | Medium | User testing feedback. Tunable progression thresholds via admin dashboard (Phase 5). Start with spec values, adjust based on data. | Product Owner |
| E4 | **Hints give away answers** too easily, undermining learning | Medium | Medium | 3-tier hint design with careful scaffolding. 50% accuracy weight for assisted answers prevents hint-only progression. Review hint content with educators. | Content Lead |

### 8.3 Engagement Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|------|-----------|--------|------------|-------|
| G1 | **Game not fun enough** -- children find it boring compared to Brawl Stars/Roblox | Medium | Critical | Focus on game feel (animations, sounds, feedback). Test with children early and often. Iterate on celebration moments. The avatar/cosmetics system (Phase 2) is critical for long-term engagement. | Product Owner |
| G2 | **Children lose interest after 1-2 weeks** (poor retention) | High | High | Daily streaks, login rewards, and daily quests (Phase 4). Weekly challenges and seasonal content for variety. Streak freeze mechanic. Track D7/D30 retention closely. | Product Owner |
| G3 | **MVP feels too bare** without avatars, shop, leaderboards | Medium | Medium | Ensure MVP has the 10 avatars, daily streak, and coins. These provide a minimal engagement loop. Communicate "more coming soon" within the app. | Product Owner |
| G4 | **Teachers do not adopt** because the teacher dashboard is not in MVP | Medium | Medium | Phase 1 focuses on solo play (direct-to-child acquisition). Teacher features in Phase 3. Engage pilot teachers early for feedback. | Product Owner |

### 8.4 Scale Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|------|-----------|--------|------------|-------|
| S1 | **Database performance degrades** as answer_logs grows | Low (Phase 1-2), High (Phase 3+) | High | Partition answer_logs by month at 100K students. Implement materialized views for analytics. Monitor query performance via pg_stat_statements. | Backend Lead |
| S2 | **Cost explosion** if AI tutor usage exceeds projections | Low | Medium | Response caching (40-60% expected hit rate). Per-student rate limiting (10 req / 5 min). Cost monitoring with alerts. Kill switch to fall back to pre-written explanations. | Backend Lead |
| S3 | **Cloudflare free tier limits** exceeded (100K Worker requests/day) | Low | Low | Monitor usage. $5/mo Workers upgrade provides 10M requests/month. Well within budget. | Backend Lead |

### 8.5 Legal & Compliance Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|------|-----------|--------|------------|-------|
| L1 | **GDPR/CNIL non-compliance** for children's data | Low (by design) | Critical | Zero personal data collected from children (no email, no real name, no DOB). Privacy by design from day one. Privacy policy in child-friendly language. Data retention policies enforced. | Product Owner |
| L2 | **UK Children's Code violation** if expanding to UK market | Low | High | No nudge techniques (no push notifications to children). No detrimental data use. High privacy defaults. Review code requirements before English launch. | Product Owner |
| L3 | **Inappropriate usernames** bypass profanity filter | Medium | Medium | French + English profanity blocklist. Teacher can report usernames. Admin moderation queue (Phase 5). Pre-generated username option reduces risk. | Backend Lead |

### 8.6 Timeline Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|------|-----------|--------|------------|-------|
| R1 | **Scope creep** -- adding features not in the sprint plan | High | Medium | Strict sprint scope. All new requests go to backlog. Product Owner is sole authority on sprint scope changes. | Scrum Master |
| R2 | **Curriculum mapping takes longer than expected** (5 levels x 10 sub-levels x 10 micro-levels) | Medium | Medium | MVP only implements CP + CE1 (2 of 5 levels) with simplified progression (no micro-levels). Full mapping deferred to Phase 2. | Content Lead |
| R3 | **AI model API changes or deprecation** | Low | Medium | Abstraction layer between game and AI provider. Fallback model (GPT-4o Mini). Pre-written explanations as ultimate fallback. AI is Phase 4 -- ample time to adapt. | Backend Lead |

---

## 9. Success Metrics & KPIs

### 9.1 Engagement Metrics

| Metric | Target (6 months post-launch) | Measurement |
|--------|-------------------------------|-------------|
| DAU / MAU ratio | > 30% | PostHog / custom analytics |
| Average session length | > 5 minutes (full session) | Session duration from game_sessions |
| Sessions per active user per day | >= 1.5 | game_sessions count per DAU |
| D1 retention (next-day return) | > 60% | Cohort analysis |
| D7 retention (7-day return) | > 40% | Cohort analysis |
| D30 retention (30-day return) | > 25% | Cohort analysis |
| Session completion rate | > 85% (sessions completed vs. started) | game_sessions where ended_at is not null |
| Daily streak average | > 5 days | progress table streak data |
| PWA install rate | > 20% of unique visitors | PWA install event tracking |

### 9.2 Learning Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Mastery progression rate | Average student advances 1 sub-level per 2 weeks of active play | progress table sub-level changes |
| Accuracy improvement | +10% accuracy improvement after 30 sessions | Rolling accuracy comparison (first 10 sessions vs. last 10) |
| Level completion rate | > 30% of active players complete at least 1 full level within the school year | progress table level completions |
| Topic mastery distribution | No single topic has > 40% of students below 70% accuracy | Topic mastery breakdown |
| Hint dependency rate | < 20% of correct answers use 2+ hints | answer_logs hint_used analysis |
| Review effectiveness | > 80% of review questions answered correctly | answer_logs for review-tagged questions |

### 9.3 Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | > 99.5% | Better Uptime monitoring |
| LCP (P75) | < 2.5s | Sentry Performance / Lighthouse |
| FCP (P75) | < 1.5s | Sentry Performance / Lighthouse |
| TTI (P75) | < 3.0s | Sentry Performance / Lighthouse |
| CLS (P75) | < 0.1 | Sentry Performance / Lighthouse |
| API response time (P50) | < 200ms | Supabase Logs |
| API response time (P95) | < 500ms | Supabase Logs |
| Client error rate | < 0.1% of sessions | Sentry |
| Offline sync success rate | > 98% | Custom event tracking |
| JS bundle size (initial) | < 100 KB gzipped | CI/CD build check |
| Lighthouse Performance score | > 90 | Lighthouse CI |

### 9.4 Growth Metrics

| Metric | Target (Phase 1) | Target (Phase 3+) | Measurement |
|--------|------------------|-------------------|-------------|
| Total registered players | 500 (pilot) | 10,000 (launch) | players table count |
| User acquisition rate | 20 new players / week | 200 new players / week | Weekly new player count |
| Class adoption rate | N/A (no classes in MVP) | 50 classes within 3 months of Phase 3 | classes table count |
| School conversion | N/A | 10 schools within 6 months of Phase 3 | schools table count |
| Organic referral rate | 10% of new users from word-of-mouth | 20%+ | Attribution tracking |

---

## 10. Launch Strategy

### 10.1 Alpha (Internal Testing)

| Aspect | Detail |
|--------|--------|
| **Timeline** | Sprint 7-8 (Weeks 13-16) |
| **Participants** | Development team + 5 test families (8-10 children, ages 6-8) |
| **Focus** | Functional correctness, UX validation, difficulty calibration, performance |
| **Feedback collection** | Direct observation, structured interviews, in-app analytics |
| **Success criteria** | All critical bugs fixed. Children can complete a session without assistance. Average session engagement > 4 minutes. |

### 10.2 Beta (Closed)

| Aspect | Detail |
|--------|--------|
| **Timeline** | Phase 3, Sprints 19-22 (after teacher features are built) |
| **Participants** | 2-3 classes in 1-2 schools (50-90 students, 2-3 teachers) |
| **Focus** | Classroom workflow, teacher dashboard utility, class dynamics, leaderboard impact |
| **Feedback collection** | Teacher interviews (weekly), student usage data, in-app analytics |
| **Feedback loop** | Bi-weekly feedback sessions with teachers. Prioritize top 3 issues per cycle. |
| **Success criteria** | Teachers find dashboard useful. Students play 3+ sessions/week. D7 retention > 35%. No data/privacy concerns raised. |

### 10.3 Soft Launch

| Aspect | Detail |
|--------|--------|
| **Timeline** | End of Phase 3 / beginning of Phase 4 (~Sprint 22-24) |
| **Scope** | Open registration, targeted outreach to 1 school district (academie) |
| **Marketing** | Teacher-to-teacher word-of-mouth, local education blog mentions, social media (teacher communities) |
| **Monitoring** | Daily review of engagement metrics, error rates, support requests |
| **Success criteria** | 500+ active students. D7 retention > 40%. No critical incidents. Support volume manageable (< 10 tickets/week). |

### 10.4 Public Launch

| Aspect | Detail |
|--------|--------|
| **Timeline** | End of Phase 4 (~Sprint 28), ideally aligned with a school period start (September or January) |
| **Marketing push** | Education press outreach, teacher influencer partnerships, SEO-optimized landing page, social media campaign, presence at education conferences (Educatice, Ludovia) |
| **App store presence** | PWA listed on Google Play Store (via TWA wrapper), Microsoft Store. iOS: optimize for "Add to Home Screen" with guided instructions. |
| **Teacher outreach** | Email campaign to education mailing lists. Free materials (classroom posters with QR code, lesson plan integration guides). |
| **Success criteria** | 5,000+ registered players within first month. 100+ classes. 10+ schools. D7 retention > 40%. Press coverage in at least 2 education outlets. |

---

## 11. Post-Launch Roadmap

The following features are planned for development after Phase 5, based on user demand, strategic priorities, and resource availability.

### 11.1 Near-Term (Year 2)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Middle school levels (6eme-3eme)** | Extend curriculum coverage to French college level (ages 11-15), covering algebra, equations, statistics, probability | High |
| **Classroom mode (teacher-led sessions)** | Teacher launches a synchronized session where all students answer the same questions in real time. Live results displayed on the classroom projector. | High |
| **Parent companion dashboard** | Parents link to their child's account via email. View progress summaries, set daily time limits, receive weekly email digests. | Medium |
| **Offline-first improvements** | Full offline mode with conflict-free sync (CRDTs or operational transforms). Multi-device seamless experience. | Medium |

### 11.2 Medium-Term (Year 2-3)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Additional subjects: French/Grammar** | Extend the question engine to support French language learning (conjugation, spelling, grammar). Reuse the progression and engagement systems. | High |
| **Additional subjects: Science** | Basic science questions aligned to the French curriculum (cycle 2 and 3). | Medium |
| **API for school management systems** | Integration with existing school management platforms (Pronote, ENT) for automatic class synchronization and single sign-on. | Medium |
| **Advanced analytics / data export** | Teacher and admin ability to export data as CSV/PDF. Integration with learning management systems (LTI standard). | Medium |

### 11.3 Long-Term (Year 3+)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Multiplayer real-time battles** | Head-to-head math duels between students (similar to Kahoot but always available). Matchmaking by skill level. | Medium |
| **Content creation tools for teachers** | Allow teachers to create custom question sets for their class, using the template system. | Medium |
| **Adaptive learning AI** | Replace rule-based progression with ML-based difficulty selection that optimizes for each individual student's learning rate. | Low |
| **Native mobile apps** | If PWA limitations on iOS become untenable, consider native wrappers (Capacitor or Tauri Mobile) for App Store distribution. | Low |

---

## Appendix A: Sprint Calendar Overview

| Sprint | Weeks | Dates (approx.) | Phase | Focus |
|--------|-------|-----------------|-------|-------|
| 1 | 1-2 | Feb 17 - Feb 28 | 1 | Project scaffolding, CI/CD, Supabase, PWA |
| 2 | 3-4 | Mar 3 - Mar 14 | 1 | Auth flow, UI framework, design system |
| 3 | 5-6 | Mar 17 - Mar 28 | 1 | Question engine, CP content (CNT, ORD, ADD, SUB) |
| 4 | 7-8 | Mar 31 - Apr 11 | 1 | Scoring, results screen, session sync, hints |
| 5 | 9-10 | Apr 14 - Apr 25 | 1 | Progression system, CE1 content, progress page |
| 6 | 11-12 | Apr 28 - May 9 | 1 | Avatars, daily streaks, sounds, offline polish |
| 7 | 13-14 | May 12 - May 23 | 1 | E2E testing, performance, bug fixes |
| 8 | 15-16 | May 26 - Jun 6 | 1 | User testing, soft launch prep, monitoring |
| 9-10 | 17-20 | Jun 9 - Jul 4 | 2 | CE2 + CM1 content, new question types |
| 11-12 | 21-24 | Jul 7 - Aug 1 | 2 | CM2 content, remaining question types |
| 13-14 | 25-28 | Aug 4 - Aug 29 | 2 | Micro-level progression, gems, power-ups |
| 15-16 | 29-32 | Sep 1 - Sep 26 | 2 | English i18n, extended cosmetics, leaderboard prep |
| 17-18 | 33-36 | Sep 29 - Oct 24 | 3 | School/class model, teacher auth, join codes |
| 19-20 | 37-40 | Oct 27 - Nov 21 | 3 | Teacher dashboard, class analytics |
| 21-22 | 41-44 | Nov 24 - Dec 19 | 3 | Leaderboards, team challenges, social features |
| 23-24 | 45-48 | Jan 5 - Jan 30 | 4 | AI tutor integration |
| 25-26 | 49-52 | Feb 2 - Feb 27 | 4 | Concept library, achievements, daily/weekly challenges |
| 27-28 | 53-56 | Mar 2 - Mar 27 | 4 | Seasonal events, spaced repetition, advanced adaptive |
| 29-30 | 57-60 | Mar 30 - Apr 24 | 5 | Admin dashboard (core) |
| 31-32 | 61-64 | Apr 27 - May 22 | 5 | Admin dashboard (economy, analytics, moderation) |
| 33-34 | 65-68 | May 25 - Jun 19 | 5 | Performance, accessibility, parent dashboard, scale prep |

*Note: Calendar assumes a start date of February 17, 2026. Holidays and team availability may shift dates.*

## Appendix B: Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | SvelteKit | 2.x |
| Build tool | Vite | 6.x |
| PWA | @vite-pwa/sveltekit (Workbox) | Latest |
| Styling | Tailwind CSS | 4.x |
| State management | Svelte stores + IndexedDB (idb-keyval) | Built-in |
| i18n | svelte-i18n | Latest |
| Backend / API | Supabase Edge Functions (Deno) | Latest cloud |
| Database | PostgreSQL 15+ (via Supabase) | Supabase-managed |
| Auth | Supabase Auth | Included |
| Realtime | Supabase Realtime | Included |
| Frontend hosting | Cloudflare Pages | Free tier |
| Edge caching | Cloudflare Workers | Free tier |
| AI tutor (primary) | Google Gemini 2.0 Flash | API |
| AI tutor (fallback) | OpenAI GPT-4o Mini | API |
| Analytics | PostHog (self-hosted) or Plausible | Self-hosted |
| Error tracking | Sentry | Free tier |
| Uptime monitoring | Better Uptime | Free tier |
| Testing (unit) | Vitest | Latest |
| Testing (E2E) | Playwright | Latest |
| CI/CD | GitHub Actions | N/A |
| Package manager | pnpm | 9+ |
| Node.js | Node.js | 20+ LTS |

## Appendix C: Glossary

| Term | Definition |
|------|-----------|
| **CP** | Cours Preparatoire -- first year of French primary school (age 6) |
| **CE1** | Cours Elementaire 1 -- second year (age 7) |
| **CE2** | Cours Elementaire 2 -- third year (age 8) |
| **CM1** | Cours Moyen 1 -- fourth year (age 9) |
| **CM2** | Cours Moyen 2 -- fifth year (age 10) |
| **Sub-level** | One of 10 difficulty bands within a level, mapped to curriculum periods |
| **Micro-level** | One of 10 fine-grained difficulty steps within a sub-level (Phase 2) |
| **Gate quiz** | A 10-question assessment at the end of a sub-level to verify mastery |
| **Level-up exam** | A 20-question assessment at the end of a level to verify readiness for the next grade |
| **MC** | Multiple Choice question type |
| **FIB** | Fill-in-the-Blank question type |
| **FI** | Free Input question type |
| **CMP** | Comparison question type (< > =) |
| **RLS** | Row Level Security (PostgreSQL) |
| **PWA** | Progressive Web App |
| **LCP** | Largest Contentful Paint (Core Web Vital) |
| **TTI** | Time to Interactive |
| **FCP** | First Contentful Paint |
| **CLS** | Cumulative Layout Shift |
| **CNIL** | Commission Nationale de l'Informatique et des Libertes (French data protection authority) |
| **DAU** | Daily Active Users |
| **MAU** | Monthly Active Users |

---

*Document version: 1.0*
*Last updated: 2026-02-12*
*Status: Roadmap & Implementation Plan -- ready for team alignment*
