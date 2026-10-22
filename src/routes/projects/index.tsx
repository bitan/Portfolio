import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { projects as staticProjects } from "@/data/projects";
import { fetchCategories, fetchProjects, type Category } from "@/lib/firestore";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/shared/Reveal";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Bitanya Tigabe" },
      { name: "description", content: "All projects by Bitanya Tigabe — web apps, UI/UX designs, client work, and open source." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState(staticProjects);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    fetchProjects().then((p) => { if (p.length) setProjects(p); }).catch(() => {});
  }, []);

  const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-24">

        <Reveal>
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">Projects</h1>
            <p className="text-muted-foreground text-sm max-w-xl">Everything I've built — web apps, UI/UX designs, client work, and personal experiments.</p>
          </div>
        </Reveal>

        {/* Category filter */}
        <Reveal delay={80}>
          <div className="flex flex-wrap gap-2 mb-12">
            <button onClick={() => setActiveCategory("All")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${activeCategory === "All" ? "bg-foreground text-background" : "border border-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground/40"}`}>
              All ({projects.length})
            </button>
            {categories.map((cat) => {
              const count = projects.filter((p) => p.category === cat.label).length;
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.label)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all border`}
                  style={activeCategory === cat.label
                    ? { background: cat.color, borderColor: cat.color, color: "#fff" }
                    : { borderColor: `${cat.color}40`, color: cat.color }}>
                  {cat.label} ({count})
                </button>
              );
            })}
            {/* Static fallback if no Firestore categories */}
            {categories.length === 0 && Array.from(new Set(projects.map((p) => p.category).filter(Boolean))).map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all border border-foreground/20 ${activeCategory === cat ? "bg-foreground text-background border-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Featured project */}
        {filtered[0] && (
          <Reveal delay={100}>
            <div className="group mb-8 border border-foreground/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
              <a href={filtered[0].isPrivate ? "#" : filtered[0].url} target={filtered[0].isPrivate ? "_self" : "_blank"} rel="noopener noreferrer">
                <div className="relative w-full h-52 md:h-72 bg-foreground/5 overflow-hidden">
                  <img src={filtered[0].mediaUrl || `https://opengraph.githubassets.com/1/bitan/${filtered[0].url.split("/").pop()}`}
                    alt={filtered[0].t} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                  <span className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full">Featured</span>
                  {filtered[0].isPrivate && <span className="absolute top-3 right-3 bg-yellow-500/90 text-black text-[10px] font-mono uppercase px-2 py-1 rounded-full">Private</span>}
                </div>
              </a>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-xs text-muted-foreground">{filtered[0].n}</span>
                  <span className="font-mono text-xs text-muted-foreground">{filtered[0].y}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 group-hover:text-blue-500 transition-colors">{filtered[0].t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">{filtered[0].d}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {filtered[0].tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link to="/projects/$slug" params={{ slug: filtered[0].slug }} className="text-xs font-mono text-blue-500 hover:underline">Case Study →</Link>
                  {!filtered[0].isPrivate && <a href={filtered[0].url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">GitHub ↗</a>}
                  {filtered[0].live && <a href={filtered[0].live} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-green-500 hover:underline">Live Demo ↗</a>}
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.slice(1).map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <div className="group flex flex-col border border-foreground/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full">
                <a href={p.isPrivate ? "#" : p.url} target={p.isPrivate ? "_self" : "_blank"} rel="noopener noreferrer">
                  <div className="relative w-full h-40 bg-foreground/5 overflow-hidden">
                    <img src={p.mediaUrl || `https://opengraph.githubassets.com/1/bitan/${p.url.split("/").pop()}`}
                      alt={p.t} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement; el.style.display = "none";
                        const parent = el.parentElement;
                        if (parent) { parent.style.background = "linear-gradient(135deg,#1e3a5f,#0f172a)"; parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:2rem;color:#3b82f6;opacity:0.4">&lt;/&gt;</div>`; }
                      }} />
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                    {p.isPrivate && <span className="absolute top-2 right-2 bg-yellow-500/90 text-black text-[9px] font-mono px-1.5 py-0.5 rounded">Private</span>}
                  </div>
                </a>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-muted-foreground">{p.n}</span>
                    <span className="font-mono text-xs text-muted-foreground">{p.y}</span>
                  </div>
                  <h3 className="text-base font-bold mb-2 group-hover:text-blue-500 transition-colors leading-snug">{p.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{p.d}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <Link to="/projects/$slug" params={{ slug: p.slug }} className="text-xs font-mono text-blue-500 hover:underline">Case Study →</Link>
                    {!p.isPrivate && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">GitHub ↗</a>}
                    {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-green-500 hover:underline">Live ↗</a>}
                  </div>
                </div>
              </div>
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
          <div className="mt-12 border border-dashed border-foreground/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="font-mono text-xs text-green-400">currently building</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Bar Daily Tracker", desc: "Tracks drinks, food, income, and costs for a bar — daily summaries and analytics dashboard.", tags: ["React", "Firebase", "Charts"] },
                { title: "Budget from Wallet/Banking App", desc: "Reads user budgets from mobile banking apps and provides smart financial insights.", tags: ["Next.js", "TypeScript", "API"] },
              ].map((item) => (
                <div key={item.title} className="border border-foreground/10 rounded-xl p-4">
                  <h3 className="font-bold mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  <div className="flex gap-1.5 mt-3">
                    {item.tags.map((t) => <span key={t} className="text-[10px] font-mono bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full">{t}</span>)}
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
