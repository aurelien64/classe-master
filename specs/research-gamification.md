# Gamification Research for Classe-Master
## Targeting French Primary School (CP-CM2, ages 6-11)

**Research date:** February 2026
**Purpose:** Understand gamification patterns from popular children's games and educational platforms to inform the design of an engaging math education PWA.

---

## Table of Contents

1. [Brawl Stars Mechanics](#1-brawl-stars-mechanics)
2. [Roblox Mechanics](#2-roblox-mechanics)
3. [Minecraft Mechanics](#3-minecraft-mechanics)
4. [Educational Games Analysis](#4-educational-games-analysis)
5. [Brainrot Culture and Kids Trends](#5-brainrot-culture-and-kids-trends-2024-2025)
6. [Point and Reward Systems](#6-point-and-reward-systems)
7. [Avatar and Collectible Systems](#7-avatar-and-collectible-systems)
8. [Anti-Frustration Features](#8-anti-frustration-features)
9. [Social Features Without Toxicity](#9-social-features-without-toxicity)
10. [PWA Game Design Patterns](#10-pwa-game-design-patterns)
11. [Key Takeaways and Recommendations](#11-key-takeaways-and-recommendations)

---

## 1. Brawl Stars Mechanics

### Why It Matters
Brawl Stars (Supercell) is one of the most popular mobile games among French primary school children. Its engagement systems are extremely well-designed and offer direct inspiration for educational gamification.

### Trophy System
- **Individual brawler trophies**: Each character (brawler) has its own trophy count. This creates multiple parallel progression tracks -- a child always has something to work on.
- **50-tier system**: Every 20 trophies = 1 new tier. Clear, predictable, visible progression.
- **Asymmetric win/loss**: Players earn more trophies for winning than they lose for losing. This is critical -- it means even a 40% win rate still results in net progression. Players never feel stuck.
- **Win streak bonuses**: Starting from 2 consecutive wins with the same brawler, players earn +1 bonus trophy per win, capping at +5. This rewards "hot hands" and creates excitement.
- **Season resets**: Trophies partially reset each season, providing a fresh start and renewed motivation.

### Brawler Unlocking and Progression
- **Multi-layered progression**: Brawlers progress from Power Level 1 to 11 using Power Points and Coins.
- **Milestone unlocks**: Gadgets at Power 7, Star Powers at Power 9, Hypercharges at Power 11. Each milestone feels meaningful and changes gameplay.
- **Buffies (2024)**: A newer layer -- each brawler gets 3 Buffies that boost Star Powers, Gadgets, and Hypercharges. This extends the progression ceiling.
- **Rarity tiers**: Common, Rare, Super Rare, Epic, Mythic, Legendary. Rarity creates aspiration and excitement when unlocking higher-tier brawlers.

### Engagement Loop
- **Short sessions**: Matches last 2-3 minutes. Multiple short sessions per day rather than one long session. Perfect for children's attention spans.
- **Daily quests**: Timed quests refresh daily, creating a daily login ritual.
- **Brawl Pass**: Seasonal pass with free and premium tracks providing continuous rewards.
- **Variable rewards**: Starr Drops (loot boxes) provide randomized rewards. The unpredictability drives excitement (variable ratio reinforcement schedule).
- **Trophy Boxes**: Cosmetic reward boxes earned through trophy progression. Higher tiers may contain Mythic, Legendary, or Hypercharge skins.

### Key Takeaways for Our Design
- **Asymmetric scoring (gain more than you lose) is essential** to prevent frustration.
- **Multiple parallel progression tracks** keep engagement high -- if one area stalls, another is advancing.
- **Short session design** maps perfectly to classroom use (5-10 minute exercises).
- **Win streak bonuses** create excitement and reward consistency.
- **Seasonal resets** provide fresh-start motivation periodically.

---

## 2. Roblox Mechanics

### Why It Matters
Roblox is the most-played game platform for children aged 6-12 globally. French primary school children are deeply engaged with it. Its social and customization systems drive enormous retention.

### Avatar Customization
- **Central identity feature**: The avatar is how children present themselves. Customization is the primary driver of engagement.
- **Robux economy**: Virtual currency that can be earned (slowly) or purchased. Creates a dual-currency feel even though it is technically one currency.
- **UGC (User-Generated Content)**: Players can create and sell avatar items. This creator economy drives engagement.
- **The "wardrobe effect"**: Research shows children accumulate many items but tend to use one favorite avatar consistently. The accumulation behavior is itself rewarding, independent of actual use.
- **Default skin stigma**: Children associate default skins with "newbies," which carries negative social status. This drives the desire to customize.

### Badges and Achievements
- **Experience-specific badges**: Each game on Roblox can define its own badges. Collecting badges across games creates a meta-progression layer.
- **Platform-level badges**: Roblox itself awards badges for milestones (first login, account age, etc.).
- **Badge visibility**: Badges are displayed on player profiles, creating social proof and status.

### Limited Items and Scarcity (FOMO)
- **Limited quantity items**: Cosmetic items released in fixed quantities. Once sold out, only available through resale.
- **Time-limited releases**: Items available only during events or for limited periods.
- **Resale market**: Players can resell limited items after a holding period, creating a trading economy.
- **FOMO mechanics**: Scarcity creates urgency and fear of missing out, driving frequent logins and engagement.

### Social Features
- **Friends system**: Players maintain friend lists across experiences.
- **Age-gated chat**: Players 12 and under have heavily filtered chat. Post-2025, all chat requires age verification.
- **Parental controls**: Screen time limits, friend list visibility, communication restrictions.
- **3,000+ moderators** (as of 2024) for content and interaction moderation.

### Key Takeaways for Our Design
- **Avatar customization is a massive engagement driver**, even if items are purely cosmetic.
- **Scarcity and exclusivity** drive desire -- limited-time rewards are more valued.
- **Social proof** (visible achievements, profile display) motivates continued engagement.
- **Age-appropriate safety features** are non-negotiable for children's platforms.
- **The desire to not look like a "default" drives customization** -- even small cosmetic options matter.

---

## 3. Minecraft Mechanics

### Why It Matters
Minecraft is the best-selling game of all time and deeply embedded in children's culture. Its progression and achievement systems are uniquely open-ended.

### Achievement/Advancement System
- **122 total advancements** in Java Edition, divided across 5 tabs.
- **Branching tree structure**: Completing one advancement reveals the next logical task. Players see natural progression paths without being forced into a single route.
- **Discovery-based design**: The system is designed to show every aspect of the game organically, so players experience content without needing external guides.
- **Progressive challenge curve**: From basic survival (mine stone, craft tools) to endgame challenges (defeat the Ender Dragon, explore the End).

### Crafting Progression
- **Recipe discovery**: Players learn crafting recipes through experimentation or progression.
- **Material tiers**: Wood -> Stone -> Iron -> Diamond -> Netherite. Each tier requires more effort but provides better tools.
- **Dependency chains**: Complex items require multi-step processes (e.g., Blaze Rods + Ender Pearls = Eyes of Ender = portal activation). This teaches sequential thinking.

### What Makes It Engaging for Children
- **No natural stopping points**: The sandbox nature means there is always something more to do. No "game over" state.
- **Dopamine from achievement**: Each milestone (first diamond, first house, first Nether portal) triggers satisfaction.
- **Open-ended creativity**: Players set their own goals. The game provides tools and freedom rather than rigid objectives.
- **Survival pressure**: In survival mode, the need to eat, build shelter, and defend against mobs creates constant low-level motivation.

### Risks and Considerations
- **Lack of structure can cause excessive play** -- children find it hard to stop when there are no natural endpoints.
- **Neurodivergent children** (especially ADHD/autism) may be particularly drawn to the game's reward structure.
- **Minecraft Education Edition lacks achievements** -- a notable gap that frustrated educators.

### Key Takeaways for Our Design
- **Branching progression trees** let different children take different paths while still progressing.
- **Material/tier systems** (bronze -> silver -> gold) create clear, tangible progression.
- **Dependency chains** in progression teach planning and sequential thinking.
- **Natural stopping points are essential** in educational contexts -- unlike Minecraft, we NEED clear session boundaries.
- **Discovery-based design** (revealing content as you progress) maintains curiosity.

---

## 4. Educational Games Analysis

### 4.1 Prodigy Math

**What it is**: RPG-style game where math problems are integrated into turn-based combat battles. Players aged 6-14 (grades 1-8).

**Gamification Mechanics**:
- Turn-based combat where spells require solving math problems
- Character customization with pets, outfits, and items
- World exploration with quests and storylines
- Adaptive difficulty matching curriculum standards
- Points, progress bars, and achievement tracking

**What Works Well**:
- Children who struggle with traditional math instruction become excited to learn
- RPG wrapper makes math feel like an adventure rather than homework
- Adaptive difficulty matches individual skill levels

**Critical Weaknesses**:
- **Pay-to-win model**: Non-paying players face severe limitations. Children feel excluded when classmates have paid memberships.
- **Aggressive marketing to children**: In observed sessions, 16 unique membership advertisements appeared during 19 minutes of gameplay, with only 4 math problems solved.
- **Poor math integration**: Most of a child's attention goes to customization and exploration, not math. Math feels like an interruption rather than the core experience.
- **No measurable learning improvement**: Research showed no statistically significant difference in benchmark assessment scores between Prodigy users and non-users.
- **Social comparison pressure**: Premium members visibly have better gear, creating social pressure to buy.

**Lesson for Us**: The math must BE the game, not a tax to play the game. Never create a pay-to-win dynamic. Keep ads out entirely.

### 4.2 Khan Academy Kids

**What it is**: Free educational app for ages 2-8 with games, books, and lessons building reading, math, and social-emotional skills. Over 21 million users.

**Gamification Mechanics**:
- Character guides (Ollo the Elephant, Reya the Red Panda, Peck the Hummingbird, Sandy the Dingo) each specializing in different skills
- Personalized learning paths adapting to each child's pace
- Simple reward mechanics (stickers, animations, celebrations)
- No ads, no subscriptions, completely free

**What Works Well**:
- Trusted brand with high-quality educational content
- Completely free with no monetization pressure on children
- Characters create emotional connection to different subject areas
- Personalized pacing prevents frustration

**Weaknesses**:
- Limited gamification depth -- engagement drops off for older children (8+) who want more "game" in their game
- Limited social/competitive features
- Not designed for classroom group use
- Aesthetic is too "young" for CM1-CM2 students

**Lesson for Us**: Free, ad-free, and trust-based models work for parents and schools. But deeper gamification is needed for 8-11 year olds.

### 4.3 DragonBox

**What it is**: A series of puzzle games that teach algebra, geometry, and numbers through progressive puzzle mechanics. Available in multiple languages including French.

**Gamification Mechanics**:
- Progressive puzzle difficulty -- each level introduces one new concept
- Math concepts discovered organically through gameplay rather than direct instruction
- Immediate feedback built into game mechanics (not as separate "grading")
- Colorful characters and visual metaphors for abstract concepts

**What Works Well**:
- Math concepts are learned through discovery, not instruction
- Feedback is immediate and built into the mechanics themselves
- Gradual complexity increase keeps players in the flow state
- Children learn algebra concepts without realizing they are doing algebra

**Weaknesses**:
- Limited replayability once puzzles are solved
- No social features or competition
- No long-term progression system beyond completing levels
- Each "game" (DragonBox Algebra, DragonBox Numbers, etc.) is a separate purchase
- No classroom management tools

**Lesson for Us**: Math-as-mechanics (not math-as-interruption) is the gold standard. Feedback should be immediate and intrinsic.

### 4.4 Mathador

**What it is**: French mental math game developed by Reseau Canope (official French Ministry of Education operator). Available as board game, online platform, and mobile app. CP to 6eme.

**Gamification Mechanics**:
- Multiple challenge types: imposed target, speed challenge, complexity challenge, quantity challenge
- 30 levels across 4 difficulty tiers
- Weekly competition ("rallye") from January to May for entire classes
- Teacher-created personalized learning paths
- Success percentage thresholds to unlock next exercises

**What Works Well**:
- Officially supported by the French Ministry of Education
- Multiple challenge formats prevent monotony
- Class rallye creates healthy inter-class competition
- Free for schools
- Dual mode: in-class and at-home practice

**Weaknesses**:
- Interface feels dated and not visually engaging for children raised on Brawl Stars/Roblox
- Limited avatar/customization features
- Competition is class-level only, not individual gamification
- No persistent reward economy (no coins, gems, unlockables)
- No mobile-first PWA design

**Lesson for Us**: French institutional support matters for adoption. The rallye format proves class competition works. But the UX/UI needs to match children's expectations from commercial games.

### 4.5 Calculatice (calcul@TICE)

**What it is**: Free French mental math training platform created by the academic inspection of Nord (Lille). CP to 6eme.

**Gamification Mechanics**:
- Exercises categorized by class level, skill, and difficulty
- Teacher-created personalized courses with student accounts
- Annual "Rallye Calculatice" -- inter-school math competitions
- Success percentage thresholds for progression
- Video integration capability for teachers

**What Works Well**:
- Completely free and institutionally supported
- Large exercise library covering the full French curriculum
- Rallye competitions create school-level engagement
- Works offline via standalone application

**Weaknesses**:
- Very basic visual design, no gamification beyond completion tracking
- No avatar, rewards, or progression systems
- Not mobile-optimized
- No adaptive difficulty -- teacher must manually set paths
- Feels like "exercises on a screen" rather than a game

**Lesson for Us**: Proves that schools want digital math practice tools. The rallye model works. But modern children need game-quality UX to stay engaged.

### 4.6 Logiciel Educatif

**What it is**: Popular French educational games website covering math, French, and other subjects for primary school.

**Gamification Mechanics**:
- Individual browser-based mini-games
- Simple scoring per game session
- Curriculum-aligned exercises

**Weaknesses**:
- No persistent progression or accounts
- No social features
- Games are disconnected from each other
- No adaptive difficulty
- Ad-supported model

**Lesson for Us**: Proves demand exists for French-language educational games. But standalone mini-games without persistence fail to build long-term engagement.

---

## 5. Brainrot Culture and Kids Trends (2024-2025)

### Why This Matters
To engage children, we need to understand their cultural language. Incorporating (or at least acknowledging) current trends makes the product feel "for them" rather than "from adults."

### What is "Brainrot"?
"Brain rot" was named Oxford Word of the Year in 2024. It describes digital media deemed low-quality or unchallenging, and the perceived cognitive impact of consuming it. In practice, it has become a cultural identity marker for Gen Alpha (born 2010-2025).

### Key Terms and Trends Among French Primary School Children

| Term | Meaning | Context |
|------|---------|---------|
| **Skibidi** | From "Skibidi Toilet" YouTube series. Used as an intensifier meaning "cool," "weird," or just as a catchphrase | Ubiquitous in playground culture. Teachers have banned it in classrooms. Over 20 billion TikTok views. |
| **Sigma** | A "lone wolf" masculine archetype. Used to describe someone cool, independent, confident | Children use it as a compliment. "T'es un sigma" = "You're cool/tough." |
| **Rizz** | Charisma, especially romantic charm | Used even by 7-8 year olds who do not fully understand the romantic connotation. |
| **Ohio** | Synonym for "bizarre" or "weird" | "C'est Ohio" = "That's weird." No connection to the actual US state. |
| **Gyatt** | Expression of surprise/admiration | Widely used on playgrounds, often without understanding original meaning. |
| **Fanum tax** | Taking food from someone's plate/meal | Used literally during school lunches and snack time. |
| **Bruh** | Expression of exasperation or disbelief | Universal across age groups. |
| **Sus** | Suspicious (from Among Us) | Still in active use despite Among Us declining in popularity. |

### Cultural References That Resonate

- **Skibidi Toilet** (YouTube animated series): Children reproduce scenes and songs on the playground. The series features a battle between toilet-headed characters and camera-headed heroes.
- **Anime/Manga**: Demon Slayer, Spy x Family, One Piece, Naruto remain hugely popular. Pokemon maintains cultural relevance.
- **Roblox and Brawl Stars**: Central to playground social currency. "Which brawler do you main?" is a common conversation starter.
- **YouTube/TikTok creators**: Children aspire to be content creators. One third of Gen Alpha children dream of being YouTubers.
- **Huggy Wuggy, Poppy Playtime, Backrooms**: Horror-adjacent content that children find thrilling.

### How to Use This in Our Design
- **Do NOT try to be "fellow kids"** -- forced use of brainrot slang will feel cringe.
- **DO incorporate the aesthetic**: Fast, snappy animations. Bold colors. Quick reward feedback. The energy and pace that children are accustomed to.
- **Consider themed cosmetic items** that reference popular culture without directly copying IP (e.g., camera-headed characters, toilet humor options, sigma-pose emotes).
- **Achievement/badge names** could playfully reference these trends (e.g., "Sigma Solver," "Rizz-matic Calculator") -- used sparingly and as Easter eggs rather than core branding.
- **Keep it updateable**: These trends change every 3-6 months. The system should support seasonal cosmetic themes that can be refreshed.

---

## 6. Point and Reward Systems

### Research Findings

#### The Fundamental Balance: Intrinsic vs. Extrinsic Motivation
- External rewards (points, badges) can **inhibit development of intrinsic motivation**, which is associated with long-term behavior maintenance.
- However, properly designed rewards can **scaffold intrinsic motivation** -- they help children experience competence, which then generates its own motivation.
- The key: rewards should **acknowledge effort and mastery**, not just completion. Points for "I solved a hard problem" > points for "I clicked the button."

#### Optimal Point Structure for Math Education

**Recommended: Dual-Currency System**

| Currency | Name Suggestion | Earn Method | Spend On |
|----------|----------------|-------------|----------|
| Soft currency | **Coins** (Pieces d'or) | Correct answers, daily login, streaks, quests | Character upgrades, power-ups, basic cosmetics |
| Hard currency | **Gems** (Gemmes) | Exceptional performance, weekly challenges, class achievements, milestones | Premium cosmetics, exclusive items, special unlocks |

**Why dual currency works**:
- Soft currency provides constant, predictable rewards (every session earns coins).
- Hard currency creates aspirational goals (saving up for something special).
- Separation prevents inflation -- if everything costs coins, coins lose perceived value.
- Only 2 currencies maximum to avoid confusion for young children.

#### Scoring for Correct/Incorrect Answers

**Recommended Model: Asymmetric with Difficulty Weighting**

```
Correct answer:
  Base points: 10
  Speed bonus: +1 to +5 (based on answer time, scaled to difficulty)
  Difficulty multiplier: x1 (easy), x2 (medium), x3 (hard)
  Streak bonus: +2 per consecutive correct (caps at +10)

  Example: Hard problem, answered quickly, on a 4-streak
  = (10 + 4) x 3 + 8 = 50 points

Incorrect answer:
  Points lost: 0 (NEVER subtract points)
  Streak reset: yes (streak counter returns to 0)
  Feedback: Show correct answer, explain briefly
  Retry bonus: Half points available if retried successfully
```

**Critical rule: NEVER subtract points for wrong answers.** This is the single most important design decision. Losing points creates anxiety, discourages risk-taking, and penalizes children who attempt harder problems. Instead, the "penalty" is the lost opportunity for streak bonuses and the streak reset.

#### Combo/Streak System

Inspired by Duolingo and Brawl Stars:

- **Daily streaks**: Login and complete at least 1 exercise per day. Streak counter increments.
  - 7-day streak: Users are 3.6x more likely to stay engaged long-term (Duolingo data).
  - Visual streak counter prominently displayed (fire icon, growing flame).
  - **Streak freeze**: Allow 1 free "streak freeze" per week (earned, not purchased). Reduces churn by ~21% (Duolingo data).
  - Streak milestones: Special rewards at 7, 14, 30, 60, 100 days.

- **In-session combo streaks**: Consecutive correct answers within a single session.
  - Visual combo counter (x2, x3, x4...) with escalating visual effects.
  - Point multiplier increases with each correct answer.
  - Combo breaks on incorrect answer but does NOT penalize -- just resets to x1.
  - Max combo displayed as a personal record to beat.

- **Weekly streaks**: Complete exercises on at least 4 of 7 days = weekly reward.

#### Preventing System Gaming

| Exploit | Prevention |
|---------|------------|
| Spam-clicking random answers | Minimum display time per question (3-5 seconds). Speed bonus only activates after minimum time. |
| Repeatedly doing easy problems for coins | Diminishing returns on repeated difficulty levels. "You've mastered this! Try harder problems for more coins." |
| Creating multiple accounts | Teacher-managed accounts only. No self-registration. |
| Sharing answers | Dynamic question generation -- same concept, different numbers each time. |
| Using calculators/external tools | Time limits per question (appropriate to difficulty). Visual/interactive answer formats that are hard to look up. |
| Farming streak freezes | Maximum 1 per week. Must be earned through activity. |

---

## 7. Avatar and Collectible Systems

### Research Findings

#### What Children (6-11) Want in Avatars

Research from CHI 2025 (ACM) studying children aged 8-13 in social online games found:

- **Primary motivations for avatar customization**:
  1. Self-representation ("This looks like me")
  2. Alter ego experimentation ("I want to look like a ninja")
  3. Social connection ("My friend and I match")
  4. Status signaling ("I have something rare")

- **Visual preferences**: Children gravitate toward colorful, whimsical, and fantastical designs. Simple visual appeal is the main driver behind choices.

- **The "default skin" effect**: Children avoid default appearances because they signal "newbie" status. Even minimal customization options dramatically improve engagement.

- **The wardrobe effect**: Children accumulate many items but typically use one favorite. The act of collecting is itself rewarding, independent of use.

#### Recommended Avatar System

**Base Avatar**: Simple, customizable character with:
- Face shape (5-6 options)
- Hair style (10-12 options including various textures/lengths)
- Skin tone (diverse range)
- Eye style (6-8 options)
- Basic outfit (5-6 starter options)

**Unlockable Cosmetics** (earned through gameplay, NEVER pay-to-win):

| Category | Examples | Earn Method |
|----------|----------|-------------|
| **Hats/Headwear** | Crowns, animal ears, helmets, wizard hats | Achievement rewards, milestone unlocks |
| **Outfits** | Themed costumes (space, medieval, sports, animal) | Gem purchases, seasonal events |
| **Accessories** | Glasses, backpacks, wings, pets | Streak rewards, challenge completion |
| **Frames/Borders** | Profile frame decorations | Class/school competition rewards |
| **Emotes/Celebrations** | Victory dances, expressions | Combo milestones, special events |
| **Titles** | "Math Wizard," "Speed Demon," "Sigma Solver" | Achievement-based, non-purchasable |
| **Backgrounds** | Profile background themes | Seasonal events, gem purchases |

#### Collectible Rarity System

Inspired by Brawl Stars rarity tiers:

| Rarity | Color | Drop Rate | Examples |
|--------|-------|-----------|----------|
| Common | Grey | Always available | Basic hats, simple accessories |
| Rare | Blue | Weekly rewards | Themed outfits, fun glasses |
| Epic | Purple | Monthly milestones | Animated accessories, special pets |
| Legendary | Gold | Seasonal events, exceptional achievement | Unique skins, animated frames |
| Mythic | Red | One-time achievements only | "100-day streak" crown, "School champion" cape |

#### Seasonal/Limited Items
- **New themed items each school trimester** (fall, winter, spring).
- **Competition-exclusive rewards** that cannot be obtained any other way.
- **Limited-time event cosmetics** (Semaine des Maths, holiday themes).
- Items display "Obtained: [date]" to create collector value.

---

## 8. Anti-Frustration Features

### Why This Is Critical
Frustration is the number one reason children abandon educational games. Games with balanced difficulty scaling have a **40% higher player retention rate** compared to those with erratic difficulty progression.

### Adaptive Difficulty (Zone of Proximal Development)

**Research basis**: Vygotsky's Zone of Proximal Development (ZPD) states that optimal learning occurs when tasks are slightly beyond a child's current ability but achievable with effort. Adaptive difficulty games show significantly higher learning outcomes than non-adaptive versions.

**Implementation**:
```
Performance tracking:
  - Rolling accuracy over last 20 questions
  - Per-skill accuracy tracking
  - Response time analysis

Difficulty adjustment:
  If accuracy > 85% for 10+ questions:
    -> Increase difficulty by 1 level
    -> Visual: "You're on fire! Trying harder problems!"

  If accuracy between 60-85%:
    -> Maintain current difficulty (optimal zone)
    -> Visual: Normal gameplay

  If accuracy between 40-60%:
    -> Mix in 30% easier problems to rebuild confidence
    -> Visual: Encouraging messages

  If accuracy < 40% for 10+ questions:
    -> Decrease difficulty by 1 level
    -> Show mini-tutorial/hint for the concept
    -> Visual: "Let's practice this together!"
```

### Handling Losing Streaks

**The "3-strike safety net"**: After 3 consecutive wrong answers on the same concept:
1. First wrong: Show correct answer with brief explanation.
2. Second wrong: Show a simpler version of the same problem type with a hint.
3. Third wrong: Switch to a different, easier topic. Return to the difficult concept later in the session.

**The "comeback bonus"**: After a losing streak, the next correct answer earns bonus points ("Comeback! +5 bonus"). This emotional recovery moment is crucial.

**Never show negative statistics**: Do not display "You got 3/10 wrong." Instead show "You got 7/10 right!" or "You improved by 2 since last time!"

### Handling Difficulty Spikes

- **Gradual difficulty curves**: Never jump more than one difficulty level at a time.
- **"Practice mode" option**: Children can opt into an unscored practice mode for any topic without affecting their stats or streaks.
- **Scaffolded hints**: Progressive hint system (hint 1: general direction, hint 2: partial answer, hint 3: full walkthrough) that trades points for help.
- **No dead ends**: Every screen has a "skip" option (limited uses per session). Skipped problems return later at reduced difficulty.

### Long-Term Engagement (Weeks/Months)

| Timeframe | Engagement Mechanic | Purpose |
|-----------|---------------------|---------|
| Daily | Daily quest (1-2 specific tasks) | Creates login habit |
| Daily | Streak counter | Loss aversion maintains consistency |
| Weekly | Weekly challenge (themed, higher difficulty) | Provides medium-term goals |
| Weekly | Class leaderboard reset | Fresh competition every week |
| Monthly | New cosmetic items / seasonal theme | Novelty and excitement |
| Trimestral | School competition / rallye | Large-scale social motivation |
| Yearly | End-of-year awards, "yearbook" stats | Celebration and reflection |

### Key Design Principles

1. **Fail forward**: Every failure should teach something and never feel punishing.
2. **Multiple paths to success**: If a child is stuck on multiplication, let them earn rewards through addition while multiplication skills develop.
3. **Celebrate effort, not just accuracy**: "You practiced for 15 minutes today!" is as valuable as "You got 10/10!"
4. **Recovery moments**: After every difficulty spike, provide a guaranteed "win" to rebuild confidence.
5. **Respect the child's emotional state**: If response times suddenly increase or accuracy drops sharply, offer a break or switch topics.

---

## 9. Social Features Without Toxicity

### The Core Challenge
Leaderboards and competition are powerful motivators, but poorly designed systems can cause shame, bullying, and disengagement among struggling students. Research shows that students consistently at the bottom of leaderboards feel discouraged and stigmatized.

### Safe Leaderboard Designs

#### 1. Relative/Windowed Leaderboard
- Each student sees only the 2 students directly above and 2 below them.
- Students never see the full ranking or who is at the bottom.
- This provides competitive motivation without exposing struggling students.

#### 2. Multi-Metric Leaderboards
Instead of a single "points" leaderboard, rotate or display multiple rankings:
- **Speed Champion**: Fastest average response time
- **Streak Master**: Longest current streak
- **Most Improved**: Biggest accuracy improvement this week
- **Persistence Star**: Most problems attempted
- **Perfect Scorer**: Most perfect scores on exercises
- **Helper Hero**: (If peer features exist) Most helpful interactions

This ensures different students can excel at different metrics.

#### 3. Team-Based Competition
- **Class teams**: Divide the class into 3-4 teams. Display team totals, not individual scores.
- Research shows team leaderboards promote collaborative learning and team spirit.
- Teams can be reshuffled weekly/monthly to prevent fixed social hierarchies.
- Team names and avatars can be collectively chosen, building ownership.

#### 4. Class vs. Class / School vs. School
- Aggregate class performance into a single score.
- Classes compete against other classes (within school or between schools).
- Individual performance contributes to collective score, creating positive peer motivation.
- No individual student is singled out.

### Anonymization Strategies
- **Leaderboard aliases**: Use avatar names or randomly assigned animal names instead of real names on public boards.
- **Bottom-half anonymization**: Only the top 50% of names are displayed; the bottom 50% shows "and 12 other students."
- **Teacher control**: Teachers can toggle leaderboard visibility on/off per student (for children who are particularly sensitive to competition).

### Preventing Bullying Through Design

| Risk | Mitigation |
|------|------------|
| Mocking lowest-ranked students | Windowed leaderboards; only show nearby ranks |
| "Carrying" pressure in teams | Team composition is hidden; individual contributions are private |
| Bragging about high scores | Limit direct comparison; celebrate improvement over absolute position |
| Exclusion of struggling students | Multiple metrics ensure everyone can excel at something |
| Screen-sharing leaderboards in class | Teacher-only view for full rankings; student view is always windowed |

### Social Features That Work

- **Class challenges**: "Can our class collectively solve 1,000 problems this week?" Cooperative goals with shared rewards.
- **Duel mode (opt-in)**: Two students solve the same problems simultaneously. Both earn points. Winner gets a small bonus. Losers still gain. Opt-in only.
- **Encouragement system**: Students can send pre-set encouraging messages to classmates ("Nice streak!" "Keep going!"). No free-text to prevent misuse.
- **Group achievements**: Badges that require the entire class to participate (e.g., "Every student in the class completed at least 5 problems today").

---

## 10. PWA Game Design Patterns

### Why PWA?
- **No app store installation required**: Critical for school deployment where IT departments restrict app installations.
- **Cross-platform**: Works on tablets, Chromebooks, phones, and desktop.
- **Offline capability**: Service workers enable use in classrooms with unreliable internet.
- **Instant updates**: No app store review process; updates deploy immediately.
- **Low storage footprint**: No 100MB+ app downloads.

### Performance Best Practices

#### Loading and Initial Experience
- **Target**: First meaningful paint in under 3 seconds on 3G.
- **App shell architecture**: Cache the UI shell immediately; load content dynamically.
- **Progressive loading**: Load essential game assets first (question display, answer buttons), then load cosmetic elements (avatars, animations) in the background.
- **Skeleton screens**: Show layout placeholders while content loads rather than blank screens or spinners.

#### Asset Management
- **Lazy loading**: Load game assets only when needed (e.g., avatar customization screen assets load only when that screen opens).
- **Image optimization**: WebP format, responsive images, SVG for UI elements.
- **Asset budget**: Core game should function within 5MB initial download. Extended assets (cosmetics, animations) load progressively up to 15MB total.
- **Compression**: Brotli/gzip for all text assets; sprite sheets for small images.

#### Offline Strategy

```
Cache layers:

1. PRECACHE (install event):
   - App shell (HTML, CSS, core JS)
   - Core game logic
   - Essential UI assets (buttons, icons)
   - Current user's avatar data

2. RUNTIME CACHE (cache-first):
   - Cosmetic assets (skins, items)
   - Sound effects
   - Animation files

3. NETWORK-FIRST:
   - Question banks (with fallback to cached set)
   - Leaderboard data
   - User progress sync

4. OFFLINE QUEUE:
   - Store completed exercises locally
   - Sync to server when connectivity returns
   - Conflict resolution: server wins for leaderboards, merge for progress
```

### Touch and Input Design for Children

#### Touch Targets
- **Minimum 48x48px** touch targets (WCAG 2.5.8 requires 24x24px minimum; we double it for children's motor skills).
- **Generous spacing**: At least 12px between interactive elements.
- **Large answer buttons**: Full-width buttons for answer selection, minimum 56px height.
- **No hover-dependent interactions**: Everything must work with tap/touch.

#### Input Methods
- Support **keyboard, mouse, touch, and stylus** inputs.
- **Number pad input**: Custom on-screen number pad for math answers (more reliable than relying on device keyboard).
- **Drag-and-drop**: For ordering, matching, and grouping exercises.
- **Handwriting recognition** (future): Could use canvas-based digit recognition for a more natural math feel.

### Responsive Design
- **Mobile-first**: Design for 320px width first, then scale up.
- **Breakpoints**: 320px (phone), 768px (tablet portrait), 1024px (tablet landscape/desktop).
- **Orientation handling**: Games must work in both portrait and landscape.
- **Font sizing**: Minimum 16px base, 20px+ for question text. Never smaller than 14px for any text.

### Installation and PWA-Specific UX
- **Smart install prompt**: Show after 3rd visit (not immediately). "Add to home screen for faster access!"
- **Offline indicator**: Clear visual when offline ("Offline mode -- your progress will sync when you reconnect").
- **Update notification**: "New features available! Tap to update." Non-blocking.
- **Push notifications** (with parental consent): Daily streak reminders, class challenge updates. Must be opt-in and respectful.

### Audio Design
- **Sound effects for feedback**: Correct answer (satisfying "ding"), wrong answer (gentle, non-punishing sound), streak break (soft "whoosh"), level up (celebratory).
- **Background music**: Optional, off by default in classroom mode. Light, non-distracting.
- **All audio must be optional**: Mute button always accessible. Game fully functional without sound.

---

## 11. Key Takeaways and Recommendations

### The Golden Rules

1. **Math IS the game, not a gate to the game** (anti-Prodigy pattern). Every interaction should involve math, and the math should feel like gameplay.

2. **Never subtract points for wrong answers.** Use streak resets and missed bonus opportunities instead. The absence of reward is sufficient feedback.

3. **Asymmetric win/loss** (Brawl Stars pattern): Children should always feel net forward progress, even when they struggle.

4. **Adaptive difficulty is non-negotiable.** Keep children in their Zone of Proximal Development through dynamic adjustment.

5. **Dual currency (coins + gems)** provides both constant reward flow and aspirational goals.

6. **Avatar customization drives engagement** far more than points alone. Cosmetic rewards are the primary long-term motivator.

7. **Short sessions (5-10 minutes)** match both classroom constraints and children's attention spans.

8. **Streaks build habits.** Daily streaks with streak freezes are the most proven retention mechanic in educational software.

9. **Team competition over individual ranking.** Protect struggling students while maintaining competitive motivation.

10. **Seasonal freshness** (new cosmetics, themes, challenges each trimester) prevents staleness.

### Recommended Engagement Architecture

```
DAILY LOOP:
  -> Login (streak check + daily reward)
  -> Daily quest (e.g., "Solve 10 multiplication problems")
  -> Core practice (adaptive difficulty, earn coins)
  -> Session summary (stats, coins earned, streak updated)
  Duration: 5-15 minutes

WEEKLY LOOP:
  -> Weekly challenge unlocks Monday
  -> Class leaderboard tracks weekly performance
  -> Team points accumulate
  -> Weekly reward Friday (gems or rare cosmetic)
  Duration: 5-7 daily sessions

MONTHLY/TRIMESTRAL LOOP:
  -> Seasonal theme change
  -> New cosmetic items available
  -> School-level competition / rallye
  -> "Big unlock" milestone reward
  -> Progress report for teacher/parent

YEARLY LOOP:
  -> Grade-level progression (CP -> CE1 -> CE2, etc.)
  -> End-of-year celebration and stats
  -> Summer challenge mode (optional, lighter)
  -> Achievement showcase / "yearbook"
```

### What We Should NOT Do

- **No pay-to-win.** All gameplay-relevant content must be free. Cosmetic premium content only, if any monetization is needed.
- **No ads to children.** Ever.
- **No loot boxes / gacha mechanics.** These are exploitative and increasingly regulated. Rewards should be transparent and earned.
- **No free-text chat between students.** Pre-set messages only to prevent bullying and inappropriate content.
- **No public shaming.** Never display "worst performers" or "most wrong answers."
- **No mandatory social features.** Everything social should be opt-in or teacher-controlled.
- **No dark patterns.** No artificial urgency, no guilt-tripping notifications, no "your pet is sad because you didn't play today."

### Competitive Advantages Over Existing Solutions

| Feature | Prodigy | Khan Kids | Mathador | Calculatice | **Our Solution** |
|---------|---------|-----------|----------|-------------|-----------------|
| French curriculum aligned | No | No | Yes | Yes | **Yes** |
| Modern gamification | Yes (broken) | Limited | Limited | No | **Yes** |
| Avatar system | Yes (P2W) | No | No | No | **Yes (earned)** |
| Adaptive difficulty | Yes | Yes | Limited | No | **Yes** |
| Class management | Basic | No | Yes | Yes | **Yes** |
| Free/no ads | No | Yes | Yes (schools) | Yes | **Yes** |
| PWA/offline | No | No | No | Partial | **Yes** |
| Anti-frustration | Limited | Yes | Limited | No | **Yes** |
| Social competition | Limited | No | Rallye only | Rallye only | **Yes (multi-level)** |
| Brainrot-aware UX | No | No | No | No | **Yes** |

---

## References and Sources

### Game Analysis
- Brawl Stars Wiki: Trophy system, progression mechanics
- Supercell blog: Trophy Season Rework announcements
- Roblox Developer Forum: UGC Limiteds program
- Roblox Support: Safety features, parental controls
- Minecraft Wiki: Advancement and Achievement systems

### Educational Games
- Prodigy Math Game case studies and criticism (Fairplay, Common Sense Media, NBC News)
- Khan Academy Kids platform analysis
- DragonBox review (Recess.gg)
- Mathador official site and Reseau Canope documentation
- Calculatice (calcul@TICE) platform and Rallye documentation

### Academic Research
- CHI 2025: "Understanding Children's Avatar Making in Social Online Games" (Fu et al.)
- PMC: "Leaderboard Design Principles to Enhance Learning and Motivation" (Christy & Fox)
- ScienceDirect: "The effectiveness of adaptive difficulty adjustments on students' motivation and learning"
- Frontiers in Education: "Points and the Delivery of Gameful Experiences"
- Csikszentmihalyi flow theory applied to game design (Chen, 2007)
- Vygotsky ZPD and adaptive educational technology

### Industry Analysis
- Duolingo gamification strategy (Deconstructor of Fun, multiple case studies)
- Game economy design for F2P (Machinations.io)
- Naavik: "Roblox Brings Scarcity to UGC"
- Deconstructor of Fun: "Brawl Stars, to the Moon!"

### Cultural Research
- Oxford University Press: "Brain rot" Word of the Year 2024
- Gen Alpha slang surveys (Parade, Promova, NBC News)
- Junior City: TikTok as preferred social network for pre-teens in France
- Wikipedia: Brain rot, Skibidi Toilet cultural phenomenon
