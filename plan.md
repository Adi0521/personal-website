# Personal Website — Build Plan
**Aditya Kewalram** | CS + Bioengineering @ UIUC

---

## Vision
A bold, playful personal website with immersive 3D Spline scenes mapped to real work:
- A **car driving** for the Self-Driving MiniCar project
- **Protein strands** rotating for the RuBisCO bioinformatics research
- **Neuron spikes** for brain/EEG research at Engelken Lab and Attune
- **3D servers/computers** for cloud and ML engineering roles

Scroll-triggered 3D, sound effects on interactions, hybrid scroll + detail page architecture.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) + TypeScript |
| Styling | Tailwind CSS |
| 3D | @splinetool/react-spline |
| Animation | Framer Motion |
| Audio | Howler.js |
| Fonts | Clash Display (headlines), Syne or Inter (body) |
| Hosting | Vercel |

**Color Palette:** Sunset — orange + pink + deep blue
**Aesthetic:** Bold, colorful, playful. Blocky/retro headlines, clean body text.

---

## Site Structure

### Main Scroll Page (`/`)

| # | Section | 3D Element | Notes |
|---|---|---|---|
| 1 | **Hero** | Neural network / abstract AI brain | Full name, role, short bio, scroll-down arrow |
| 2 | **About** | — | Bio paragraph + student org chips |
| 3 | **Experience** | Per role (see below) | Vertical timeline |
| 4 | **Projects** | Per project (see below) | Horizontal carousel |
| 5 | **Skills** | — | Categorized badge grid |
| 6 | **Education** | — | UIUC card |
| 7 | **Contact** | — | Email, GitHub, LinkedIn |

### Experience Timeline (5 Roles)

| Company | Role | 3D Scene |
|---|---|---|
| Motate | Software Engineering Intern | Server / cloud |
| Engelken Lab @ UIUC | Undergraduate Research Assistant | Neuron spike |
| Divergence 2% LLC | Undergraduate Researcher | Abstract AI / LLM |
| Attune NeuroFeedback | Model Development Engineer | Brain wave / EEG |
| Science Gurus | Bioinformatics Intern | Protein / DNA strand |

### Projects Carousel

| Project | 3D Hover Scene | On Click |
|---|---|---|
| Self-Driving MiniCar | Car drives around track | Expands to modal, scene keeps playing |
| Protein Modeling RuBisCO | Protein strand rotates | Expands to modal, scene keeps playing |

### Detail Pages (`/projects/[slug]`)
Each project has a standalone URL with full description, tech stack, GitHub/live links, and the 3D scene still running.

---

## File Structure

```
personal-website/
├── app/
│   ├── layout.tsx                  # Root layout: fonts, metadata, SoundProvider
│   ├── page.tsx                    # Main scroll page (assembles all sections)
│   ├── globals.css                 # Tailwind directives, CSS custom properties
│   └── projects/
│       └── [slug]/
│           └── page.tsx            # Individual project detail pages
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── EducationSection.tsx
│   │   └── ContactSection.tsx
│   ├── ui/
│   │   ├── SectionWrapper.tsx      # Framer Motion scroll-reveal container (reused everywhere)
│   │   ├── NavBar.tsx              # Sticky nav with section anchors + mute toggle
│   │   ├── TimelineItem.tsx        # Single experience entry
│   │   ├── ProjectCard.tsx         # Single project card in carousel
│   │   ├── ProjectModal.tsx        # Expanded project overlay (3D stays playing)
│   │   ├── SkillBadge.tsx          # Individual tech badge pill
│   │   ├── SoundButton.tsx         # HOC wrapper: adds hover/click sounds to any child
│   │   └── LoadingScreen.tsx       # Shown during initial hero Spline load
│   ├── spline/
│   │   ├── SplineScene.tsx         # Core SSR-safe Spline wrapper (dynamic import, useInView)
│   │   ├── HeroSpline.tsx          # Neural network scene
│   │   ├── MiniCarSpline.tsx       # Car-on-track scene
│   │   ├── ProteinSpline.tsx       # Rotating protein/molecular model
│   │   ├── NeuronSpline.tsx        # Neuron spike visualization
│   │   └── ServerSpline.tsx        # 3D server/computer
│   └── providers/
│       └── SoundProvider.tsx       # Howler context: mute state, playSound(key)
├── data/
│   ├── experience.ts               # ExperienceItem[] — 5 roles
│   ├── projects.ts                 # ProjectItem[] — 2 projects
│   ├── skills.ts                   # SkillCategory[] — 5 categories
│   └── education.ts                # EducationItem — UIUC
├── hooks/
│   ├── useSplineHover.ts           # Fires app.emitEvent() on React hover
│   ├── useSound.ts                 # Consumes SoundProvider
│   └── useActiveSection.ts         # IntersectionObserver — drives nav highlighting
├── lib/
│   ├── spline-events.ts            # SPLINE_SCENES, SPLINE_OBJECTS, SPLINE_EVENTS constants
│   └── cn.ts                       # clsx + tailwind-merge
├── public/
│   └── sounds/
│       ├── hover.mp3
│       ├── click.mp3
│       └── reveal.mp3
├── types/
│   └── index.ts                    # All shared TypeScript interfaces
├── next.config.ts
├── tailwind.config.ts
├── CLAUDE.md                       # Project conventions for Claude sessions
└── plan.md                         # This file
```

