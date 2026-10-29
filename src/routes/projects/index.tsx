import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { projects as staticProjects, type Project } from "@/data/projects";
import { fetchCategories, fetchProjects, fetchSettings, type Category } from "@/lib/firestore";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/shared/Reveal";
import { Github, Globe, Lock } from "lucide-react";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Bitanya Tigabe" },
      { name: "description", content: "Web apps, tools, and client sites built by Bitanya Tigabe." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState(staticProjects);
  const [currentlyBuilding, setCurrentlyBuilding] = useState<{ title: string; description: string; tags: string[] }[]>([
    { title: "Bar Daily Tracker", description: "Tracks drinks, food, income, and costs for a bar — daily summaries and analytics dashboard.", tags: ["React", "Firebase", "Charts"] },
    { title: "Budget from Wallet/Banking App", description: "Reads user budgets from mobile banking apps and provides smart financial insights.", tags: ["Next.js", "TypeScript", "API"] },
  ]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    fetchProjects().then((p) => { if (p.length) setProjects(p); }).catch(() => {});
    fetchSettings().then((s) => { if (s?.currentlyBuilding?.length) setCurrentlyBuilding(s.currentlyBuilding); }).catch(() => {});
  }, []);

  const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-24">

        <Reveal>
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">Projects</h1>
            <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
              Each project started with a real problem. Here's what the problem was, what I built, and what came out of it.
            </p>
          </div>
        </Reveal>

        {/* Category filter */}
        <Reveal delay={80}>
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeCategory === "All"
                  ? "bg-foreground text-background"
                  : "border border-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}>
              All ({projects.length})
            </button>
            {categories.map((cat) => {
              const count = projects.filter((p) => p.category === cat.label).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.label)}
                  className="px-4 py-1.5 rounded-full text-xs font-mono transition-all border"
                  style={
                    activeCategory === cat.label
                      ? { background: cat.color, borderColor: cat.color, color: "#fff" }
                      : { borderColor: `${cat.color}40`, color: cat.color }
                  }>
                  {cat.label} ({count})
                </button>
              );
            })}
            {categories.length === 0 &&
              Array.from(new Set(projects.map((p) => p.category).filter(Boolean))).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-sm font-mono transition-all border border-foreground/20 ${
                    activeCategory === cat ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {cat}
                </button>
              ))}
          </div>
        </Reveal>

        {/* Project list — problem / what I did / result format */}
        <div className="space-y-6">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ProjectCard p={p} featured={i === 0} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-foreground/10 rounded-2xl">
            <p className="text-muted-foreground text-sm">No projects in this category yet.</p>
          </div>
        )}

        {/* Currently Building */}
        <Reveal delay={200}>
          <div className="mt-16 border border-dashed border-foreground/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="font-mono text-xs text-green-400 uppercase tracking-widest">Currently building</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentlyBuilding.map((item) => (
                <div key={item.title} className="border border-foreground/10 rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {item.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}

function ProjectCard({ p, featured }: { p: Project; featured: boolean }) {
  // Determine if GitHub link should show:
  // show only if NOT private AND url is a real GitHub URL
  const hasGitHub = !p.isPrivate && !!p.url && p.url.includes("github.com");

  return (
    <div className={`group border rounded-2xl overflow-hidden transition-all duration-300 ${
      featured ? "border-blue-500/30 hover:border-blue-500/60" : "border-foreground/10 hover:border-foreground/25"
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0">

        {/* Image */}
        <div className="relative h-40 sm:h-48 md:h-auto bg-foreground/5 overflow-hidden">
          <img
            src={p.mediaUrl || `https://opengraph.githubassets.com/1/bitan/${p.url.split("/").pop()}`}
            alt={p.t}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              const parent = el.parentElement;
              if (parent) {
                parent.style.background = "linear-gradient(135deg,#1e3a5f,#0f172a)";
                parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:2.5rem;color:#3b82f6;opacity:0.3">&lt;/&gt;</div>`;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
          {featured && (
            <span className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          {p.isPrivate && (
            <span className="absolute top-3 right-3 bg-yellow-500/90 text-black text-[10px] font-mono uppercase px-2 py-1 rounded-full flex items-center gap-1">
              <Lock size={9} strokeWidth={2} /> Private
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{p.n}</span>
                  {p.category && (
                    <span className="font-mono text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-full">
                      {p.category}
                    </span>
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-blue-500 transition-colors">
                  {p.t}
                </h3>
              </div>
              <span className="font-mono text-xs text-muted-foreground shrink-0 ml-4">{p.y}</span>
            </div>

            {/* Problem / What I did / Result */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-1.5">Problem</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.problem || p.d}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-1.5">What I built</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.solution || "See the full case study for details."}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-1.5">Stack</p>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-foreground/8">
            <Link
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className="text-xs font-mono text-blue-500 hover:underline"
            >
              Full case study →
            </Link>
            {hasGitHub && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={12} strokeWidth={1.75} /> GitHub
              </a>
            )}
            {p.isPrivate && !p.url && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/50">
                <Lock size={12} strokeWidth={1.75} /> Private repo
              </span>
            )}
            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-green-500 hover:underline"
              >
                <Globe size={12} strokeWidth={1.75} /> Live demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
