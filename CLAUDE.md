# CLAUDE.md — Personal Website

This file defines conventions for all Claude sessions working on this project.

---

## Project Overview

Personal website for Aditya Kewalram — CS + Bioengineering @ UIUC.
Bold, playful, immersive. 3D Spline scenes mapped to real work (car, protein strand, neurons, servers).

See `plan.md` for full architecture, file structure, and build phases.

---

## Stack

- **Framework**: Next.js 14+ App Router + TypeScript
- **Styling**: Tailwind CSS (`tailwind.config.ts` has sunset palette + custom fonts)
- **3D**: `@splinetool/react-spline` via `components/spline/`
- **Animation**: Framer Motion
- **Audio**: Howler.js via `SoundProvider`
- **Fonts**: Clash Display (headlines), body TBD

---

## File Conventions

### Components
- Section components live in `components/sections/`
- Shared UI primitives in `components/ui/`
- All Spline wrappers in `components/spline/`
- Context providers in `components/providers/`

### Data
- All content lives in `data/` as typed TypeScript files
- **Always update `data/` files first** before touching components
- Types live in `types/index.ts` — never inline interfaces in component files

### Constants
- All Spline scene URLs, object names, and event names live in `lib/spline-events.ts`
- Never hard-code Spline strings in component files — always import from `lib/spline-events.ts`

---

## Spline Rules (Critical)

1. **Every Spline component must have `'use client'`** at the top — Spline uses `window` at import time and crashes SSR without it.

2. **Always use dynamic import with `ssr: false`:**
   ```ts
   const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })
   ```

3. **Always lazy-mount with `useInView`:** Only render a Spline scene when it's near the viewport. Browsers support a maximum of ~8 WebGL contexts — mounting all scenes at once crashes the tab.
   ```ts
   const isInView = useInView(ref, { once: true, margin: '0px 0px -200px 0px' })
   return <div ref={ref}>{isInView && <SplineScene url={...} />}</div>
   ```

4. **Always wrap Spline in a sized container:**
   ```tsx
   <div className="relative overflow-hidden aspect-video w-full">
     <SplineScene ... />
   </div>
   ```
   Without explicit dimensions the canvas collapses to zero height.

5. **Object names must match exactly.** If Spline emitEvent silently does nothing, check that the object name in `SPLINE_OBJECTS` matches the object name in the Spline editor exactly (case-sensitive).

6. **Add to `next.config.ts`:**
   ```ts
   transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime']
   ```

---

## Framer Motion Rules

- Never set `transform`, `opacity`, or `transition` via Tailwind on elements you are animating with Framer Motion — they conflict.
- Always use `viewport={{ once: true }}` on `SectionWrapper` to prevent re-triggering animations.
- For the Projects carousel: use CSS `scroll-snap` + `overflow-x-scroll` for the scroll behavior. Framer Motion handles entrance animations only — not layout animations on carousel items.

---

## Howler / Sound Rules

- **Never initialize `new Howl(...)` at module level.** Always initialize lazily inside `useEffect` or on first call inside `SoundProvider`. Browsers block audio until the first user gesture.
- Throttle hover sounds at ~150ms to prevent glitches during fast mouse movement.
- The mute toggle lives in `NavBar` and updates `SoundProvider` context.

---

## Tailwind Conventions

- Sunset palette variables are defined in `tailwind.config.ts` as:
  - `orange-400` / `orange-500` — primary warm accent
  - `pink-400` / `pink-500` — secondary warm accent
  - `indigo-950` / `indigo-900` — deep blue background
- Use `cn()` from `lib/cn.ts` for all conditional class merging (clsx + tailwind-merge)
- Avoid mixing Tailwind animation utilities with Framer Motion on the same element

---

## Server vs Client Components

| Component | Type |
|---|---|
| `HeroSection` | Client (Spline + Framer Motion) |
| `AboutSection` | Client (Framer Motion) |
| `ExperienceSection` | Client (Spline + Framer Motion) |
| `ProjectsSection` | Client (Spline + Framer Motion + sound) |
| `SkillsSection` | Client (Framer Motion) |
| `EducationSection` | **Server** — no interactive dependencies |
| `ContactSection` | **Server** — no interactive dependencies |
| All `spline/*` | Client (required) |
| `SoundProvider` | Client (Howler requires browser) |
| `NavBar` | Client (IntersectionObserver) |

---

## Do Not

- Do not hard-code resume content in JSX — all content comes from `data/` files
- Do not load more than one Spline scene per visible section at a time
- Do not use `next/image` for Spline thumbnails — use CSS gradients as fallbacks
- Do not commit `.env` files
- Do not use `any` type — keep TypeScript strict
- Do not create new UI primitives when existing ones in `components/ui/` can be reused

---

## Spline Scene Authoring Workflow

When creating or updating Spline scenes:
1. Author the scene in Spline.design
2. Name all interactive objects using the names in `lib/spline-events.ts` (`SPLINE_OBJECTS`)
3. Export the scene URL and update `SPLINE_SCENES` in `lib/spline-events.ts`
4. No React component changes needed — components reference the constants

---

## Resume Data (Source of Truth)

The resume content below is the source of truth for all `data/` files:

**Person:** Aditya Kewalram | San Jose, CA | adi.kewalram@gmail.com | GitHub: Adi0521 | LinkedIn: adi-kewalram

**Education:** UIUC — BS CS + BS Bioengineering | Aug 2024 – May 2028 | GPA: 3.88
Coursework: Algorithms & Models of Computation, Data Structures, Linear Algebra, Differential Equations, Computer Architecture, Biologically Plausible AI, Systems Programming, Deep Learning, Computer Vision
Orgs: Neurotech, EV Concept Design, Medical Advancements through Design and Engineering (MADE)

**Experience:**
- Motate — SE Intern | San Jose, CA | May–Aug 2025 | Serverless AWS (Terraform, Step Functions, Lambda, Sagemaker), AI dubbing/lip sync, voice cloning, Mailjet API, RESTful APIs
- Engelken Lab @ UIUC — Undergrad Research Assistant | Urbana, IL | Dec 2025–Present | Neuron spike modeling (Julia), dynamical systems, leaky network, delay modeling
- Divergence 2% LLC — Undergrad Researcher | Urbana, IL | Sept 2024–Jun 2025 | LLM fine-tuning (RL), Triton inference server, TensorRT + ONNX (40s → 1.5s), NCCL distributed training
- Attune NeuroFeedback — Model Dev Engineer | Urbana, IL | Feb 2025–Present | VR EEG neurofeedback, Bidirectional LSTM (85% accuracy), Random Forest + GMM, mental state estimation
- Science Gurus — Bioinformatics Intern | Fremont, CA | Jun–Aug 2023 | NMOSD genetic markers (95% confidence), R data analysis, Tocilizumab drug modeling

**Projects:**
- Self-Driving MiniCar: LiDAR + camera CNN, obstacle detection, 400m route optimization (~4.5s improvement), MATLAB Simulink validation
- Protein Modeling RuBisCO: PDB + AlphaFold + GROMACS, protein folding/interactions for crop yield + carbon sequestration

**Skills:**
Languages: C++, Java, Python, R, JavaScript, Node.js, React.js, SQL, MATLAB
Frameworks: CUDA, Triton, TensorRT, ONNX, FastAPI, Springboot, Pandas, MCP, TensorFlow, OpenCV
Tools: Git, AWS, Azure, Docker, Jupyter, TCP/IP, NCCL, AlphaFold, PDB, GROMACS
