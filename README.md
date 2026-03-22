<div align="center">

# Meridian - Frontend

### AI-Powered Career Mentorship for Everyone

An intelligent career guidance platform that uses conversational AI to help people discover career paths, test-drive skills, and make informed decisions — especially those who've never had access to a mentor.

**[Live Demo](https://meridian-cbc.netlify.app)** | **[Backend Repository](https://github.com/Girik1105/Meridian-backend)**

---

*Built at HackASU 2026 — Track 3: Economic Empowerment & Education*

</div>

## The Problem

Millions of people navigate career decisions without guidance. Career counselors are scarce, expensive, or inaccessible. First-generation college students, career changers, and underserved communities are left guessing — often investing time and money into paths that don't fit them.

**Meridian bridges this gap** by providing personalized, AI-driven career mentorship that adapts to each user's unique background, constraints, and aspirations.

## What Meridian Does

1. **Conversational Onboarding** — A multi-turn AI conversation maps your background, constraints, interests, and goals into a structured profile. No forms — just a natural conversation.

2. **Career Path Discovery** — Using your profile, Meridian generates 2-3 realistic career paths with salary ranges, timelines, required skills, and ROI analysis grounded in your real constraints.

3. **Skill Tasters** — 30-minute interactive crash courses that let you "try before you commit." Read, practice, and reflect — then receive an honest AI assessment of your fit.

4. **Persistent AI Mentor** — Context-aware conversations that remember your history, reference past tasters, and evolve as you do.

## Screenshots

### Landing Page
The landing page introduces Meridian's mission with a hero section featuring a dynamic typing effect, problem statement, feature highlights, and clear calls to action.

### Dashboard
After onboarding, users see their personalized journey hub with a 3-step progress track (Onboarding, Career Discovery, Skill Tasters), profile snapshot chips, and action buttons for each stage.

### Conversational Onboarding
A natural chat interface with dynamic input widgets (sliders, multi-select pills, single-select cards) that make profile building feel like a conversation, not a form.

### Career Path Discovery
AI-generated career paths displayed as expandable cards with salary ranges, timelines, required skills, ROI breakdowns, and match reasoning — sortable by best match, ROI, speed, or cost.

### Skill Taster Player
An interactive module-by-module experience with read, exercise, and reflect sections — followed by an honest AI assessment with a structured learning plan.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.2 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Fonts** | DM Sans (headings) + Source Serif 4 (body) + JetBrains Mono (data) |
| **Auth** | Cookie-based JWT with auto-refresh |
| **Streaming** | SSE via fetch + ReadableStream |
| **Deployment** | Netlify |

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout with fonts
│   ├── globals.css               # Design system + animations
│   ├── login/                    # Sign in
│   ├── register/                 # Create account
│   ├── dashboard/                # Journey hub (post-auth)
│   ├── career-paths/             # Career discovery
│   ├── tasters/                  # Skill taster hub
│   ├── tasters/[id]/             # Taster player
│   ├── forgot-password/
│   └── reset-password/
│
├── components/
│   ├── landing/                  # Landing page sections
│   │   ├── Navbar.tsx            # Fixed nav with mobile drawer
│   │   ├── Hero.tsx              # Typing effect hero
│   │   ├── ProblemStatement.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── Mission.tsx
│   │   └── Footer.tsx
│   │
│   ├── onboarding/               # Conversational onboarding
│   │   ├── OnboardingFlow.tsx    # 3-phase orchestrator
│   │   ├── ChatThread.tsx        # Auto-scrolling messages
│   │   ├── ChatMessage.tsx       # Styled message bubbles
│   │   ├── ChatInput.tsx         # Text input fallback
│   │   ├── ProfileProgress.tsx   # Progress indicator
│   │   ├── CompletionScreen.tsx  # Celebration screen
│   │   └── widgets/              # Dynamic input widgets
│   │       ├── SliderWidget.tsx
│   │       ├── SingleSelectWidget.tsx
│   │       ├── MultiSelectWidget.tsx
│   │       ├── FreeTextWidget.tsx
│   │       └── CompositeWidget.tsx
│   │
│   ├── career/                   # Career path discovery
│   │   ├── CareerPathsView.tsx   # Orchestrator
│   │   ├── CareerPathCard.tsx    # Expandable path cards
│   │   ├── ROIBreakdown.tsx      # Investment vs ROI viz
│   │   ├── SortBar.tsx           # Sort controls
│   │   └── SelectConfirmation.tsx
│   │
│   └── taster/                   # Skill taster experience
│       ├── TasterHub.tsx         # Taster list
│       ├── TasterPlayer.tsx      # Module player
│       ├── ModuleContent.tsx     # Content renderer
│       ├── TasterAssessment.tsx  # AI assessment display
│       └── TasterHelpPanel.tsx   # Help side panel
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication state
│   ├── useChat.ts                # SSE streaming + messages
│   ├── useTypingEffect.ts       # Landing hero animation
│   ├── useCountUp.ts            # Number animations
│   └── useScrollAnimation.ts    # Scroll triggers
│
├── lib/
│   └── api.ts                    # API client with auto-refresh
│
└── types/
    ├── career.ts                 # CareerPath + ROIData types
    └── taster.ts                 # SkillTaster types
```

## Key Features

### Real-Time AI Streaming
Claude's responses stream token-by-token via SSE using `fetch` + `ReadableStream` (not EventSource, to support auth headers). Users see responses appear naturally as the AI thinks.

### Dynamic Widget System
During onboarding, the AI can request specific input widgets (sliders, multi-select pills, single-select cards, free text, composites) instead of plain text. The backend sends a widget spec in the response, and the frontend renders the appropriate interactive component.

### Progressive Journey
The dashboard tracks users through a 3-step journey: Onboarding, Career Discovery, and Skill Tasters. Each stage unlocks based on the previous one's completion, with the AI getting smarter at each step.

### ROI Analysis
Career paths include investment (learning hours, cost, difficulty) vs. return (salary uplift, job demand) breakdowns, helping users make data-informed decisions.

## Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#1E2A5E` | Headings, buttons, user chat bubbles |
| Secondary | `#2BBCB3` | Active states, progress, links |
| Accent | `#E8973A` | CTAs, badges, highlights, warmth |
| Success | `#4CAF82` | Completion states |

### Typography
- **DM Sans** — Headings, buttons, labels
- **Source Serif 4** — Chat messages, descriptions, long-form text
- **JetBrains Mono** — Salaries, scores, data points

### Animations
Custom CSS animations for card entries (`fade-in-up`), floating icons (`float`), and subtle pulses (`pulse-glow`) with staggered delays for natural motion.

## Getting Started

### Prerequisites

- Node.js 18+
- The [backend server](https://github.com/Girik1105/Meridian-backend) running

### 1. Clone and install

```bash
git clone https://github.com/Girik1105/Meridian-frontend.git
cd Meridian-frontend
npm install
```

### 2. Configure environment

Create a `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The backend must be running for AI features to work. See the [backend setup guide](https://github.com/Girik1105/Meridian-backend#getting-started).

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js App                       │
│                                                     │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Landing  │  │Dashboard │  │  Feature Pages    │  │
│  │  Page    │  │  (Hub)   │  │  Career / Taster  │  │
│  └─────────┘  └────┬─────┘  └────────┬──────────┘  │
│                     │                 │              │
│              ┌──────▼─────────────────▼──────┐      │
│              │     useAuth() + useChat()      │      │
│              │     (Core Hooks)               │      │
│              └──────────────┬────────────────┘      │
│                             │                        │
│              ┌──────────────▼────────────────┐      │
│              │     apiFetch() — lib/api.ts    │      │
│              │     Auto-refresh on 401        │      │
│              └──────────────┬────────────────┘      │
└─────────────────────────────┼───────────────────────┘
                              │ REST + SSE
                    ┌─────────▼──────────┐
                    │   Django Backend   │
                    │   + Claude API     │
                    └────────────────────┘
```

## Design Philosophy

- **Empowerment over dependency** — Help users make their own informed decisions, never prescribe
- **Transparency** — Claude explicitly states it is AI, not a licensed counselor
- **No cultural assumptions** — Asks "what does a better situation look like to *you*?"
- **Honest assessments** — "This is based on a 30-minute sample. A real decision deserves more exploration."
- **Conversation, not forms** — Natural interaction with smart widgets when structure helps

## License

This project was built for HackASU 2026.
