import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal, useReveal } from "@/components/shared/Reveal";
import { skills, proficiencies } from "@/data/static";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Bitanya Tigabe" },
      { name: "description", content: "Self-taught full-stack developer from Dire Dawa, Ethiopia. React, TypeScript, Node.js, Firebase." },
    ],
  }),
  component: AboutPage,
});

function SkillBar({ name, pct, color, delay = 0 }: { name: string; pct: number; color: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs font-mono transition-opacity duration-300" style={{ color, opacity: visible ? 1 : 0 }}>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden">
        <div style={{ height: "100%", borderRadius: "9999px", background: `linear-gradient(90deg, ${color}99, ${color})`, width: visible ? `${pct}%` : "0%", transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }} />
      </div>
    </div>
  );
}

function StatFallback({ label, lines }: { label: string; lines: { k: string; v: string }[] }) {
  return (
    <div className="h-40 w-44 border border-foreground/10 rounded-xl p-4 flex flex-col justify-between bg-foreground/[0.03]">
      <p className="font-mono text-[10px] text-blue-500 uppercase tracking-widest">{label}</p>
      <div className="space-y-1.5 mt-2">
        {lines.map(({ k, v }) => (
          <div key={k} className="flex justify-between items-center gap-2">
            <span className="text-[10px] text-muted-foreground truncate">{k}</span>
            <span className="text-[10px] font-mono text-foreground/60 shrink-0">{v}</span>
          </div>
        ))}
      </div>
      <p className="text-[9px] font-mono text-muted-foreground/40 mt-2">stats unavailable</p>
    </div>
  );
}

function GitHubStatCard({ src, alt, fallback }: { src: string; alt: string; fallback: React.ReactNode }) {
  const [failed, setFailed] = useState(false);
  return failed ? <>{fallback}</> : (
    <img src={src} alt={alt} className="h-40 object-contain" loading="lazy" onError={() => setFailed(true)} />
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-24">

        {/* Header */}
        <Reveal>
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">About Me</h1>
            <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
              Self-taught developer from Dire Dawa, Ethiopia. I build things for the web — from UI design to backend systems.
            </p>
          </div>
        </Reveal>

        {/* Bio + cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
          <Reveal dir="left">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
                Developer.<br />Designer.<br />Builder.
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>I'm a self-taught full-stack developer based in Dire Dawa, Ethiopia. I started coding out of curiosity and turned it into something I do every day — building web apps, tools, and experiences that solve real problems.</p>
                <p>My stack centers on React and TypeScript on the frontend, Node.js on the backend, and Firebase for real-time data. I also design in Figma before I build, which means I think about UX before I think about code.</p>
                <p>I believe in building things that are fast, accessible, and honest about what they are. No bloat, no over-engineering — just software that works and looks good doing it.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100} dir="right">
            <div className="space-y-4">
              {[
                { icon: "🤝", t: "Collaboration",  d: "Open-source finance & productivity apps" },
                { icon: "🧩", t: "Help with",       d: "Backend integration & database design for real-time features" },
                { icon: "📚", t: "Learning",        d: "Next.js · TypeScript · Databases" },
                { icon: "💬", t: "Ask me about",    d: "Frontend basics, portfolios, UI & app design" },
              ].map((item) => (
                <div key={item.t} className="flex gap-4 border border-foreground/10 rounded-xl p-4 hover:border-blue-500/30 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{item.t}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Skills */}
        <section className="mb-24">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight mb-12">Skills & Tools</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <Reveal dir="left">
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-6 uppercase tracking-widest">Proficiency</p>
                <div className="space-y-5">
                  {proficiencies.map((s, i) => <SkillBar key={s.name} name={s.name} pct={s.pct} color={s.color} delay={i * 60} />)}
                </div>
                <p className="text-[10px] font-mono text-muted-foreground/50 mt-4">* honest self-assessment, always improving</p>
              </div>
            </Reveal>
            <Reveal dir="right" delay={100}>
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-6 uppercase tracking-widest">Toolbox</p>
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((g, i) => (
                    <div key={g.t} className="border border-foreground/10 rounded-xl p-4 hover:border-foreground/20 transition-colors">
                      <p className="font-mono text-xs font-semibold mb-2 text-foreground/80">{g.t === "Currently Learning" ? "🔥 Learning" : g.t}</p>
                      <ul className="space-y-1">
                        {g.items.map((item) => (
                          <li key={item} className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-blue-500/50 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* GitHub Stats */}
        <section>
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight mb-8">GitHub Activity</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="border border-foreground/10 rounded-2xl p-6">
              <div className="flex flex-wrap gap-4 justify-center items-center">
                <GitHubStatCard
                  src="https://github-readme-stats.vercel.app/api?username=bitan&theme=dark&hide_border=true&show_icons=true&bg_color=00000000&title_color=3b82f6&icon_color=3b82f6&text_color=ffffff"
                  alt="GitHub Stats"
                  fallback={<StatFallback label="GitHub Stats" lines={[{ k: "Total Stars", v: "—" }, { k: "Total Commits", v: "—" }, { k: "Pull Requests", v: "—" }, { k: "Issues", v: "—" }]} />}
                />
                <GitHubStatCard
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=bitan&theme=dark&hide_border=true&layout=compact&bg_color=00000000&title_color=3b82f6&text_color=ffffff"
                  alt="Top Languages"
                  fallback={<StatFallback label="Top Languages" lines={[{ k: "TypeScript", v: "~45%" }, { k: "JavaScript", v: "~30%" }, { k: "HTML/CSS", v: "~15%" }, { k: "Other", v: "~10%" }]} />}
                />
                <GitHubStatCard
                  src="https://nirzak-streak-stats.vercel.app/?user=bitan&theme=dark&hide_border=true&background=00000000&ring=3b82f6&fire=3b82f6&currStreakLabel=3b82f6"
                  alt="GitHub Streak"
                  fallback={<StatFallback label="GitHub Streak" lines={[{ k: "Current Streak", v: "—" }, { k: "Longest Streak", v: "—" }, { k: "Total Contrib.", v: "—" }]} />}
                />
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
