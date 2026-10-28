import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Github, Globe, Tag, Lock } from "lucide-react";
import { getProjectBySlug, projects as staticProjects, type Project } from "@/data/projects";
import { fetchProjects, fetchProject } from "@/lib/firestore";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    return {
      meta: project
        ? [
            { title: `${project.t} — Bitanya (Nabi) Tigabe` },
            { name: "description", content: project.d },
            { property: "og:title", content: `${project.t} — Bitanya (Nabi) Tigabe` },
            { property: "og:description", content: project.d },
          ]
        : [{ title: "Project not found — Bitanya Tigabe" }],
    };
  },
  loader: ({ params }) => {
    // Use static data as initial value — Firestore data loaded client-side
    const project = getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project: initialProject } = Route.useLoaderData() as { project: Project };
  const { theme, toggle } = useTheme();
  const [project, setProject] = useState<Project>(initialProject);
  const [allProjects, setAllProjects] = useState(staticProjects);

  useEffect(() => {
    // Load fresh data from Firestore
    fetchProject(initialProject.slug)
      .then((p) => { if (p) setProject(p); })
      .catch(() => {});
    fetchProjects()
      .then((p) => { if (p.length) setAllProjects(p); })
      .catch(() => {});
  }, [initialProject.slug]);

  // Next / prev based on Firestore order
  const currentIdx = allProjects.findIndex((p) => p.slug === project.slug);
  const prev = allProjects[currentIdx - 1];
  const next = allProjects[currentIdx + 1];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">

      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-foreground/10">
        <div className="mx-auto max-w-4xl px-6 md:px-12 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            <span className="font-mono">bitan.dev</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">{project.n}</span>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-foreground/20 hover:border-blue-500 hover:text-blue-500 transition-all text-sm"
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 md:px-12 pt-28 pb-24">

        {/* ── Hero ── */}
        <div className="mb-16">
          <p className="font-mono text-blue-500 text-xs mb-3">Case Study</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            {project.t}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {project.d}
          </p>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-3 mt-8">
            {project.category && (
              <div className="border border-blue-500/20 bg-blue-500/10 rounded-xl px-4 py-2 flex flex-col gap-0.5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Category</span>
                <span className="text-sm font-medium text-blue-400">{project.category}</span>
              </div>
            )}
            {project.highlights.map((h: { label: string; value: string }) => (
              <div key={h.label} className="border border-foreground/10 rounded-xl px-4 py-2 flex flex-col gap-0.5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{h.label}</span>
                <span className="text-sm font-medium">{h.value}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            {!project.isPrivate && project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-foreground/20 rounded-full px-5 py-2 text-sm hover:border-blue-500 hover:text-blue-500 transition-all">
                <Github size={14} strokeWidth={1.75} />
                View on GitHub
              </a>
            )}
            {project.isPrivate && (
              <span className="flex items-center gap-2 border border-yellow-500/30 text-yellow-400 rounded-full px-5 py-2 text-sm">
                <Lock size={14} strokeWidth={1.75} />
                Private project
              </span>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-500 text-white rounded-full px-5 py-2 text-sm hover:bg-blue-600 transition-all">
                <Globe size={14} strokeWidth={1.75} />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* ── Preview media ── */}
        <div className="w-full rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/5 mb-16">
          {project.mediaUrl ? (
            project.mediaType === "video" ? (
              <video
                src={project.mediaUrl}
                controls
                className="w-full max-h-96 object-contain"
                poster=""
              />
            ) : (
              <img src={project.mediaUrl} alt={`${project.t} preview`} className="w-full max-h-96 object-contain" />
            )
          ) : (
            <div className="h-56 md:h-80">
              <img
                src={`https://opengraph.githubassets.com/1/bitan/${project.url.split("/").pop()}`}
                alt={`${project.t} preview`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  const parent = el.parentElement;
                  if (parent) {
                    parent.style.background = "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)";
                    parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:4rem;color:#3b82f6;opacity:0.3">&lt;/&gt;</div>`;
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

          {/* Problem */}
          <div>
            <p className="font-mono text-blue-500 text-xs mb-3 uppercase tracking-widest">The Problem</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.problem}</p>
          </div>

          {/* Solution */}
          <div>
            <p className="font-mono text-blue-500 text-xs mb-3 uppercase tracking-widest">The Solution</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
          </div>
        </div>

        {/* ── What I learned ── */}
        <div className="border border-foreground/10 rounded-2xl p-8 mb-16">
          <p className="font-mono text-blue-500 text-xs mb-6 uppercase tracking-widest">What I Learned</p>
          <ul className="space-y-3">
            {project.learned.map((item: string) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="text-blue-500 mt-0.5 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Tags ── */}
        <div className="flex flex-wrap gap-2 mb-16">
          <Tag size={13} className="text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.75} />
          {project.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── Prev / Next navigation ── */}
        <div className="border-t border-foreground/10 pt-10 grid grid-cols-2 gap-4">
          {prev ? (
            <Link
              to="/projects/$slug"
              params={{ slug: prev.slug }}
              className="group flex flex-col gap-1 border border-foreground/10 rounded-xl p-5 hover:border-blue-500/40 transition-all"
            >
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <ArrowLeft size={10} /> Previous
              </span>
              <span className="text-sm font-medium group-hover:text-blue-500 transition-colors line-clamp-2">
                {prev.t}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to="/projects/$slug"
              params={{ slug: next.slug }}
              className="group flex flex-col gap-1 border border-foreground/10 rounded-xl p-5 hover:border-blue-500/40 transition-all text-right ml-auto w-full"
            >
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex items-center justify-end gap-1">
                Next <ArrowLeft size={10} className="rotate-180" />
              </span>
              <span className="text-sm font-medium group-hover:text-blue-500 transition-colors line-clamp-2">
                {next.t}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* ── Back home ── */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="font-mono text-xs text-muted-foreground hover:text-blue-500 transition-colors"
          >
            ← back to bitan.dev
          </Link>
        </div>

      </main>
    </div>
  );
}
