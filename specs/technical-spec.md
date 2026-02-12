# Classe Master -- Technical Specification

> **Version:** 1.0
> **Date:** 2026-02-12
> **Status:** Implementation-ready
> **Product:** Children's math education PWA for French primary school (CP-CM2, ages 6-11)
> **Languages:** French (primary), English

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Data Model](#3-data-model)
4. [API Design](#4-api-design)
5. [PWA Strategy](#5-pwa-strategy)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Privacy & Compliance](#7-privacy--compliance)
8. [Security](#8-security)
9. [Internationalization](#9-internationalization)
10. [AI Tutor Integration](#10-ai-tutor-integration)
11. [Performance Targets](#11-performance-targets)
12. [Scalability Plan](#12-scalability-plan)
13. [Monitoring & Alerting](#13-monitoring--alerting)
14. [Development Environment](#14-development-environment)
15. [Admin Dashboard](#15-admin-dashboard)

---

## 1. Architecture Overview

### 1.1 High-Level System Diagram

```
                          +---------------------------+
                          |      Cloudflare Pages     |
                          |   (Static Assets / CDN)   |
                          |   200+ edge locations      |
                          +------------+--------------+
                                       |
                                       | HTTPS
                                       v
+-------------------+         +-----------------+         +-------------------+
|                   |         |                 |         |                   |
|  Browser / PWA    +-------->+  Cloudflare     +-------->+  Supabase Cloud   |
|  (SvelteKit App)  |         |  Workers (edge  |         |                   |
|                   |<--------+  cache layer)   |<--------+  - PostgreSQL DB  |
|  - Svelte stores  |         |                 |         |  - Auth           |
|  - IndexedDB      |         |  - Leaderboard  |         |  - Edge Functions |
|  - Service Worker |         |    cache        |         |  - Realtime       |
|  - Workbox        |         |  - Question     |         |  - Storage        |
|                   |         |    bank cache   |         |                   |
+-------------------+         +-----------------+         +--------+----------+
                                                                   |
                                                                   v
                                                          +-----------------+
                                                          |  External APIs  |
                                                          |                 |
                                                          |  - Gemini 2.0   |
                                                          |    Flash (AI)   |
                                                          |  - GPT-4o Mini  |
                                                          |    (fallback)   |
                                                          +-----------------+

+-------------------+
|  Analytics        |
|  (self-hosted)    |
|                   |
|  - PostHog or     |
|    Plausible      |
|  - Sentry         |
+-------------------+
```

### 1.2 Component Breakdown

| Component | Responsibility | Technology |
|---|---|---|
| **Client App** | Game UI, offline play, local state, service worker | SvelteKit + Vite PWA |
| **CDN / Static Hosting** | Serve app shell, assets, global edge caching | Cloudflare Pages |
| **Edge Cache** | Cache leaderboards, question banks at the edge | Cloudflare Workers |
| **API / Business Logic** | Score validation, AI proxy, session management | Supabase Edge Functions (Deno) |
| **Database** | Persistent storage, RLS, materialized views | PostgreSQL via Supabase |
| **Auth** | Student (code+PIN), teacher (email), parent (email) | Supabase Auth |
| **Realtime** | Class leaderboard live updates | Supabase Realtime (LISTEN/NOTIFY) |
| **AI Tutor** | Child-safe math explanations | Gemini 2.0 Flash + GPT-4o Mini fallback |
| **Analytics** | Product analytics, privacy-respecting | PostHog (self-hosted) or Plausible |
| **Error Tracking** | Client/server error capture | Sentry |

### 1.3 Data Flow: Game Session Lifecycle

```
1. PLAY (offline-capable)
   Client generates questions from cached templates
   -> Answers stored in Svelte GameStore
   -> Written immediately to IndexedDB

2. SESSION END
   Client computes session summary + fingerprint hash
   -> Queued in IndexedDB sync queue

3. SYNC (when online)
   Client POSTs batched session data to Edge Function
   -> Edge Function validates: score, timing, fingerprint
   -> Writes to PostgreSQL (game_sessions + answer_logs)
   -> Updates player XP/gems/progress
   -> Triggers materialized view refresh (async)

4. LEADERBOARD UPDATE
   Materialized view refreshed (class: 60s, school: 5min, global: 60min)
   -> Supabase Realtime pushes class updates to subscribed clients
   -> Cloudflare Workers cache school/global boards at the edge
```

---

## 2. Technology Stack

### 2.1 Final Decisions

| Layer | Technology | Version Target |
|---|---|---|
| Frontend framework | SvelteKit | 2.x (latest stable) |
| Build tool | Vite | 6.x |
| PWA plugin | @vite-pwa/sveltekit (Workbox) | Latest |
| Styling | Tailwind CSS | 4.x |
| State management | Svelte stores + IndexedDB (idb-keyval) | Built-in |
| i18n | svelte-i18n | Latest |
| Backend / API | Supabase (Edge Functions, Deno runtime) | Latest cloud |
| Database | PostgreSQL | 15+ (via Supabase) |
| Auth | Supabase Auth | Included |
| Realtime | Supabase Realtime | Included |
| Frontend hosting | Cloudflare Pages | Free plan |
| Edge caching | Cloudflare Workers | Free plan (100k req/day) |
| AI tutor (primary) | Google Gemini 2.0 Flash | API |
| AI tutor (fallback) | OpenAI GPT-4o Mini | API |
| Analytics | PostHog (self-hosted) or Plausible | Self-hosted / EU cloud |
| Error tracking | Sentry | Free tier |
| Uptime monitoring | Better Uptime or equivalent | Free tier |

### 2.2 Justification Summary

**SvelteKit over React/Vue:** Bundle size is the decisive factor. Svelte compiles to vanilla JS with no runtime virtual DOM. Core bundle is approximately 3 KB vs. 45 KB (React) or 34 KB (Vue). On target device (Samsung Galaxy A03, 2 GB RAM, Mediatek MT6739), this yields approximately 40% faster load times. SvelteKit provides file-based routing, SSR for public pages, and first-class Vite integration.

**Supabase over Firebase/custom backend:** PostgreSQL fits the relational hierarchy (school > class > student > session > answer). Row Level Security enforces data isolation at the database level. Built-in auth, realtime, and edge functions eliminate separate service management. Open-source, so no vendor lock-in. Predictable pricing ($25/mo Pro) vs. Firebase's usage-based spikes.

**Cloudflare Pages over Vercel/Netlify:** Unlimited bandwidth on the free tier. TTFB approximately 50 ms globally from 200+ edge locations. Cloudflare Workers provide edge caching with 100k free requests/day.

**Gemini 2.0 Flash over alternatives:** Lowest cost at $0.10/$0.40 per 1M input/output tokens. Approximately 300 ms latency. Adequate quality for primary school math explanations. Google safety filters provide baseline child safety. GPT-4o Mini as fallback for downtime or safety filter failures.

**PostHog/Plausible over Google Analytics:** Self-hostable (data stays in the EU). No cookies required. No personal data sent to third parties. Compliant with GDPR/CNIL requirements for children's data.

---

## 3. Data Model

### 3.1 Entity Relationship Diagram

```
schools 1---* classes 1---* players
                |               |
                |               +---* game_sessions 1---* answer_logs
                |               +---1 progress
                |               +---* inventory
                |               +---* achievements
                |               +---* ai_help_logs
                |
                +---* leaderboard_class_daily (materialized view)
```

### 3.2 Schema Definitions

#### schools

```sql
CREATE TABLE schools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    code            VARCHAR(10) UNIQUE NOT NULL,
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- settings JSONB shape:
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
    name            TEXT NOT NULL,
    join_code       VARCHAR(8) UNIQUE NOT NULL,
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

-- settings JSONB shape:
-- {
--   "max_students": 35,
--   "ai_tutor_enabled": true,
--   "daily_xp_cap": 500,
--   "allowed_game_modes": ["practice", "challenge", "speed"],
--   "show_leaderboard": true
-- }
```

#### players

```sql
CREATE TABLE players (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id        UUID REFERENCES classes(id) ON DELETE SET NULL,
    username        VARCHAR(30) NOT NULL,
    avatar_id       VARCHAR(50) DEFAULT 'default_1',
    pin_hash        VARCHAR(255),
    locale          VARCHAR(5) DEFAULT 'fr',

    -- Progression
    level           SMALLINT DEFAULT 1,
    sublevel        SMALLINT DEFAULT 1,
    xp              INTEGER DEFAULT 0,
    gems            INTEGER DEFAULT 0,

    -- Settings
    settings        JSONB DEFAULT '{}',
    sound_enabled   BOOLEAN DEFAULT true,

    -- Metadata
    last_played_at  TIMESTAMPTZ,
    total_play_time INTEGER DEFAULT 0,            -- seconds
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now(),

    UNIQUE(class_id, username)
);

CREATE INDEX idx_players_class ON players(class_id);
CREATE INDEX idx_players_xp ON players(xp DESC);
```

#### game_sessions

```sql
CREATE TABLE game_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id           UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    class_id            UUID REFERENCES classes(id),

    -- Game context
    game_mode           VARCHAR(20) NOT NULL,
    level               SMALLINT NOT NULL,
    sublevel            SMALLINT NOT NULL,
    topic               VARCHAR(50) NOT NULL,

    -- Timing
    started_at          TIMESTAMPTZ DEFAULT now(),
    ended_at            TIMESTAMPTZ,
    duration_seconds    INTEGER,

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
    is_validated        BOOLEAN DEFAULT false,
    client_fingerprint  VARCHAR(64),

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
    question_type   VARCHAR(30) NOT NULL,
    question_data   JSONB NOT NULL,

    -- Answer details
    player_answer   TEXT,
    correct_answer  TEXT NOT NULL,
    is_correct      BOOLEAN NOT NULL,
    time_taken_ms   INTEGER,

    -- Learning analytics
    difficulty      REAL,
    hint_used       BOOLEAN DEFAULT false,
    ai_help_used    BOOLEAN DEFAULT false,

    answered_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_answers_session ON answer_logs(session_id);
CREATE INDEX idx_answers_player ON answer_logs(player_id, answered_at DESC);
CREATE INDEX idx_answers_type ON answer_logs(question_type, is_correct);
```

**Partitioning strategy** (activate at Growth phase, 100K+ students):

```sql
-- Convert answer_logs to partitioned table by month
CREATE TABLE answer_logs (
    -- columns as above
) PARTITION BY RANGE (answered_at);

CREATE TABLE answer_logs_2026_01 PARTITION OF answer_logs
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE answer_logs_2026_02 PARTITION OF answer_logs
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- Auto-create future partitions via pg_partman or scheduled function
```

#### progress

```sql
CREATE TABLE progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id           UUID UNIQUE NOT NULL REFERENCES players(id) ON DELETE CASCADE,

    -- Current position
    current_level       SMALLINT DEFAULT 1,
    current_sublevel    SMALLINT DEFAULT 1,
    current_micro_level SMALLINT DEFAULT 1,

    -- Topic mastery (0.0 to 1.0 per topic)
    topic_mastery       JSONB DEFAULT '{}',

    -- Adaptive difficulty
    current_difficulty  REAL DEFAULT 0.5,
    consecutive_correct INTEGER DEFAULT 0,
    consecutive_wrong   INTEGER DEFAULT 0,

    -- Aggregate stats
    total_sessions      INTEGER DEFAULT 0,
    total_questions     INTEGER DEFAULT 0,
    total_correct       INTEGER DEFAULT 0,
    total_play_time     INTEGER DEFAULT 0,
    longest_streak      INTEGER DEFAULT 0,

    updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_progress_mastery ON progress USING GIN (topic_mastery);
```

#### inventory

```sql
CREATE TABLE inventory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    item_type       VARCHAR(30) NOT NULL,
    item_id         VARCHAR(50) NOT NULL,
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
    achievement_id  VARCHAR(50) NOT NULL,
    unlocked_at     TIMESTAMPTZ DEFAULT now(),
    metadata        JSONB DEFAULT '{}',

    UNIQUE(player_id, achievement_id)
);

CREATE INDEX idx_achievements_player ON achievements(player_id);
```

#### ai_help_logs

```sql
CREATE TABLE ai_help_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    session_id      UUID REFERENCES game_sessions(id),
    question_data   JSONB NOT NULL,
    prompt_sent     TEXT NOT NULL,
    response_text   TEXT NOT NULL,
    model_used      VARCHAR(50),
    tokens_used     INTEGER,
    latency_ms      INTEGER,
    was_cached      BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_help_player ON ai_help_logs(player_id, created_at DESC);
```

### 3.3 Materialized Views

#### Class Daily Leaderboard

```sql
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
```

**Refresh schedules:**

| View | Refresh Interval | Method |
|---|---|---|
| `leaderboard_class_daily` | 60 seconds | pg_cron or Supabase scheduled function |
| `leaderboard_class_weekly` | 5 minutes | pg_cron |
| `leaderboard_school_weekly` | 15 minutes | pg_cron |
| `leaderboard_global_weekly` | 60 minutes | pg_cron |

### 3.4 Row Level Security Policies

```sql
-- Enable RLS on all player-facing tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_help_logs ENABLE ROW LEVEL SECURITY;

-- Players: self-access only
CREATE POLICY player_self_access ON players
    FOR ALL USING (id = auth.uid());

-- Teachers: read students in their classes
CREATE POLICY teacher_read_students ON players
    FOR SELECT USING (
        class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

-- Game sessions: self-access only
CREATE POLICY session_self_access ON game_sessions
    FOR ALL USING (player_id = auth.uid());

-- Teachers: read sessions in their classes
CREATE POLICY teacher_read_sessions ON game_sessions
    FOR SELECT USING (
        class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

-- Answer logs: self-access only
CREATE POLICY answer_self_access ON answer_logs
    FOR ALL USING (player_id = auth.uid());

-- Progress: self-access only
CREATE POLICY progress_self_access ON progress
    FOR ALL USING (player_id = auth.uid());

-- Teachers: read progress in their classes
CREATE POLICY teacher_read_progress ON progress
    FOR SELECT USING (
        player_id IN (
            SELECT id FROM players WHERE class_id IN (
                SELECT id FROM classes WHERE teacher_id = auth.uid()
            )
        )
    );

-- Inventory: self-access only
CREATE POLICY inventory_self_access ON inventory
    FOR ALL USING (player_id = auth.uid());

-- Achievements: self-access only
CREATE POLICY achievement_self_access ON achievements
    FOR ALL USING (player_id = auth.uid());

-- AI help logs: self-access only
CREATE POLICY ai_help_self_access ON ai_help_logs
    FOR ALL USING (player_id = auth.uid());

-- Leaderboard: students can read their own class
CREATE POLICY leaderboard_class_read ON leaderboard_class_daily
    FOR SELECT USING (
        class_id IN (
            SELECT class_id FROM players WHERE id = auth.uid()
        )
    );
```

---

## 4. API Design

### 4.1 API Architecture

All API endpoints are implemented as **Supabase Edge Functions** (Deno runtime) except where Supabase client SDK provides direct access. Public read endpoints for leaderboards and question banks are cached at the **Cloudflare Workers** edge.

**Base URL:** `https://<project>.supabase.co/functions/v1/`

**Authentication:** All endpoints require a valid JWT in the `Authorization: Bearer <token>` header, except for the class lookup and student join endpoints.

### 4.2 Auth Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/auth/class-lookup` | Look up class by join code | None |
| POST | `/auth/student-join` | Create or rejoin student account | None |
| POST | `/auth/student-pin` | Authenticate returning student with PIN | None |
| POST | `/auth/teacher-signup` | Register teacher account | None |
| POST | `/auth/teacher-login` | Teacher email + password login | None |
| POST | `/auth/magic-link` | Send magic link to teacher/parent email | None |
| POST | `/auth/refresh` | Refresh JWT token | Refresh token |
| POST | `/auth/logout` | Invalidate session | JWT |

**POST /auth/class-lookup**

```
Request:  { "join_code": "MATH42" }
Response: { "class_id": "uuid", "class_name": "CM1 - Mme Dupont", "school_name": "Ecole Voltaire", "grade_level": 4 }
Error:    { "error": "CLASS_NOT_FOUND" }
```

**POST /auth/student-join**

```
Request:  { "class_id": "uuid", "username": "CoolNinja", "pin": "1234" (optional), "locale": "fr" }
Response: { "player_id": "uuid", "access_token": "jwt", "refresh_token": "rt" }
Errors:   "USERNAME_TAKEN", "USERNAME_INAPPROPRIATE", "CLASS_FULL"
```

### 4.3 Game Session Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/sessions/start` | Begin a new game session | Student JWT |
| POST | `/sessions/sync` | Submit completed session with answer batch | Student JWT |
| GET | `/sessions/history` | Fetch player's session history | Student JWT |

**POST /sessions/sync**

This is the primary data ingestion endpoint. The client batches all answers and submits them with the session summary at session end (or periodically every 30 seconds).

```
Request:
{
  "session_id": "uuid",
  "game_mode": "practice",
  "level": 3,
  "sublevel": 2,
  "topic": "multiplication",
  "started_at": "2026-02-12T09:15:00Z",
  "ended_at": "2026-02-12T09:20:00Z",
  "duration_seconds": 300,
  "score": 450,
  "questions_total": 18,
  "questions_correct": 15,
  "xp_earned": 120,
  "gems_earned": 5,
  "streak_max": 8,
  "client_fingerprint": "sha256hash",
  "answers": [
    {
      "question_type": "multiple_choice",
      "question_data": { "operand1": 6, "operand2": 7, "operator": "*" },
      "player_answer": "42",
      "correct_answer": "42",
      "is_correct": true,
      "time_taken_ms": 3200,
      "difficulty": 0.5,
      "hint_used": false,
      "ai_help_used": false
    }
    // ... remaining answers
  ]
}

Response:
{
  "validated": true,
  "xp_awarded": 120,
  "gems_awarded": 5,
  "new_achievements": ["streak_10"],
  "player_totals": { "xp": 4520, "gems": 85, "level": 3, "sublevel": 3 }
}
```

**Server-side validation (Edge Function):**
1. `questions_correct <= questions_total`
2. Every answer's `time_taken_ms >= 500` (no instant answers)
3. `duration_seconds` is plausible for `questions_total`
4. Score matches expected calculation formula
5. Answers are mathematically correct for recorded questions
6. Client fingerprint matches hash of (questions + answers + timings)

### 4.4 Progress Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/progress` | Fetch player's full progress state | Student JWT |
| GET | `/progress/mastery` | Fetch topic mastery breakdown | Student JWT |
| POST | `/progress/advance` | Request micro/sub/main level advancement | Student JWT |

### 4.5 Leaderboard Endpoints

| Method | Path | Description | Auth | Caching |
|---|---|---|---|---|
| GET | `/leaderboards/class/:classId/daily` | Class daily leaderboard | Student JWT | Supabase Realtime (1s) |
| GET | `/leaderboards/class/:classId/weekly` | Class weekly leaderboard | Student JWT | 5 min edge cache |
| GET | `/leaderboards/school/:schoolId/weekly` | School weekly leaderboard | Student JWT | 15 min edge cache |
| GET | `/leaderboards/global/weekly` | Global weekly leaderboard | Student JWT | 60 min edge cache |

**Leaderboard response shape:**

```
{
  "leaderboard": [
    { "rank": 1, "username": "StarMath", "avatar_id": "astro_1", "total_xp": 1250, "avg_accuracy": 0.92 },
    { "rank": 2, "username": "NinjaSolver", "avatar_id": "ninja_2", "total_xp": 1180, "avg_accuracy": 0.88 }
  ],
  "player_rank": 5,
  "player_window": [ /* 2 above, self, 2 below */ ],
  "updated_at": "2026-02-12T09:30:00Z"
}
```

The `player_window` field implements the windowed leaderboard design. Students only see the 2 players directly above and 2 below them, never the full ranking or the bottom.

### 4.6 AI Tutor Endpoint

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/ai/help` | Request AI-generated hint for a question | Student JWT |

**POST /ai/help**

```
Request:
{
  "session_id": "uuid",
  "question_data": { "operand1": 47, "operand2": 19, "operator": "-" },
  "player_answer": "32",
  "correct_answer": "28",
  "grade_level": 3,
  "locale": "fr"
}

Response:
{
  "explanation": "Tu y es presque ! ...",
  "model_used": "gemini-2.0-flash",
  "was_cached": false
}
```

### 4.7 Teacher Dashboard Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/teacher/classes` | List teacher's classes | Teacher JWT |
| POST | `/teacher/classes` | Create a new class | Teacher JWT |
| GET | `/teacher/classes/:id/overview` | Class aggregated stats | Teacher JWT |
| GET | `/teacher/classes/:id/students` | Student list with summary stats | Teacher JWT |
| GET | `/teacher/students/:id/progress` | Individual student progress detail | Teacher JWT |
| PUT | `/teacher/classes/:id/settings` | Update class settings | Teacher JWT |
| DELETE | `/teacher/students/:id` | Remove student from class | Teacher JWT |
| GET | `/teacher/classes/:id/report` | Weekly progress report (PDF export) | Teacher JWT |

---

## 5. PWA Strategy

### 5.1 Service Worker Configuration

**Plugin:** `@vite-pwa/sveltekit` with Workbox.

**Registration strategy:** `autoUpdate` -- the service worker updates silently in the background. Children should never see update prompts.

### 5.2 Caching Strategy by Resource Type

| Resource | Strategy | Max Age | Rationale |
|---|---|---|---|
| App shell (HTML, CSS, JS) | Precache (install-time) | Until new deploy | Instant load + offline access |
| Game assets (images, SVG, sounds) | Cache-first | 30 days | Large assets, rarely change |
| Question bank templates (JSON) | Stale-while-revalidate | 7 days | Serve cached, update in background |
| API responses (progress, scores) | Network-first | 1 hour fallback | Prefer fresh, fallback to cache offline |
| AI tutor responses | Cache-first (by hash) | 30 days | Identical explanations reusable |
| Leaderboard data | Network-only | N/A | Always fresh; not critical offline |
| User avatar images | Cache-first | 90 days | Rarely change |
| Fonts | Cache-first | 1 year | Never change |
| Localization files | Cache-first | 30 days | Rarely change |

### 5.3 Precached Assets (Install-Time)

```
Precached at install:
  - App shell (all routes)
  - Core game engine code
  - Default question bank (500 questions per level)
  - All UI assets (images, sounds, SVG sprites)
  - Localization files (fr.json, en.json)

Cached on first access:
  - Extended question banks per level
  - User's avatar and inventory images
```

### 5.4 Offline Sync Queue

```
Stored in IndexedDB when offline:
  - Completed game sessions
  - Answer logs
  - Progress updates
  - XP and gem changes

Sync mechanism:
  - Primary: Background Sync API (when available)
  - Fallback: Sync on next app open
  - Conflict resolution: server wins for leaderboards, merge for progress
```

### 5.5 Storage Budget

| Asset Category | Size (gzipped) |
|---|---|
| App shell + JS | ~500 KB |
| Game images/SVG | ~5 MB |
| Sound effects | ~3 MB |
| Question bank templates | ~2 MB |
| Fonts | ~500 KB |
| Localization files | ~50 KB |
| Cached API responses | ~1 MB |
| **Total typical** | **~12 MB** |
| **Maximum** | **50 MB** |

### 5.6 Install Prompt Strategy

1. Intercept `beforeinstallprompt` and suppress the browser's default mini-infobar.
2. Show a custom, child-friendly install banner **after the child completes their first game session** (moment of engagement).
3. Banner text: "Ajoute Classe Master sur ton ecran d'accueil pour jouer a tout moment !" with a large colorful button and a "Plus tard" (Maybe later) option.
4. **iOS Safari:** Detect iOS and show an educational overlay explaining "Partager > Ajouter a l'ecran d'accueil" with step illustrations.
5. **Teacher dashboard:** Provide a QR code linking to install instructions for classroom projection.

### 5.7 Web App Manifest

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
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 5.8 Push Notifications

**Not implemented for children.** Rationale: UK Age Appropriate Design Code prohibits nudge techniques for children. CNIL recommends against engagement-driving features for minors.

**Exception:** Teachers may opt in to weekly email digests (class progress summaries). No push notifications.

---

## 6. Authentication & Authorization

### 6.1 Auth Flows by Role

| Role | Auth Method | Session Duration | Personal Data |
|---|---|---|---|
| Student (6-11) | Class code + username + optional 4-digit PIN | 7 days (refresh: 30 days) | None (no email, no real name) |
| Teacher | Email + password or magic link | 24 hours (with refresh) | Email only |
| Parent | Email + password or magic link | 24 hours (with refresh) | Email only |
| Admin (school) | Email + password + optional TOTP 2FA | 24 hours (with refresh) | Email only |

### 6.2 Student Auth Flow (Zero Personal Data)

```
1. Teacher creates class -> receives 6-character join code (e.g., MATH42)
2. Student enters join code on join screen
3. Student picks username (from allowed list OR custom with profanity filter) + avatar
4. Optionally sets 4-digit PIN for returning sessions
5. Device receives JWT stored in localStorage
6. On return: auto-recognized by stored token
7. New device: re-enter class code + username + PIN
```

**Token storage:** JWT in `localStorage` for PWA compatibility. `httpOnly` cookies are not viable for PWA offline scenarios where service workers need token access.

**PIN security:** PINs are bcrypt-hashed server-side. PINs are optional -- if not set, the student is device-bound only.

### 6.3 Authorization Matrix

| Resource | Student (self) | Student (other) | Teacher (own class) | Teacher (other class) | Parent | Admin |
|---|---|---|---|---|---|---|
| Player profile | Read/Write | None | Read | None | Read (own child) | Read |
| Game sessions | Read/Write | None | Read | None | Read (own child) | Read |
| Answer logs | Read/Write | None | None* | None | None | None |
| Progress | Read/Write | None | Read | None | Read (own child) | Read |
| Inventory | Read/Write | None | None | None | None | None |
| Achievements | Read | None | Read | None | Read (own child) | Read |
| Class leaderboard | Read (own class) | None | Read | None | None | Read |
| Class settings | None | None | Read/Write | None | None | Read/Write |

*Teachers see aggregated analytics, not individual answer-by-answer logs, to respect student dignity.

---

## 7. Privacy & Compliance

### 7.1 Regulatory Requirements

| Regulation | Jurisdiction | Key Requirements for This Product |
|---|---|---|
| **GDPR Art. 8** (France) | EU/France | Digital consent age is 15 in France. Parental consent required for personal data of under-15s. Our mitigation: collect zero personal data from children. |
| **CNIL 8 Recommendations** | France | High-privacy defaults, minimal data, parental controls, children's rights by design, no profiling. |
| **UK Children's Code** | UK | High privacy by default, data minimization, no nudge techniques, no detrimental use, best interests. |
| **COPPA** | US (future) | Under-13 protection. School exception for educational tools. Verifiable parental consent. |

### 7.2 Data Minimization: What We Collect from Children

| Data Point | Collected? | Justification |
|---|---|---|
| Real name | NO | Username/alias only |
| Email | NO | Not needed for child accounts |
| Date of birth | NO | Grade level inferred from class |
| Location / GPS | NO | Not needed |
| Device ID / fingerprint | NO | Session token only |
| IP address | Logs only, auto-purged 24h | Security/rate limiting only |
| Game performance data | YES | Core educational function |
| Time spent playing | YES | Teacher analytics, break reminders |
| Language preference | YES | Core feature |
| Avatar choice | YES | Personalization feature |

**Never collected from children:** Real names, photos, email, phone, address, geolocation, biometrics, contacts, browsing history, device identifiers.

### 7.3 Implementation Measures

**No free-text communication:** Children cannot message each other. No chat, no comments, no custom text visible to others. Usernames are either from a predefined list or filtered against a profanity blocklist (French + English).

**No user-generated content visible to others:** Avatars are predefined options, not uploads.

**No external links:** The app never links outside the application.

**No advertising:** Ad-free. No tracking pixels. No third-party analytics tracking children.

**No push notifications to children:** See Section 5.8.

**Session time awareness:** After 45 minutes of continuous play, show a gentle suggestion to take a break (not a hard restriction).

**Daily time limits:** Configurable by teachers/parents in class settings.

### 7.4 Data Retention Policies

| Data Type | Retention Period | Deletion Method |
|---|---|---|
| Game sessions | Current school year + 1 year | Automatic purge |
| Answer logs (raw) | 6 months | Aggregate then delete raw |
| Progress data | While student is active | Delete on account removal |
| AI help logs | 3 months | Automatic purge |
| Server access logs (IP) | 24 hours | Automatic purge |
| Leaderboard cache | Rolling (daily/weekly) | Auto-refresh replaces old data |

**Account deletion flow:**
1. Immediate: username, avatar, inventory deleted.
2. Within 30 days: all game sessions and answer logs anonymized (`player_id` replaced with random token, original mapping destroyed).
3. Aggregated class-level analytics (non-identifiable) retained indefinitely for educational research (with school consent).

### 7.5 Privacy Policy Requirements

- Written in child-friendly language (separate from legal version).
- Available in both French and English.
- Accessible from the app's settings page.
- Clearly states: what data is collected, why, how long it is kept, and how to request deletion.
- Contact point for data deletion requests.

---

## 8. Security

### 8.1 Anti-Cheating Measures

The focus is **data integrity** for educational analytics, not competitive anti-cheat:

| Measure | Implementation |
|---|---|
| Server-side score validation | Edge Function validates all session data on sync (see Section 4.3) |
| Session fingerprint | SHA-256 hash of (questions + answers + timings) computed client-side, verified server-side |
| Rate limiting per session | Max 1 session start per 10s, max 120 answers per minute |
| Leaderboard integrity | Only `is_validated = true` sessions appear on leaderboards |
| Anomaly flagging (future) | Flag sudden performance jumps for teacher review, not auto-punishment |

### 8.2 Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| Login / join class | 5 requests | 1 minute |
| Start game session | 6 requests | 1 minute |
| Submit answer (in sync) | 120 records | 1 minute |
| Sync session | 10 requests | 1 minute |
| AI tutor help | 10 requests | 5 minutes |
| Leaderboard fetch | 30 requests | 1 minute |
| Teacher API endpoints | 60 requests | 1 minute |

**Implementation:** Supabase Edge Functions with Upstash Redis for distributed rate limiting, or Cloudflare's built-in rate limiting on the CDN edge.

### 8.3 Input Validation

| Input | Validation Rules |
|---|---|
| Username | 3-30 chars, alphanumeric + limited special chars, profanity blocklist (FR + EN) |
| PIN | Exactly 4 digits |
| Class join code | 4-8 uppercase alphanumeric |
| Numeric answers | Validated as number, range-checked per question type |
| Text answers | Sanitized, max 100 chars |
| All inputs | Server-side re-validation regardless of client-side checks |

**SQL injection:** Supabase uses parameterized queries by default. All Edge Function DB calls use the Supabase client library, never raw SQL concatenation.

**XSS:** SvelteKit escapes all template expressions by default. The `{@html}` directive is never used with user-provided content.

**CSRF:** SvelteKit's built-in CSRF protection for forms. API calls use JWT bearer tokens.

### 8.4 Content Security Policy

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

### 8.5 Transport Security

- HTTPS enforced at Cloudflare (frontend) and Supabase (backend).
- HSTS: `max-age=31536000; includeSubDomains; preload`.
- TLS 1.2 minimum, TLS 1.3 preferred.
- Certificate transparency monitoring via Cloudflare.

---

## 9. Internationalization

### 9.1 Library and Approach

**Library:** `svelte-i18n`

**Locale resolution order:**
1. Player's saved preference (in `players.locale`)
2. Browser's `navigator.language`
3. Default: `fr`

**Supported locales:** `fr` (French, primary), `en` (English)

### 9.2 Translation File Structure

```
src/lib/i18n/
  fr.json              -- French UI translations (primary)
  en.json              -- English UI translations
  fr-math.json         -- French math terminology
  en-math.json         -- English math terminology
  fr-questions.json    -- French word problem templates
  en-questions.json    -- English word problem templates
```

Only the active locale is loaded in the initial bundle. The other locale is lazy-loaded on demand (~10-20 KB).

### 9.3 Number Formatting

| Format | French (`fr-FR`) | English (`en-GB`) |
|---|---|---|
| Decimal separator | Virgule: `3,14` | Period: `3.14` |
| Thousands separator | Espace insecable: `1 000` | Comma: `1,000` |
| Percentage | `75 %` (space before %) | `75%` |
| Ordinal | `1er`, `2e`, `3e` | `1st`, `2nd`, `3rd` |

**Implementation:** `Intl.NumberFormat` via `svelte-i18n`'s `$format.number()`.

**Critical for math input:** The numeric keypad must accept both `,` and `.` as decimal separators and normalize internally. Display format matches the child's locale.

### 9.4 Word Problem Localization

Word problems require full localization, not just translation:
- **Names:** Culturally appropriate names per locale (French: Leo, Emma, Jade; English: Oliver, Sophia, Noah).
- **Currency:** EUR for French contexts, GBP/EUR for English contexts.
- **Units:** Metric system for both locales.
- **Cultural references:** "billes" (marbles), "bonbons" (sweets) in French; "marbles", "cookies" in English.

### 9.5 UI Text Rules

- All UI text is externalized to JSON locale files. Zero hardcoded strings in components.
- Language switch available in settings and on the initial join screen.
- ICU MessageFormat used for pluralization.

---

## 10. AI Tutor Integration

### 10.1 Model Selection

| Model | Role | Cost (per 1M tokens) | Latency | When Used |
|---|---|---|---|---|
| Gemini 2.0 Flash | Primary | $0.10 in / $0.40 out | ~300ms | Default for all AI help requests |
| GPT-4o Mini | Fallback | $0.15 in / $0.60 out | ~500ms | When Gemini is down or returns unsafe content |

### 10.2 Request Flow

```
1. Child clicks "Help me" button (no free-text input)
2. Client generates structured help request from question data + child's answer
3. POST /ai/help -> Edge Function
4. Edge Function checks:
   a. Rate limit (10 req / 5 min per student)
   b. Pre-written explanation cache (exact match on error pattern)
   c. AI response cache (hash of question_type + question_data + grade + locale + error_type)
   d. If no cache hit: call Gemini 2.0 Flash
   e. If Gemini fails or response fails safety filter: call GPT-4o Mini
   f. If both fail: return generic pre-written encouragement
5. Response passes output filter before returning to client
6. Log interaction to ai_help_logs (no PII)
```

### 10.3 System Prompt

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
- Encourage the child after each step.
- If the child is stuck, break the problem into smaller pieces.
- Maximum 3 steps in an explanation.

SAFETY:
- ONLY discuss math. If asked about anything else, redirect to math.
- Never mention violence, politics, religion, or any adult topics.
- Never ask the child personal questions (name, age, location, school).
- Never provide links or references to external content.
- Never use fear, shame, or negative reinforcement.

FORMAT:
- Use simple markdown: bold for key numbers, line breaks between steps.
- Include emoji sparingly (maximum 2 per response).
- Keep total response under 150 words.
```

### 10.4 Safety Guardrails

| Layer | Check | Action on Failure |
|---|---|---|
| Input | Child never writes free text; request is structured from question data | N/A -- structurally safe |
| Output: length | Response > 300 words | Reject, fall back to pre-written |
| Output: blocklist | Disallowed keywords detected | Reject, fall back to pre-written |
| Output: relevance | Response does not contain math-related content | Reject, fall back to pre-written |
| Conversation | No history; each call is stateless | Prevents prompt injection and off-topic |
| Kill switch | Feature flag per-class and global | Instantly falls back to pre-written explanations |
| Monitoring | Weekly sample review of logged AI responses | Catch problematic patterns |

### 10.5 Caching Strategy

**Cache key:** SHA-256 of `(question_type, question_data, grade_level, locale, error_type)`

| Cache Layer | Storage | TTL | Expected Hit Rate |
|---|---|---|---|
| In-memory (edge function) | Last 100 responses | 5 minutes | 10-15% |
| Persistent (Supabase/Redis) | All responses | 30 days | 30-45% |
| Pre-written explanations | Static JSON per error pattern | Permanent | 10-20% |
| **Combined** | | | **40-60%** |

### 10.6 Cost Projections

| Scale | Students | Requests/month | Gross Cost | After Cache (50%) | Per Student/Month |
|---|---|---|---|---|---|
| Pilot | 500 | 20,000 | $2.80 | $1.40 | $0.003 |
| Launch | 10,000 | 400,000 | $56.00 | $28.00 | $0.003 |
| Growth | 100,000 | 4,000,000 | $560.00 | $280.00 | $0.003 |
| Scale | 500,000 | 20,000,000 | $2,800.00 | $1,400.00 | $0.003 |

Assumptions: 2 help requests per student per school day, 20 school days/month, ~200 input tokens + ~300 output tokens per request.

---

## 11. Performance Targets

### 11.1 Core Web Vitals and App Metrics

| Metric | Target | Condition |
|---|---|---|
| First Contentful Paint (FCP) | < 1.5s | 3G connection |
| Largest Contentful Paint (LCP) | < 2.5s | 3G connection |
| Time to Interactive (TTI) | < 3.0s | 3G connection |
| Total Blocking Time (TBT) | < 200ms | 3G connection |
| Cumulative Layout Shift (CLS) | < 0.1 | All conditions |
| JS bundle size (initial route) | < 100 KB | Gzipped |
| Lighthouse PWA score | 100 | All audits pass |
| Offline load time | < 500ms | From service worker cache |
| Animation frame rate | 60 fps | During gameplay |
| Memory usage | < 100 MB | During gameplay |
| API response time (P50) | < 200ms | Server-side |
| API response time (P95) | < 500ms | Server-side |

### 11.2 Target Reference Device

**Samsung Galaxy A03** (or equivalent budget phone):
- SoC: Mediatek MT6739
- RAM: 2 GB
- OS: Android 12
- Screen: 6.5" HD+

This represents a budget phone common in French households. If the app performs well on this device, it will perform well everywhere.

### 11.3 Bundle Size Budget

| Route | Max JS (gzipped) | Rationale |
|---|---|---|
| `/play` (game screen) | 80 KB | Most critical, must load fast |
| `/` (landing/join) | 40 KB | Simple entry point |
| `/progress` | 50 KB | Charts library loaded lazily |
| `/shop` | 50 KB | Cosmetic asset thumbnails lazy-loaded |
| `/teacher/dashboard` | 100 KB | Desktop-only, chart-heavy |
| Shared Svelte runtime | ~3 KB | Compiled to vanilla JS |
| Total unique JS | < 150 KB | Across all routes |

---

## 12. Scalability Plan

### 12.1 Capacity Tiers

| Phase | Timeline | Students | Concurrent Users | Schools | Data Growth/Month |
|---|---|---|---|---|---|
| Pilot | Months 1-3 | 500 | 50 | 5 | 100 MB |
| Launch | Months 4-12 | 10,000 | 1,000 | 100 | 2 GB |
| Growth | Year 2 | 100,000 | 10,000 | 1,000 | 20 GB |
| Scale | Year 3 | 500,000 | 50,000 | 5,000 | 100 GB |

**Peak usage:** French school hours 8:30-16:30, peak at 9:00-11:00 and 14:00-15:30. Evenings and weekends see lighter homework usage.

### 12.2 Cost Projections

| Service | Pilot ($0-500 students) | Launch (10K) | Growth (100K) | Scale (500K) |
|---|---|---|---|---|
| Supabase | Free tier | $25/mo (Pro) | $25 + compute add-on ~$100 | $25 + dedicated ~$400 |
| Cloudflare Pages | $0 | $0 | $0 | $0 |
| Cloudflare Workers | $0 | $5/mo | $5/mo | $5/mo |
| AI tutor (Gemini) | $1 | $28 | $280 | $1,400 |
| Sentry | $0 | $0 | $26/mo | $80/mo |
| PostHog/Plausible | $0 | $0 | $0 (self-hosted) | $0 (self-hosted) |
| Domain | $1 | $1 | $1 | $1 |
| **Monthly Total** | **~$2** | **~$59** | **~$412** | **~$1,886** |
| **Per Student/Month** | **$0.004** | **$0.006** | **$0.004** | **$0.004** |

### 12.3 Scaling Actions by Phase

**Pilot (500 students):**
- Supabase free tier is sufficient (500 MB storage, 50K MAU).
- Cloudflare free tier handles all traffic.
- No partitioning, no read replicas.

**Launch (10K students):**
- Upgrade to Supabase Pro ($25/mo).
- Enable materialized view refresh via pg_cron.
- Implement Cloudflare Workers edge caching for leaderboards.
- Batch answer sync (client batches, single POST per session).

**Growth (100K students):**
- Partition `answer_logs` by month.
- Add Supabase compute add-on for connection pool capacity.
- Consider read replica for teacher dashboard queries.
- Implement request coalescing for leaderboard requests.

**Scale (500K students):**
- Dedicated Supabase compute.
- Multiple materialized views with staggered refresh.
- Consider self-hosted Supabase or managed PostgreSQL for full control.
- Separate read/write database topology.
- CDN-edge caching for all read-heavy endpoints.

---

## 13. Monitoring & Alerting

### 13.1 Monitoring Stack

| Tool | Purpose | Cost |
|---|---|---|
| Supabase Dashboard | Database metrics, auth metrics, function logs | Included |
| Cloudflare Analytics | CDN performance, traffic, errors, WAF | Included |
| Sentry | Client + server error tracking, performance traces | Free tier (5K events/mo) |
| PostHog / Plausible | Product analytics (DAU, retention, feature usage) | Self-hosted / free |
| pg_stat_statements | Database query performance analysis | Built into PostgreSQL |
| Better Uptime | Availability monitoring, status page | Free tier |
| Custom teacher dashboard | Learning analytics (class/student progress) | Built in-app |

### 13.2 Key Metrics and Dashboards

**Technical Health Dashboard:**

| Metric | Source | Alert Threshold |
|---|---|---|
| Page load time P50, P95 | Sentry Performance | P95 > 3s |
| API response time P50, P95 | Supabase Logs | P95 > 500ms |
| Error rate (4xx, 5xx) | Cloudflare / Sentry | > 1% of requests |
| Service worker cache hit rate | Custom event | < 80% |
| Offline sync failure rate | Custom event | > 5% |
| JS bundle size (CI check) | Build pipeline | > 150 KB gzipped |
| Lighthouse score (CI check) | Build pipeline | < 90 |
| Database connection pool usage | Supabase Dashboard | > 80% of pool |
| Database query P95 latency | pg_stat_statements | > 100ms |
| Edge Function execution time P95 | Supabase Logs | > 1s |

**Product Health Dashboard:**

| Metric | Purpose | Frequency |
|---|---|---|
| Daily Active Users (DAU) | Overall engagement | Daily |
| Sessions per user per day | Usage intensity | Daily |
| Average session duration | Engagement depth | Daily |
| Return rate (D1, D7, D30) | Retention | Daily |
| PWA install rate | Adoption | Weekly |
| AI help usage rate per topic | Difficulty calibration | Weekly |
| Session completion rate | Engagement | Daily |
| Feature usage (shop, achievements, leaderboard) | Feature value | Weekly |

### 13.3 Alert Configuration

**Critical (immediate notification -- PagerDuty/SMS):**
- API error rate > 5% for 5 consecutive minutes
- Database connection pool exhausted
- AI tutor returning unsafe content (detected by safety filter)
- Complete service downtime (uptime monitor)

**Warning (Slack/email within 15 minutes):**
- P95 API latency > 1 second for 10 minutes
- DAU drops > 30% vs. previous same-day-of-week
- Offline sync failure rate > 2%
- Storage usage > 80% of plan limit
- Service worker registration failure rate > 10%
- Sentry error budget > 50% consumed

### 13.4 Analytics Privacy Rules

All analytics for children follow these constraints:
- No fingerprinting or cross-site tracking.
- All analytics events contain only: `player_id` (pseudonymous UUID), `event_type`, `event_data` (no PII), `timestamp`.
- No individual tracking that could identify a child.
- PostHog/Plausible configured in cookie-free, session-based mode.

---

## 14. Development Environment

### 14.1 Local Setup

**Prerequisites:**
- Node.js 20+ (LTS)
- pnpm 9+ (package manager)
- Docker (for local Supabase)
- Supabase CLI (`npx supabase`)

**Local development stack:**

```bash
# Clone and install
git clone <repo>
cd classe-master
pnpm install

# Start local Supabase (PostgreSQL, Auth, Edge Functions, Realtime)
npx supabase start

# Apply migrations
npx supabase db push

# Seed development data
npx supabase db seed

# Start SvelteKit dev server
pnpm dev
```

**Environment variables (`.env.local`):**

```
PUBLIC_SUPABASE_URL=http://localhost:54321
PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>
GEMINI_API_KEY=<dev-key>
OPENAI_API_KEY=<dev-key>
```

### 14.2 Project Structure

```
classe-master/
  src/
    routes/                    -- SvelteKit file-based routes
      (app)/
        play/+page.svelte      -- Game screen
        progress/+page.svelte  -- Progress dashboard
        shop/+page.svelte      -- Cosmetics shop
        settings/+page.svelte  -- Player settings
      (auth)/
        join/+page.svelte      -- Student join flow
        login/+page.svelte     -- Teacher/parent login
      (teacher)/
        dashboard/+page.svelte -- Teacher dashboard
    lib/
      components/              -- Reusable Svelte components
      stores/                  -- Svelte stores (GameStore, PlayerStore, etc.)
      i18n/                    -- Locale JSON files
      game/                    -- Game engine (question generation, scoring, etc.)
      utils/                   -- Shared utilities
      db/                      -- Supabase client setup
    app.html                   -- HTML template
    app.css                    -- Global styles (Tailwind)
  supabase/
    migrations/                -- PostgreSQL migrations (sequential)
    functions/                 -- Supabase Edge Functions
      sessions-sync/
      ai-help/
      validate-session/
    seed.sql                   -- Development seed data
    config.toml                -- Supabase local config
  static/
    icons/                     -- PWA icons
    sounds/                    -- Sound effect files
    images/                    -- Game assets
  tests/
    unit/                      -- Vitest unit tests
    integration/               -- Playwright integration tests
    e2e/                       -- Playwright E2E tests
  specs/                       -- Specification documents
  svelte.config.js
  vite.config.ts
  tailwind.config.js
  playwright.config.ts
  vitest.config.ts
```

### 14.3 Testing Strategy

| Layer | Tool | Scope | Coverage Target |
|---|---|---|---|
| Unit tests | Vitest | Game engine (question generation, scoring, difficulty), stores, utils | 90%+ |
| Component tests | Vitest + @testing-library/svelte | UI components in isolation | 80%+ |
| Integration tests | Playwright | API endpoints, auth flows, session sync | Key flows |
| E2E tests | Playwright | Full user journeys (join class, play session, view progress) | Critical paths |
| Visual regression | Playwright screenshots | UI consistency across viewports | Key screens |
| Accessibility | axe-core via Playwright | WCAG 2.1 AA compliance | All pages |
| Performance | Lighthouse CI | Core Web Vitals, bundle size | Every PR |
| Database tests | pgTAP or Supabase test helpers | RLS policies, migrations | All policies |

**Key test scenarios:**

1. **Question generation:** All templates produce valid questions with valid distractors across all difficulty levels.
2. **Scoring:** Points calculation matches specification (asymmetric, streaks, difficulty multipliers, hint penalties).
3. **Progression:** Micro-level, sub-level, and main-level advancement logic matches thresholds.
4. **Offline play:** Full session completes without network; sync succeeds on reconnection.
5. **Auth flow:** Student join, return on same device, return on new device with PIN.
6. **RLS policies:** Students cannot access other students' data; teachers see only their classes.
7. **AI safety:** Output filter correctly rejects non-math, overly long, or blocklisted responses.
8. **i18n:** All UI strings render correctly in both locales; number formatting matches locale.

### 14.4 CI/CD Pipeline

**Platform:** GitHub Actions

**Pipeline stages:**

```
On Pull Request:
  1. Lint (ESLint + Prettier)
  2. Type check (svelte-check)
  3. Unit tests (Vitest)
  4. Component tests (Vitest)
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
  5. Notify Slack
```

**Branch strategy:**
- `main` -- production-ready, protected
- `staging` -- pre-production testing
- `feat/*` -- feature branches
- `fix/*` -- bugfix branches

**Database migrations:**
- Sequential migration files in `supabase/migrations/`.
- Every schema change is a new migration (never edit existing migrations).
- Migrations run automatically on deploy via Supabase CLI.
- Rollback migrations maintained for all schema changes.

### 14.5 Code Quality

| Tool | Purpose | Configuration |
|---|---|---|
| ESLint | JavaScript/Svelte linting | Svelte + Tailwind plugins |
| Prettier | Code formatting | Enforced via pre-commit hook |
| svelte-check | Svelte type checking | Strict mode |
| TypeScript | Type safety | Strict mode, all files |
| Husky + lint-staged | Pre-commit hooks | Lint + format on staged files |

---

## 15. Admin Dashboard

The admin dashboard is a web-based back-office for platform administrators. It is technically separate from the teacher dashboard (Section 4.7) and uses its own authentication, authorization, and audit infrastructure.

### 15.1 Admin Authentication

| Aspect | Detail |
|--------|--------|
| **Auth method** | Email + password + mandatory TOTP 2FA (time-based one-time password via authenticator app) |
| **Session duration** | 8 hours (no refresh token -- admins must re-authenticate daily) |
| **Password policy** | Minimum 12 characters, at least one uppercase, one lowercase, one digit, one special character. Checked against HaveIBeenPwned API on creation/change. |
| **Brute-force protection** | Account locked after 5 failed attempts (30-minute cooldown). Alert sent to Super Admin. |
| **IP allowlisting** | Optional: restrict admin access to specific IP ranges (configurable per admin role). |

### 15.2 Admin Roles (RBAC)

| Role | Permissions | Intended For |
|------|------------|--------------|
| **Super Admin** | Full access to all features. Can create/remove other admins. Can access audit logs. | Platform owner, CTO |
| **Content Manager** | Content & level management, economy & rewards management, season management. Read-only access to analytics. | Game designers, curriculum experts |
| **Moderator** | Player management (suspend/unsuspend, username review), moderation queues. Read-only access to player profiles. | Community/support team |
| **Analytics Viewer** | Read-only access to all analytics dashboards and monitoring. No write access to any entity. | Product managers, researchers |

**Role hierarchy:** Super Admin > Content Manager = Moderator > Analytics Viewer. Higher roles inherit all permissions of lower roles.

### 15.3 Audit Log

Every admin action is recorded in an immutable audit log:

| Field | Detail |
|-------|--------|
| **Who** | Admin user ID and email |
| **What** | Action type (create, update, delete, suspend, reset, toggle, etc.) |
| **Which entity** | Entity type (player, school, class, template, feature_flag, etc.) + entity ID |
| **Changes** | JSON diff of before/after state for update operations |
| **When** | Timestamp (UTC) |
| **Context** | IP address, user agent |

Audit logs are retained for a minimum of 2 years and cannot be deleted by any admin role (including Super Admin). They are append-only.

### 15.4 Admin API Endpoints

#### Player Management

| Method | Path | Description | Role |
|--------|------|-------------|------|
| GET | `/admin/players` | Search/filter players (paginated) | Moderator+ |
| GET | `/admin/players/:id` | Full player profile with stats, progression, inventory, history | Moderator+ |
| PUT | `/admin/players/:id/suspend` | Suspend a player (body: `{ reason }`) | Moderator+ |
| PUT | `/admin/players/:id/unsuspend` | Unsuspend a player | Moderator+ |
| POST | `/admin/players/:id/reset-progress` | Reset player progression (body: `{ reason, confirm: true }`) | Super Admin |
| POST | `/admin/players/bulk` | Bulk operations on players (body: `{ player_ids, action, params }`) | Super Admin |

#### School & Class Management

| Method | Path | Description | Role |
|--------|------|-------------|------|
| GET | `/admin/schools` | List all schools (paginated, filterable) | Content Manager+ |
| POST | `/admin/schools` | Create a school | Super Admin |
| PUT | `/admin/schools/:id` | Update school details | Super Admin |
| DELETE | `/admin/schools/:id` | Archive a school (soft delete) | Super Admin |
| GET | `/admin/schools/:id/classes` | List classes in a school | Content Manager+ |
| POST | `/admin/classes` | Create a class | Super Admin |
| PUT | `/admin/classes/:id` | Update class details | Super Admin |
| DELETE | `/admin/classes/:id` | Archive a class (soft delete) | Super Admin |
| POST | `/admin/classes/:id/regenerate-code` | Generate a new join code | Super Admin |
| PUT | `/admin/classes/:id/assign-teacher` | Assign teacher to class | Super Admin |

#### Content & Level Management

| Method | Path | Description | Role |
|--------|------|-------------|------|
| GET | `/admin/templates` | List question templates (paginated, filterable by level/topic/type) | Content Manager+ |
| POST | `/admin/templates` | Create a new question template | Content Manager+ |
| PUT | `/admin/templates/:id` | Update a template | Content Manager+ |
| PUT | `/admin/templates/:id/disable` | Disable a template (soft delete) | Content Manager+ |
| POST | `/admin/templates/preview` | Generate preview questions from a template | Content Manager+ |
| GET | `/admin/levels/params` | View all level/sublevel/microlevel parameters | Content Manager+ |
| PUT | `/admin/levels/params` | Update level parameters | Content Manager+ |
| POST | `/admin/ab-tests` | Create an A/B test experiment | Content Manager+ |
| GET | `/admin/ab-tests` | List A/B test experiments and results | Content Manager+ |

#### Economy & Rewards Management

| Method | Path | Description | Role |
|--------|------|-------------|------|
| GET | `/admin/economy/rates` | View current earning rates | Content Manager+ |
| PUT | `/admin/economy/rates` | Update earning rates | Content Manager+ |
| GET | `/admin/catalog/avatars` | List all cosmetic items | Content Manager+ |
| POST | `/admin/catalog/avatars` | Add a cosmetic item | Content Manager+ |
| PUT | `/admin/catalog/avatars/:id` | Update a cosmetic item | Content Manager+ |
| GET | `/admin/catalog/powerups` | List all power-ups | Content Manager+ |
| PUT | `/admin/catalog/powerups/:id` | Update power-up settings | Content Manager+ |
| POST | `/admin/seasons` | Create a season | Content Manager+ |
| PUT | `/admin/seasons/:id` | Update a season | Content Manager+ |
| GET | `/admin/economy/health` | Economy health metrics | Analytics Viewer+ |

#### Analytics & Monitoring

| Method | Path | Description | Role |
|--------|------|-------------|------|
| GET | `/admin/analytics/platform` | Platform-wide stats (DAU, MAU, retention) | Analytics Viewer+ |
| GET | `/admin/analytics/learning` | Learning outcomes by level/topic/school | Analytics Viewer+ |
| GET | `/admin/analytics/ai` | AI tutor usage, cost, and safety metrics | Analytics Viewer+ |
| GET | `/admin/analytics/content` | Content effectiveness metrics | Analytics Viewer+ |
| GET | `/admin/analytics/economy` | Economy health dashboard data | Analytics Viewer+ |
| GET | `/admin/monitoring/errors` | Error and incident feed | Analytics Viewer+ |

#### Moderation

| Method | Path | Description | Role |
|--------|------|-------------|------|
| GET | `/admin/moderation/usernames` | Username review queue | Moderator+ |
| PUT | `/admin/moderation/usernames/:id` | Resolve username review (approve/reject/suspend) | Moderator+ |
| GET | `/admin/moderation/reports` | Reported behavior queue | Moderator+ |
| PUT | `/admin/moderation/reports/:id` | Resolve a report | Moderator+ |
| GET | `/admin/moderation/rules` | List automated moderation rules | Moderator+ |
| POST | `/admin/moderation/rules` | Create an automated moderation rule | Super Admin |
| PUT | `/admin/moderation/rules/:id` | Update a moderation rule | Super Admin |

#### System Configuration

| Method | Path | Description | Role |
|--------|------|-------------|------|
| GET | `/admin/feature-flags` | List all feature flags | Content Manager+ |
| PUT | `/admin/feature-flags/:id` | Toggle or configure a feature flag | Super Admin |
| GET | `/admin/ai-settings` | View AI tutor configuration | Content Manager+ |
| PUT | `/admin/ai-settings` | Update AI tutor settings (model, prompts, cost limits, kill switch) | Super Admin |
| POST | `/admin/maintenance` | Toggle maintenance mode (body: `{ enabled, message }`) | Super Admin |
| GET | `/admin/audit-log` | Query audit log (paginated, filterable by admin, action, entity, date range) | Super Admin |

### 15.5 Admin Data Model Additions

#### admins

```sql
CREATE TABLE admins (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    totp_secret     TEXT,                          -- encrypted TOTP secret for 2FA
    role            VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'content_manager', 'moderator', 'analytics_viewer')),
    is_active       BOOLEAN DEFAULT true,
    failed_attempts INTEGER DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    ip_allowlist    TEXT[],                         -- optional IP restrictions
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
```

#### admin_audit_log

```sql
CREATE TABLE admin_audit_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id        UUID NOT NULL REFERENCES admins(id),
    action          VARCHAR(50) NOT NULL,           -- 'create', 'update', 'delete', 'suspend', 'reset', 'toggle', etc.
    entity_type     VARCHAR(50) NOT NULL,           -- 'player', 'school', 'class', 'template', 'feature_flag', etc.
    entity_id       UUID,
    changes_json    JSONB,                          -- { "before": {...}, "after": {...} } for updates
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_admin ON admin_audit_log(admin_id, created_at DESC);
CREATE INDEX idx_audit_entity ON admin_audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_action ON admin_audit_log(action, created_at DESC);
```

#### feature_flags

```sql
CREATE TABLE feature_flags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) UNIQUE NOT NULL,   -- e.g., 'ai_tutor', 'leaderboards', 'power_ups', 'seasonal_event_winter_2026'
    description     TEXT,
    enabled         BOOLEAN DEFAULT false,
    conditions_json JSONB DEFAULT '{}',             -- optional targeting: { "schools": [...], "classes": [...], "levels": [...], "percentage": 50 }
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
```

#### seasons

```sql
CREATE TABLE seasons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,                  -- e.g., 'Cosmic Explorer Season'
    theme           VARCHAR(50) NOT NULL,           -- e.g., 'space', 'underwater', 'jungle'
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    rewards_json    JSONB DEFAULT '[]',             -- [{ "tier": 1, "item_id": "...", "type": "cosmetic" }, ...]
    is_active       BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

CREATE INDEX idx_seasons_active ON seasons(is_active, start_date, end_date);
```

#### moderation_queue

```sql
CREATE TABLE moderation_queue (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            VARCHAR(30) NOT NULL,           -- 'username', 'behavior', 'score_anomaly'
    entity_type     VARCHAR(30) NOT NULL,           -- 'player', 'session', etc.
    entity_id       UUID NOT NULL,
    reason          TEXT NOT NULL,                  -- description of the flagged issue
    status          VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
    reporter_id     UUID,                           -- teacher or system who reported
    reviewer_id     UUID REFERENCES admins(id),     -- admin who reviewed
    resolution      TEXT,                           -- admin's resolution notes
    created_at      TIMESTAMPTZ DEFAULT now(),
    resolved_at     TIMESTAMPTZ
);

CREATE INDEX idx_moderation_status ON moderation_queue(status, created_at DESC);
CREATE INDEX idx_moderation_type ON moderation_queue(type, status);
```

### 15.6 Admin UI Technical Approach

| Aspect | Detail |
|--------|--------|
| **Architecture** | Protected route group within the main SvelteKit app under `(admin)/` path. Shares the build pipeline but has its own layout, auth guards, and navigation. |
| **Route structure** | `/admin/dashboard`, `/admin/players`, `/admin/schools`, `/admin/content`, `/admin/economy`, `/admin/analytics`, `/admin/moderation`, `/admin/settings` |
| **Auth guard** | SvelteKit server-side `load` function checks admin JWT and role on every request. Unauthorized access redirects to `/admin/login`. |
| **Data tables** | Sortable, filterable, paginated tables for all list views. Built with a reusable `<DataTable>` Svelte component. Server-side pagination for large datasets (players, sessions, audit logs). |
| **Charts and visualizations** | Chart.js (or Chartist/Lightweight alternative) for analytics dashboards: line charts (trends over time), bar charts (comparisons), heatmaps (topic mastery across schools). Lazy-loaded to keep admin bundle separate from the game bundle. |
| **Real-time monitoring** | Supabase Realtime subscriptions for live dashboards: active user count, error feed, moderation queue updates. |
| **Bundle isolation** | Admin routes are code-split from the game routes. The admin JS bundle is only loaded when accessing `/admin/*` paths, keeping the game bundle unaffected. |
| **Responsive design** | Admin dashboard is designed for desktop use (min-width: 1024px). Tablet support is secondary. Not optimized for mobile. |

### 15.7 Admin Row Level Security

```sql
-- Admin tables use a separate auth context (not Supabase Auth for students/teachers).
-- Admin access is enforced via Edge Function middleware that validates admin JWT and role
-- before proxying requests to the database.

-- RLS on admin-specific tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

-- Only service role (Edge Functions) can access admin tables
-- All admin API endpoints run through Edge Functions with role-based checks
CREATE POLICY admin_service_role_only ON admins
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY audit_service_role_only ON admin_audit_log
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY flags_service_role_only ON feature_flags
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY seasons_service_role_only ON seasons
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY moderation_service_role_only ON moderation_queue
    FOR ALL USING (auth.role() = 'service_role');
```

---

## Appendix A: Technology Decision Records

### ADR-001: SvelteKit over React/Vue

**Decision:** SvelteKit
**Reason:** 60-70% smaller bundles (3 KB vs 45 KB core), no virtual DOM overhead, critical for target device (2 GB RAM budget phone). Mature enough ecosystem for required libraries (i18n, PWA, animation).
**Risk:** Smaller hiring pool. Mitigated by Svelte's low learning curve and ability to use any vanilla JS library.

### ADR-002: Supabase over Firebase

**Decision:** Supabase
**Reason:** PostgreSQL fits relational data model. RLS enforces data isolation at DB level. Predictable pricing ($25/mo Pro). Open-source, no vendor lock-in. Includes auth, realtime, edge functions, storage.
**Risk:** Younger platform. Mitigated by PostgreSQL portability.

### ADR-003: Gemini 2.0 Flash as primary AI

**Decision:** Gemini 2.0 Flash (primary) + GPT-4o Mini (fallback)
**Reason:** Lowest cost ($0.10/$0.40 per 1M tokens), fastest latency (~300ms), adequate quality for primary school math. With fallback, availability is high.
**Risk:** Quality may not match GPT-4o Mini for complex explanations. Mitigated by pre-written explanation bank for common errors.

### ADR-004: No push notifications for children

**Decision:** No push notifications to student accounts
**Reason:** UK Children's Code prohibits nudge techniques. CNIL recommends against engagement-driving features for minors. Push notifications create compulsive behavior inappropriate for ages 6-11.
**Exception:** Teacher email digests (opt-in).

### ADR-005: PostHog/Plausible over Google Analytics

**Decision:** Self-hosted PostHog or Plausible
**Reason:** GDPR/CNIL compliance for children's data. Self-hosted keeps data in EU. No cookies. No third-party data sharing. Open-source.

---

*Document version: 1.0*
*Last updated: 2026-02-12*
*Status: Implementation-ready*
