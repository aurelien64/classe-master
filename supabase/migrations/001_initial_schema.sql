-- ============================================================================
-- Classe Master - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Core tables for the educational math game platform
-- ============================================================================

-- ============================================================================
-- TRIGGER FUNCTION: auto-update updated_at column
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLE: schools
-- ============================================================================

CREATE TABLE schools (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    code        VARCHAR(10) UNIQUE NOT NULL,
    settings    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: classes
-- ============================================================================

CREATE TABLE classes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    join_code   VARCHAR(8) UNIQUE NOT NULL,
    teacher_id  UUID REFERENCES auth.users(id),
    grade_level SMALLINT NOT NULL CHECK (grade_level BETWEEN 1 AND 5), -- 1=CP, 2=CE1, 3=CE2, 4=CM1, 5=CM2
    settings    JSONB DEFAULT '{}',
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_classes_school ON classes(school_id);
CREATE INDEX idx_classes_join_code ON classes(join_code);
CREATE INDEX idx_classes_teacher ON classes(teacher_id);

CREATE TRIGGER trg_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: players
-- ============================================================================

CREATE TABLE players (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id        UUID REFERENCES classes(id) ON DELETE SET NULL,
    username        VARCHAR(30) NOT NULL,
    avatar_id       VARCHAR(50) DEFAULT 'default_1',
    pin_hash        VARCHAR(255),
    locale          VARCHAR(5) DEFAULT 'fr',
    level           SMALLINT DEFAULT 1,
    sublevel        SMALLINT DEFAULT 1,
    xp              INTEGER DEFAULT 0,
    gems            INTEGER DEFAULT 0,
    settings        JSONB DEFAULT '{}',
    sound_enabled   BOOLEAN DEFAULT true,
    last_played_at  TIMESTAMPTZ,
    total_play_time INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now(),

    UNIQUE(class_id, username)
);

CREATE INDEX idx_players_class ON players(class_id);
CREATE INDEX idx_players_xp ON players(xp DESC);

CREATE TRIGGER trg_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: game_sessions
-- ============================================================================

CREATE TABLE game_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id           UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    class_id            UUID REFERENCES classes(id),
    game_mode           VARCHAR(20) NOT NULL,
    level               SMALLINT NOT NULL,
    sublevel            SMALLINT NOT NULL,
    topic               VARCHAR(50) NOT NULL,
    started_at          TIMESTAMPTZ DEFAULT now(),
    ended_at            TIMESTAMPTZ,
    duration_seconds    INTEGER,
    score               INTEGER DEFAULT 0,
    questions_total     INTEGER DEFAULT 0,
    questions_correct   INTEGER DEFAULT 0,
    accuracy            REAL GENERATED ALWAYS AS (
                            CASE WHEN questions_total > 0
                                THEN questions_correct::REAL / questions_total
                                ELSE 0
                            END
                        ) STORED,
    xp_earned           INTEGER DEFAULT 0,
    gems_earned         INTEGER DEFAULT 0,
    streak_max          INTEGER DEFAULT 0,
    is_validated        BOOLEAN DEFAULT false,
    client_fingerprint  VARCHAR(64),
    created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sessions_player ON game_sessions(player_id, started_at DESC);
CREATE INDEX idx_sessions_class ON game_sessions(class_id, started_at DESC);
CREATE INDEX idx_sessions_topic ON game_sessions(topic);
CREATE INDEX idx_sessions_score ON game_sessions(score DESC) WHERE is_validated = true;

-- ============================================================================
-- TABLE: answer_logs
-- ============================================================================

CREATE TABLE answer_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    question_type   VARCHAR(30) NOT NULL,
    question_data   JSONB NOT NULL,
    player_answer   TEXT,
    correct_answer  TEXT NOT NULL,
    is_correct      BOOLEAN NOT NULL,
    time_taken_ms   INTEGER,
    difficulty      REAL,
    hint_used       BOOLEAN DEFAULT false,
    ai_help_used    BOOLEAN DEFAULT false,
    answered_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_answers_session ON answer_logs(session_id);
CREATE INDEX idx_answers_player ON answer_logs(player_id, answered_at DESC);
CREATE INDEX idx_answers_type ON answer_logs(question_type, is_correct);

-- ============================================================================
-- TABLE: progress
-- ============================================================================

CREATE TABLE progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id           UUID UNIQUE NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    current_level       SMALLINT DEFAULT 1,
    current_sublevel    SMALLINT DEFAULT 1,
    current_micro_level SMALLINT DEFAULT 1,
    topic_mastery       JSONB DEFAULT '{}',
    current_difficulty  REAL DEFAULT 0.5,
    consecutive_correct INTEGER DEFAULT 0,
    consecutive_wrong   INTEGER DEFAULT 0,
    total_sessions      INTEGER DEFAULT 0,
    total_questions     INTEGER DEFAULT 0,
    total_correct       INTEGER DEFAULT 0,
    total_play_time     INTEGER DEFAULT 0,
    longest_streak      INTEGER DEFAULT 0,
    updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_progress_mastery ON progress USING GIN (topic_mastery);

-- ============================================================================
-- TABLE: inventory
-- ============================================================================

CREATE TABLE inventory (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id   UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    item_type   VARCHAR(30) NOT NULL,
    item_id     VARCHAR(50) NOT NULL,
    quantity    INTEGER DEFAULT 1,
    acquired_at TIMESTAMPTZ DEFAULT now(),
    metadata    JSONB DEFAULT '{}',

    UNIQUE(player_id, item_type, item_id)
);

CREATE INDEX idx_inventory_player ON inventory(player_id);

-- ============================================================================
-- TABLE: achievements
-- ============================================================================

CREATE TABLE achievements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    achievement_id  VARCHAR(50) NOT NULL,
    unlocked_at     TIMESTAMPTZ DEFAULT now(),
    metadata        JSONB DEFAULT '{}',

    UNIQUE(player_id, achievement_id)
);

