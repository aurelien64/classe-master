# Game Design Specification
## Classe Master -- The Math Adventure Game

**Version:** 1.0
**Date:** 2026-02-12
**Status:** Design specification -- ready for team review
**Audience:** Development team, designers, product stakeholders

---

## Table of Contents

1. [Game Overview & Vision](#1-game-overview--vision)
2. [Core Gameplay Loop](#2-core-gameplay-loop)
3. [Player Onboarding](#3-player-onboarding)
4. [Question System](#4-question-system)
5. [Progression System](#5-progression-system)
6. [Economy & Rewards](#6-economy--rewards)
7. [Avatar & Collectibles System](#7-avatar--collectibles-system)
8. [Power-ups / Jokers / Skills](#8-power-ups--jokers--skills)
9. [Social Features](#9-social-features)
10. [School / Class / Teacher Features](#10-school--class--teacher-features)
11. [AI Tutor System](#11-ai-tutor-system)
12. [UX/UI Design Principles](#12-uxui-design-principles)
13. [Engagement Mechanics](#13-engagement-mechanics)
14. [Anti-Frustration Design](#14-anti-frustration-design)
15. [Admin Dashboard](#15-admin-dashboard)

---

## 1. Game Overview & Vision

### 1.1 Name Suggestions

| Name | Rationale |
|------|-----------|
| **Classe Master** | Plays on "classe" (class/classroom) + mastery. Works in French and English. Clear, memorable, aspirational. |
| **MathArena** | Competitive energy. "Arena" is universally understood by kids. |
| **CalcuStars** | "Calcul" (French for calculation) + stars. Fun, approachable. |
| **MathCraft** | Echoes Minecraft culture. "Craft" implies building skills. |
| **NumeRun** | "Numeros" (numbers) + "Run". Suggests speed and action. |

**Recommended name: Classe Master**

The name communicates educational purpose without feeling like homework. It carries a competitive edge ("master") that motivates children while the French word "classe" anchors it to the school context. It works seamlessly for English-speaking audiences.

### 1.2 Elevator Pitch

> Classe Master is a 5-minute math game that makes primary school children *want* to practice math. It combines adaptive difficulty aligned to the French national curriculum (CP-CM2) with the engagement systems kids love from Brawl Stars and Roblox -- avatar customization, streaks, leaderboards, and collectibles -- all in a free, ad-free, privacy-first PWA that works on any device.

### 1.3 Target Audience

| Attribute | Detail |
|-----------|--------|
| **Primary users** | French primary school children, CP through CM2 (ages 6-11) |
| **Secondary users** | English-speaking primary school children (KS1-KS2, ages 5-11) |
| **Key stakeholders** | Teachers (class management, analytics), parents (progress oversight) |
| **Devices** | Budget smartphones, tablets, Chromebooks, desktop (reference device: Samsung Galaxy A03, 2 GB RAM) |
| **Context** | Classroom 5-minute exercises, homework practice, independent play |

### 1.4 Core Philosophy

**Math IS the game, not a gate to the game.**

Every interaction involves math. Unlike Prodigy (where math is an interruption to an RPG), Classe Master makes solving problems the core action. The gamification wraps around the math, not the other way around.

**Five pillars:**

1. **Learning through play** -- Solving math problems feels like gameplay, not homework.
2. **Adaptive challenge** -- Every child plays at their Zone of Proximal Development (Vygotsky). Never too easy, never too hard.
3. **Positive reinforcement** -- Never subtract points. Never show negative scores. Celebrate effort alongside accuracy.
4. **Privacy by design** -- Zero personal data collected from children. No ads. No tracking. Analytics serve learning, not surveillance.
5. **Accessible to all** -- Free, offline-capable, runs on the cheapest devices. No child is excluded by economics or connectivity.

### 1.5 Curriculum Alignment

The game covers the full French mathematics curriculum (Bulletin Officiel 2024-2025) across four domains:

| Domain | French Name | Coverage |
|--------|-------------|----------|
| Numbers & Calculation | Nombres, calcul et resolution de problemes | CP-CM2 |
| Measurement | Grandeurs et mesures | CP-CM2 |
| Geometry | Espace et geometrie | CP-CM2 |
| Data Management | Organisation et gestion de donnees | CM1-CM2 |

The English-language version maps to UK National Curriculum KS1-KS2, with the question system adapting number ranges, terminology, and cultural references per locale.

---

## 2. Core Gameplay Loop

### 2.1 The 5-Minute Session

The fundamental unit of play is a **5-minute timed session**. This duration is deliberately chosen to:
- Fit into a 10-minute classroom warm-up (setup + 1 session + review)
- Match the attention span of a 6-year-old
- Create natural stopping points (unlike Minecraft's open-ended design)
- Allow 2-3 sessions for homework (10-15 minutes total)

### 2.2 Session Flow

```
[SESSION START]
    |
    v
[Daily check-in: streak update, daily reward]
    |
    v
[Question served]  <-----+
    |                     |
    v                     |
[Child answers]           |
    |                     |
    +--- Correct -------> [Celebration animation, +XP, combo counter increments]
    |                     |
    +--- Incorrect -----> [Gentle feedback, show correct answer, brief explanation]
    |                     |
    +--- Hint used -----> [Tiered hint, reduced points, resume answering]
    |                     |
    v                     |
[Next question] ----------+
    |
    v (5-minute timer expires)
    |
[Grace period: 15 seconds to finish current question]
    |
    v
[RESULTS SCREEN]
    |-- Questions answered
    |-- Correct count (star animation per correct answer)
    |-- Accuracy (shown as "12 sur 15" for younger students)
    |-- XP earned
    |-- Coins earned
    |-- Personal best comparison
    |-- Streak update
    |
    v
[REWARDS DISTRIBUTION]
    |-- Coins credited
    |-- Gems credited (if milestone reached)
    |-- Achievement unlocked (if applicable)
    |-- Level-up animation (if applicable)
    |
    v
[PROGRESSION CHECK]
    |-- Update topic mastery scores
    |-- Adjust adaptive difficulty
    |-- Check micro-level advancement criteria
    |-- Schedule spaced repetition reviews
    |
    v
[END SCREEN]
    |-- "Play Again" button
    |-- "Back to Menu" button
    |-- Break reminder (after 3 consecutive sessions)
```

### 2.3 Expected Questions Per Session

| Level | Avg. Time per Question | Questions per Session | Range |
|-------|----------------------|----------------------|-------|
| CP | 20-25 seconds | 12-15 | 10-18 |
| CE1 | 18-22 seconds | 14-17 | 11-20 |
| CE2 | 15-20 seconds | 15-20 | 12-22 |
| CM1 | 15-20 seconds | 15-20 | 12-22 |
| CM2 | 12-18 seconds | 17-25 | 14-28 |

### 2.4 Multi-Timescale Engagement Loops

```
DAILY LOOP (5-15 minutes):
  -> Login: streak check + daily reward (coins)
  -> Daily quest: "Solve 10 multiplication problems" or similar
  -> 1-3 game sessions (adaptive difficulty, earn coins + XP)
  -> Session summary: stats, coins earned, streak updated
  -> Optional: browse shop, customize avatar

WEEKLY LOOP (5-7 daily sessions):
  -> Weekly challenge unlocks Monday (themed, higher difficulty, gem reward)
  -> Class leaderboard tracks weekly performance
  -> Team points accumulate throughout the week
  -> Weekly reward on completion (gems or rare cosmetic)
  -> "Star of the week" recognition in class

MONTHLY LOOP:
  -> Seasonal theme change (new backgrounds, new items in shop)
  -> New cosmetic items available for purchase
  -> School-level competition / rallye
  -> "Big unlock" milestone reward for consistent play
  -> Progress report available for teacher/parent

YEARLY LOOP:
  -> Grade-level progression (CP -> CE1 -> CE2 -> CM1 -> CM2)
  -> End-of-year celebration and stats showcase
  -> Summer challenge mode (optional, lighter difficulty, fun themes)
  -> Achievement showcase / "yearbook" of accomplishments
```

---

## 3. Player Onboarding

### 3.1 Account Creation Flow

The onboarding flow collects **zero personal data** from children -- no email, no real name, no date of birth. Age is inferred from class grade level.

```
Step 1: WELCOME SCREEN
  -> "Jouer" (Play) button -- big, colorful, center of screen
  -> Language selector (FR / EN) in top corner

Step 2: JOIN OR CREATE
  -> "J'ai un code de classe" (I have a class code) --> Enter 6-character code (e.g., MATH42)
  -> "Je joue seul" (I play alone) --> Select grade level manually

Step 3: CHOOSE USERNAME
  -> Child types a username (3-20 characters, profanity-filtered)
  -> OR selects from a list of fun pre-generated names (e.g., "TurboMath", "StarCalc")
  -> Username displayed with their avatar on the class leaderboard

Step 4: SET OPTIONAL PIN
  -> 4-digit PIN for returning on the same or different device
  -> Can be skipped (device token used for auto-login)
  -> Recoverable by teacher if forgotten

Step 5: CREATE AVATAR
  -> Simple customization: face shape, hair, skin tone, eyes, starter outfit
  -> 5-6 options per category to keep it quick
  -> "This is you!" moment -- avatar is shown celebrating
```

### 3.2 Tutorial / First Game Experience

The first session is a **guided tutorial** that teaches the game through play, not instruction screens:

```
Tutorial Session (3 minutes, shorter than normal):

1. "Voici ta premiere question !" (Here's your first question!)
   -> Simple MC question at easiest difficulty
   -> Animated hand shows where to tap
   -> On correct: BIG celebration, explanation of points

2. Second question, no hand guidance
   -> On correct: combo counter explained ("2 d'affilee !")

3. Third question, deliberately easy
   -> Hints button highlighted: "Si tu as besoin d'aide, appuie ici !"
   -> (Child may or may not use it)

4. Fourth question, slightly harder
   -> If wrong: gentle feedback shown, correct answer explained
   -> "C'est pas grave ! Tu apprends en jouant."

5-8. Remaining questions at adaptive difficulty
   -> No more tutorial overlays
   -> Natural gameplay

END: Results screen with extra celebration
   -> "Bienvenue dans Classe Master !"
   -> First coins awarded (generous: 50 coins)
   -> First daily streak started
   -> Prompt to customize avatar with earned coins
```

### 3.3 Returning Player Flow

```
[Open app]
    |
    +-- Session token valid? --> [Welcome back, {username}!] --> [Main menu]
    |
    +-- No token? --> [Enter class code + username] --> [Enter PIN] --> [Main menu]
    |
    +-- Same device, different student? --> [Switch player] --> [Enter class code + username]
```

On return, the game shows:
- Current streak status (with fire animation if active)
- Daily reward claim button
- "Continue" button to jump into a session
- Any pending notifications (achievement unlocked, weekly challenge available)

---

## 4. Question System

### 4.1 Question Types

The game features 14 distinct question formats, each designed for specific mathematical concepts and engagement purposes.

---

#### 4.1.1 Multiple Choice (QCM)

**Description:** A math question with 4 tappable answer buttons (3 options for CP to reduce cognitive load).

**Layout:** 2x2 grid of large buttons with distinct pastel backgrounds. Minimum 24pt font. On selection, the chosen button highlights; a "Valider" confirmation button appears to prevent accidental taps.

**Mockup concept:**
```
+------------------------------------------+
|                                          |
|           7  +  5  =  ?                 |
|                                          |
+------------------------------------------+
|                  |                        |
|  [ 11 ]          |  [ 12 ]              |
|  (light blue)    |  (light green)       |
|                  |                        |
+------------------+------------------------+
|                  |                        |
|  [ 13 ]          |  [ 2 ]               |
|  (light pink)    |  (light yellow)      |
|                  |                        |
+------------------+------------------------+
|                                          |
|         [ Valider ]  (green)             |
+------------------------------------------+
```

**Distractor generation:** Each wrong answer represents a plausible mistake:
- **Off-by-one:** correct answer +/- 1
- **Wrong operation:** result of subtraction/multiplication instead
- **Procedural error:** forgotten carry, digit swap
- **Magnitude error:** wrong place value
- At least one distractor must be "close" to the correct answer

**Used for:** All topics, all levels. Primary format at lower difficulties.

---

#### 4.1.2 Fill-in-the-Blank

**Description:** An equation with one element replaced by a highlighted blank box with a blinking cursor.

**Where the blank can appear:**
- Result position: `6 x 5 = ___`
- Operand position: `6 x ___ = 30`
- Operator position (CM1+): `6 ___ 5 = 30`

**Input:** Kid-friendly on-screen numpad (see 4.1.3).

**Used for:** All arithmetic topics. Excellent for testing understanding of inverse operations.

---

#### 4.1.3 Free Input (Direct Answer Entry)

**Description:** A question with no options -- the child types the answer using a custom numpad.

**Kid-friendly numpad design:**
```
+-------------------------------------------+
|    [ display: typed number, 36pt+ ]       |
+-------------------------------------------+
|    [ 1 ]    |    [ 2 ]    |    [ 3 ]     |
+-----------+-----------+-----------+
|    [ 4 ]    |    [ 5 ]    |    [ 6 ]     |
+-----------+-----------+-----------+
|    [ 7 ]    |    [ 8 ]    |    [ 9 ]     |
+-----------+-----------+-----------+
|    [ , ]    |    [ 0 ]    |    [ <x ]    |
+-----------+-----------+-----------+
|           [ Valider ]  (green)            |
+-------------------------------------------+
```

**Key behaviors:**
- Buttons are at least 56x56dp with 8dp gaps
- Decimal separator key `,` (French convention) only visible for CM1+ levels
- Backspace key `<x` for correction
- For fraction entry (CE2+): a special mode with numerator/denominator fields separated by a horizontal bar
- Negative sign key only for CM2 extension activities

---

#### 4.1.4 Word Problems

**Description:** A short narrative (1-3 sentences) with a mathematical question embedded in a real-world context.

**Structure:** Context sentence --> Action sentence --> Question

**Age-appropriate examples:**

| Level | Example |
|-------|---------|
| CP | "Leo a 8 billes. Il en donne 3 a Mia. Combien de billes a-t-il maintenant ?" |
| CE1 | "Emma a 45 images. Son frere lui en donne 27. Combien d'images a-t-elle en tout ?" |
| CE2 | "Un paquet contient 6 gateaux. Maman achete 4 paquets. Combien de gateaux y a-t-il en tout ?" |
| CM1 | "Un ruban mesure 2,5 m. Julie en coupe 1,3 m. Quelle longueur reste-t-il ?" |
| CM2 | "Pour 4 personnes il faut 200 g de farine. Combien de farine faut-il pour 10 personnes ?" |

**UX details:**
- Story text at the top with a context illustration (basket icon for market, clock for time, etc.)
- Key numbers subtly highlighted (bold or colored) for younger children
- An optional "Relire" (Re-read) button triggers text-to-speech for early readers
- Answer input is MC (CP-CE1) or free input (CE2+)
- Character pool: ~20 rotating French first names, gender-balanced (Leo, Emma, Lucas, Chloe, Louis, Marie, Hugo, Jade, Noah, Lina, Adam, Alice, Jules, Ines, Raphael, Manon, Arthur, Camille, Nathan, Sarah)
- Contexts: school, playground, bakery, market, birthday party, garden, sports, cooking, travel, animals

---

#### 4.1.5 Ordering / Sorting

**Description:** 4-6 draggable number cards that must be placed in ascending or descending order.

**Variants:**
- **Order numbers:** Drag cards into slots from "plus petit" to "plus grand"
- **Order calculation steps (CM1+):** Arrange sub-calculations in correct order of operations
- **Place on number line:** Drag number tokens to correct positions on a number line (great for fractions and decimals)

**UX:** Large drag handles (48dp+), snap-to-slot animation, green glow on correct placement, gentle shake on incorrect. "Valider" checks the full arrangement.

---

#### 4.1.6 True / False

**Description:** A mathematical statement with two large buttons: "VRAI" (green) and "FAUX" (red).

**Examples:**
- `12 + 5 = 18` (FAUX)
- `3 x 4 = 12` (VRAI)
- `1/2 > 1/3` (VRAI)

**Design notes:** Quick-fire format, ideal for timed challenges and warm-ups. Target 3-4 seconds per question. "FAUX" statements always use a plausible common error, never an absurd value.

---

#### 4.1.7 Matching (Association)

**Description:** Two columns of items (4-6 per column) that must be connected.

**Variants:**
- Match equation to answer
- Match fraction to visual representation (pie chart)
- Match number in digits to written form
- Match measurement to converted equivalent (100 cm = 1 m)

**UX:** Tap an item on the left, then tap its match on the right. A line connects them. Completed pairs lock in place with a green checkmark. "Valider" checks all pairs at once.

---

#### 4.1.8 Comparison (Greater Than / Less Than / Equal)

**Description:** Two expressions or numbers shown side by side. Child selects `<`, `>`, or `=`.

**Examples:**
- `34 + 12 ___ 50`
- `1/2 ___ 2/5`

**Layout:** Three large symbol buttons below the comparison.

---

#### 4.1.9 Pattern Completion

**Description:** A number sequence with one or two blanks to fill in.

**Example:** `2, 4, 6, ___, 10, ___`

**Used for:** Multiplication table reinforcement, logical thinking, algebraic preparation.

---

#### 4.1.10 Estimation Challenge (CM1-CM2)

**Description:** A visual (jar of objects, dot array) with a request to estimate the quantity. Answers within a tolerance range (e.g., +/- 10%) are accepted.

**Used for:** Number sense development.

---

#### 4.1.11 Mental Calculation Chain

**Description:** A starting number followed by sequential operations that appear one at a time.

**Example:** `Start: 10 --> +5 --> x2 --> -3 --> = ?`

Operations appear with a 2-second delay. The child must track the running total mentally.

---

#### 4.1.12 Clock Reading (CE1+)

**Description:** An analog clock face is displayed. Child answers "What time is it?" via MC, or drags clock hands to a requested time.

---

#### 4.1.13 Money Counting (CE1+)

**Description:** A set of Euro coins and bills is displayed. Child calculates the total, or selects the right coins to make a given amount.

Uses images of real Euro coins and bills for realism.

---

#### 4.1.14 Visual Geometry Questions

**Description:** A shape is displayed. Child answers questions about it (number of sides, shape name, area on grid, perimeter).

**Format:** MC for identification, free input for measurement.

---

### 4.2 Question Format Summary Table

| Format | Input Method | Min Level | Options | Validation |
|--------|-------------|-----------|---------|------------|
| Multiple Choice | Tap button | CP | 3-4 | Tap + Valider |
| Fill-in-the-Blank | Numpad | CP | N/A | Valider |
| Free Input | Numpad | CP | N/A | Valider |
| Word Problem | MC or Numpad | CP | 3-4 or free | Valider |
| True/False | Two buttons | CP | 2 | Instant tap |
| Ordering | Drag-and-drop | CE1 | 4-6 items | Valider |
| Matching | Tap-pair or drag | CE1 | 4-6 pairs | Valider |
| Comparison (<>=) | Three buttons | CP | 3 | Instant tap |
| Pattern Completion | Numpad | CE1 | N/A | Valider |
| Estimation | Numpad | CM1 | N/A | Tolerance range |
| Mental Calc Chain | Numpad | CE2 | N/A | Valider |
| Clock Reading | MC or drag hands | CE1 | 4 or interactive | Valider |
| Money Counting | Tap coins/MC | CE1 | Interactive or 4 | Valider |
| Geometry Visual | MC or tap | CP | 3-4 | Valider |

**Important design rule:** No visible per-question countdown timer. Timers are silent and tracked in the background only.

### 4.3 Question Generation System

#### Template-Based Generation with Randomized Parameters

Each question is generated from a template that defines:

```
Template {
  id: string                    // Unique template identifier
  type: QuestionType            // multiple_choice, fill_blank, free_input, etc.
  topic: Topic                  // addition, multiplication, fractions, etc.
  level: Level                  // CP, CE1, CE2, CM1, CM2
  subLevel: 1-10                // Difficulty sub-level
  microLevel: 1-10              // Difficulty micro-level
  pattern: string               // e.g., "{a} + {b} = ?"
  parameters: {
    a: { min, max, constraints }
    b: { min, max, constraints }
  }
  answerFormula: string          // e.g., "a + b"
  distractorStrategies: string[] // e.g., ["off_by_one", "wrong_operation"]
  constraints: string[]          // e.g., ["result <= 20", "a >= b"]
  wordProblemTemplate?: string   // optional narrative template
}
```

#### Validation Pipeline

Every generated question passes through:

1. **Parameter generation:** Random values picked within defined ranges
2. **Constraint check:** All constraints evaluated; re-generate if any fails (max 10 attempts)
3. **Answer computation:** Calculated from the formula
4. **Answer range check:** Must be valid for the level (CP: 0-100, CE1: 0-1000, etc.)
5. **Distractor generation:** 3 unique distractors, each different from the correct answer
6. **Presentation check:** Word problem text checked for grammatical sense

#### Anti-Repetition Mechanisms

| Mechanism | Detail |
|-----------|--------|
| Session history | Track last 20 questions; never repeat same template + parameters in one session |
| Template rotation | Cycle through all templates for a topic/difficulty before reusing any |
| Parameter variation | Minimum Hamming distance of 2 between parameter sets |
| Cross-session tracking | Per-student "recently seen" buffer (last 100 questions) in persistent storage |
| Freshness score | Templates with lower freshness scores are preferred in selection |

#### Template Volume

| Level | Templates per Sub-level | Total Templates | Effective Unique Questions |
|-------|------------------------|-----------------|---------------------------|
| CP | ~30 | ~300 | ~30,000-90,000 |
| CE1 | ~35 | ~350 | ~35,000-105,000 |
| CE2 | ~35 | ~350 | ~35,000-105,000 |
| CM1 | ~40 | ~400 | ~40,000-120,000 |
| CM2 | ~40 | ~400 | ~40,000-120,000 |
| **Total** | **~36 avg** | **~1,800** | **~180,000-540,000** |

**MVP target:** ~1,000 templates (sufficient for months of daily play without noticeable repetition).

### 4.4 Difficulty Calibration

#### Difficulty Parameters

| Parameter | Description | How It Scales |
|-----------|-------------|---------------|
| Number range | Min/max for operands and results | Increases with level |
| Number of operations | Single vs. multi-step | 1 at CP, up to 3 at CM2 |
| Carry/borrow | Whether regrouping is needed | Introduced gradually |
| Number of digits | Single, double, triple... | Increases with level |
| Decimal places | 0, 1, 2, 3 | 0 at CP-CE2, increases CM1-CM2 |
| Fraction complexity | Denominator size, common denom needed | Increases CE2-CM2 |
| Time pressure | Per-question time limit | Decreases at higher micro-levels |
| Distractor closeness | How close wrong answers are | Gets closer at higher levels |
| Question type mix | MC vs. fill-blank vs. free input | Shifts from MC to free input |
| Word problem length | Sentences and operations | Increases with level |

#### Question Type Distribution by Difficulty

| Difficulty Index | Multiple Choice | Fill-in-Blank | Free Input | Word Problem |
|-----------------|----------------|---------------|------------|--------------|
| 1-20 (easiest) | 70% | 20% | 5% | 5% |
| 21-40 | 50% | 25% | 15% | 10% |
| 41-60 | 35% | 25% | 25% | 15% |
| 61-80 | 20% | 25% | 30% | 25% |
| 81-100 (hardest) | 10% | 20% | 35% | 35% |

### 4.5 Per-Question Timing

#### Time Limits by Question Type and Level

| Question Type | CP | CE1 | CE2 | CM1 | CM2 |
|---------------|-----|------|------|------|------|
| True/False | 8s | 7s | 6s | 5s | 5s |
| Multiple Choice (simple) | 15s | 12s | 10s | 10s | 8s |
| Multiple Choice (complex) | 20s | 18s | 15s | 12s | 10s |
| Fill-in-the-Blank | 20s | 18s | 15s | 15s | 12s |
| Free Input | 25s | 20s | 18s | 15s | 12s |
| Word Problem | 35s | 30s | 25s | 25s | 20s |
| Ordering/Sorting | 30s | 25s | 20s | 18s | 15s |
| Matching | 40s | 35s | 30s | 25s | 20s |

**The per-question timer is invisible to the child.** It runs silently and only triggers:
- At **1x time:** Gentle nudge -- "Besoin d'aide ?" with hint button
- At **2x time:** Second nudge -- "Tu peux passer a la suite !" with skip button
- At **3x time:** Auto-advance with gentle animation (not marked as error for progression)

### 4.6 Help / Hint System

#### Three-Tier Hint Structure

Hints are **always available** via a lightbulb icon. The icon gently bounces if the child seems stuck (no input for 10+ seconds). Hints are free to use but reduce scoring to encourage independent solving.

**Tier 1 -- Strategy Reminder (general direction):**

| Question Type | Example Hint |
|---------------|-------------|
| Arithmetic | "Commence par additionner les unites : 7 + 8" |
| Multiple Choice | One distractor is greyed out |
| Fill-in-the-Blank | "Quel nombre multiplie par 6 donne 30 ?" |
| Word Problem | "Il s'agit d'une soustraction." |
| Fractions | "Pour additionner des fractions, il faut le meme denominateur." |

**Tier 2 -- Partial Solution (narrow it down):**

| Question Type | Example Hint |
|---------------|-------------|
| Arithmetic | "7 + 8 = 15. Ecris 5 et retiens 1." |
| Multiple Choice | A second distractor is greyed out (50/50 remains) |
| Fill-in-the-Blank | "C'est un nombre entre 1 et 10." |
| Word Problem | "Les nombres importants sont 45 et 27." |
| Fractions | "Le denominateur commun de 3 et 4 est 12." |

**Tier 3 -- Walkthrough (one step from the answer):**

| Question Type | Example Hint |
|---------------|-------------|
| Arithmetic | Animated column addition showing all steps, pausing before the final answer |
| Multiple Choice | "6 x 7, c'est 6 fois le nombre 7. Tu peux compter : 7, 14, 21..." |
| Fill-in-the-Blank | "Tu sais que 6 x 5 = 30. Alors..." |
| Word Problem | "Tu dois calculer 45 - 27 = ?" |
| Fractions | "1/3 = 4/12 et 1/4 = 3/12. Maintenant additionne." |

#### Hint Scoring Impact

| Hints Used | Points Earned | Positive Framing |
|------------|---------------|------------------|
| 0 hints | 100% (full) | "Super cerveau ! Bonus pour avoir trouve tout seul !" |
| 1 hint | 70% | Normal feedback, no comment on hint |
| 2 hints | 40% | Normal feedback |
| 3 hints | 20% | "Bien joue ! Tu as appris quelque chose de nouveau." |

**Critical rule:** The minimum is never 0. A correct answer always earns something, even with all hints used. The UI never says "penalty" or "reduced" -- only "bonus for solving on your own" when no hints are used.

#### Hint Impact on Progression

Questions answered with 2+ hints are flagged as "assisted" and count at **50% weight** toward the 80% accuracy threshold for micro-level advancement. This prevents advancing purely through hints while keeping hints available as a genuine learning tool.

---

## 5. Progression System

### 5.1 Overall Structure

The progression system has three nested layers:

```
5 Main Levels (CP, CE1, CE2, CM1, CM2)
    |
    +-- 10 Sub-levels each (topics within the year's curriculum)
            |
            +-- 10 Micro-levels each (fine-grained difficulty steps)

Total: 500 micro-steps across the entire game
```

Each main level maps to one year of the French curriculum.

### 5.2 Topic Mapping Per Level

#### CP (Cours Preparatoire -- Age 6)

| Sub-level | Topic | Description |
|-----------|-------|-------------|
| 1 | Counting & Number Recognition | Count objects 1-10, recognize written digits |
| 2 | Number Comparison | Compare numbers up to 10, use < > = |
| 3 | Addition Basics | Sums up to 10, concrete objects |
| 4 | Subtraction Basics | Differences within 10 |
| 5 | Addition Crossing 10 | Sums between 10 and 20 |
| 6 | Subtraction Crossing 10 | Differences from numbers up to 20 |
| 7 | Doubles and Near-Doubles | 3+3, 4+4, 5+6, etc. |
| 8 | Two-Digit Numbers | Read, write, compare numbers 10-99 |
| 9 | Shape Recognition | Identify squares, rectangles, triangles, circles |
| 10 | Simple Measurements & Review | Compare lengths, order sizes; mixed review |

#### CE1 (Cours Elementaire 1 -- Age 7)

| Sub-level | Topic | Description |
|-----------|-------|-------------|
| 1 | Addition Review & Extension | Sums up to 100, fluency building |
| 2 | Addition with Carrying | Two-digit addition with regrouping |
| 3 | Subtraction Review & Extension | Differences up to 100 |
| 4 | Subtraction with Borrowing | Two-digit subtraction with regrouping |
| 5 | Introduction to Multiplication | Groups, repeated addition |
| 6 | Multiplication Tables (x2, x5, x10) | First tables memorization |
| 7 | Numbers to 1,000 | Read, write, compare, order |
| 8 | Introduction to Fractions & Decimals | Halves, quarters; euros and cents |
| 9 | Geometry & Measurement | Shapes, right angles, cm, telling time |
| 10 | Problem Solving & Review | Multi-topic word problems, mixed operations |

#### CE2 (Cours Elementaire 2 -- Age 8)

| Sub-level | Topic | Description |
|-----------|-------|-------------|
| 1 | Multiplication Tables (x3, x4) | Extend table knowledge |
| 2 | Multiplication Tables (x6-x9) | Complete table mastery (all x2-x9 by heart) |
| 3 | Multiplying by 10, 100 | Pattern recognition with zeros |
| 4 | Introduction to Division | Sharing equally, quotient concept |
| 5 | Division with Small Numbers | Division facts from known tables |
| 6 | Numbers to 10,000 | Read, write, compare, decompose |
| 7 | Fractions: Halves, Thirds, Quarters | Visual fractions, naming, comparing |
| 8 | Measurement Units | m/cm/mm, kg/g, L/cL, hours/minutes |
| 9 | Geometry: Perimeter, Right Angles | Measure perimeter, identify right angles |
| 10 | Problem Solving & Review | Multi-step problems, mixed operations |

#### CM1 (Cours Moyen 1 -- Age 9)

| Sub-level | Topic | Description |
|-----------|-------|-------------|
| 1 | Multi-Digit Addition & Subtraction | Numbers up to 100,000, column methods |
| 2 | Multi-Digit Multiplication | Two-digit x two-digit, column multiplication |
| 3 | Division Algorithm | Long division with one-digit divisor |
| 4 | Fractions: Naming and Comparing | Denominators up to 12 |
| 5 | Fractions: Addition and Subtraction | Same denominator, then different |
| 6 | Introduction to Decimals | Tenths and hundredths, place value |
| 7 | Decimal Operations | Addition and subtraction with decimals |
| 8 | Measurement Conversions | m/cm, kg/g, L/mL conversions |
| 9 | Area and Perimeter | Rectangle/square formulas, grid counting |
| 10 | Problem Solving & Review | Multi-step with mixed operations and units |

#### CM2 (Cours Moyen 2 -- Age 10)

| Sub-level | Topic | Description |
|-----------|-------|-------------|
| 1 | Operations with Large Numbers | All four operations, numbers up to 1,000,000 |
| 2 | Long Division | Two-digit divisors |
| 3 | Fraction Operations | Add, subtract, multiply fractions |
| 4 | Decimal Operations: All Four | Add, subtract, multiply, divide decimals |
| 5 | Proportionality | Ratio, scaling, rule of three |
| 6 | Percentages (Introduction) | Percentage as fraction of 100 |
| 7 | Measurement & Conversions | Complex unit conversions, volume intro |
| 8 | Geometry: Angles & Triangles | Classify angles, types of triangles |
| 9 | Geometry: Area of Triangles, Composites | Triangle area formula, composite shapes |
| 10 | Comprehensive Review & Bridge to College | All topics mixed, pre-6eme preparation |

### 5.3 Independent Topic Tracks

**Each topic within a level progresses independently.** A student can be advanced in addition but behind in subtraction, and the system adapts accordingly.

```
Example -- CP Student:
  Counting:       sub-level 7, micro-level 4  (advanced)
  Addition:       sub-level 6, micro-level 8  (progressing)
  Subtraction:    sub-level 3, micro-level 2  (struggling)
  Shapes:         sub-level 5, micro-level 1  (on track)
  Measurement:    sub-level 2, micro-level 5  (behind)
```

**Adaptive session composition:** Each 5-minute session draws questions from multiple topics, weighted by need:

| Student Status in Topic | Question Allocation |
|------------------------|---------------------|
| Behind (accuracy < 70% over last 20 questions) | 40-50% of session (2x "weakness multiplier") |
| On track | 30-40% of session |
| Ahead | 10-20% of session (never zero -- maintains fluency) |

### 5.4 Advancement Criteria

#### Micro-Level Advancement (micro-level N to N+1)

| Criteria | Detail |
|----------|--------|
| Minimum questions | 8 at the current micro-level |
| Accuracy | At least 80% on a rolling window of the last 10 questions |
| Consistency | No more than 2 consecutive errors on the same sub-topic |
| Hint adjustment | Questions with 2+ hints count at 50% weight toward accuracy |

**On failure to advance:** System increases proportion of struggling sub-topics. After 3 failed sets, a review session pulls questions from the previous micro-level.

#### Sub-Level Advancement (sub-level N to N+1)

| Criteria | Detail |
|----------|--------|
| Completion | All 10 micro-levels passed |
| Mastery score | At least 85% weighted average across all 10 micro-levels |
| Gate quiz | 10 mixed questions from all micro-levels, must score at least 8/10 |

**On gate quiz failure:** Specific micro-levels with errors are identified; targeted remediation required before re-attempt.

#### Main Level Advancement (e.g., CP to CE1)

| Criteria | Detail |
|----------|--------|
| Completion | All 10 sub-levels passed |
| Mastery score | At least 85% weighted average across all sub-levels |
| Level-up exam | 20 questions covering all sub-levels (at least 2 per sub-level), must score 16/20 (80%) |
| No weak spots | No single sub-level below 70% accuracy in the exam |
| Recency | Activity in each sub-level within the last 7 days (or complete a refresh quiz) |

### 5.5 Spaced Repetition for Review

Once a sub-level is passed, questions from it still appear occasionally to prevent skill decay:

| Days Since Mastery | Review Questions per Session |
|--------------------|-----------------------------|
| 1 | 2 |
| 3 | 1 |
| 7 | 1 |
| 14 | 1 |
| 30 | 1 |
| 60+ | 1 (monthly) |

**On incorrect answer during review:** The spacing resets to Day 1 for that specific sub-topic.

### 5.6 XP System

XP represents the child's total accumulated learning progress. It maps to a visible "player level" displayed on profiles and leaderboards.

**XP earning:**

| Source | XP Amount |
|--------|-----------|
| Correct answer (no hints) | 10 base + speed bonus (1-5) + difficulty multiplier (x1/x2/x3) |
| Correct answer (with hints) | Reduced proportionally (70% / 40% / 20%) |
| Combo streak bonus | +2 XP per consecutive correct (caps at +10) |
| Session completion | 20 XP flat (for finishing a full session) |
| Daily quest completion | 50 XP |
| Weekly challenge completion | 200 XP |
| Level-up exam passed | 500 XP |

**XP never decreases.** Wrong answers earn 0 XP but never subtract.

### 5.7 Visual Progression Indicators

**Progress bar per topic:** A horizontal bar showing current micro-level within the sub-level. Fills left to right with each micro-level passed.

**Main level map:** A visual "adventure map" showing the 10 sub-levels as waypoints on a path. Completed waypoints glow. The current waypoint pulses. Locked waypoints are dimmed but visible (showing what is coming).

**Overall progress:** A badge or emblem on the player's profile showing their main level (CP/CE1/CE2/CM1/CM2) with a visual ranking (bronze/silver/gold/platinum/diamond based on sub-level progress within the main level).

---

## 6. Economy & Rewards

### 6.1 Dual Currency System

The economy uses exactly two currencies to provide both constant reward flow and aspirational goals. Two is the maximum -- more would confuse young children.

| Currency | Name (FR) | Name (EN) | Purpose | Earn Method | Feel |
|----------|-----------|-----------|---------|-------------|------|
| **Coins** | Pieces d'or | Gold Coins | Frequent, everyday rewards | Every session, daily logins, quests | "Pocket money" -- constant trickle |
| **Gems** | Gemmes | Gems | Aspirational, special rewards | Level-ups, achievements, weekly challenges | "Birthday present" -- rare and exciting |

### 6.2 Earning Rates

#### Coins (Frequent Currency)

| Source | Amount | Frequency |
|--------|--------|-----------|
| Correct answer | 1-3 coins (scaled by difficulty) | Every question |
| Session completion | 10 coins (flat bonus for finishing) | Every session |
| Daily login | 5 coins (Day 1-6), 20 coins (Day 7 weekly bonus) | Daily |
| Daily quest completion | 15 coins | Daily |
| Streak milestone (7 days) | 25 coins | Weekly |
| Perfect session (100% accuracy) | 20 coin bonus | Per occurrence |

**Expected daily earning (active player):** 50-80 coins per day (2-3 sessions).

#### Gems (Aspirational Currency)

| Source | Amount | Frequency |
|--------|--------|-----------|
| Sub-level completion | 5 gems | ~Every 1-2 weeks |
| Main level advancement | 50 gems | ~Once per year |
| Weekly challenge completion | 10 gems | Weekly |
| Achievement unlocked (rare/epic) | 5-20 gems | Varies |
| Class competition winner | 15 gems | Monthly |
| Streak milestone (30 days) | 20 gems | Monthly |

**Expected weekly earning (active player):** 15-25 gems per week.

### 6.3 Spending (Sinks)

#### Coin Purchases

| Item | Cost | Category |
|------|------|----------|
| Common hat | 30 coins | Cosmetic |
| Common outfit | 50 coins | Cosmetic |
| Common accessory | 20 coins | Cosmetic |
| Power-up (single use) | 15 coins | Gameplay |
| Profile background (common) | 40 coins | Cosmetic |
| Emote (common) | 25 coins | Cosmetic |

#### Gem Purchases

| Item | Cost | Category |
|------|------|----------|
| Rare cosmetic item | 20-40 gems | Cosmetic |
| Epic cosmetic item | 60-100 gems | Cosmetic |
| Legendary cosmetic item | 150-250 gems | Cosmetic |
| Premium power-up pack (5x) | 30 gems | Gameplay |
| Avatar frame (rare+) | 40-80 gems | Cosmetic |
| Exclusive title | 50 gems | Cosmetic |

### 6.4 Anti-Inflation Design

| Mechanism | Detail |
|-----------|--------|
| Diminishing returns on easy content | Repeating already-mastered difficulty levels earns fewer coins |
| Daily earning cap | Soft cap of ~150 coins per day (after which coin rate drops to 50%) |
| Escalating prices | New seasonal items cost more than base items |
| Gem-gated premium items | Prevents coins from being the only currency needed |
| No coin-to-gem conversion | Currencies remain separate |
| Seasonal item rotation | Old items leave the shop, replaced by new ones at fresh prices |

---

## 7. Avatar & Collectibles System

### 7.1 Base Avatar

Every player starts with a customizable base avatar:

| Category | Options at Start | Unlockable |
|----------|-----------------|------------|
| Face shape | 5-6 | -- |
| Hair style | 10-12 (various textures/lengths) | -- |
| Skin tone | Diverse range (8-10) | -- |
| Eye style | 6-8 | -- |
| Basic outfit | 5-6 starter options | Many more via shop |

Base customization is **free and immediate** at account creation. The goal is that no child ever feels like a "default skin" (which carries negative social status in Roblox/Brawl Stars culture).

### 7.2 Cosmetic Categories

| Category | Examples | Primary Earn Method |
|----------|----------|---------------------|
| **Hats / Headwear** | Crowns, animal ears, helmets, wizard hats, space helmets | Achievement rewards, milestone unlocks |
| **Outfits** | Themed costumes (space, medieval, sports, animal, pixel) | Gem purchases, seasonal events |
| **Accessories** | Glasses, backpacks, wings, pets, scarves | Streak rewards, challenge completion |
| **Frames / Borders** | Profile frame decorations | Class/school competition rewards |
| **Emotes / Celebrations** | Victory dances, expressions, animations | Combo milestones, special events |
| **Titles** | "Maitre du Calcul", "Speed Demon", "Sigma Solver" | Achievement-based, non-purchasable |
| **Backgrounds** | Profile background themes | Seasonal events, gem purchases |

### 7.3 Rarity Tiers

| Rarity | Color | How to Obtain | Examples |
|--------|-------|---------------|----------|
| **Common** | Grey | Always available in coin shop | Basic hats, simple accessories |
| **Rare** | Blue | Weekly rewards, gem shop | Themed outfits, fun glasses |
| **Epic** | Purple | Monthly milestones, gem shop | Animated accessories, special pets |
| **Legendary** | Gold | Seasonal events, exceptional achievement | Unique skins, animated frames |
| **Mythic** | Red | One-time achievements only | "100-day streak" crown, "School champion" cape |

### 7.4 Themed Collections

Collections are groups of cosmetic items around a theme. Completing a collection (owning all items) unlocks a special bonus item.

| Collection | Theme | Inspiration | Copyright Safety |
|------------|-------|-------------|------------------|
| **Camera Crew** | Camera-headed robot characters | Skibidi Toilet culture | Original designs, no direct copy |
| **Pixel Legends** | 8-bit retro pixel art style | Minecraft/retro gaming | Generic pixel aesthetic |
| **Cosmic Explorer** | Space suits, planets, rockets | Space/sci-fi | Original designs |
| **Animal Squad** | Animal ears, tails, costumes | Universal kids appeal | Original animal characters |
| **Math Wizard** | Robes, wands, spell books | Fantasy/Harry Potter vibe | Generic wizard aesthetic |
| **Sport Stars** | Jerseys, equipment, medals | Sports culture | Generic sports items |
| **Dino World** | Dinosaur hats, scales, fossils | Persistent kids interest | Original dinosaur designs |
| **Ninja Academy** | Masks, headbands, throwing stars | Anime/ninja culture | Generic ninja aesthetic |

### 7.5 Seasonal / Limited Items

- **New themed items each school trimester** (fall, winter, spring)
- **Competition-exclusive rewards** that cannot be obtained any other way
- **Limited-time event cosmetics** (Semaine des Maths, holiday themes, Pi Day)
- Items display "Obtained: [date]" to create collector value
- **Never** remove items a child already owns
- Seasonal items rotate out of the shop but may return in future seasons

---

## 8. Power-ups / Jokers / Skills

### 8.1 Available Power-ups

| Power-up | Icon Concept | Effect | Duration |
|----------|-------------|--------|----------|
| **Temps Extra** (Time Extension) | Hourglass | +30 seconds added to the session timer | Instant |
| **Passe-Question** (Skip Question) | Forward arrow | Skip the current question with no penalty (no streak break, no wrong answer) | 1 question |
| **Double Points** | x2 badge | Next 3 correct answers earn double points and coins | 3 questions |
| **50/50** | Split circle | Remove 2 wrong answers in a multiple choice question, leaving 1 correct + 1 wrong | 1 MC question |
| **Indice Gratuit** (Free Hint) | Golden lightbulb | Use a Tier 1 hint without any scoring reduction | 1 question |

### 8.2 Earning and Purchasing Power-ups

| Method | Detail |
|--------|--------|
| Coin purchase | 15 coins each (single use) |
| Gem purchase | Pack of 5 for 30 gems (20% discount) |
| Daily reward | Occasional free power-up in daily login rewards |
| Achievement reward | Specific achievements grant power-ups |
| Weekly challenge | Completion may reward power-up packs |

### 8.3 Usage Limits Per Session

| Rule | Detail |
|------|--------|
| Maximum power-ups per session | 3 total (any combination) |
| Maximum of same type per session | 2 |
| Cannot stack | Double Points cannot be activated while already active |
| Passe-Question limit | Maximum 2 per session (prevents skipping everything) |
| 50/50 only on MC | Only activates on multiple choice questions |

### 8.4 Design Philosophy

Power-ups are a **fun bonus**, not a requirement. No question requires a power-up to answer. They provide:
- A sense of agency ("I choose when to use my advantage")
- A coin/gem sink to balance the economy
- A safety net for stressful moments (skip a hard question, get more time)
- An additional layer of strategy for older children

---

## 9. Social Features

### 9.1 Class Leaderboard

**Design: Windowed / Relative Leaderboard**

Each student sees only:
- Their own rank and score
- The 2 students directly above them
- The 2 students directly below them

**Students never see the full ranking or who is at the bottom.** This provides competitive motivation without exposing struggling students.

```
Example view for a student ranked #8:

  #6   TurboCalc     1,250 XP
  #7   StarMath      1,180 XP
  --------------------------------
  #8   YOU (NinjaNum) 1,120 XP   <-- highlighted
  --------------------------------
  #9   MathPanda     1,090 XP
  #10  CosmicBrain   1,040 XP
```

**Leaderboard resets weekly** (every Monday) to provide fresh competition and prevent discouragement from permanent rankings.

### 9.2 Multi-Metric Rankings

Instead of a single "points" leaderboard, the game rotates or displays multiple rankings so different students can excel:

| Metric | Name (FR) | What It Measures |
|--------|-----------|------------------|
| **Champion de la semaine** | Speed Champion | Highest total XP this week |
| **Serie en or** | Golden Streak | Longest current daily streak |
| **Progression eclair** | Most Improved | Biggest accuracy improvement this week |
| **Perseverance** | Persistence Star | Most questions attempted this week |
| **Sans faute** | Perfect Scorer | Most 100% accuracy sessions this week |

### 9.3 School Leaderboard

- Aggregate class scores into a single class score
- Classes compete against other classes within the school
- Individual performance contributes to collective score
- No individual student is singled out at the school level
- Updated every 30 seconds (SSE or polling)

### 9.4 Team / Class Challenges

**Cooperative class challenges:** "Can our class collectively solve 1,000 problems this week?"

| Feature | Detail |
|---------|--------|
| Team goals | Shared objectives with shared rewards |
| Team composition | Hidden from students; reshuffled weekly/monthly |
| Individual contribution | Private (only the student sees their own) |
| Reward | Everyone in the class receives the reward if the goal is met |
| Examples | "500 correct answers as a class", "Every student completes 3 sessions this week" |

### 9.5 Pre-Set Encouragement Messages

Students can send pre-set encouraging messages to classmates. **No free text is ever allowed** to prevent bullying and inappropriate content.

Available messages:
- "Bravo !" (Well done!)
- "Continue comme ca !" (Keep it up!)
- "Belle serie !" (Nice streak!)
- "Tu geres !" (You're crushing it!)
- "On peut le faire !" (We can do it!)

### 9.6 Bottom-Half Anonymization

**Teacher-configurable option:** Only the top 50% of names are displayed on class leaderboards. The bottom 50% shows "et 12 autres eleves" (and 12 other students). This protects struggling students from public comparison.

### 9.7 Achievements and Badges

Achievements are visible on the student's profile. Other students can see a classmate's badge collection, creating positive social proof.

| Category | Examples |
|----------|----------|
| **Milestones** | First perfect session, 100 questions answered, 1,000 questions answered |
| **Streaks** | 7-day streak, 30-day streak, 100-day streak |
| **Mastery** | Complete all CP addition, master all multiplication tables |
| **Speed** | Answer 10 questions in under 60 seconds |
| **Persistence** | Play for 5 consecutive weeks, complete 50 sessions |
| **Special** | Participate in school rally, complete seasonal challenge |

---

## 10. School / Class / Teacher Features

### 10.1 School Creation and Management

| Feature | Detail |
|---------|--------|
| School account | Created by a school administrator (email + password + 2FA) |
| School code | Unique identifier for the school |
| Class management | Admin can create/archive classes, assign teachers |
| Settings | Max classes, allowed grade levels, school-wide feature toggles |
| Data access | Admin sees aggregate school-level data only |

### 10.2 Class Creation and Join Codes

| Feature | Detail |
|---------|--------|
| Creation | Teacher creates a class from their dashboard |
| Join code | Auto-generated 6-character alphanumeric code (e.g., "MATH42") |
| Code display | Shown as a large-format card and QR code for classroom projection |
| Student limit | Configurable, default 35 students per class |
| Multiple classes | One teacher can manage multiple classes |
| Archiving | Classes can be archived at year-end (data preserved for reference) |

### 10.3 Teacher Dashboard

#### Class Progress Overview

- **Topic heatmap:** A grid showing all students (rows) vs. all topics (columns), color-coded by mastery level (red < 50%, yellow 50-70%, light green 70-85%, green 85%+)
- **Class averages:** Overall accuracy, average sessions per student, total questions answered
- **Trend indicators:** Improving, stable, or declining arrows per topic
- **Most common errors:** Aggregated error patterns across the class per topic
- **Activity distribution:** How many students played today, this week, this month

#### Individual Student View

- **Radar chart:** Topic mastery visualization across all subjects (spider/web chart)
- **Session history:** Dates, durations, scores (summary level, not individual answers)
- **Progression trend:** Line chart showing accuracy over time
- **Comparison to class average:** Student's position relative to class median (not named peers)
- **AI help usage:** Flag topics where the student uses hints frequently (may indicate difficulty)
- **Recommendations:** System-generated suggestions for focus areas

#### Teacher Controls

| Control | Detail |
|---------|--------|
| Leaderboard visibility | Toggle on/off per class; enable bottom-half anonymization |
| AI tutor | Enable/disable per class |
| Session limits | Set daily maximum session count or time per student |
| Game modes | Enable/disable specific modes (practice, challenge, speed) |
| Feature flags | Control availability of power-ups, social features |

### 10.4 Privacy: "Analytics Not Surveillance"

**Core principle:** Teachers see learning analytics, not surveillance data.

| Teachers CAN see | Teachers CANNOT see |
|------------------|---------------------|
| Topic mastery percentages | Individual answer-by-answer logs in real time |
| Session completion rates | What a student is doing right now |
| Accuracy trends over time | Screen recordings or screenshots |
| AI help usage frequency | Private chat or messages between students |
| Common error patterns (aggregated) | Exact questions a student got wrong today |
| Time spent per session (summary) | Minute-by-minute activity tracking |

---

## 11. AI Tutor System

### 11.1 When It Activates

The AI tutor is triggered in three contexts:

| Trigger | Context | Behavior |
|---------|---------|----------|
| **After wrong answer** | Post-question feedback screen | Offers a brief, step-by-step explanation of the concept |
| **On hint request** | Student taps the lightbulb icon | Provides the appropriate hint tier |
| **From concept library** | Student browses learning resources in the menu | Explains concepts with worked examples |

**The child never writes free text to the AI.** The help request is generated programmatically from the question data and the child's answer. The child only clicks a "Help me" button. This eliminates prompt injection risks and off-topic conversations.

### 11.2 Age-Appropriate Explanations

The AI tutor adapts its language by grade level:

| Level | Vocabulary | Sentence Length | Tone |
|-------|-----------|----------------|------|
| CP | Extremely simple, concrete | Max 10 words | Warm, encouraging, uses object references ("Imagine 7 pommes...") |
| CE1 | Simple, some math vocabulary | Max 12 words | Encouraging, introduces step-by-step thinking |
| CE2 | Moderate, math terms used | Max 15 words | Supportive, references known facts ("Tu sais que 6 x 5 = 30...") |
| CM1 | Standard, all math terms | Max 15 words | Guiding, encourages strategy ("Decompose le probleme...") |
| CM2 | Full math vocabulary | Max 15 words | Coaching, builds autonomy ("Quelle methode utiliserais-tu ?") |

### 11.3 Visual Aids Library

The AI tutor can reference and display pre-built visual aids:

| Visual Aid | Used For | Levels |
|------------|----------|--------|
| **Number line** | Addition, subtraction, comparison, fractions, decimals | All |
| **Base-10 blocks** | Place value, carrying, borrowing (animated) | CP-CE2 |
| **Array / Grid** | Multiplication, area | CE1-CM2 |
| **Pie / Bar charts** | Fractions | CE2-CM2 |
| **Balance scale** | Equations and equality | CM1-CM2 |
| **Clock face** | Time-related questions | CE1-CE2 |
| **Money images** | Decimal/money questions | CE1-CM1 |
| **Column layout** | Written addition, subtraction, multiplication | CE1-CM2 |

### 11.4 Safety Guardrails

| Guardrail | Implementation |
|-----------|----------------|
| **Topic restriction** | System prompt strictly limits responses to math only |
| **No personal questions** | AI never asks for name, age, location, school |
| **No external links** | AI never provides URLs or references to external content |
| **No negative reinforcement** | AI never uses fear, shame, or negative language |
| **Output filtering** | Every response passes through a content filter before display |
| **Length limit** | Maximum 150 words per response |
| **Keyword blocklist** | Maintained blocklist of disallowed terms |
| **Stateless** | No conversation history; each call is independent |
| **Kill switch** | AI tutor can be disabled per-class or globally via feature flag |
| **Fallback** | If AI response fails any filter, pre-written explanation is shown instead |

### 11.5 Post-Question Explanations

After every wrong answer (whether or not hints were used), a brief explanation screen appears:
- Shows the correct answer
- Shows a 1-2 sentence explanation of the method
- Optionally shows an animated mini-lesson (5-10 seconds)
- A "J'ai compris !" (I understand!) button dismisses it

### 11.6 Concept Library

Accessible from the main menu, organized by topic and level:

Each concept page contains:
- A simple explanation in child-friendly language (French or English based on locale)
- A visual diagram or animation
- 2-3 worked examples with step-by-step solutions
- A "Pratique" (Practice) button that launches questions on that specific concept

---

## 12. UX/UI Design Principles

### 12.1 Mobile-First Design

| Principle | Implementation |
|-----------|---------------|
| Primary target | 320px width (phone), scaling up to tablet and desktop |
| Breakpoints | 320px (phone), 768px (tablet portrait), 1024px (tablet landscape/desktop) |
| Orientation | Both portrait and landscape supported; games work in both |
| Touch-first | All interactions designed for touch; mouse/keyboard as secondary |

### 12.2 Touch Targets

| Element | Minimum Size | Rationale |
|---------|-------------|-----------|
| Answer buttons | 56px height, full width | Children's motor skills require large targets |
| General interactive elements | 48x48px | WCAG 2.5.8 requires 24x24px; we double for children |
| Spacing between elements | 12px minimum | Prevents accidental taps on adjacent elements |
| No hover-dependent interactions | N/A | Touch devices have no hover state |

### 12.3 Color and Visual Design

| Principle | Detail |
|-----------|--------|
| Bright, engaging palette | Primary colors with high saturation for game elements |
| Accessibility | All text meets WCAG AA contrast ratios (4.5:1 minimum) |
| Color-blind safe | Never use color alone to convey information; always pair with icons/shapes |
| Distinct answer buttons | Each MC option uses a different pastel background |
| Correct answer | Green flash + star animation + satisfying "ding" sound |
| Wrong answer | Gentle red pulse (not alarming) + soft sound + immediate explanation |
| Combo/streak | Escalating visual effects: x2 (sparkle), x3 (glow), x5 (fireworks), x10 (full-screen celebration) |
| Level-up | Full-screen animation with character celebration, confetti, fanfare |

### 12.4 Typography

| Context | Font Size | Rationale |
|---------|-----------|-----------|
| Question text | 20-24pt | Must be instantly readable |
| Answer buttons | 24pt+ | Large enough for quick recognition |
| Numpad digits | 28pt+ | Comfortable for small fingers |
| Display area (typed number) | 36pt+ | Clear feedback on input |
| Body text (menus, descriptions) | 16-18pt | Readable on small screens |
| Smallest text (labels, metadata) | 14pt minimum | Never smaller |
| CP-specific adjustment | +2pt to all sizes | Larger text for youngest readers |

### 12.5 Sound Design

| Event | Sound Character | Purpose |
|-------|----------------|---------|
| Correct answer | Satisfying "ding" or chime (bright, short) | Positive reinforcement |
| Wrong answer | Gentle, soft tone (not alarming, not punishing) | Feedback without anxiety |
| Combo increment | Rising pitch sequence | Building excitement |
| Streak break | Soft "whoosh" (not a failure buzzer) | Neutral notification |
| Level up | Celebratory fanfare (3-5 seconds) | Major achievement moment |
| Coin earned | Light "coin clink" | Satisfying micro-reward |
| Gem earned | Magical shimmer sound | Special reward |
| Timer warning (1 min left) | Subtle tone change in background | Awareness without anxiety |
| Session end | Gentle conclusion melody | Natural ending |

**Audio rules:**
- All sound is optional. Mute button always accessible.
- Background music is off by default in classroom mode.
- Game is fully functional without any sound.
- Sound effects are short (< 1 second for most events).

### 12.6 No Anxiety-Inducing Elements

| Anti-Anxiety Rule | Implementation |
|-------------------|---------------|
| **No visible countdown numbers** | The session timer is a progress bar, not a clock with seconds ticking |
| **No per-question visible timer** | Time tracking is silent; nudges appear gently when time is up |
| **Warm timer colors** | Progress bar: green -> yellow (1 min left) -> orange (30s left). Never red. |
| **No ticking sound** | No audible clock tick |
| **No "time's up!" alarm** | Session ends with a gentle animation, not a buzzer |
| **No negative scores** | Score is always >= 0. Displayed as "12 sur 15" not "3 wrong" |
| **No skull/death imagery** | Wrong answers use gentle visual feedback, never failure iconography |
| **Grace period** | 15 extra seconds to finish current question when session timer expires |

### 12.7 Animations

| Animation | Style | Duration |
|-----------|-------|----------|
| Correct answer celebration | Star burst from the answer, subtle screen flash | 0.5s |
| Wrong answer feedback | Gentle shake of the answer area, soft red pulse | 0.3s |
| Combo counter | Number scales up with glow, particle effect | 0.4s |
| Level-up | Full screen: character celebrates, confetti rains, badge appears | 3-5s |
| Coin/gem collection | Currency icon flies from source to wallet counter | 0.6s |
| Question transition | Card slide animation (old out left, new in right) | 0.3s |
| Avatar customization | Item snaps onto avatar with sparkle effect | 0.3s |
| Leaderboard rank change | Smooth slide up/down to new position | 0.5s |

All animations respect `prefers-reduced-motion` media query for accessibility.

---

## 13. Engagement Mechanics

### 13.1 Daily Login Rewards

A simple escalating daily reward:

| Day | Reward |
|-----|--------|
| Day 1 | 5 coins |
| Day 2 | 5 coins |
| Day 3 | 10 coins |
| Day 4 | 10 coins |
| Day 5 | 10 coins + 1 random power-up |
| Day 6 | 15 coins |
| Day 7 | 20 coins + 5 gems + rare cosmetic chance |

The cycle resets after Day 7 and repeats. Missing a day resets the cycle to Day 1 (but does not affect the daily streak -- those are separate mechanics).

### 13.2 Daily Quests

One daily quest assigned each day, requiring one focused activity:

**Example quests:**
- "Resous 10 problemes de multiplication" (Solve 10 multiplication problems)
- "Termine une session avec 80% de precision" (Complete a session with 80% accuracy)
- "Reponds a 5 problemes de geometrie" (Answer 5 geometry problems)
- "Fais une serie de 5 bonnes reponses" (Get a streak of 5 correct answers)

**Reward:** 15 coins + 50 XP.

### 13.3 Weekly Challenges

Unlocks every Monday. Higher difficulty than normal play. Themed around specific topics or skills.

**Example challenges:**
- "La semaine des fractions" -- answer 50 fraction questions with 75%+ accuracy
- "Defi vitesse" -- complete 5 sessions with average answer time under 10 seconds
- "Zero indice" -- complete 3 sessions without using any hints

**Reward:** 10 gems + rare cosmetic item + 200 XP.

### 13.4 Monthly Seasons

Each month (or school trimester) brings a new **season** with:
- A visual theme (space, underwater, jungle, pixel, winter wonderland, etc.)
- New cosmetic items in the shop tied to the theme
- A season-long challenge track (complete objectives to earn season-exclusive rewards)
- New background music and visual effects matching the theme

### 13.5 Streak System

| Feature | Detail |
|---------|--------|
| Daily streak | Login and complete at least 1 session per day |
| Visual indicator | Fire icon with growing flame, prominently displayed |
| Streak freeze | 1 free freeze per week (earned through activity, not purchased). Protects streak if a day is missed. |
| Streak milestones | Special rewards at 7, 14, 30, 60, 100 days |
| In-session combo | Consecutive correct answers within a session (x2, x3, x4...) with escalating visual effects |
| Max combo record | Personal best displayed; beating it triggers special celebration |
| Weekly streak | Complete sessions on at least 4 of 7 days = weekly reward |

**Streak freeze reduces churn by approximately 21% (Duolingo data).** A child who misses a Saturday because of a family outing should not lose their 20-day streak.

### 13.6 Achievement Badges

Achievements are organized by category and displayed on the player's profile:

| Category | Badge | Requirement |
|----------|-------|-------------|
| **Getting Started** | "Premier Pas" | Complete first session |
| **Getting Started** | "Mon Avatar" | Customize avatar for the first time |
| **Streaks** | "Flamme de Bronze" | 7-day streak |
| **Streaks** | "Flamme d'Argent" | 30-day streak |
| **Streaks** | "Flamme d'Or" | 100-day streak |
| **Mastery** | "Roi de l'Addition" | Complete all addition sub-levels for current level |
| **Mastery** | "Maitre des Tables" | Know all multiplication tables (x2-x9) |
| **Speed** | "Eclair" | Answer 10 questions in under 60 seconds in one session |
| **Accuracy** | "Sans Faute" | Complete a session with 100% accuracy |
| **Accuracy** | "Triple Sans Faute" | Three perfect sessions in a row |
| **Persistence** | "Marathonien" | Complete 100 sessions total |
| **Social** | "Esprit d'equipe" | Participate in 5 class challenges |
| **Special** | "Chasseur de saison" | Collect all items from a seasonal collection |

### 13.7 "Star of the Week"

Each Monday, the class sees a "Star of the Week" recognition for the student who showed the most improvement (not the highest score). This ensures the recognition goes to effort, not innate ability.

**Criteria:** Biggest accuracy improvement compared to the previous week, weighted by number of sessions completed.

### 13.8 Session Time Awareness

| Trigger | Message |
|---------|---------|
| After 3 consecutive sessions (15 min) | "C'est l'heure de faire une pause ! Reviens plus tard pour continuer tes progres." |
| After 6 sessions (30 min) | Stronger suggestion: "Tu as beaucoup travaille ! Fais une pause et reviens demain." |
| After 45 min total | Gentle break screen (not a block -- teachers/parents can set hard limits separately) |

---

## 14. Anti-Frustration Design

### 14.1 Core Principle: Fail Forward

Every failure teaches something and never feels punishing. The absence of reward is sufficient feedback -- explicit punishment is never used.

### 14.2 Asymmetric Scoring

Inspired by Brawl Stars' trophy system, children always feel net forward progress:

| Event | Points Impact | Streak Impact |
|-------|--------------|---------------|
| Correct answer | +10 base + bonuses | Combo increments |
| Wrong answer | 0 (never subtract) | Combo resets to 0 |
| Hint used | Reduced points (but always > 0) | No streak impact |
| Session completed | +20 XP flat bonus | Daily streak increments |
| Skipped question | 0 (no penalty) | No streak impact |

**Even a player with 40% accuracy will make steady progress.** They earn fewer coins and XP per session but they never go backward.

### 14.3 Comeback Bonuses

After a losing streak (3+ wrong answers in a row), the next correct answer earns a bonus:

**"Comeback ! +5 bonus"** -- with a special animation and encouraging message. This emotional recovery moment is critical for maintaining engagement.

### 14.4 Adaptive Difficulty Adjustment

The system continuously adjusts difficulty based on real-time performance:

| Accuracy (Rolling 20 Questions) | System Response | Visual Feedback |
|--------------------------------|-----------------|-----------------|
| Above 85% for 10+ questions | Increase difficulty by 1 micro-level | "Tu es en feu ! Des problemes plus durs arrivent !" |
| 60-85% | Maintain current difficulty (optimal zone) | Normal gameplay |
| 40-60% | Mix in 30% easier problems to rebuild confidence | Encouraging messages |
| Below 40% for 10+ questions | Decrease difficulty by 1 micro-level + show mini-tutorial | "On va s'entrainer ensemble !" |

### 14.5 Three-Strike Safety Net

After 3 consecutive wrong answers on the same concept:

| Strike | Response |
|--------|----------|
| 1st wrong | Show correct answer with brief explanation |
| 2nd wrong | Show a simpler version of the same problem type with a hint |
| 3rd wrong | Switch to a different, easier topic. Return to the difficult concept later in the session. |

This prevents a child from spiraling into frustration on a concept they are not ready for.

### 14.6 Positive Statistics Framing

| Instead of... | Show... |
|---------------|---------|
| "You got 3 wrong" | "Tu as eu 7 bonnes reponses sur 10 !" |
| "62% accuracy" | "12 sur 15 -- bien joue !" |
| "Level failed" | "Presque ! Encore un peu d'entrainement et tu y es." |
| "Score: 0" | Never happens (minimum score is always > 0 for any completed session) |
| Declining graph | Show only "personal best" comparisons, not declining trends |

### 14.7 Multiple Paths to Success

If a child is stuck on multiplication, they can still:
- Earn coins and XP through addition and subtraction
- Advance in geometry and measurement topics
- Complete daily quests focused on their stronger areas
- Customize their avatar and earn achievements

**No child should ever feel like the game has "nothing to offer" because of one difficult topic.**

### 14.8 Practice Mode

Available from the menu at any time:
- Unscored practice on any unlocked topic
- No impact on stats, streaks, or progression
- Full hint system available
- "I just want to practice" without performance pressure

### 14.9 Encouraging Messages on Wrong Answers

The game rotates through a bank of encouraging messages after wrong answers:

**French:**
- "Pas tout a fait, mais tu apprends !"
- "Bonne tentative ! La reponse etait {answer}."
- "C'est en se trompant qu'on apprend !"
- "Presque ! Essaie encore la prochaine fois."
- "Continue, tu progresses !"

**English:**
- "Not quite, but you're learning!"
- "Good try! The answer was {answer}."
- "Mistakes help us learn!"
- "So close! Try again next time."
- "Keep going, you're making progress!"

---

## 15. Admin Dashboard

The admin dashboard is a web-based back-office for **platform administrators** -- distinct from the teacher dashboard (Section 10). Teachers manage their own classes and students; platform admins manage the entire system: all schools, all content, all economy parameters, and platform health.

### 15.1 Player Management

| Feature | Detail |
|---------|--------|
| **Search and filter** | Find players by username, level, school, class, or last activity date. Full-text search with auto-complete. |
| **View player profiles** | Inspect any player's stats, progression state, inventory, game history, and AI tutor usage. |
| **Suspend / unsuspend players** | Temporarily block a player from accessing the platform (e.g., for inappropriate usernames or abusive behavior). Suspended players see a message directing them to their teacher. |
| **Reset player progress** | Reset a player's progression data (with a confirmation dialog and mandatory reason field). Useful for test accounts or exceptional cases. |
| **Bulk operations** | Select multiple players and apply batch actions: mass level adjustment, mass suspension, mass progress reset. All bulk operations require confirmation and are logged in the audit trail. |

### 15.2 School & Class Management

| Feature | Detail |
|---------|--------|
| **Create, edit, delete schools** | Full CRUD for school entities. Deletion requires confirmation and cascades to archiving (not hard-deleting) associated classes and players. |
| **View all classes per school** | List classes with student count, teacher assignment, activity level, and creation date. |
| **Create, edit, delete classes** | Full CRUD for classes within a school. |
| **Generate / regenerate join codes** | Issue new join codes for a class (invalidating the previous code). Useful if a code is leaked. |
| **Assign teachers to classes** | Link a teacher account to a class. One teacher can have multiple classes; one class has one primary teacher. |
| **View school/class statistics** | Aggregate stats per school and per class: active players, sessions this week, average accuracy, engagement trends. |

### 15.3 Content & Level Management

| Feature | Detail |
|---------|--------|
| **View and adjust level parameters** | Inspect and modify number ranges, difficulty curves per sub-level and micro-level. Changes take effect for all new sessions. |
| **Add / edit / disable question templates** | Create new question templates, modify existing ones, or disable templates without deleting them (preserving historical data). |
| **Preview questions** | Generate and preview sample questions at any difficulty level, topic, and question type. Useful for QA and content review. |
| **Adjust topic weights per sub-level** | Modify the proportion of questions allocated to each topic within a sub-level. |
| **A/B testing framework** | Define experiments for difficulty tuning: split players into groups, assign different difficulty parameters, and compare outcomes (accuracy, engagement, advancement rate). |

### 15.4 Economy & Rewards Management

| Feature | Detail |
|---------|--------|
| **Adjust coin/gem earning rates** | Modify earning rates for all coin and gem sources (correct answers, session completion, streaks, challenges). Changes apply globally or per level. |
| **Manage avatar catalog** | Add new cosmetic items, edit existing ones (name, description, price, rarity tier), enable/disable items, and set rarity. |
| **Manage power-up catalog** | Adjust power-up pricing, availability, and per-session usage limits. |
| **Create / schedule seasonal items** | Create time-limited items with start/end dates. Schedule items to appear in the shop during specific seasons or events. |
| **View economy health metrics** | Dashboard showing: total currency in circulation (coins and gems), spending patterns by item category, earning-to-spending ratio, inflation indicators, and top-purchased items. |

### 15.5 Game Rules & Settings

| Feature | Detail |
|---------|--------|
| **Global scoring rules** | Configure points per correct answer, combo multipliers, difficulty multipliers, session completion bonuses, and hint scoring penalties. |
| **Session duration settings** | Adjust the default 5-minute session duration globally or per level. Configure grace period length. |
| **Progression thresholds** | Modify accuracy thresholds for micro-level advancement (default 80%), sub-level gate quiz requirements, and main level exam criteria. |
| **Daily / weekly challenge configuration** | Create and schedule daily quests and weekly challenges. Set reward amounts, difficulty parameters, and theme. |
| **Season management** | Create seasons with names, themes, start/end dates, and reward tracks. Define seasonal cosmetic collections and challenge tracks. |

### 15.6 Analytics & Monitoring

| Feature | Detail |
|---------|--------|
| **Platform-wide stats** | DAU, MAU, retention rates (D1, D7, D30), session counts, average session duration, and engagement trends over time. |
| **Learning outcomes dashboard** | Mastery rates broken down by level, topic, school, and class. Identify topics where students struggle platform-wide. |
| **AI tutor usage and cost monitoring** | Track AI help request volume, cache hit rates, per-model costs, average latency, and safety filter rejection rates. |
| **Content effectiveness metrics** | Compare intended question difficulty vs. actual measured difficulty. Track skip rates, hint usage rates, and time-per-question by template. Identify poorly calibrated questions. |
| **Error and incident monitoring** | Surface Sentry errors, API error rates, offline sync failures, and service health status. Link to detailed incident logs. |

### 15.7 Moderation

| Feature | Detail |
|---------|--------|
| **Username review queue** | Flag usernames that bypass the profanity filter or are reported by teachers. Admins can approve, reject (force rename), or suspend the player. |
| **Reported content / behavior queue** | Review reports submitted by teachers about player behavior. Track report status: open, under review, resolved, dismissed. |
| **Automated moderation rules** | Configure rules for automatic flagging: regex patterns for usernames, thresholds for suspicious activity (e.g., impossibly high scores), and rate-limit triggers. |

### 15.8 System Configuration

| Feature | Detail |
|---------|--------|
| **Feature flags management** | Toggle features on/off globally or per school/class: AI tutor, leaderboards, power-ups, social features, seasonal events. |
| **AI tutor settings** | Select AI model (Gemini / GPT-4o Mini), adjust system prompt parameters, set per-student and global cost limits, and activate the kill switch to fall back to pre-written explanations. |
| **Maintenance mode toggle** | Enable a maintenance page that blocks all player access while allowing admin access. Configurable maintenance message. |
| **i18n management** | Review and edit translation strings. Flag missing or outdated translations. Preview UI in any locale. |
| **Push / notification management** | Manage teacher email digest templates and schedules. Configure in-app announcement banners (e.g., "New season starting Monday!"). |

---

## Appendix A: Distractor Strategy Matrix

| Topic | Primary Strategy | Secondary Strategy | Tertiary Strategy |
|-------|-----------------|-------------------|-------------------|
| Addition (no carry) | off_by_one | wrong_operation (subtraction) | random_nearby |
| Addition (with carry) | forget_carry | off_by_one | digit_swap |
| Subtraction (no borrow) | off_by_one | wrong_operation (addition) | random_nearby |
| Subtraction (with borrow) | forget_borrow | off_by_one | digit_swap |
| Multiplication | wrong_table_entry | off_by_product | partial_product |
| Division | wrong_quotient | remainder_confusion | inverse_operation |
| Fractions (compare) | numerator_only | wrong_denominator | invert_comparison |
| Fractions (operations) | wrong_denominator | numerator_only | forget_simplify |
| Decimals | decimal_shift | ignore_decimal | wrong_place_value |
| Proportionality | additive_instead_of_multiplicative | wrong_ratio | magnitude_error |

## Appendix B: Progression Thresholds Summary

| Transition | Min Questions | Accuracy Required | Special Condition |
|------------|--------------|-------------------|-------------------|
| Micro-level -> next | 8 | 80% (rolling 10) | Max 2 consecutive errors |
| Sub-level -> next | All 10 micros | 85% weighted avg | Gate quiz: 8/10 |
| Main level -> next | All 10 subs | 85% weighted avg | Level exam: 16/20, no sub below 70% |
| Topic review trigger | N/A | Below 70% on last 20 | 2x question allocation |
| Hint-assisted question | N/A | 50% weight | If 2+ hints used |

## Appendix C: Spaced Repetition Schedule

| Days Since Mastery | Review Questions per Session | Reset Condition |
|--------------------|-----------------------------|-----------------|
| 1 | 2 | Any incorrect answer |
| 3 | 1 | Any incorrect answer |
| 7 | 1 | Any incorrect answer |
| 14 | 1 | Any incorrect answer |
| 30 | 1 | Any incorrect answer |
| 60+ | 1 (monthly) | Any incorrect answer |

## Appendix D: Curriculum Alignment Reference

### Number Range Progression (French vs. UK)

| Age | French Level | French Range | UK Level | UK Range |
|-----|-------------|-------------|----------|----------|
| 5-6 | -- | -- | Year 1 | 0-100 |
| 6 | CP | 0-100 | -- | -- |
| 7 | CE1 | 0-999 | Year 2 | 0-100 |
| 8 | CE2 | 0-10,000 | Year 3 | 0-1,000 |
| 9 | CM1 | 0-999,999 | Year 4 | 0-10,000+ |
| 10 | CM2 | 0-1,000,000,000 | Year 5 | 0-1,000,000 |

### Multiplication Tables Progression

| Age | French Level | Tables Expected | UK Level | Tables Expected |
|-----|-------------|----------------|----------|----------------|
| 6 | CP | Doubles only | Year 1 | Counting in 2s, 5s, 10s |
| 7 | CE1 | x2, x3, x4, x5 | Year 2 | x2, x5, x10 |
| 8 | CE2 | x2 through x9 (by heart) | Year 3 | Add x3, x4, x8 |
| 9 | CM1 | x2-x9 fluent | Year 4 | ALL to 12x12 (statutory test) |
| 10 | CM2 | x2-x9 maintained | Year 5 | 12x12 maintained |

### Key Curriculum Differences to Account For

**France has, UK does not:** Probability and randomness (CM1-CM2), algorithmic thinking (CM1-CM2), numbers up to 1 billion (CM2), ban on conversion tables.

**UK has, France does not:** Percentages (Year 5-6), ratio and proportion (Year 6), algebra as a domain (Year 6), coordinates and 4-quadrant work (Year 4-6), times tables to 12, imperial units (Year 5).

The game's English-language mode adapts content to UK curriculum expectations where they differ.

## Appendix E: What We Do NOT Do

These are explicit design anti-patterns that the team must avoid:

| Anti-Pattern | Why It Is Harmful | Our Alternative |
|--------------|-------------------|-----------------|
| **Pay-to-win** | Creates social exclusion, undermines trust | All gameplay content is free; cosmetic-only premium |
| **Ads to children** | Exploitative, breaks trust, regulated | Completely ad-free, no tracking pixels |
| **Loot boxes / gacha** | Exploitative gambling mechanics, increasingly regulated | Transparent, earned rewards only |
| **Free-text chat** | Enables bullying, inappropriate content | Pre-set messages only |
| **Public shaming** | Displaying "worst performers" damages self-esteem | Windowed leaderboards, bottom-half anonymization |
| **Mandatory social features** | Some children are uncomfortable with competition | All social features opt-in or teacher-controlled |
| **Dark patterns** | Artificial urgency, guilt-tripping | No "your pet is sad", no deceptive notifications |
| **Subtracting points** | Creates anxiety, discourages risk-taking | 0 points for wrong answers, never negative |
| **Visible countdown timers** | Causes anxiety in young children | Silent timers with gentle visual indicators |
| **Math as a gate to fun** | Children perceive math as punishment (Prodigy problem) | Math IS the game |

---

*Document version: 1.0*
*Last updated: 2026-02-12*
*Status: Game Design Specification -- ready for team review*
*Sources: research-curriculum.md, research-gamification.md, research-questions.md, research-technical.md*