---

## TypeScript Interfaces (`types/index.ts`)

```ts
interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  location: string
  description: string[]         // bullet points
  techTags: string[]
  splineScene?: keyof typeof SPLINE_SCENES
  accentColor?: string          // Tailwind class for timeline dot color
}

interface ProjectItem {
  id: string                    // URL-safe slug e.g. "self-driving-minicar"
  title: string
  shortDescription: string      // shown on card
  fullDescription: string[]     // shown in modal (array of paragraphs)
  techTags: string[]
  splineScene: keyof typeof SPLINE_SCENES
  splineHoverObject: string     // must match object name in Spline editor exactly
  githubUrl?: string
  liveUrl?: string
  coverGradient: string         // Tailwind gradient classes
}

interface SkillCategory {
  category: string
  skills: {
    name: string
    iconSlug?: string           // Simple Icons slug for SVG
    proficiency?: 'core' | 'proficient' | 'familiar'
  }[]
}

interface EducationItem {
  institution: string
  degrees: string[]
  gpa: string
  period: string
  location: string
  coursework: string[]
  activities: string[]
}
```

---

## Key Dependencies

```bash
# Production
npm install @splinetool/react-spline framer-motion howler clsx tailwind-merge

# Dev
npm install -D @types/howler @fontsource/clash-display
```

---

## Build Phases

### Phase 0 — Bootstrap
- [ ] `npx create-next-app@latest . --typescript --tailwind --app`
- [ ] Install all dependencies
- [ ] Configure `tailwind.config.ts` — sunset palette, fonts, custom keyframes
- [ ] Set up `globals.css` — Tailwind directives, CSS custom properties
- [ ] Create `lib/cn.ts`, `types/index.ts`, `lib/spline-events.ts` stubs
- [ ] Wire `app/layout.tsx` with fonts + SoundProvider
- [ ] `CLAUDE.md` already exists (see that file)

### Phase 1 — Data Layer
- [ ] `data/experience.ts` — 5 roles from resume
- [ ] `data/projects.ts` — 2 projects with slugs + Spline scene keys
- [ ] `data/skills.ts` — 5 categories
- [ ] `data/education.ts` — UIUC entry

### Phase 2 — Core Infrastructure
- [ ] `SoundProvider.tsx` — Howler context, lazy-init
- [ ] `useSound.ts` hook
- [ ] `SoundButton.tsx` wrapper
- [ ] `SectionWrapper.tsx` — Framer Motion scroll-reveal container
- [ ] `useActiveSection.ts` — IntersectionObserver for nav
- [ ] `NavBar.tsx` — sticky, anchors, mute toggle

### Phase 3 — Spline Infrastructure (validate in isolation)
- [ ] `SplineScene.tsx` — dynamic import, SSR-safe, useInView lazy mount, opacity fade
- [ ] `useSplineHover.ts` — emitEvent hook
- [ ] Stub all 5 Spline wrappers with placeholder URLs
- [ ] **Validate**: Hero Spline loads, no SSR crash, hover event fires

### Phase 4 — Sections
- [ ] `HeroSection.tsx`
- [ ] `AboutSection.tsx`
- [ ] `ExperienceSection.tsx` + `TimelineItem.tsx`
- [ ] `ProjectsSection.tsx` + `ProjectCard.tsx` + `ProjectModal.tsx`
- [ ] `SkillsSection.tsx` + `SkillBadge.tsx`
- [ ] `EducationSection.tsx`
- [ ] `ContactSection.tsx`

### Phase 5 — Polish
- [ ] `LoadingScreen.tsx`
- [ ] Tune Framer Motion stagger timings
- [ ] Tune Howler volumes
- [ ] Responsive audit: mobile carousel, Spline fallback on small screens
- [ ] Wire `app/projects/[slug]/page.tsx`

### Phase 6 — Deploy
- [ ] Open Graph metadata
- [ ] Lighthouse audit (target > 75 desktop)
- [ ] Vercel deploy

---

## Spline Scenes to Build (in Spline.design)

| Scene Key | Content | Where Used |
|---|---|---|
| `HERO_NEURAL` | Abstract neural network, brain-like mesh | Hero section background |
| `MINI_CAR` | Small car driving around a simple track | Self-Driving project card + modal |
| `PROTEIN` | Rotating protein strand / molecular model | RuBisCO project card + modal |
| `NEURON_SPIKE` | Neuron with spike animation | Engelken Lab + Attune timeline entries |
| `SERVER` | 3D computer / server rack | Motate + Divergence timeline entries |

**Spline authoring workflow:**
1. Create each scene in Spline.design with correct object names matching `SPLINE_OBJECTS` constants
2. Export URL → add to `lib/spline-events.ts`
3. Swap placeholder URLs → real URLs with no React code changes needed

---

## Critical Rules Summary
(Full details in `CLAUDE.md`)

1. All Spline components: `'use client'` + `dynamic(..., { ssr: false })` — always
2. Mount Spline scenes only when near viewport (`useInView`) — max ~8 WebGL contexts
3. All Spline URLs and object names live in `lib/spline-events.ts` — never hard-code strings
4. No Tailwind `transform`/`opacity`/`transition` on Framer Motion elements — they conflict
5. Howler: initialize lazily (never at module level), throttle hover sounds at ~150ms
6. Data-first: update `data/` files before touching components