CREATE INDEX idx_achievements_player ON achievements(player_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all player-facing tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- Players: self-access
-- --------------------------------------------------------------------------

CREATE POLICY players_self_access ON players
    FOR ALL
    USING (id = auth.uid());

-- --------------------------------------------------------------------------
-- Players: teacher read access
-- --------------------------------------------------------------------------

CREATE POLICY players_teacher_read ON players
    FOR SELECT
    USING (
        class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

-- --------------------------------------------------------------------------
-- Game Sessions: self-access
-- --------------------------------------------------------------------------

CREATE POLICY sessions_self_access ON game_sessions
    FOR ALL
    USING (player_id = auth.uid());

-- --------------------------------------------------------------------------
-- Game Sessions: teacher read access
-- --------------------------------------------------------------------------

CREATE POLICY sessions_teacher_read ON game_sessions
    FOR SELECT
    USING (
        class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

-- --------------------------------------------------------------------------
-- Answer Logs: self-access
-- --------------------------------------------------------------------------

CREATE POLICY answers_self_access ON answer_logs
    FOR ALL
    USING (player_id = auth.uid());

-- --------------------------------------------------------------------------
-- Progress: self-access
-- --------------------------------------------------------------------------

CREATE POLICY progress_self_access ON progress
    FOR ALL
    USING (player_id = auth.uid());

-- --------------------------------------------------------------------------
-- Progress: teacher read access
-- --------------------------------------------------------------------------

CREATE POLICY progress_teacher_read ON progress
    FOR SELECT
    USING (
        player_id IN (
            SELECT p.id FROM players p
            WHERE p.class_id IN (
                SELECT c.id FROM classes c WHERE c.teacher_id = auth.uid()
            )
        )
    );

-- --------------------------------------------------------------------------
-- Inventory: self-access
-- --------------------------------------------------------------------------

CREATE POLICY inventory_self_access ON inventory
    FOR ALL
    USING (player_id = auth.uid());

-- --------------------------------------------------------------------------
-- Achievements: self-access
-- --------------------------------------------------------------------------

CREATE POLICY achievements_self_access ON achievements
    FOR ALL
    USING (player_id = auth.uid());
