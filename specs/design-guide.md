# Classe Master - Design Guide

## Visual Language

- **Modern & Clean**: Generous whitespace, clear hierarchy, rounded shapes
- **Pixel Art Personality**: Avatar characters, decorative accents, chunky borders for playful touches
- **Child-Friendly**: Large touch targets (min 48px), high contrast, vibrant but not overwhelming colors

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| primary | #4f46e5 | Main CTA, branding |
| primary-light | #818cf8 | Hover states, accents |
| success | #22c55e | Correct answers, positive feedback |
| error | #f87171 | Wrong answers, errors |
| warning | #fbbf24 | Hints, streaks |
| xp-gold | #f59e0b | XP rewards |
| gem-purple | #a855f7 | Gems, special items |
| answer-a | #dbeafe | MC answer A (blue tint) |
| answer-b | #d1fae5 | MC answer B (green tint) |
| answer-c | #fce7f3 | MC answer C (pink tint) |
| answer-d | #fef3c7 | MC answer D (yellow tint) |

## Shadows

- **shadow-soft**: Subtle elevation for cards at rest
- **shadow-card**: Standard card elevation
- **shadow-glow**: Colored glow for interactive focus states

## Typography

- System font stack for performance
- Question prompts: text-4xl bold
- Answer buttons: text-xl bold
- Numpad digits: text-2xl bold
- Display area: text-3xl bold

## Animations

- **slideUp**: Content entrance from below (300ms)
- **fadeIn**: Opacity entrance (200ms)
- **scaleIn**: Scale from 0.8 to 1 (200ms)
- **bounceIn**: Playful entrance with overshoot (500ms)
- **shake**: Error feedback (400ms)
- **pulse-success**: Correct answer celebration (600ms)

## Layout Principles

- Exercise screen: full-height flex column, no scrolling
- Top bar: single compact row (score, counter, timer)
- Question: flex-grow center, maximum readability
- Answers: bottom-anchored, generous touch targets

## Pixel Art Style

- Avatar images: 128x128 pixel art, `image-rendering: pixelated`
- Decorative borders: 4px solid with stepped corners
- Retro-inspired accents mixed with modern card UI
