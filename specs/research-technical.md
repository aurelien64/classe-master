# Technical Architecture Research -- Classe Master

> Children's Educational Math Game (PWA)
> Target: French primary school children, ages 6--11
> Languages: French, English
> Date: 2026-02-12

---

## Table of Contents

1. [Technology Stack Recommendations](#1-technology-stack-recommendations)
2. [PWA Architecture](#2-pwa-architecture)
3. [Data Model Design](#3-data-model-design)
4. [Privacy and Safety for Children](#4-privacy-and-safety-for-children)
5. [Security Architecture](#5-security-architecture)
6. [Internationalization (i18n)](#6-internationalization-i18n)
7. [AI Integration for Tutor/Help](#7-ai-integration-for-tutorhelp)
8. [Scalability Considerations](#8-scalability-considerations)
9. [Monitoring and Analytics](#9-monitoring-and-analytics)

---

## 1. Technology Stack Recommendations

### 1.1 Frontend Framework

| Criterion | SvelteKit | React (Next.js) | Vue (Nuxt) | Vanilla JS |
|---|---|---|---|---|
| Bundle size (core) | ~3 KB | ~45 KB | ~34 KB | 0 KB |
| Runtime overhead | No virtual DOM | Virtual DOM | Virtual DOM | None |
| Low-end phone perf | Excellent | Adequate | Good | Excellent |
| Developer experience | Excellent | Excellent | Excellent | Poor at scale |
| Ecosystem maturity | Growing (sufficient) | Massive | Large | N/A |
| PWA tooling | vite-pwa/sveltekit | next-pwa / workbox | vite-pwa | Manual |
| Hiring pool (France) | Small but growing | Very large | Large | Universal |
| Learning curve | Low | Medium | Low | Low (initially) |

**Recommendation: SvelteKit**

Rationale:
- **Bundle size is critical** for a children's app used on low-end phones. Svelte compiles to vanilla JS at build time, producing bundles 60--70% smaller than React or Vue equivalents. This translates to roughly 40% faster load times.
- **No runtime overhead.** There is no virtual DOM diffing at runtime. For a game with frequent UI updates (timers, score changes, animations), this means less CPU work and better battery life on cheap devices.
- **SvelteKit provides** file-based routing, server-side rendering (SSR) for SEO of public pages, API routes for lightweight backend endpoints, and first-class Vite integration.
- **The `@vite-pwa/sveltekit` plugin** provides zero-config PWA support with Workbox integration, automatic service worker generation, and manifest handling.
- **Svelte stores** provide built-in reactive state management without additional libraries, reducing complexity.

Risk mitigation: The Svelte ecosystem is smaller than React's. However, for this project the required libraries (i18n, animation, PWA) all have mature Svelte solutions. If a critical library is missing, Svelte can use any vanilla JS library directly.

### 1.2 State Management

**Recommendation: Svelte stores + custom game state machine**

Architecture:

```
Local State Layer (Svelte stores)
    |
    +-- GameStore: current session, score, timer, question state
    +-- PlayerStore: profile, XP, gems, level, settings
    +-- ProgressStore: per-topic mastery, completion state
    +-- UIStore: language, theme, modals, navigation
    |
Persistence Layer
    |
    +-- IndexedDB (via idb-keyval): offline-first local storage
    +-- Supabase sync: background sync when online
```

Key design decisions:
- **Offline-first**: All game state is written to IndexedDB immediately. A sync queue stores pending changes to push to the server when connectivity returns.
- **Optimistic updates**: The UI always reflects local state. Server confirmations happen in the background.
- **Session state machine**: A finite state machine (using XState or a lightweight custom implementation) manages game session transitions: `IDLE -> LOADING -> PLAYING -> PAUSED -> ANSWERING -> FEEDBACK -> COMPLETE -> SYNCING`.
- **No Redux/Vuex complexity**: Svelte's built-in stores with derived stores cover all reactive state needs without an additional dependency.

### 1.3 Backend

| Option | Pros | Cons | Cost at scale |
|---|---|---|---|
| Supabase (hosted) | Auth, DB, Edge Functions, Realtime built-in; PostgreSQL; generous free tier | Vendor coupling (mitigated by open-source) | $25/mo Pro, predictable |
| Firebase | Real-time sync, generous free tier, Google ecosystem | Proprietary NoSQL, vendor lock-in, unpredictable costs at scale | Can spike unexpectedly |
| Node.js (self-hosted) | Full control, large ecosystem | DevOps burden, hosting costs | $50--200/mo for servers |
| Python/Django | Admin panel, ORM, mature ecosystem | Slower for real-time, heavier | $50--200/mo for servers |
| Serverless (AWS Lambda) | Pay-per-use, auto-scale | Cold starts, complex setup, AWS complexity | Very cheap at low scale |

**Recommendation: Supabase as primary backend**

Rationale:
- **PostgreSQL under the hood**: Relational data model fits the school/class/student hierarchy perfectly. Complex queries for analytics and leaderboards use standard SQL.
- **Built-in Auth**: Supports email/password, magic links, and anonymous sessions -- important for flexible child authentication.
- **Row Level Security (RLS)**: Database-level access control ensures a student can only read their own data, a teacher can only see their class, and an admin can see their school. This is enforced at the database level, not in application code.
- **Edge Functions (Deno runtime)**: Serverless functions for score validation, AI tutor proxy, and custom business logic. Deployed globally. 500,000 free invocations/month.
- **Realtime subscriptions**: Built on PostgreSQL's LISTEN/NOTIFY for live leaderboard updates.
- **Free tier is sufficient for development and small pilots**: 500 MB storage, 50,000 MAU, 2 GB egress.
- **Pro plan at $25/month** is predictable, unlike Firebase's usage-based spikes.
- **No vendor lock-in**: Supabase is open-source. The database is standard PostgreSQL. If needed, the entire backend can be migrated to self-hosted Supabase or raw PostgreSQL + custom API.

Supplementary: **Cloudflare Workers** for edge caching of leaderboards and static question banks. Their free tier allows 100,000 requests/day.

### 1.4 Database

**Recommendation: PostgreSQL (via Supabase)**

Rationale:
- The data model has clear relational structures: School -> Class -> Student -> Sessions -> Answers. PostgreSQL handles these joins efficiently.
- **Materialized views** for leaderboard pre-computation avoid expensive real-time aggregation queries.
- **JSONB columns** for flexible data like question_data and inventory items, combining relational structure with document flexibility.
- **Full-text search** for question banks (built-in `tsvector`).
- **Row Level Security** policies enforce data isolation at the database level.
- **Excellent indexing**: B-tree for lookups, GIN for JSONB, partial indexes for active sessions.

### 1.5 Real-time Features (Leaderboards)

| Approach | Latency | Complexity | Cost | Scalability |
|---|---|---|---|---|
| Polling (30s) | High (30s) | Very low | Very low | Excellent |
| SSE | Low (~1s) | Low | Low | Good |
| WebSockets | Very low (<100ms) | Medium | Medium | Good |
| Supabase Realtime | Low (~1s) | Very low | Included | Good |

**Recommendation: Tiered approach**

1. **Class leaderboard**: Supabase Realtime subscriptions (PostgreSQL LISTEN/NOTIFY). Updates propagate within ~1 second. Sufficient for a class of 30 students.
2. **School leaderboard**: SSE or polling every 30 seconds. Computed from a materialized view refreshed every 60 seconds.
3. **Global leaderboard**: Polling every 5 minutes against a cached endpoint (Cloudflare Workers KV or edge-cached response). Computed hourly via a scheduled function.

This tiered approach matches real user expectations -- children care most about their class ranking, which updates fastest, while global rankings can be slightly delayed.

### 1.6 Authentication

**Recommendation: Layered authentication based on user role**

| Role | Auth method | Details |
|---|---|---|
| Student (6--11) | Class code + username + optional PIN | No email required, no personal data |
| Teacher | Email + password (or magic link) | Standard Supabase Auth |
| Parent | Email + password (or magic link) | Links to child's account for oversight |
| Admin (school) | Email + password + optional 2FA | Higher privilege |

**Student flow**:
1. Teacher creates a class, receives a 6-character join code (e.g., `MATH42`).
2. Student enters the class code on the join screen.
3. Student picks a username (validated against a list of allowed fun names or freely chosen with profanity filter) and an avatar.
4. Optionally sets a 4-digit PIN for returning sessions.
5. On the same device, a session token is stored in `localStorage`. The student is recognized automatically on return.
6. To play on a new device, the student re-enters class code + username + PIN.

This approach collects **zero personal data** from children (no email, no real name, no date of birth).

### 1.7 Hosting

| Platform | Static assets | Edge functions | Cost (free tier) | Scalability |
|---|---|---|---|---|
| Cloudflare Pages + Workers | Unlimited bandwidth | 100k req/day free | $0 (very generous) | Excellent |
| Vercel | 100 GB/mo | 100k invocations/mo | $0 (hobby) | Good |
| Netlify | 100 GB/mo | 125k functions/mo | $0 (starter) | Good |
| Self-hosted (VPS) | Full control | Full control | ~$10--50/mo | Manual scaling |

**Recommendation: Cloudflare Pages for the frontend + Supabase for the backend**

Rationale:
- **Cloudflare Pages** serves the SvelteKit static build with unlimited bandwidth at no cost. TTFB is approximately 50 ms globally (200+ edge locations).
- **Supabase** handles database, auth, real-time, edge functions, and file storage.
- This combination provides an extremely cost-effective stack: potentially $0/month during development and pilot, and $25/month (Supabase Pro) + $5/month (Cloudflare Workers paid) = **$30/month** for production with thousands of users.
- Both platforms provide automatic HTTPS, global CDN, and CI/CD from Git.

---

## 2. PWA Architecture

### 2.1 Service Worker Strategy

**Plugin**: `@vite-pwa/sveltekit` with Workbox under the hood.

**Registration strategy**: `autoUpdate` -- the service worker updates silently in the background. Children should not see update prompts.

**Caching strategies by resource type**:

| Resource | Strategy | Max age | Rationale |
|---|---|---|---|
| App shell (HTML, CSS, JS) | Precache (install-time) | Until new deploy | Ensures instant load and offline access |
| Game assets (images, SVG, sounds) | Cache-first | 30 days | Large assets rarely change; serve from cache |
| Question banks (JSON) | Stale-while-revalidate | 7 days | Serve cached version instantly, update in background |
| API responses (progress, scores) | Network-first | 1 hour fallback | Always try fresh data; fall back to cache offline |
| AI tutor responses | Cache-first (by hash) | 30 days | Cache identical question explanations |
| Leaderboard data | Network-only | N/A | Always fresh; not critical offline |
| User avatar images | Cache-first | 90 days | Rarely change |
| Fonts | Cache-first | 1 year | Never change |

**Offline play strategy**:

```
Pre-cached at install:
  - App shell (all routes)
  - Core game engine code
  - Default question bank (500 questions per level)
  - All UI assets (images, sounds, SVG sprites)
  - Localization files (fr.json, en.json)

Cached on first access:
  - Extended question banks per level
  - User's avatar and inventory images

Sync queue (stored in IndexedDB):
  - Completed game sessions
  - Answer logs
  - Progress updates
  - XP and gem changes
  -> Synced via Background Sync API when online
  -> Fallback: sync on next app open if Background Sync unavailable
```

### 2.2 Cache Management

**Storage budget**: Target maximum 50 MB for all cached content. This is safe even on low-end devices.

```
Estimated cache breakdown:
  - App shell + JS:        ~500 KB (gzipped)
  - Game images/SVG:       ~5 MB
  - Sound effects:         ~3 MB
  - Question banks (JSON): ~2 MB (compressed)
  - Fonts:                 ~500 KB
  - Localization files:    ~50 KB
  - Cached API responses:  ~1 MB
  Total:                   ~12 MB typical / 50 MB maximum
```

**Cache versioning**: The service worker uses Workbox's `precacheAndRoute` with revision hashes. On deploy, only changed files are re-downloaded.

**Cache cleanup**: A Workbox `ExpirationPlugin` removes entries older than their max age. A `CacheableResponsePlugin` only caches 200 responses.

### 2.3 Install Prompt

**Strategy for children and parents**:

1. **Do not use the browser's default mini-infobar.** Intercept `beforeinstallprompt` and suppress it.
2. **Show a custom, child-friendly install banner** after the child completes their first game session (moment of engagement).
3. The banner uses:
   - Simple language: "Add Classe Master to your home screen to play anytime!" (FR: "Ajoute Classe Master sur ton ecran d'accueil pour jouer a tout moment !")
   - A large, colorful button with the app icon.
   - A friendly mascot illustration.
   - A "Maybe later" option (no dark patterns).
4. **iOS special handling**: Since iOS has no `beforeinstallprompt`, detect iOS Safari and show an educational overlay explaining the "Share -> Add to Home Screen" steps, illustrated with screenshots/icons.
5. **Teacher/parent onboarding**: In the teacher dashboard, provide a QR code that links to a page with install instructions for both Android and iOS. Teachers can project this in class.

### 2.4 Push Notifications

**Recommendation: Do not implement push notifications for children.**

Rationale:
- The UK Age Appropriate Design Code states that nudge techniques should not be used to encourage children to spend more time online.
- The CNIL recommends against engagement-driving features for children.
- Push notifications create compulsive checking behavior, which is inappropriate for ages 6--11.
- From a practical standpoint, iOS PWA push support remains limited.

**Exception**: Teacher accounts may opt in to weekly digest notifications (class progress summary). These are sent via email, not push.

### 2.5 App Manifest Configuration

```json
{
  "name": "Classe Master - Jeu de Maths",
  "short_name": "Classe Master",
  "description": "Apprends les maths en t'amusant !",
  "start_url": "/play",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#4F46E5",
  "background_color": "#F8FAFC",
  "lang": "fr",
  "dir": "ltr",
  "categories": ["education", "games"],
  "icons": [
    { "src": "/icons/icon-72.png",  "sizes": "72x72",   "type": "image/png" },
    { "src": "/icons/icon-96.png",  "sizes": "96x96",   "type": "image/png" },
    { "src": "/icons/icon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/game.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" },
    { "src": "/screenshots/dashboard.png", "sizes": "1280x720", "type": "image/png", "form_factor": "wide" }
  ]
}
```

### 2.6 Performance Targets

| Metric | Target | Rationale |
|---|---|---|
| First Contentful Paint | < 1.5s on 3G | Children lose attention quickly |
| Largest Contentful Paint | < 2.5s on 3G | Core Web Vitals "Good" threshold |
| Time to Interactive | < 3.0s on 3G | Must be playable quickly |
| Total Blocking Time | < 200ms | Smooth interactions during gameplay |
| Cumulative Layout Shift | < 0.1 | Prevent accidental mis-taps |
| JS bundle size (initial) | < 100 KB gzipped | Fast load on slow connections |
| Lighthouse PWA score | 100 | Full PWA compliance |
| Offline load time | < 500ms | Instant from cache |
| Animation frame rate | 60 fps | Smooth game feel |
| Memory usage | < 100 MB | Low-end phone safety margin |

**Target reference device**: Samsung Galaxy A03 (2 GB RAM, Mediatek MT6739, Android 12). This represents a budget phone common in French households.

---

## 3. Data Model Design

### 3.1 Entity Relationship Overview

```
School 1---* Class 1---* Student
                |              |
                |              +---* GameSession 1---* AnswerLog
                |              +---1 Progress
                |              +---1 Inventory
                |              +---* Achievement
                |
                +---* ClassLeaderboard
```

### 3.2 Detailed Table Schemas

#### schools

```sql
CREATE TABLE schools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    code            VARCHAR(10) UNIQUE NOT NULL,  -- school identifier
    settings        JSONB DEFAULT '{}',           -- school-wide config
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- settings JSONB example:
-- {
--   "max_classes": 20,
--   "allowed_levels": [1,2,3,4,5],
--   "custom_branding": false
-- }
```

#### classes

```sql
CREATE TABLE classes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID REFERENCES schools(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,               -- e.g., "CM1 - Mme Dupont"
    join_code       VARCHAR(8) UNIQUE NOT NULL,  -- e.g., "MATH42"
    teacher_id      UUID REFERENCES auth.users(id),
    grade_level     SMALLINT NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
                    -- 1=CP, 2=CE1, 3=CE2, 4=CM1, 5=CM2
    settings        JSONB DEFAULT '{}',
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_classes_school ON classes(school_id);
CREATE INDEX idx_classes_join_code ON classes(join_code);
CREATE INDEX idx_classes_teacher ON classes(teacher_id);

-- settings JSONB example:
-- {
--   "max_students": 35,
--   "ai_tutor_enabled": true,
--   "daily_xp_cap": 500,
--   "allowed_game_modes": ["practice", "challenge", "speed"],
--   "show_leaderboard": true
-- }
```

#### players (students)

```sql
CREATE TABLE players (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id        UUID REFERENCES classes(id) ON DELETE SET NULL,
    username        VARCHAR(30) NOT NULL,        -- display name, no real name
    avatar_id       VARCHAR(50) DEFAULT 'default_1',
    pin_hash        VARCHAR(255),                -- bcrypt hash of optional PIN
    locale          VARCHAR(5) DEFAULT 'fr',     -- 'fr' or 'en'

    -- Progression
    level           SMALLINT DEFAULT 1,          -- current game level (1-5)
    sublevel        SMALLINT DEFAULT 1,          -- sublevel within level
    xp              INTEGER DEFAULT 0,
    gems            INTEGER DEFAULT 0,

    -- Settings
    settings        JSONB DEFAULT '{}',
    sound_enabled   BOOLEAN DEFAULT true,

    -- Metadata
    last_played_at  TIMESTAMPTZ,
    total_play_time INTEGER DEFAULT 0,           -- in seconds
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now(),

    UNIQUE(class_id, username)
);

CREATE INDEX idx_players_class ON players(class_id);
CREATE INDEX idx_players_xp ON players(xp DESC);

-- settings JSONB example:
-- {
--   "difficulty_preference": "adaptive",
--   "theme": "space",
--   "font_size": "normal"
-- }
```

#### game_sessions

```sql
CREATE TABLE game_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id           UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    class_id            UUID REFERENCES classes(id),   -- denormalized for queries

    -- Game context
    game_mode           VARCHAR(20) NOT NULL,          -- 'practice', 'challenge', 'speed', 'boss'
    level               SMALLINT NOT NULL,
    sublevel            SMALLINT NOT NULL,
    topic               VARCHAR(50) NOT NULL,          -- 'addition', 'multiplication', etc.

    -- Timing
    started_at          TIMESTAMPTZ DEFAULT now(),
    ended_at            TIMESTAMPTZ,
    duration_seconds    INTEGER,                       -- computed on end

    -- Results
    score               INTEGER DEFAULT 0,
    questions_total     INTEGER DEFAULT 0,
    questions_correct   INTEGER DEFAULT 0,
    accuracy            REAL GENERATED ALWAYS AS (
                            CASE WHEN questions_total > 0
                            THEN questions_correct::REAL / questions_total
                            ELSE 0 END
                        ) STORED,
    xp_earned           INTEGER DEFAULT 0,
    gems_earned         INTEGER DEFAULT 0,
    streak_max          INTEGER DEFAULT 0,

    -- Validation
    is_validated        BOOLEAN DEFAULT false,         -- server-side validation flag
    client_fingerprint  VARCHAR(64),                   -- for anti-cheat detection

    created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sessions_player ON game_sessions(player_id, started_at DESC);
CREATE INDEX idx_sessions_class ON game_sessions(class_id, started_at DESC);
CREATE INDEX idx_sessions_topic ON game_sessions(topic);
CREATE INDEX idx_sessions_score ON game_sessions(score DESC)
    WHERE is_validated = true;
```

#### answer_logs

```sql
CREATE TABLE answer_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,

    -- Question details
    question_type   VARCHAR(30) NOT NULL,        -- 'arithmetic', 'word_problem', 'comparison', etc.
    question_data   JSONB NOT NULL,              -- full question structure
    -- example: {"operand1": 7, "operand2": 5, "operator": "+", "display": "7 + 5 = ?"}

    -- Answer details
    player_answer   TEXT,                        -- what the child entered
    correct_answer  TEXT NOT NULL,               -- expected answer
    is_correct      BOOLEAN NOT NULL,
    time_taken_ms   INTEGER,                     -- milliseconds to answer

    -- Learning analytics
    difficulty      REAL,                        -- 0.0 to 1.0 difficulty rating
    hint_used       BOOLEAN DEFAULT false,
    ai_help_used    BOOLEAN DEFAULT false,

    answered_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_answers_session ON answer_logs(session_id);
CREATE INDEX idx_answers_player ON answer_logs(player_id, answered_at DESC);
CREATE INDEX idx_answers_type ON answer_logs(question_type, is_correct);

-- Partitioning strategy for large scale:
-- Partition answer_logs by month using RANGE on answered_at
-- This keeps queries fast as data grows
```

#### progress

```sql
CREATE TABLE progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       UUID UNIQUE NOT NULL REFERENCES players(id) ON DELETE CASCADE,

    -- Current position
    current_level   SMALLINT DEFAULT 1,
    current_sublevel SMALLINT DEFAULT 1,
    current_micro_level SMALLINT DEFAULT 1,

    -- Topic mastery (0.0 to 1.0 per topic)
    topic_mastery   JSONB DEFAULT '{}',
    -- example: {
    --   "addition_single": 0.95,
    --   "addition_double": 0.72,
    --   "subtraction_single": 0.88,
    --   "multiplication_tables": 0.45,
    --   "division_simple": 0.30,
    --   "fractions_intro": 0.0,
    --   "geometry_shapes": 0.65,
    --   "word_problems_easy": 0.55
    -- }

    -- Adaptive difficulty
    current_difficulty REAL DEFAULT 0.5,         -- 0.0 (easiest) to 1.0 (hardest)
    consecutive_correct INTEGER DEFAULT 0,
    consecutive_wrong   INTEGER DEFAULT 0,

    -- Stats
    total_sessions      INTEGER DEFAULT 0,
    total_questions     INTEGER DEFAULT 0,
    total_correct       INTEGER DEFAULT 0,
    total_play_time     INTEGER DEFAULT 0,       -- seconds
    longest_streak      INTEGER DEFAULT 0,

    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_progress_mastery ON progress USING GIN (topic_mastery);
```

#### inventory

```sql
CREATE TABLE inventory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    item_type       VARCHAR(30) NOT NULL,        -- 'avatar', 'badge', 'powerup', 'theme'
    item_id         VARCHAR(50) NOT NULL,        -- e.g., 'avatar_astronaut', 'badge_100_streak'
    quantity        INTEGER DEFAULT 1,
    acquired_at     TIMESTAMPTZ DEFAULT now(),
    metadata        JSONB DEFAULT '{}',

    UNIQUE(player_id, item_type, item_id)
);

CREATE INDEX idx_inventory_player ON inventory(player_id);
```

#### achievements

```sql
CREATE TABLE achievements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    achievement_id  VARCHAR(50) NOT NULL,        -- e.g., 'first_perfect_score', 'streak_50'
    unlocked_at     TIMESTAMPTZ DEFAULT now(),
    metadata        JSONB DEFAULT '{}',          -- context: {"streak_count": 50, "topic": "addition"}

    UNIQUE(player_id, achievement_id)
);

CREATE INDEX idx_achievements_player ON achievements(player_id);
```

#### leaderboard_cache

```sql
-- Materialized view, refreshed periodically
CREATE MATERIALIZED VIEW leaderboard_class_daily AS
SELECT
    gs.class_id,
    gs.player_id,
    p.username,
    p.avatar_id,
    SUM(gs.score) AS total_score,
    SUM(gs.xp_earned) AS total_xp,
    COUNT(*) AS sessions_count,
    AVG(gs.accuracy) AS avg_accuracy,
    RANK() OVER (
        PARTITION BY gs.class_id
        ORDER BY SUM(gs.xp_earned) DESC
    ) AS rank
FROM game_sessions gs
JOIN players p ON p.id = gs.player_id
WHERE gs.started_at >= CURRENT_DATE
    AND gs.is_validated = true
GROUP BY gs.class_id, gs.player_id, p.username, p.avatar_id;

CREATE UNIQUE INDEX idx_lb_class_daily
    ON leaderboard_class_daily(class_id, player_id);

-- Refresh every 60 seconds via pg_cron or Supabase scheduled function:
-- SELECT cron.schedule('refresh-leaderboard', '* * * * *',
--     'REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_class_daily');

-- Additional materialized views:
-- leaderboard_class_weekly   (refreshed every 5 min)
-- leaderboard_school_weekly  (refreshed every 15 min)
-- leaderboard_global_weekly  (refreshed every 60 min)
```

#### ai_help_logs

```sql
CREATE TABLE ai_help_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    session_id      UUID REFERENCES game_sessions(id),
    question_data   JSONB NOT NULL,
    prompt_sent     TEXT NOT NULL,                -- sanitized prompt (no PII)
    response_text   TEXT NOT NULL,
    model_used      VARCHAR(50),                 -- e.g., 'gemini-2.0-flash'
    tokens_used     INTEGER,
    latency_ms      INTEGER,
    was_cached      BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_help_player ON ai_help_logs(player_id, created_at DESC);
```

### 3.3 Row Level Security Policies

```sql
-- Students can only read/update their own data
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_self_access ON players
    FOR ALL USING (id = auth.uid());

-- Teachers can read all students in their classes
CREATE POLICY teacher_read_students ON players
    FOR SELECT USING (
        class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

-- Students can read class leaderboard
CREATE POLICY leaderboard_class_read ON leaderboard_class_daily
    FOR SELECT USING (
        class_id IN (
            SELECT class_id FROM players WHERE id = auth.uid()
        )
    );

-- Students can only read their own sessions and answers
CREATE POLICY session_self_access ON game_sessions
    FOR ALL USING (player_id = auth.uid());

CREATE POLICY answer_self_access ON answer_logs
    FOR ALL USING (player_id = auth.uid());
```

---

## 4. Privacy and Safety for Children

### 4.1 Regulatory Framework

#### GDPR Article 8 -- France

- In France, the age of digital consent is **15 years** (set by the French Data Protection Act).
- Children under 15 require **verifiable parental consent** for processing of personal data where the lawful basis is consent.
- **Important nuance for educational tools**: When the lawful basis is **legitimate interest** (for an educational service provided by a school), parental consent for data processing may not be strictly required under Article 8. However, the school/teacher acts as the data controller or joint controller and must ensure appropriate safeguards.
- Our approach: **Minimize data collection to avoid the consent question entirely.** If we collect no personal data from children, the consent requirements are vastly simplified.

#### CNIL Recommendations (8 Recommendations for Children)

1. **Regulate children's online capacity**: Age-appropriate features only.
2. **Encourage exercise of rights**: Easy data deletion, clear explanations.
3. **Support parents**: Provide parental dashboard and controls.
4. **Parental consent for under-15s**: Required if collecting personal data.
5. **Respect privacy in parental controls**: Monitor without surveilling.
6. **Children's rights by design**: High-privacy defaults, minimal data.
7. **Age verification respecting privacy**: No invasive age checks.
8. **Specific safeguards**: No profiling for advertising, no dark patterns.

#### UK Age Appropriate Design Code (Children's Code)

Applies to all online services accessible by under-18s, even if not targeted at them. Key requirements relevant to this project:
- **High privacy by default**: All settings must default to maximum privacy.
- **Data minimization**: Collect only what is strictly necessary.
- **No nudge techniques**: No dark patterns to encourage more screen time.
- **No detrimental use**: Data must not be used against the child's interests.
- **Best interests**: The child's best interests must be the primary consideration.
- **Age-appropriate application**: Design and defaults should match the child's age.

#### COPPA (US expansion consideration)

If expanding to the US market:
- Applies to children under 13.
- Requires **verifiable parental consent** before collecting personal information.
- Requires a clear privacy policy.
- Requires ability to review, delete, and refuse further collection of child's data.
- The "school exception" allows schools to consent on behalf of parents for educational purposes, but only for school-authorized educational tools.

### 4.2 Data Minimization Strategy

**Data we collect from children**:
| Data point | Collected? | Justification |
|---|---|---|
| Real name | NO | Username/alias only |
| Email | NO | Not needed for child accounts |
| Date of birth | NO | Grade level inferred from class |
| Location | NO | Not needed |
| Device ID | NO | Session token only |
| IP address | Logs only (auto-purged 24h) | Required for security/rate limiting |
| Game performance | YES | Core educational function |
| Time spent | YES | Teacher analytics, session management |
| Language preference | YES | Core feature |
| Avatar choice | YES | Personalization |

**Data we never collect from children**: Real names, photos, email, phone, address, location, biometrics, contacts, browsing history.

### 4.3 Safety Features

1. **No free-text communication**: Children cannot message each other. No chat, no comments, no custom text visible to other children. Usernames are either selected from a predefined list or filtered against a profanity blocklist.
2. **No user-generated content visible to others**: Avatars are selected from predefined options, not uploaded.
3. **No external links**: The game never links to external websites.
4. **No advertising**: The app is ad-free. No tracking pixels, no third-party analytics that track children.
5. **Session time awareness**: After 45 minutes of continuous play, show a gentle suggestion to take a break (not a restriction, which could cause frustration).
6. **Teacher oversight**: Teachers can see all student progress but cannot see individual answer logs in real time (to avoid surveillance feeling). Teachers see aggregated class data and per-student summary dashboards.
7. **Parental access**: Parents can request a data export or deletion at any time via the teacher or directly through a parent portal.

### 4.4 Data Retention Policies

| Data type | Retention period | Deletion method |
|---|---|---|
| Game sessions | Current school year + 1 year | Automatic purge |
| Answer logs | 6 months (aggregated after) | Aggregate then delete raw |
| Progress data | While student is active | Delete on account removal |
| AI help logs | 3 months | Automatic purge |
| Server access logs | 24 hours | Automatic purge |
| Leaderboard cache | Rolling (daily/weekly/monthly) | Auto-refresh replaces old data |

**Account deletion**: When a student leaves a class or a teacher deletes a student:
1. Immediate: username, avatar, inventory deleted.
2. Within 30 days: all game sessions and answer logs anonymized (player_id replaced with null or a random token, then the original mapping is destroyed).
3. Aggregated learning analytics (class-level, no individual identification) may be retained indefinitely for educational research (with school consent).

---

## 5. Security Architecture

### 5.1 Authentication

**Student authentication flow**:

```
[Student opens app]
    |
    +-- Has stored session token? --> [Validate token] --> [Resume play]
    |
    +-- No token? --> [Enter class code] --> [Select username]
                          |
                          +-- New student? --> [Create account] --> [Set optional PIN]
                          |
                          +-- Existing student? --> [Enter PIN or auto-match on device]
```

**Session tokens**:
- JWTs issued by Supabase Auth with a custom claim for `player_id` and `class_id`.
- Token lifetime: 7 days for students (long-lived to avoid re-auth friction for children).
- Refresh tokens: 30-day lifetime.
- Tokens stored in `httpOnly` cookies where possible, or `localStorage` for PWA compatibility.

**Teacher authentication**:
- Standard email + password or magic link via Supabase Auth.
- Optional TOTP-based 2FA for teachers managing multiple classes.
- Session lifetime: 24 hours with refresh.

### 5.2 Anti-Cheating Measures

Since this is an educational tool (not a competitive esport), anti-cheat is about **data integrity** more than preventing all cheating:

1. **Server-side score validation**: When a session is synced, the edge function validates:
   - `questions_correct <= questions_total`
   - `time_taken_ms` per answer is >= 500 ms (no instant answers)
   - `duration_seconds` is plausible for the number of questions
   - Score matches the expected calculation formula
   - Answers are mathematically correct for the recorded questions
2. **Session fingerprint**: A hash of the session's questions + answers + timings is computed client-side and verified server-side. Tampering with individual fields invalidates the hash.
3. **Rate limiting per session**: Maximum 1 session start per 10 seconds, maximum 120 answers per minute (generous limit for speed challenges).
4. **Anomaly detection (future)**: Flag sessions where a student's performance suddenly jumps far above their historical average. These are flagged for teacher review, not auto-punished.
5. **No client-trust for leaderboard**: Only sessions with `is_validated = true` (server-confirmed) appear on leaderboards.

### 5.3 Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| Login/join class | 5 requests | 1 minute |
| Start game session | 6 requests | 1 minute |
| Submit answer | 120 requests | 1 minute |
| Sync session | 10 requests | 1 minute |
| AI tutor help | 10 requests | 5 minutes |
| Leaderboard fetch | 30 requests | 1 minute |
| Teacher API | 60 requests | 1 minute |

Implementation: Supabase Edge Functions with Upstash Redis for distributed rate limiting, or Cloudflare's built-in rate limiting on the CDN edge.

### 5.4 Input Sanitization

- **All user input is treated as untrusted.** Usernames, PINs, answers, and any text input are sanitized.
- **Username validation**: 3--20 characters, alphanumeric + limited special chars, checked against a profanity blocklist (French and English).
- **Answer input**: Numeric only for arithmetic (validated client-side and server-side). Word problem answers validated against expected format.
- **SQL injection prevention**: Supabase uses parameterized queries by default. All edge function database calls use the Supabase client library, never raw SQL string concatenation.
- **XSS prevention**: SvelteKit escapes all template expressions by default. The `{@html}` directive is never used with user-provided content.
- **CSRF**: SvelteKit handles CSRF protection for form submissions. API calls use JWT bearer tokens.
- **Content Security Policy**: Strict CSP headers deployed via Cloudflare.

```
Content-Security-Policy:
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    font-src 'self';
    media-src 'self';
    object-src 'none';
    frame-src 'none';
```

### 5.5 HTTPS and Transport Security

- HTTPS enforced at both Cloudflare (frontend) and Supabase (backend).
- HSTS headers with `max-age=31536000; includeSubDomains; preload`.
- TLS 1.2 minimum (TLS 1.3 preferred).
- Certificate transparency monitoring via Cloudflare.

---

## 6. Internationalization (i18n)

### 6.1 Library Choice

**Recommendation: `svelte-i18n`**

Rationale:
- Built specifically for Svelte, leveraging Svelte stores for reactivity.
- Uses the ICU MessageFormat standard for pluralization, gender, and number formatting.
- Supports lazy-loading of locale files (important for bundle size).
- Includes `$format.number()`, `$format.date()`, `$format.time()` based on `Intl` APIs.
- Lighter weight than wrapping i18next for Svelte.

### 6.2 Translation File Structure

```
src/
  lib/
    i18n/
      fr.json          -- French translations (primary)
      en.json          -- English translations
      fr-math.json     -- French math-specific terms
      en-math.json     -- English math-specific terms
      fr-questions.json -- French word problem templates
      en-questions.json -- English word problem templates
```

**Example `fr.json`**:

```json
{
  "app": {
    "name": "Classe Master",
    "tagline": "Apprends les maths en t'amusant !"
  },
  "game": {
    "score": "Score",
    "level": "Niveau {level}",
    "correct": "Bravo ! Bonne reponse !",
    "incorrect": "Pas tout a fait... La reponse etait {answer}.",
    "streak": "{count, plural, one {# bonne reponse d'affilee} other {# bonnes reponses d'affilee}}",
    "timeLeft": "{seconds, plural, one {# seconde restante} other {# secondes restantes}}",
    "xpEarned": "+{amount} XP"
  },
  "nav": {
    "play": "Jouer",
    "progress": "Ma progression",
    "shop": "Boutique",
    "settings": "Reglages"
  }
}
```

### 6.3 Number Formatting Differences

| Format | French | English |
|---|---|---|
| Decimal separator | Virgule: `3,14` | Period: `3.14` |
| Thousands separator | Espace: `1 000` | Comma: `1,000` |
| Currency | `5,00 EUR` / `5 EUR` | `EUR 5.00` / `5 EUR` |
| Percentage | `75 %` (space before %) | `75%` (no space) |
| Ordinal | `1er`, `2e`, `3e` | `1st`, `2nd`, `3rd` |

**Implementation**: Use the `Intl.NumberFormat` API (available in all modern browsers) via `svelte-i18n`'s `$format.number()`:

```javascript
// French: "1 250,50"
$format.number(1250.50, { locale: 'fr-FR' })

// English: "1,250.50"
$format.number(1250.50, { locale: 'en-US' })
```

**Critical for math game**: When a child enters a numerical answer, the input field must accept both `,` and `.` as decimal separators and normalize internally. The display format must match the child's locale.

### 6.4 Question Template Localization

**Arithmetic questions**: These are language-independent. The question `7 + 5 = ?` is the same in both languages. Only the feedback text needs translation.

**Word problems**: These require full localization, not just translation.

```json
{
  "word_problems": {
    "addition_shopping": {
      "fr": {
        "template": "{name} a {a} billes. {friend} lui donne {b} billes. Combien {name} a-t-il de billes maintenant ?",
        "names": ["Luca", "Emma", "Nolan", "Jade", "Adam", "Chloe"],
        "friend_names": ["son ami", "sa copine", "son cousin", "sa soeur"]
      },
      "en": {
        "template": "{name} has {a} marbles. {friend} gives {name} {b} more marbles. How many marbles does {name} have now?",
        "names": ["Oliver", "Emma", "Noah", "Sophia", "Liam", "Ava"],
        "friend_names": ["a friend", "their cousin", "their sister", "their brother"]
      }
    }
  }
}
```

**Localization considerations for word problems**:
- **Names**: Use culturally appropriate names for each locale.
- **Currency**: EUR for France (euros and centimes), GBP/USD for English contexts.
- **Units**: Metric system for both (France and UK use metric; this simplifies things).
- **Cultural references**: "billes" (marbles), "bonbons" (sweets), "croissants" vs. "cookies", "stickers".

### 6.5 UI Text Management

- All UI text is externalized to JSON locale files. No hardcoded strings in components.
- The locale is determined by: (1) player's saved preference, (2) browser's `navigator.language`, (3) default `fr`.
- Language switch is available in settings and on the initial join screen.
- Locale files are lazy-loaded: only the active locale is included in the initial bundle. The other loads on demand (~10--20 KB).

---

## 7. AI Integration for Tutor/Help

### 7.1 Model Selection

| Model | Input cost (per 1M tokens) | Output cost (per 1M tokens) | Latency | Math quality | Safety |
|---|---|---|---|---|---|
| Gemini 2.0 Flash | $0.10 | $0.40 | ~300ms | Good | Good (Google safety filters) |
| GPT-4o Mini | $0.15 | $0.60 | ~500ms | Very good | Very good (OpenAI moderation) |
| Claude Haiku 3.5 | $1.00 | $5.00 | ~400ms | Good | Excellent (Constitutional AI) |
| Mistral Small 3.1 | ~$0.10 | ~$0.30 | ~400ms | Good | Good |
| Gemini 2.0 Flash-Lite | $0.075 | $0.30 | ~200ms | Adequate | Good |

**Recommendation: Gemini 2.0 Flash as primary, GPT-4o Mini as fallback**

Rationale:
- **Cost**: At $0.10/$0.40 per million tokens, Gemini 2.0 Flash is extremely affordable. A typical help request uses ~200 input tokens and ~300 output tokens, costing approximately $0.00014 per request.
- **Latency**: ~300ms is fast enough for a child waiting for help. The response will feel near-instant.
- **Quality**: Sufficient for explaining primary school math concepts. These are not complex reasoning tasks.
- **Safety**: Google's built-in safety filters provide a baseline. We add our own guardrails on top.
- **Fallback**: If Gemini is down or returns an unsafe response, fall back to GPT-4o Mini.

### 7.2 Cost Estimation

```
Assumptions:
  - 10,000 active students
  - Average 2 help requests per student per day
  - 200 input tokens + 300 output tokens per request
  - 20 school days per month

Monthly requests: 10,000 * 2 * 20 = 400,000 requests

Token usage:
  Input:  400,000 * 200 = 80M tokens  -> 80 * $0.10 = $8.00
  Output: 400,000 * 300 = 120M tokens -> 120 * $0.40 = $48.00

Total: ~$56/month for 10,000 students

With 50% cache hit rate (see 7.4): ~$28/month

Cost per student per month: $0.003 - $0.006
```

This is extremely affordable, even at scale.

### 7.3 Prompt Engineering for Children

**System prompt**:

```
You are a friendly math tutor helping a {age_range}-year-old child in {grade_level}.
You MUST follow these rules strictly:

LANGUAGE:
- Respond in {locale} ({locale_name}).
- Use simple words a child aged {age_range} would understand.
- Use short sentences (maximum 15 words per sentence).
- Never use jargon, sarcasm, or complex vocabulary.

PEDAGOGY:
- Never give the answer directly. Guide the child step by step.
- Use concrete examples (fingers, objects, drawings).
- Encourage the child after each step ("Super !" / "Great job!").
- If the child is stuck, break the problem into smaller pieces.
- Use visual representations when helpful (e.g., "Imagine 7 apples...").
- Maximum 3 steps in an explanation.

SAFETY:
- ONLY discuss math. If asked about anything else, redirect to math.
- Never mention violence, politics, religion, or any adult topics.
- Never ask the child personal questions (name, age, location, school).
- Never provide links or references to external content.
- Never use fear, shame, or negative reinforcement.
- Always be encouraging, even when the child is wrong.

FORMAT:
- Use simple markdown: bold for key numbers, line breaks between steps.
- Include emoji sparingly for encouragement (maximum 2 per response).
- Keep total response under 150 words.
```

**Example interaction**:

```
Question: 47 - 19 = ?
Child answered: 32 (incorrect, correct answer is 28)

Prompt to AI:
"The child (CE2, 8 years old, French) answered 32 to the question 47 - 19.
The correct answer is 28. Help them understand their mistake without
giving the answer. Respond in French."

AI response:
"Tu y es presque ! Essayons ensemble.

**Etape 1** : On peut decomposer 19 en 20 - 1.
C'est plus facile de soustraire 20 d'abord !

**Etape 2** : 47 - 20 = combien ?
Imagine que tu as 47 billes et tu en enleves 20...

**Etape 3** : Maintenant, on avait enleve 1 de trop !
Alors il faut rajouter 1 a ton resultat.

Tu veux reessayer ?"
```

### 7.4 Caching Strategy

**Cache key**: Hash of `(question_type, question_data, child_grade_level, locale, error_type)`.

**Cache layers**:

1. **In-memory cache (edge function)**: Last 100 responses. Lifetime: 5 minutes.
2. **Supabase/Redis cache**: All responses. Lifetime: 30 days.
3. **Pre-computed explanations**: For the most common errors on each question type, pre-generate and store explanations. These are served instantly without an AI call.

**Expected cache hit rate**: 40--60%. Many children make the same common mistakes on the same types of questions.

### 7.5 Fallback to Pre-written Explanations

For each question type and common error pattern, maintain a bank of hand-written explanations:

```json
{
  "addition_carry_error": {
    "fr": "Quand on additionne {a} + {b}, il ne faut pas oublier la retenue ! Essaie de poser l'operation en colonne.",
    "en": "When you add {a} + {b}, don't forget to carry over! Try writing the problem in columns."
  },
  "subtraction_reversal": {
    "fr": "Attention ! On soustrait toujours le petit nombre du grand nombre. Ici, c'est {a} - {b}.",
    "en": "Be careful! We subtract the smaller number from the bigger number. Here, it's {a} - {b}."
  }
}
```

**Fallback priority**: Pre-written explanation (if exact match) -> Cached AI response -> Live AI call -> Generic encouragement message.

### 7.6 Safety for AI Responses

1. **Input filtering**: The child never writes free text to the AI. The help request is generated programmatically from the question data and the child's answer. The child only clicks a "Help me" button.
2. **Output filtering**: Every AI response passes through a simple content filter before being shown:
   - Check response length (reject if > 300 words).
   - Check for disallowed keywords (maintained blocklist).
   - Check that the response contains math-related content.
   - If any check fails, fall back to pre-written explanation.
3. **No conversation history**: Each AI call is stateless. The child cannot have a back-and-forth conversation. This prevents prompt injection and off-topic discussions.
4. **Logging**: All AI interactions are logged (without PII) for quality monitoring. A weekly sample review can catch any problematic responses.
5. **Kill switch**: AI tutor can be disabled per-class or globally via a feature flag, instantly falling back to pre-written explanations.

---

## 8. Scalability Considerations

### 8.1 Capacity Planning

**Target user tiers**:

| Phase | Students | Concurrent users | Schools | Data growth/month |
|---|---|---|---|---|
| Pilot | 500 | 50 | 5 | 100 MB |
| Launch (Year 1) | 10,000 | 1,000 | 100 | 2 GB |
| Growth (Year 2) | 100,000 | 10,000 | 1,000 | 20 GB |
| Scale (Year 3) | 500,000 | 50,000 | 5,000 | 100 GB |

**Peak usage patterns**: French school hours are approximately 8:30--16:30. Peak concurrent usage will occur during morning lessons (9:00--11:00) and early afternoon (14:00--15:30). Evenings and weekends see lighter homework usage.

### 8.2 Database Optimization

**Indexing strategy** (already defined in schema above):
- All foreign keys are indexed.
- Leaderboard queries use materialized views, not real-time aggregation.
- `answer_logs` will be the largest table. Partition by month using PostgreSQL range partitioning on `answered_at`:

```sql
CREATE TABLE answer_logs (
    -- ... columns as above ...
) PARTITION BY RANGE (answered_at);

CREATE TABLE answer_logs_2026_01 PARTITION OF answer_logs
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE answer_logs_2026_02 PARTITION OF answer_logs
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- Auto-create future partitions via pg_partman or scheduled function
```

**Connection pooling**: Supabase includes PgBouncer for connection pooling. At the Growth tier (10,000 concurrent users), the Pro plan's connection limits are sufficient. At Scale tier, consider Supabase's dedicated compute add-on or a self-hosted read replica.

**Query patterns to optimize**:

| Query | Frequency | Optimization |
|---|---|---|
| Fetch player progress | Every session start | Primary key lookup, always fast |
| Submit answer | Every 5--15 seconds per player | Batch insert (client batches, syncs in bulk) |
| Class leaderboard | On game completion | Materialized view, sub-5ms read |
| Teacher class overview | On dashboard load | Pre-aggregated via scheduled function |
| Topic mastery per student | On progress page | JSONB index on progress.topic_mastery |

### 8.3 CDN and Static Assets

**Cloudflare Pages** serves all static assets from 200+ edge locations:
- JavaScript bundles: immutable hashes, cache forever.
- Images/SVG/sounds: long cache (30 days), versioned filenames.
- Question bank JSON: 7-day cache with stale-while-revalidate.

**Image optimization**:
- All game illustrations served as SVG where possible (resolution-independent, small file size).
- Raster images served as WebP with AVIF fallback.
- Avatar sprites combined into sprite sheets to reduce HTTP requests.
- Cloudflare's automatic image optimization (Polish) for user-facing images.

### 8.4 API Rate Limiting

(Detailed in Section 5.3 above.)

**Additional scaling measures**:
- **Request coalescing**: Multiple clients requesting the same leaderboard within a short window receive the same cached response.
- **Batched sync**: The client accumulates answer logs locally and syncs them in a single POST request at session end (or every 30 seconds), rather than one request per answer.
- **Edge caching for read-heavy endpoints**: Leaderboards, question banks, and achievement definitions are cached at the Cloudflare edge with 60-second TTL.

---

## 9. Monitoring and Analytics

### 9.1 Metrics to Track

#### Learning metrics (core product)

| Metric | Purpose | Granularity |
|---|---|---|
| Questions answered per session | Engagement | Per session |
| Accuracy rate | Learning effectiveness | Per topic, per student |
| Time per question | Fluency | Per question type |
| Topic mastery progression | Learning curve | Weekly per student |
| Streak length | Engagement, motivation | Per session |
| AI help usage rate | Difficulty calibration | Per topic |
| Session completion rate | Engagement | Per game mode |
| Repeat question accuracy | Knowledge retention | Per question |

#### Engagement metrics

| Metric | Purpose |
|---|---|
| Daily Active Users (DAU) | Overall engagement |
| Sessions per user per day | Usage intensity |
| Average session duration | Engagement depth |
| Return rate (D1, D7, D30) | Retention |
| Drop-off point in game flow | UX friction identification |
| Install rate (PWA) | Adoption |
| Feature usage (shop, achievements) | Feature value |
| Time-of-day usage distribution | Usage patterns |

#### Technical metrics

| Metric | Alert threshold |
|---|---|
| Page load time (P50, P95) | P95 > 3s |
| API response time (P50, P95) | P95 > 500ms |
| Error rate (4xx, 5xx) | > 1% |
| Service worker cache hit rate | < 80% |
| Offline sync failure rate | > 5% |
| JS bundle size | > 150 KB gzipped |
| Lighthouse score | < 90 |
| Database connection count | > 80% pool |

### 9.2 Teacher Analytics Dashboard

**Class overview**:
- Overall class mastery by topic (heatmap visualization).
- Distribution of student levels (how many students at each mastery level per topic).
- Average accuracy and trend (improving, stable, declining).
- Most common errors by topic (aggregated across class).
- Time spent per student (flag students who play very little or excessively).
- Weekly progress report (automated, can be exported as PDF).

**Individual student view** (accessible by teacher only):
- Topic mastery radar chart.
- Session history (dates, duration, scores -- no individual answer detail to respect student dignity).
- Progression trend over time.
- Comparison to class average (not to other named students).
- AI help usage (high usage may indicate topic is too difficult for the student).

**Privacy principle**: Teachers see learning analytics, not surveillance data. No real-time tracking of what a student is doing right now. No screen recording. No individual answer-by-answer replay.

### 9.3 Implementation Stack

| Tool | Purpose | Cost |
|---|---|---|
| Supabase Dashboard | Database monitoring, auth metrics | Included |
| Cloudflare Analytics | CDN performance, traffic, errors | Included (free) |
| Sentry | Error tracking, performance monitoring | Free tier (5,000 events/month) |
| PostHog (self-hosted or cloud) | Product analytics (privacy-respecting) | Free tier or self-hosted |
| Custom teacher dashboard | Learning analytics | Built in-app |
| pg_stat_statements | Database query performance | Built into PostgreSQL |
| Uptime monitoring (e.g., Better Uptime) | Availability alerting | Free tier available |

**Privacy-first analytics**: PostHog is recommended over Google Analytics because:
- It can be self-hosted (data stays in the EU).
- No cookies required (session-based tracking).
- No personal data sent to third parties.
- Open-source.
- Alternatively, use Plausible Analytics (EU-hosted, cookie-free, lightweight).

**Analytics for children specifically**:
- No fingerprinting or cross-site tracking.
- All analytics are aggregated. No individual tracking that could identify a child.
- Analytics events contain only: `player_id` (pseudonymous UUID), `event_type`, `event_data` (no PII), `timestamp`.

### 9.4 Alerting

**Critical alerts** (PagerDuty/email):
- API error rate > 5% for 5 minutes.
- Database connection pool exhausted.
- Service worker registration failure rate > 10%.
- AI tutor returning unsafe content (detected by filter).

**Warning alerts** (Slack/email):
- P95 latency > 1 second for 10 minutes.
- Daily active users drop > 30% from previous day (potential outage).
- Sync failure rate > 2%.
- Storage usage > 80% of plan limit.

---

## Summary of Recommended Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend framework | SvelteKit | Smallest bundles, best performance on low-end devices |
| Styling | Tailwind CSS | Utility-first, purged CSS is tiny, fast development |
| State management | Svelte stores + IndexedDB | Built-in reactivity, offline-first |
| PWA tooling | @vite-pwa/sveltekit (Workbox) | Zero-config service worker, precaching |
| Backend/API | Supabase (Edge Functions) | All-in-one: auth, DB, realtime, functions |
| Database | PostgreSQL (via Supabase) | Relational model, RLS, materialized views |
| Real-time | Supabase Realtime (class) / SSE (school) / Polling (global) | Tiered approach matching latency needs |
| Authentication | Supabase Auth (custom flow for students) | Flexible, supports anonymous + email |
| Hosting (frontend) | Cloudflare Pages | Free unlimited bandwidth, fastest CDN |
| Hosting (edge logic) | Cloudflare Workers (cache) + Supabase Edge Functions (business logic) | Cost-effective, global |
| AI tutor | Gemini 2.0 Flash (primary) / GPT-4o Mini (fallback) | Cheapest per-request cost, adequate quality |
| i18n | svelte-i18n | Native Svelte integration, ICU format |
| Analytics | PostHog (self-hosted) or Plausible | Privacy-respecting, EU-compliant |
| Error tracking | Sentry | Industry standard, generous free tier |
| Monitoring | Cloudflare Analytics + Supabase Dashboard + custom | Full coverage at minimal cost |

**Estimated monthly cost at scale (10,000 students)**:

| Service | Cost |
|---|---|
| Supabase Pro | $25 |
| Cloudflare (Pages + Workers) | $5 |
| AI tutor (Gemini) | $28 (with caching) |
| Sentry | $0 (free tier) |
| PostHog / Plausible | $0 (self-hosted or free tier) |
| Domain name | ~$1 |
| **Total** | **~$59/month** |

Cost per student: approximately **$0.006/month** ($0.07/year), making this viable even for free distribution to French schools.
