import type { SplineSceneKey } from "@/lib/spline-events";

// ── Experience ────────────────────────────────────────────────────────────────

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  techTags: string[];
  splineScene?: SplineSceneKey;
  accentColor: string; // Tailwind bg class for timeline dot, e.g. "bg-sunset-orange"
}

// ── Projects ──────────────────────────────────────────────────────────────────

export interface ProjectItem {
  id: string; // URL-safe slug e.g. "self-driving-minicar"
  title: string;
  shortDescription: string; // shown on card
  fullDescription: string[]; // paragraphs shown in modal
  techTags: string[];
  splineScene: SplineSceneKey;
  splineHoverObject: string; // must match object name in Spline editor exactly
  githubUrl?: string;
  liveUrl?: string;
  coverGradient: string; // Tailwind gradient utility classes
}

// ── Skills ────────────────────────────────────────────────────────────────────

export interface SkillItem {
  name: string;
  iconSlug?: string; // Simple Icons slug for SVG lookup
  proficiency?: "core" | "proficient" | "familiar";
}

export interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

// ── Education ─────────────────────────────────────────────────────────────────

export interface EducationItem {
  institution: string;
  degrees: string[];
  gpa: string;
  period: string;
  location: string;
  coursework: string[];
  activities: string[];
}
