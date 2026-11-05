# Persona Engine Reference

**File:** `src/personaEngine.js`

The Persona Engine defines a complete identity for algorithm building.

## Niche Presets

Quick-start templates:

| Preset | Focus |
|--------|-------|
| `crypto-degen` | Crypto, DeFi, web3, memecoins |
| `tech-builder` | Building in public, SaaS, indie hacking |
| `ai-researcher` | AI/ML, LLMs, papers, agents |
| `growth-marketer` | Content strategy, copywriting, audience building |
| `finance-investor` | Stocks, markets, portfolio management |
| `creative-writer` | Writing craft, storytelling, books |
| `custom` | Define your own |

## Activity Patterns

Human-like schedules:

| Pattern | Description |
|---------|-------------|
| `night-owl` | Active late night, sleeps mornings |
| `early-bird` | Active from 5am, winds down by 10pm |
| `nine-to-five` | Checks before/after work, active evenings |
| `always-on` | Creator schedule, active throughout the day |
| `weekend-warrior` | Light weekdays, heavy weekends |

## Engagement Strategies

| Strategy | Follows/day | Likes/day | Comments/day |
|----------|-------------|-----------|-------------|
| `aggressive` | 80 | 150 | 40 |
| `moderate` | 40 | 80 | 20 |
| `conservative` | 15 | 40 | 8 |
| `thoughtleader` | 20 | 60 | 30 (deep) |

## Key Exports

```js
import {
  createPersona, savePersona, loadPersona, listPersonas, deletePersona,
  buildPersonaSystemPrompt, buildCommentPrompt, buildPostPrompt,
  shouldBeActive, planSession, getSessionDuration,
  NICHE_PRESETS, ACTIVITY_PATTERNS, ENGAGEMENT_STRATEGIES,
} from './personaEngine.js';
```

## CLI Commands

```bash
# Create persona interactively
nanomind-x persona create

# Create with options
nanomind-x persona create --preset crypto-degen --strategy aggressive --activity night-owl

# List all personas
nanomind-x persona list

# Run algorithm builder (24/7)
nanomind-x persona run <personaId>
nanomind-x persona run <personaId> --no-headless    # visible browser
nanomind-x persona run <personaId> --dry-run        # preview mode
nanomind-x persona run <personaId> --sessions 5     # stop after 5 sessions

# Check stats
nanomind-x persona status <personaId>

# Edit persona
nanomind-x persona edit <personaId> --topics "ai,llm,agents" --strategy thoughtleader

# Delete persona
nanomind-x persona delete <personaId>
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `OPENROUTER_API_KEY` | Required for LLM-generated comments and posts |
| `NANOMIND_X_SESSION_COOKIE` | X auth token (alternative to `--token` flag) |

## Getting Started (5 minutes)

```bash
# 1. Set your OpenRouter key
export OPENROUTER_API_KEY=sk-or-v1-...

# 2. Login to X
nanomind-x login

# 3. Create a persona
nanomind-x persona create --preset crypto-degen --strategy thoughtleader --activity always-on

# 4. Start building (runs forever)
nanomind-x persona run persona_1234567890
```
