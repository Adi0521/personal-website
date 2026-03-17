import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Aditya Kewalram`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen px-6 py-32">
      <div className="max-w-3xl mx-auto">
        <p className="text-sunset-orange font-mono text-sm tracking-widest uppercase mb-4">
          Project
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold text-white mb-6"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {project.title}
        </h1>

        <div className="space-y-4 mb-10">
          {project.fullDescription.map((para, i) => (
            <p key={i} className="text-white/70 text-lg leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.techTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full border border-white/10 text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-white/20 text-white hover:border-sunset-orange hover:text-sunset-orange transition-all text-sm font-medium"
            >
              View on GitHub ↗
            </a>
          )}
          <a
            href="/"
            className="px-6 py-3 rounded-full text-white/50 hover:text-white transition-colors text-sm"
          >
            ← Back
          </a>
        </div>
      </div>
    </main>
  );
}
