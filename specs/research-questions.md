# Question & Exercise System Design
## Children's Math Educational Game -- French Primary School (CP through CM2, ages 6-11)

> This document covers question types, generation strategies, difficulty calibration,
> topic/category taxonomy, progression requirements, time management, and the
> help/tutor system.

---

## Table of Contents

1. [Question Types and UX](#1-question-types-and-ux)
2. [Question Generation Strategy](#2-question-generation-strategy)
3. [Difficulty Calibration Within Levels](#3-difficulty-calibration-within-levels)
4. [Topic / Category System](#4-topic--category-system)
5. [Progression Requirements](#5-progression-requirements)
6. [Time Management](#6-time-management)
7. [Help / Tutor System](#7-help--tutor-system)

---

## 1. Question Types and UX

### 1.1 Multiple Choice (QCM)

**Number of options:** 4 choices (1 correct + 3 distractors).
- For CP (age 6-7): may reduce to 3 choices to lower cognitive load.
- For CM1/CM2 (ages 9-11): always 4 choices.

**Layout:**
- Options displayed as large, tappable buttons arranged in a 2x2 grid.
- Each button shows the answer in large, clear font (minimum 24pt equivalent).
- Buttons use distinct pastel background colours so children can differentiate at a glance.
- On selection, the chosen button highlights. Confirmation button ("Valider") appears to prevent accidental taps.

**Distractor Generation Strategy (detailed in Section 2):**

| Distractor Type | Description | Example (for 7 + 5 = 12) |
|---|---|---|
| Off-by-one | Correct answer +/- 1 | 11 or 13 |
| Wrong operation | Result of a different operation | 2 (subtraction) or 35 (multiplication) |
| Common procedural error | Forget carry, digit swap | 11 (forgot the carry in mental addition) |
| Magnitude error | Wrong place value | 102 (misplaced carry) |
| Reversal error | Swap operand digits | Answer to 5 + 7 presented differently if applicable |

Rules for distractors:
- All distractors must be positive integers (or positive decimals for CM1/CM2).
- No duplicate values among the 4 choices.
- No distractor should be obviously absurd (e.g., negative number for CP-level addition).
- At least one distractor should be "close" to the correct answer to prevent guessing by elimination.
- Distractors are shuffled randomly each time.

---

### 1.2 Fill-in-the-Blank

**Presentation:**
The equation is displayed with one element replaced by a highlighted blank box:
```
6  x  ___  =  30
```

The blank has a blinking cursor and a coloured border to draw attention.

**Where the blank can appear:**
- Result position: `6 x 5 = ___`
- Operand position: `6 x ___ = 30`
- Operator position (CM1+): `6 ___ 5 = 30`

**Input method:** Kid-friendly numpad (see Section 1.3).

**Validation:** Child taps "Valider" to submit. The system checks the entered value against the expected answer. If the answer is a decimal, a decimal point key is available on the numpad.

---

### 1.3 Free Input (Direct Answer Entry)

**Kid-Friendly Numpad Design:**

```
+-------------------------------------------+
|                                            |
|    [ display area showing typed number ]   |
|                                            |
+-------------------------------------------+
|           |           |           |
|     1     |     2     |     3     |
|           |           |           |
+-----------+-----------+-----------+
|           |           |           |
|     4     |     5     |     6     |
|           |           |           |
+-----------+-----------+-----------+
|           |           |           |
|     7     |     8     |     9     |
|           |           |           |
+-----------+-----------+-----------+
|           |           |           |
|    [,]    |     0     |    [<x]   |
|           |           |           |
+-----------+-----------+-----------+
|                                   |
|           [ Valider ]             |
|                                   |
+-----------------------------------+
```

**Design principles:**
- Buttons are at least 56x56dp (touch target) with 8dp gaps.
- Font size: 28pt minimum for digits.
- The decimal separator key `[,]` (comma, French convention) only appears for CM1+ levels where decimals are in scope. For CP-CE2, it is hidden.
- The backspace key `[<x]` allows correction of the last digit.
- The display area shows the number being typed with a large clear font (36pt+).
- The "Valider" (Validate) button is green and wide, placed at the bottom.
- An optional negative sign key `[-]` appears only for CM2 if signed numbers are introduced (rare in primary, but available for extension).
- For fraction entry (CE2+): A special fraction input mode is triggered where two fields are shown (numerator / denominator) with a horizontal bar between them. The child taps the top or bottom field and uses the same numpad.

**Fraction Input Layout:**
```
+-------------------+
|    [ numerator ]  |
|   _____________   |
|  [ denominator ]  |
+-------------------+
```

---

### 1.4 Word Problems

**Structure:**
Each word problem follows a pattern:
1. **Context sentence** (1-2 sentences setting the scene)
2. **Action sentence** (what happens)
3. **Question** (what to find)

**Age-Appropriate Design:**

| Level | Complexity | Example |
|---|---|---|
| CP | 1 operation, numbers under 20 | "Léo a 8 billes. Il en donne 3 à Mia. Combien de billes a-t-il maintenant ?" |
| CE1 | 1-2 operations, numbers under 100 | "Emma a 45 images. Son frère lui en donne 27. Combien d'images a-t-elle en tout ?" |
| CE2 | 2 operations, multiplication | "Un paquet contient 6 gateaux. Maman achete 4 paquets. Combien de gateaux y a-t-il en tout ?" |
| CM1 | Multi-step, fractions, decimals | "Un ruban mesure 2,5 m. Julie en coupe 1,3 m. Quelle longueur reste-t-il ?" |
| CM2 | Multi-step, proportionality | "Pour 4 personnes il faut 200 g de farine. Combien de farine faut-il pour 10 personnes ?" |

**Character pool:**
- Use a rotating cast of ~20 French first names (gender-balanced): Léo, Emma, Lucas, Chloé, Louis, Marie, Hugo, Jade, Noah, Lina, Adam, Alice, Jules, Inès, Raphaël, Manon, Arthur, Camille, Nathan, Sarah.
- Use relatable contexts: school, playground, bakery, market, birthday party, garden, sports, cooking, travel, animals.

**UX for word problems:**
- The story text appears at the top with an illustration or icon representing the context (e.g., a basket of apples icon for a market problem).
- Key numbers in the text are subtly highlighted (bold or coloured) to help younger children identify the data.
- The answer input area is below the text, using either multiple choice (CP-CE1) or free input (CE2+).
- An optional "Relire" (Re-read) button reads the problem aloud (text-to-speech) for early readers.
- Word problems always have a single, unambiguous numerical answer.

---

### 1.5 Ordering / Sorting

**Variants:**

**A. Order numbers (ascending / descending):**
- 4 to 6 numbers displayed as draggable cards.
- Child drags cards into labelled slots from "plus petit" to "plus grand" (or vice versa).
- Visual: numbered cards on the left, empty slots with arrows (ascending) on the right.

**B. Order the steps of a calculation:**
- For CM1+: Given a multi-step expression, arrange sub-calculations in the correct order.
- E.g., for `3 + 4 x 2`, arrange: "4 x 2 = 8" then "3 + 8 = 11".

**C. Place numbers on a number line:**
- A number line with marked endpoints. Child drags number tokens to the correct positions.
- Good for fractions (CE2+) and decimals (CM1+).

**UX:**
- Drag-and-drop with large handles (minimum 48dp touch targets).
- Snap-to-slot animation when the card is close to a slot.
- Visual feedback: green glow on correct placement, gentle shake on incorrect.
- "Valider" button to check the full arrangement (no partial checking).

---

### 1.6 True / False

**Presentation:**
- A mathematical statement is displayed prominently in the centre.
- Two large buttons below: "VRAI" (green) and "FAUX" (red).
- Examples:
  - `12 + 5 = 18` (FAUX)
  - `3 x 4 = 12` (VRAI)
  - `1/2 > 1/3` (VRAI)

**Design:**
- Quick-fire format: well suited for timed challenges and warm-up rounds.
- Aim for 3-4 seconds per question.
- Statements should be carefully crafted so the error is a plausible mistake (not obviously wrong).
- For "FAUX" statements, the displayed wrong answer should be a common error (e.g., off-by-one, wrong operation result).

---

### 1.7 Matching (Association)

**Variants:**

**A. Match equation to answer:**
- Left column: 4-6 equations. Right column: 4-6 answers (shuffled).
- Child draws lines or drags answers to equations.

**B. Match equivalent representations:**
- Match a fraction to its visual representation (pie chart).
- Match a number in digits to its written form (CE1+).
- Match a measurement to its converted equivalent (e.g., 100 cm = 1 m).

**UX:**
- Two columns layout.
- Child taps an item on the left, then taps the matching item on the right. A line connects them.
- Alternatively: drag-and-drop from right column onto left column items.
- Completed pairs lock in place with a green checkmark.
- "Valider" button checks all pairs at once.
- Incorrect pairs are shown in red with a gentle animation.

---

### 1.8 Additional Creative Formats

**A. Estimation Challenge (CM1-CM2):**
- Show a visual (e.g., a jar of objects, a dot array) and ask the child to estimate the quantity.
- Accept answers within a tolerance range (e.g., +/- 10%).
- Good for number sense development.

**B. Mental Calculation Chain:**
- A starting number is given, then a sequence of operations appears one at a time.
- `Start: 10 --> +5 --> x2 --> -3 --> = ?`
- Child must track the running total mentally and enter the final answer.
- Operations appear with a short delay between each (2 seconds), optionally animated.

**C. Comparison (Greater Than / Less Than / Equal):**
- Two expressions or numbers shown side by side.
- Child selects `<`, `>`, or `=`.
- E.g., `34 + 12 ___ 50` or `1/2 ___ 2/5`
- Three large buttons with the symbols.

**D. Pattern Completion:**
- A sequence of numbers is shown with one or two blanks.
- `2, 4, 6, ___, 10, ___`
- Child identifies the pattern and fills in the missing numbers.
- Good for multiplication table reinforcement and logical thinking.

**E. Visual Geometry Questions:**
- Show a shape and ask: "How many sides?" / "What is this shape called?"
- Multiple choice with shape names or numbers.
- For area/perimeter (CM1+): show a shape on a grid, ask for area in square units.

**F. Clock Reading (CE1+):**
- Display an analog clock face. Ask "What time is it?" with multiple choice answers.
- Or: "Show 3:45" -- child drags clock hands to the correct position.

**G. Money Counting (CE1+):**
- Display a set of Euro coins and bills. Ask "How much money is shown?"
- Or: "You need to pay 3,50 EUR. Select the right coins."
- Uses images of real Euro coins and bills for realism.

---

## 2. Question Generation Strategy

### 2.1 Template-Based Generation with Randomized Parameters

Each question is generated from a **template** that defines:

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
    a: { min: number, max: number, constraints: string[] }
    b: { min: number, max: number, constraints: string[] }
  }
  answerFormula: string          // e.g., "a + b"
  distractorStrategies: string[] // e.g., ["off_by_one", "wrong_operation"]
  constraints: string[]          // e.g., ["result <= 20", "a >= b"]
  wordProblemTemplate?: string   // optional narrative template
}
```

**Example template -- CP Addition, sub-level 3, micro-level 5:**
```json
{
  "id": "cp-add-3-5-mc",
  "type": "multiple_choice",
  "topic": "addition",
  "level": "CP",
  "subLevel": 3,
  "microLevel": 5,
  "pattern": "{a} + {b} = ?",
  "parameters": {
    "a": { "min": 5, "max": 12, "constraints": [] },
    "b": { "min": 3, "max": 8, "constraints": [] }
  },
  "answerFormula": "a + b",
  "distractorStrategies": ["off_by_one", "off_by_two", "sum_of_digits"],
  "constraints": ["result <= 20"]
}
```

### 2.2 Ensuring Validity

Every generated question goes through a **validation pipeline**:

1. **Parameter generation:** Random values are picked within the defined ranges.
2. **Constraint check:** All constraints are evaluated. If any fails, re-generate (max 10 attempts, then skip to next template).
3. **Answer computation:** The answer is computed from the formula.
4. **Answer range check:** The answer must be a valid number within a plausible range for the level:
   - CP: answers 0-100 (mostly 0-20 early on)
   - CE1: answers 0-1000
   - CE2: answers 0-10000
   - CM1/CM2: answers may include decimals with up to 3 decimal places
5. **Distractor generation:** Generate 3 distractors, validate each is unique and different from the correct answer.
6. **Presentation check:** For word problems, interpolate the template and verify the text makes grammatical sense.

**Key constraints by topic:**
- **Division:** Ensure `a` is divisible by `b` (for exact division at CE2/CM1). For CM2, remainders may be allowed.
- **Fractions:** Denominators must be within level range. Results must simplify to a "nice" fraction.
- **Subtraction:** For CP-CE1, ensure `a >= b` (no negative results). For CM2, negative results may be introduced.
- **Word problems:** The computed answer must be a whole number (or clean decimal for CM1+).

### 2.3 Distractor Generation in Detail

**Strategy library:**

| Strategy ID | Logic | When to Use |
|---|---|---|
| `off_by_one` | answer +/- 1 | All operations, all levels |
| `off_by_two` | answer +/- 2 | Addition, subtraction |
| `wrong_operation` | Apply a different operation to the same operands | All operations |
| `forget_carry` | Compute without carrying (e.g., 27+15: 2+1=3, 7+5=12 -> wrong: 312 or 32) | Addition with carrying (CE1+) |
| `forget_borrow` | Compute without borrowing | Subtraction with borrowing (CE1+) |
| `digit_swap` | Swap the digits of the answer (e.g., 21 -> 12) | Two-digit results |
| `magnitude_error` | Multiply or divide answer by 10 | Large number operations (CM1+) |
| `partial_product` | Use only one partial product in multiplication | Multi-digit multiplication (CM1+) |
| `numerator_only` | Return just the numerator or denominator | Fraction operations (CE2+) |
| `wrong_denominator` | Add/subtract denominators instead of finding common denominator | Fraction operations (CM1+) |
| `decimal_shift` | Move decimal point one place | Decimal operations (CM1+) |
| `random_nearby` | Random value within +/- 20% of answer | Fallback for any type |

**Distractor selection algorithm:**
1. Pick the first distractor from a "high-plausibility" strategy (e.g., `off_by_one` or `forget_carry`).
2. Pick the second distractor from a "different-error-type" strategy (e.g., `wrong_operation`).
3. Pick the third distractor from `random_nearby` if needed, ensuring no duplicates.
4. Shuffle all 4 options (correct + 3 distractors).

### 2.4 Avoiding Repetition

**Anti-repetition mechanisms:**

1. **Session history:** Track the last 20 questions shown in the current session. Never show the same (template_id + parameter_values) combination twice in a session.
2. **Template rotation:** Within a topic and difficulty level, cycle through all available templates before reusing any.
3. **Parameter variation:** Even when the same template is reused, the randomized parameters ensure different numbers appear. A minimum Hamming distance of 2 is enforced between parameter sets (i.e., at least 2 parameters must differ).
4. **Cross-session tracking:** Store a per-student "recently seen" buffer (last 100 questions) in persistent storage. Weight recently-seen templates lower in the selection probability.
5. **Freshness score:** Each template gets a freshness score based on recency and frequency of use. Templates with lower freshness scores are preferred.

### 2.5 Template Counts

**Recommended templates per topic per sub-level:**

| Question Type | Templates per sub-level | Rationale |
|---|---|---|
| Multiple choice | 5-8 | Core format, needs variety |
| Fill-in-the-blank | 3-5 | Variations in blank position |
| Free input | 3-5 | Different equation structures |
| Word problems | 8-12 | Needs narrative variety to stay fresh |
| True/False | 4-6 | Quick format, many needed |
| Ordering | 2-3 | Fewer needed, more complex |
| Matching | 2-3 | Fewer needed, used less often |
| Special (estimation, patterns, etc.) | 2-4 | Supplementary |

**Per sub-level total:** ~30-45 templates
**Per main level (10 sub-levels):** ~300-450 templates
**Across all 5 main levels:** ~1,500-2,250 templates

**However**, because each template generates many unique questions through parameter randomization, the effective question pool is much larger:
- Each template with 2 parameters of range 10 produces ~100 unique questions.
- Each template with 3 parameters produces ~1,000 unique questions.
- **Effective unique question pool: 150,000 to 500,000+ unique questions.**

**Minimum viable product (MVP) estimate:**
- Start with ~15-20 templates per sub-level.
- **MVP total: ~750-1,000 templates** across all levels.
- This is enough for the game to feel fresh for months of daily use.

**Full product target:**
- ~30-40 templates per sub-level.
- **Target: ~1,500-2,000 templates** for a polished, varied experience.

---

## 3. Difficulty Calibration Within Levels

### 3.1 System Structure

Each of the 5 main levels (CP, CE1, CE2, CM1, CM2) contains:
- **10 sub-levels** (broad difficulty bands within the year's curriculum)
- **10 micro-levels** per sub-level (fine-grained difficulty steps)
- **Total: 100 micro-steps per main level, 500 micro-steps across the entire game**

### 3.2 Difficulty Parameters

Difficulty is controlled by adjusting these parameters simultaneously:

| Parameter | Description | How It Scales |
|---|---|---|
| Number range | Min/max for operands and results | Increases with level |
| Number of operations | Single vs. multi-step | 1 at CP, up to 3 at CM2 |
| Carry/borrow | Whether regrouping is needed | Introduced gradually |
| Number of digits | Single, double, triple... | Increases with level |
| Decimal places | 0, 1, 2, 3 | 0 at CP-CE2, increases CM1-CM2 |
| Fraction complexity | Denominator size, need for common denominator | Increases CE2-CM2 |
| Time pressure | Per-question time limit | Decreases at higher micro-levels |
| Distractor closeness | How close wrong answers are to correct | Gets closer at higher levels |
| Question type mix | More fill-blank and free input vs. multiple choice | Shifts from MC to free input |
| Word problem length | Number of sentences and operations | Increases with level |

### 3.3 Detailed Example: CP -- Addition

**Sub-level 1: "Premiers pas" (First steps) -- Adding small numbers**

| Micro-level | Range a | Range b | Max Result | Format | Example |
|---|---|---|---|---|---|
| 1 | 1-3 | 1-2 | 5 | MC (3 options) | 2 + 1 = ? |
| 2 | 1-4 | 1-3 | 7 | MC (3 options) | 3 + 2 = ? |
| 3 | 1-5 | 1-4 | 9 | MC (3 options) | 4 + 3 = ? |
| 4 | 1-5 | 1-5 | 10 | MC (4 options) | 5 + 5 = ? |
| 5 | 1-6 | 1-5 | 10 | MC (4 options) | 6 + 4 = ? |
| 6 | 1-7 | 1-5 | 10 | Fill-blank | ___ + 3 = 7 |
| 7 | 1-8 | 1-5 | 10 | Fill-blank | 5 + ___ = 8 |
| 8 | 2-9 | 1-5 | 10 | Free input | 7 + 3 = ? |
| 9 | 1-9 | 1-5 | 10 | Mixed | 8 + 2 = ? |
| 10 | 1-9 | 1-9 | 10 | Mixed + word prob | "Léo a 6 pommes..." |

**Sub-level 5: "Avec retenue" (With carrying) -- Sums crossing 10**

| Micro-level | Range a | Range b | Max Result | Notes |
|---|---|---|---|---|
| 1 | 5-9 | 2-5 | 14 | First time crossing 10 |
| 2 | 5-9 | 3-6 | 15 | |
| 3 | 6-9 | 3-7 | 16 | |
| 4 | 6-9 | 4-8 | 17 | Introduce fill-blank |
| 5 | 7-9 | 4-9 | 18 | |
| 6 | 5-9 | 5-9 | 18 | Free input introduced |
| 7 | 3-9 | 3-9 | 18 | All formats mixed |
| 8 | 2-9 | 2-9 | 18 | Include word problems |
| 9 | 1-9 | 1-9 | 18 | Timed pressure increases |
| 10 | 1-9 | 1-9 | 18 | Speed challenge |

**Sub-level 10: "Expert CP" -- Full CP addition mastery**

| Micro-level | Range a | Range b | Max Result | Notes |
|---|---|---|---|---|
| 1 | 10-29 | 1-9 | 38 | Two-digit + one-digit |
| 2 | 10-29 | 2-9 | 38 | |
| 3 | 10-35 | 5-15 | 50 | |
| 4 | 10-39 | 10-19 | 58 | Two-digit + two-digit, no carry |
| 5 | 10-39 | 10-19 | 58 | Fill-blank and free input |
| 6 | 15-39 | 15-25 | 64 | With carrying |
| 7 | 20-39 | 15-30 | 69 | |
| 8 | 20-45 | 20-35 | 80 | Word problems |
| 9 | 25-47 | 25-38 | 85 | Mixed formats, time pressure |
| 10 | 30-47 | 25-38 | 85 | Speed + accuracy challenge |

### 3.4 Difficulty Scaling Formulas

For a given sub-level `s` (1-10) and micro-level `m` (1-10), the overall difficulty index `d` is:

```
d = (s - 1) * 10 + m      // Range: 1-100 within a main level
```

**Number range scaling (for a given topic):**

```
operand_max = base_min + floor((range_span * d) / 100)
```

Where:
- `base_min` = minimum operand for the topic at this main level
- `range_span` = difference between the maximum and minimum operand for the topic

**Example for CP Addition:**
- `base_min` = 1, `range_max` = 47
- At d=1: operand_max = 1 + floor(46 * 1 / 100) = 1 (so range 1-3 with a floor of 3)
- At d=50: operand_max = 1 + floor(46 * 50 / 100) = 24
- At d=100: operand_max = 1 + floor(46 * 100 / 100) = 47

**Time pressure scaling:**

```
time_per_question = base_time - floor((base_time - min_time) * d / 100)
```

Where:
- `base_time` = generous starting time (e.g., 30 seconds for CP)
- `min_time` = minimum time at peak difficulty (e.g., 10 seconds for CP)

**Question type distribution by difficulty index:**

| Difficulty Index (d) | Multiple Choice | Fill-in-Blank | Free Input | Word Problem |
|---|---|---|---|---|
| 1-20 | 70% | 20% | 5% | 5% |
| 21-40 | 50% | 25% | 15% | 10% |
| 41-60 | 35% | 25% | 25% | 15% |
| 61-80 | 20% | 25% | 30% | 25% |
| 81-100 | 10% | 20% | 35% | 35% |

---

## 4. Topic / Category System

### 4.1 CP (Cours Preparatoire -- Age 6-7)

**Topics and sub-level mapping:**

| Sub-level | Topic | Description |
|---|---|---|
| 1 | Counting & Number Recognition | Count objects 1-10, recognize written digits |
| 2 | Number Comparison | Compare numbers up to 10, use < > = |
| 3 | Addition Basics | Sums up to 10, concrete objects |
| 4 | Subtraction Basics | Differences within 10, "take away" concept |
| 5 | Addition Crossing 10 | Sums between 10 and 20 |
| 6 | Subtraction Crossing 10 | Differences from numbers up to 20 |
| 7 | Doubles and Near-Doubles | 3+3, 4+4, 5+6, etc. |
| 8 | Two-Digit Numbers | Read, write, compare numbers 10-99 |
| 9 | Shape Recognition | Identify squares, rectangles, triangles, circles |
| 10 | Simple Measurements & Review | Compare lengths, order sizes; mixed review |

**Sub-topics within each sub-level:**

**Sub-level 1 (Counting & Number Recognition):**
- Count objects in images (1-5, then 1-10)
- Match digit to quantity
- Write the digit for a shown quantity
- Order numbers 1-10
- Identify "how many" in a group

**Sub-level 3 (Addition Basics):**
- Addition as "putting together" (visual with objects)
- Horizontal equation: a + b = ?
- Vertical presentation with objects
- Missing addend: a + ? = c
- Word problems: "Léo a 3 billes et il en trouve 4..."
- Addition with zero

**Sub-level 9 (Shape Recognition):**
- Identify named shapes from a set
- Count sides of shapes
- Match shape name to image
- Sort shapes by property (has 4 sides / has 3 sides)
- Find shapes in real-world images

---

### 4.2 CE1 (Cours Elementaire 1 -- Age 7-8)

| Sub-level | Topic | Description |
|---|---|---|
| 1 | Addition Review & Extension | Sums up to 100, fluency building |
| 2 | Addition with Carrying | Two-digit addition with regrouping |
| 3 | Subtraction Review & Extension | Differences up to 100 |
| 4 | Subtraction with Borrowing | Two-digit subtraction with regrouping |
| 5 | Introduction to Multiplication | Concept of groups, repeated addition |
| 6 | Multiplication Tables (x2, x5, x10) | Memorize first tables |
| 7 | Numbers to 1,000 | Read, write, compare, order |
| 8 | Introduction to Fractions & Decimals | Simple halves, quarters; euros and cents |
| 9 | Geometry & Measurement | Shapes, symmetry, measuring in cm, telling time |
| 10 | Problem Solving & Review | Multi-topic word problems, mixed operations |

**Sub-topics within each sub-level:**

**Sub-level 2 (Addition with Carrying):**
- Two-digit + one-digit with carry (e.g., 27 + 5)
- Two-digit + two-digit, carry in ones (e.g., 38 + 24)
- Two-digit + two-digit, carry in tens (e.g., 65 + 52)
- Three addends (e.g., 12 + 15 + 8)
- Column addition presentation
- Word problems requiring carrying

**Sub-level 5 (Introduction to Multiplication):**
- Repeated addition as multiplication (3 + 3 + 3 = 3 x 3)
- Groups of objects (4 groups of 3 = ?)
- Multiplication vocabulary ("fois")
- Introduction of x symbol
- Simple products with small numbers (1-5 range)
- Commutative property discovery (2 x 3 = 3 x 2)

**Sub-level 8 (Introduction to Fractions & Decimals):**
- Half of a shape (visual)
- Quarter of a shape (visual)
- Half of a number (even numbers up to 20)
- Euros and cents: reading prices
- Euros and cents: adding simple amounts
- Writing decimals in money context (2,50 EUR)

---

### 4.3 CE2 (Cours Elementaire 2 -- Age 8-9)

| Sub-level | Topic | Description |
|---|---|---|
| 1 | Multiplication Tables (x3, x4) | Extend table knowledge |
| 2 | Multiplication Tables (x6, x7, x8, x9) | Complete table mastery |
| 3 | Multiplying by 10, 100 | Pattern recognition with zeros |
| 4 | Introduction to Division | Sharing equally, concept of quotient |
| 5 | Division with Small Numbers | Division facts related to known tables |
| 6 | Numbers to 10,000 | Read, write, compare, decompose |
| 7 | Fractions: Halves, Thirds, Quarters | Visual fractions, naming, comparing |
| 8 | Measurement Units | Metres/cm/mm, kg/g, litres/cl, hours/minutes |
| 9 | Geometry: Perimeter, Right Angles | Measure perimeter, identify right angles, use ruler |
| 10 | Problem Solving & Review | Multi-step problems, mixed operations |

**Sub-topics within each sub-level:**

**Sub-level 4 (Introduction to Division):**
- Equal sharing with objects (12 candies shared among 3 children)
- Division as the inverse of multiplication
- Division notation: 12 / 3 = ?
- Missing factor: ? x 3 = 12
- Simple word problems involving sharing
- Division with remainder (introduction)

**Sub-level 7 (Fractions):**
- Fraction of a shape: colour 1/2, 1/3, 1/4
- Name the fraction shown in a picture
- Place simple fractions on a number line (0 to 1)
- Compare unit fractions (1/2 vs 1/3 vs 1/4)
- Fractions greater than 1 (introduction): 3/2 as "one whole and one half"
- Equivalent fractions: 2/4 = 1/2 (visual)

---

### 4.4 CM1 (Cours Moyen 1 -- Age 9-10)

| Sub-level | Topic | Description |
|---|---|---|
| 1 | Multi-Digit Addition & Subtraction | Numbers up to 100,000, column methods |
| 2 | Multi-Digit Multiplication | Two-digit x two-digit, column multiplication |
| 3 | Division Algorithm | Long division with one-digit divisor |
| 4 | Fractions: Naming and Comparing | Fractions with denominators up to 12 |
| 5 | Fractions: Addition and Subtraction | Same denominator, then different denominators |
| 6 | Introduction to Decimals | Tenths and hundredths, place value |
| 7 | Decimal Operations | Addition and subtraction with decimals |
| 8 | Measurement Conversions | Convert between units (m/cm, kg/g, L/mL) |
| 9 | Area and Perimeter | Rectangle and square formulas, grid counting |
| 10 | Problem Solving & Review | Multi-step with mixed operations and units |

**Sub-topics within each sub-level:**

**Sub-level 6 (Introduction to Decimals):**
- Place value: tenths (0,1 to 0,9)
- Place value: hundredths (0,01 to 0,99)
- Read and write decimals
- Place decimals on a number line
- Compare decimals (0,3 vs 0,25)
- Decimal and fraction equivalence (0,5 = 1/2)
- Ordering decimals

**Sub-level 9 (Area and Perimeter):**
- Perimeter of rectangles and squares (formula)
- Perimeter of irregular shapes on a grid
- Area by counting grid squares
- Area of rectangles (length x width)
- Area of squares (side x side)
- Distinguish perimeter from area
- Word problems involving area and perimeter

---

### 4.5 CM2 (Cours Moyen 2 -- Age 10-11)

| Sub-level | Topic | Description |
|---|---|---|
| 1 | Operations with Large Numbers | All four operations, numbers up to 1,000,000 |
| 2 | Long Division | Two-digit divisors |
| 3 | Fraction Operations | Add, subtract, multiply fractions |
| 4 | Decimal Operations: All Four | Add, subtract, multiply, divide decimals |
| 5 | Proportionality | Ratio, scaling, rule of three |
| 6 | Percentages (Introduction) | Percentage as fraction of 100, simple percentages |
| 7 | Measurement & Conversions | Complex unit conversions, volume introduction |
| 8 | Geometry: Angles & Triangles | Classify angles, types of triangles |
| 9 | Geometry: Area of Triangles, Composite Shapes | Triangle area formula, composite shape decomposition |
| 10 | Comprehensive Review & Bridge to College | All topics mixed, pre-6eme preparation |

**Sub-topics within each sub-level:**

**Sub-level 5 (Proportionality):**
- Identify proportional situations
- Complete a proportionality table
- Use the "rule of three" (produit en croix)
- Scale recipes (e.g., "for 4 people -> for 6 people")
- Map scales (1 cm = 10 km)
- Speed/distance/time problems (introduction)
- Percentage as proportionality (link to sub-level 6)

**Sub-level 3 (Fraction Operations):**
- Add fractions with same denominator
- Subtract fractions with same denominator
- Find common denominators
- Add fractions with different denominators
- Subtract fractions with different denominators
- Multiply a fraction by a whole number
- Simplify fractions
- Word problems with fractions

---

## 5. Progression Requirements

### 5.1 Micro-Level Advancement

To advance from one micro-level to the next, a student must demonstrate **short-term mastery**.

**Criteria for micro-level advancement:**
- Answer a minimum of **8 questions** at the current micro-level.
- Achieve an accuracy rate of at least **80%** (i.e., at least 7 out of 8, or 8 out of 10).
- The 80% is calculated on a **rolling window** of the last 10 questions at this micro-level (not cumulative from the very beginning).
- No more than **2 consecutive errors** on the same sub-topic.

**If the student does not meet the criteria:**
- They remain at the current micro-level.
- The system increases the proportion of the sub-topics they are struggling with (targeted practice).
- After 3 failed attempts to advance (i.e., 3 sets of 10 where accuracy stays below 80%), the system offers a **review session** pulling questions from the previous micro-level to rebuild foundations.

### 5.2 Sub-Level Advancement

To advance from one sub-level (e.g., sub-level 3) to the next (sub-level 4):

**Criteria:**
- Complete micro-level 10 of the current sub-level (i.e., pass through all 10 micro-levels).
- Achieve a **sub-level mastery score** of at least **85%**, calculated as the weighted average accuracy across all 10 micro-levels.
- Pass a **sub-level gate quiz**: a set of 10 mixed questions drawn from all micro-levels of the current sub-level. Must score at least **8/10**.

**If the student fails the gate quiz:**
- They are shown which micro-levels had errors.
- They must redo the specific micro-levels where errors occurred (targeted remediation).
- They can re-attempt the gate quiz after remediation.

### 5.3 Main Level Advancement

To advance from one main level (e.g., CP) to the next (CE1):

**Criteria:**
- Complete all 10 sub-levels of the current main level.
- Achieve a **main-level mastery score** of at least **85%** across all sub-levels.
- Pass a **level-up exam**: 20 questions covering all sub-levels, with at least 2 questions per sub-level. Must score at least **16/20 (80%)**.
- No single sub-level may have an accuracy below **70%** in the exam (ensures no critical weak spots).

**If the student fails the level-up exam:**
- Detailed breakdown of performance by sub-level is shown.
- Student is directed back to the weakest sub-levels for review.
- Can re-attempt the exam after completing review sessions.

### 5.4 Handling Weak Spots

**Problem:** A student may be strong in addition but weak in subtraction (or any uneven profile).

**Solution: Independent Topic Tracks**

Each topic within a level has its own progression track:

```
CP Student Example:
  Counting:       sub-level 7, micro-level 4  (advanced)
  Addition:       sub-level 6, micro-level 8  (progressing)
  Subtraction:    sub-level 3, micro-level 2  (struggling)
  Shapes:         sub-level 5, micro-level 1  (on track)
  Measurement:    sub-level 2, micro-level 5  (behind)
```

**Adaptive session composition:**
- Each 5-minute session draws questions from **multiple topics**.
- The topic mix is weighted by need:
  - Topics where the student is **behind** get **more questions** (40-50% of session).
  - Topics where the student is **on track** get **normal allocation** (30-40%).
  - Topics where the student is **ahead** get **fewer questions** (10-20%), but never zero (to maintain fluency).
- A "weakness multiplier" is applied: if a topic's accuracy is below 70% over the last 20 questions, it gets 2x the normal question allocation.

**Spaced repetition for mastered topics:**
- Once a sub-level is passed, questions from it still appear occasionally (1-2 per session) to prevent skill decay.
- The interval between review questions follows a spaced repetition schedule:
  - Day 1 after passing: 2 review questions
  - Day 3: 1 review question
  - Day 7: 1 review question
  - Day 14: 1 review question
  - Day 30: 1 review question
  - Then monthly thereafter
- If a review question is answered incorrectly, the spacing resets to Day 1.

### 5.5 Comprehensive Mastery Verification

Before level-up, the system checks:

1. **Breadth:** All sub-levels have been completed.
2. **Depth:** No sub-level has accuracy below 70%.
3. **Recency:** The student has answered questions in each sub-level within the last 7 days (or completes a refresh quiz).
4. **Consistency:** The rolling accuracy over the last 50 questions across all topics is at least 80%.
5. **Gate exam:** The level-up exam is passed.

---

## 6. Time Management

### 6.1 Session Structure

**Standard session: 5 minutes (300 seconds)**

**Expected question count by level:**

| Level | Avg. Time per Question | Expected Questions per Session | Range |
|---|---|---|---|
| CP | 20-25 seconds | 12-15 questions | 10-18 |
| CE1 | 18-22 seconds | 14-17 questions | 11-20 |
| CE2 | 15-20 seconds | 15-20 questions | 12-22 |
| CM1 | 15-20 seconds | 15-20 questions | 12-22 |
| CM2 | 12-18 seconds | 17-25 questions | 14-28 |

These ranges account for a mix of fast questions (true/false, simple multiple choice) and slower ones (word problems, multi-step).

### 6.2 Time Per Question by Type

| Question Type | CP | CE1 | CE2 | CM1 | CM2 |
|---|---|---|---|---|---|
| True/False | 8s | 7s | 6s | 5s | 5s |
| Multiple Choice (simple) | 15s | 12s | 10s | 10s | 8s |
| Multiple Choice (complex) | 20s | 18s | 15s | 12s | 10s |
| Fill-in-the-Blank | 20s | 18s | 15s | 15s | 12s |
| Free Input | 25s | 20s | 18s | 15s | 12s |
| Word Problem | 35s | 30s | 25s | 25s | 20s |
| Ordering/Sorting | 30s | 25s | 20s | 18s | 15s |
| Matching | 40s | 35s | 30s | 25s | 20s |

These times represent the **per-question timer** (see below).

### 6.3 Timer Design: Dual Timer System

**A. Global Session Timer (5 minutes):**
- Displayed as a **progress bar** at the top of the screen, filling from left to right.
- Colour: starts green, turns yellow at 1 minute remaining, turns orange at 30 seconds.
- When time runs out: the session ends naturally. No penalty. The student sees their results.
- The bar is **not** a countdown clock with numbers (which can cause anxiety in young children). Instead, it is a visual progress indicator showing "how much of your adventure is left."

**B. Per-Question Timer (soft timer):**
- NOT displayed as a visible countdown to avoid stress.
- Runs silently in the background.
- **Purpose:** Prevent a student from sitting on one question indefinitely, consuming the entire session.
- **Behaviour when per-question time expires:**
  - A gentle nudge appears: "Besoin d'aide ?" (Need help?) with a hint button.
  - The question is NOT auto-skipped. The student can continue working.
  - If the student takes **2x** the allotted time, a second nudge: "Tu peux passer a la suite !" (You can move on!) with a skip button.
  - If the student takes **3x** the allotted time, the question is marked as unanswered and auto-advances with a gentle animation.
  - Time spent beyond the initial allotment is tracked but does NOT count as an error for progression purposes.

### 6.4 Session End Behaviour

When the 5-minute timer expires:
1. If the student is mid-question, they get **15 extra seconds** to finish the current question (indicated by a gentle pulsing effect on the timer bar).
2. After the grace period, the session ends.
3. A **results screen** appears showing:
   - Number of questions answered.
   - Number correct (with a star animation for each correct answer).
   - Accuracy percentage (shown as a fraction for younger students, e.g., "12 sur 15").
   - XP or points earned.
   - "Personal best" comparison if applicable.
   - A "Continue" or "New Session" button.

### 6.5 Optional Extended Sessions

- Students can optionally play additional 5-minute sessions.
- A **daily recommendation** of 2-3 sessions (10-15 minutes total) is shown, but not enforced.
- After 3 consecutive sessions (15 minutes), a **break reminder** appears: "C'est l'heure de faire une pause ! Reviens plus tard pour continuer tes progres." (Time for a break! Come back later to keep progressing.)
- Parents/teachers can configure a **daily time limit** in settings.

---

## 7. Help / Tutor System

### 7.1 When Hints Appear

**Automatic triggers (system-initiated hints):**
- After **2 consecutive wrong answers** on the same question type/topic: a passive hint icon starts glowing.
- After the **per-question soft timer** expires (1x time): "Besoin d'aide ?" prompt with a hint button.
- After **3 consecutive wrong answers** on any topic: a more direct conceptual reminder appears.

**Student-initiated hints:**
- A **lightbulb icon** is always visible during questions. The student can tap it at any time.
- The icon gently bounces or glows periodically if the student seems stuck (no input for 10+ seconds).

### 7.2 Hint Types by Question Type

**Tiered hint system (up to 3 hints per question, increasingly specific):**

**For arithmetic operations (addition, subtraction, multiplication, division):**

| Hint Level | Type | Example (for 47 + 38 = ?) |
|---|---|---|
| 1 | Strategy reminder | "Commence par additionner les unites : 7 + 8" (Start by adding the ones: 7 + 8) |
| 2 | Partial solution | "7 + 8 = 15. Ecris 5 et retiens 1." (7 + 8 = 15. Write 5 and carry 1.) |
| 3 | Visual aid | Animated column addition showing the steps, pausing before the final answer |

**For multiple choice:**

| Hint Level | Type | Example (for 6 x 7 = ?) |
|---|---|---|
| 1 | Eliminate one wrong answer | One distractor is greyed out |
| 2 | Eliminate a second wrong answer | A second distractor is greyed out (50/50 remains) |
| 3 | Conceptual prompt | "6 x 7, c'est 6 fois le nombre 7. Tu peux compter : 7, 14, 21..." |

**For fill-in-the-blank (e.g., 6 x ___ = 30):**

| Hint Level | Type | Example |
|---|---|---|
| 1 | Rephrase the question | "Quel nombre multiplie par 6 donne 30 ?" |
| 2 | Give a range | "C'est un nombre entre 1 et 10." |
| 3 | Related fact | "Tu sais que 6 x 5 = 30. Alors..." |

**For word problems:**

| Hint Level | Type | Example |
|---|---|---|
| 1 | Identify the operation | "Il s'agit d'une soustraction." (This is a subtraction.) |
| 2 | Extract the key numbers | "Les nombres importants sont 45 et 27." |
| 3 | Set up the equation | "Tu dois calculer 45 - 27 = ?" |

**For ordering/sorting:**

| Hint Level | Type | Example |
|---|---|---|
| 1 | Starting point | "Le plus petit nombre est 12." |
| 2 | Next in sequence | "Apres 12, quel est le plus petit ?" |
| 3 | Partial arrangement | Show the first 2-3 items in correct order |

**For fractions and decimals:**

| Hint Level | Type | Example (for 1/3 + 1/4 = ?) |
|---|---|---|
| 1 | Concept reminder | "Pour additionner des fractions, il faut le meme denominateur." |
| 2 | Find common denominator | "Le denominateur commun de 3 et 4 est 12." |
| 3 | Equivalent fractions | "1/3 = 4/12 et 1/4 = 3/12. Maintenant additionne." |

### 7.3 Explaining Concepts Without Giving Answers

**Principles:**
1. **Show the method, not the result.** Hints walk through the procedure and stop just before the final calculation.
2. **Use visual representations.** Number lines, base-10 blocks, pie charts for fractions, grids for area.
3. **Ask guiding questions.** "What do you need to do first?" "Which column should you start with?"
4. **Reference known facts.** "You know that 5 x 5 = 25. Can you use that to figure this out?"
5. **Never state the answer directly.** The most specific hint gives the student enough to compute the answer in one simple step.

**Visual aids library:**
- **Number line:** For addition, subtraction, number comparison, fractions, decimals.
- **Base-10 blocks:** For place value, carrying, borrowing (animated).
- **Array/grid:** For multiplication, area.
- **Pie/bar charts:** For fractions.
- **Balance scale:** For equations and equality.
- **Clock face:** For time-related questions.
- **Money images:** For decimal/money questions.

### 7.4 Cost of Using Hints

**Design philosophy:** Hints should be free to use. The goal is learning, not punishment.

**However**, to encourage independent problem-solving:

- **Point adjustment:** A question answered with hints earns **reduced points**:
  - 0 hints: full points (e.g., 10 points)
  - 1 hint: 70% points (7 points)
  - 2 hints: 40% points (4 points)
  - 3 hints: 20% points (2 points)
  - The minimum is never 0 -- the student always earns something for a correct answer, even with all hints used.

- **Mastery tracking:** Questions answered with hints count toward the accuracy score but are **flagged separately**.
  - For micro-level advancement: questions with 2+ hints count as "assisted" and only 50% of them count toward the 80% threshold.
  - This means a student cannot advance by relying entirely on hints.
  - Example: 10 questions answered, 8 correct (but 4 of those used 2+ hints). Effective score: 6/10 correct (4 unaided + 2 from the 4 assisted) = below the 80% threshold. Student stays at the current micro-level.

- **Positive framing:** The UI never says "penalty" or "reduced." Instead, it shows "bonus points for solving on your own!" when no hints are used, creating a positive incentive rather than a negative punishment.

- **Streak bonus:** Answering 5 questions in a row without hints earns a "Super cerveau !" (Super brain!) badge and bonus points. This gamifies independent problem-solving.

### 7.5 Learning Resources Integration

**Post-question explanations:**
After every wrong answer (whether or not hints were used), a brief **explanation screen** appears:
- Shows the correct answer.
- Shows a 1-2 sentence explanation of how to solve it.
- Optionally shows an animated mini-lesson (5-10 seconds) demonstrating the concept.
- A "J'ai compris !" (I understand!) button dismisses it.

**Concept library (accessible from the main menu):**
- Organized by topic and level.
- Each concept page has:
  - A simple explanation in child-friendly French.
  - A visual diagram or animation.
  - 2-3 worked examples with step-by-step solutions.
  - A "Pratique" (Practice) button that launches questions on that specific concept.

**Teacher/parent dashboard integration:**
- Teachers can see which concepts a student needed the most hints on.
- The system generates a weekly "topics to review" report.
- Teachers can assign specific concept reviews or extra practice sessions.

---

## Appendix A: Summary of All Question Format Specifications

| Format | Input Method | Min Age | Options Count | Timer Visible | Validation |
|---|---|---|---|---|---|
| Multiple Choice | Tap button | CP (6) | 3-4 | No | Instant on tap + Valider |
| Fill-in-the-Blank | Numpad | CP (6) | N/A | No | On Valider tap |
| Free Input | Numpad | CP (6) | N/A | No | On Valider tap |
| Word Problem | MC or Numpad | CP (6) | 3-4 or free | No | On Valider tap |
| True/False | Two buttons | CP (6) | 2 | No | Instant on tap |
| Ordering | Drag-and-drop | CE1 (7) | 4-6 items | No | On Valider tap |
| Matching | Tap-pair or drag | CE1 (7) | 4-6 pairs | No | On Valider tap |
| Comparison (<>=) | Three buttons | CP (6) | 3 | No | Instant on tap |
| Pattern Completion | Numpad | CE1 (7) | N/A | No | On Valider tap |
| Estimation | Numpad | CM1 (9) | N/A | No | Within tolerance |
| Mental Calc Chain | Numpad | CE2 (8) | N/A | No | On Valider tap |
| Clock Reading | MC or drag hands | CE1 (7) | 4 or interactive | No | On Valider tap |
| Money Counting | Tap coins/MC | CE1 (7) | Interactive or 4 | No | On Valider tap |
| Geometry Visual | MC or tap | CP (6) | 3-4 | No | On Valider tap |

---

## Appendix B: Template Count Summary

| Level | Sub-levels | Templates per Sub-level | Total Templates | Effective Unique Questions |
|---|---|---|---|---|
| CP | 10 | ~30 | ~300 | ~30,000-90,000 |
| CE1 | 10 | ~35 | ~350 | ~35,000-105,000 |
| CE2 | 10 | ~35 | ~350 | ~35,000-105,000 |
| CM1 | 10 | ~40 | ~400 | ~40,000-120,000 |
| CM2 | 10 | ~40 | ~400 | ~40,000-120,000 |
| **TOTAL** | **50** | **~36 avg** | **~1,800** | **~180,000-540,000** |

MVP target: ~1,000 templates (sufficient for months of daily play without noticeable repetition).

---

## Appendix C: Progression Thresholds Summary

| Transition | Minimum Questions | Accuracy Required | Special Condition |
|---|---|---|---|
| Micro-level -> next | 8 | 80% (rolling 10) | Max 2 consecutive errors |
| Sub-level -> next | Complete all 10 micros | 85% weighted average | Gate quiz: 8/10 |
| Main level -> next | Complete all 10 subs | 85% weighted average | Level exam: 16/20, no sub below 70% |
| Topic review trigger | N/A | Below 70% on last 20 | 2x question allocation for that topic |
| Hint-assisted question | N/A | Counts as 50% | If 2+ hints used |

---

## Appendix D: Spaced Repetition Schedule

| Days Since Mastery | Review Questions per Session | Condition to Reset |
|---|---|---|
| 1 | 2 | Any incorrect answer |
| 3 | 1 | Any incorrect answer |
| 7 | 1 | Any incorrect answer |
| 14 | 1 | Any incorrect answer |
| 30 | 1 | Any incorrect answer |
| 60+ | 1 (monthly) | Any incorrect answer |

On incorrect answer during review: schedule resets to Day 1 for that specific sub-topic.

---

## Appendix E: Distractor Strategy Matrix

| Topic | Primary Strategy | Secondary Strategy | Tertiary Strategy |
|---|---|---|---|
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

---

*Document version: 1.0*
*Last updated: 2026-02-12*
*Status: Design specification -- ready for implementation review*
