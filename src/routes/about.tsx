import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/shared/Reveal";
import { TestimonialsSection } from "@/components/shared/Testimonials";
import { skills as staticSkills } from "@/data/static";
import { fetchSkills, fetchSettings, type Skill } from "@/lib/firestore";
import { skillLogos } from "@/data/skillLogos";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Bitanya (Nabi) Tigabe" },
      { name: "description", content: "Full-stack developer who builds web apps, dashboards, and client sites. Known as Nabi. Available for freelance and collaboration." },
    ],
  }),
  component: AboutPage,
});

// Tools actually shipped in projects — no aspirational fluff
const shippedTools = [
  { category: "Frontend",    tools: ["React", "TypeScript", "Tailwind CSS", "HTML / CSS"] },
  { category: "Backend",     tools: ["Node.js", "Python", "PHP"] },
  { category: "Databases",   tools: ["Firebase", "MySQL", "SQLite"] },
  { category: "Deploy",      tools: ["Vercel", "Netlify", "Railway"] },
  { category: "Design",      tools: ["Figma", "Canva"] },
];

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
  if (failed) return <>{fallback}</>;
  return (
    <img
      src={src}
      alt={alt}
      className="h-40 max-w-full object-contain rounded-xl"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function AboutPage() {
  const [skills, setSkills] = useState<Skill[]>(
    staticSkills.map((s, i) => ({ ...s, id: s.t.toLowerCase().replace(/\s+/g, "-"), order: i }))
  );
  const [bio, setBio] = useState("");

  useEffect(() => {
    fetchSkills().then((s) => { if (s.length) setSkills(s); }).catch(() => {});
    fetchSettings().then((s) => { if (s?.bio) setBio(s.bio); }).catch(() => {});
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-28 pb-24">

        {/* ── Who I help ── */}
        <Reveal>
          <div className="mb-20">
            <p className="font-mono text-blue-500 text-xs mb-3 uppercase tracking-widest">Who I am</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
              I build web apps<br />
              <span className="italic font-light">that actually ship.</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                { who: "Who I help", body: "Startups, small businesses, and individuals who need a web presence, an internal tool, or a custom app — and want it done right the first time." },
                { who: "What I deliver", body: "Clean, fast, mobile-first web apps built with React and Node.js. From a landing page to a full-stack product with authentication, database, and deployment." },
                { who: "How to hire me", body: "Send a message on the Work with me page. I respond within 24 hours. We scope the project, agree on a timeline, and I build it." },
              ].map((item) => (
                <div key={item.who} className="border border-foreground/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                  <p className="font-semibold text-sm mb-2">{item.who}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Background ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start mb-24">
          <Reveal dir="left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Background</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                {bio ? (
                  <p>{bio}</p>
                ) : (
                  <>
                    <p>Self-taught developer based in Dire Dawa, Ethiopia. I go by <strong>Nabi</strong> — short for Bitanya. Started with HTML and CSS out of curiosity, worked through JavaScript, then React, then the full stack. Every project taught me something the next one needed.</p>
                    <p>I design in Figma before I write a line of code. That means you get a clear picture of what's being built before any development starts — fewer surprises, less back and forth.</p>
                    <p>I've shipped a CLI productivity tracker, a public transport navigation app, a client website for a university network, a budget manager, and an album search tool. Each one is in the Projects page with the problem it solved.</p>
                  </>
                )}
              </div>
              <div className="mt-8">
                <Link to="/contact" className="inline-flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all">
                  Work with me →
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal dir="right" delay={100}>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Tools I've shipped with</h2>
              <div className="space-y-4">
                {skills.map((group) => (
                  <div key={group.id} className="flex items-start gap-4">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest w-20 shrink-0 pt-0.5">{group.t}</span>
                    <div className="flex flex-wrap gap-3">
                      {group.items.map((tool) => {
                        const logoData = skillLogos[tool];
                        return (
                          <div key={tool} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-foreground/[0.05] group-hover:bg-foreground/[0.1] transition-all border border-foreground/10 group-hover:border-blue-500/30">
                              {logoData ? (
                                <svg
                                  role="img"
                                  viewBox="0 0 24 24"
                                  className="w-6 h-6"
                                  style={{ color: logoData.color }}
                                >
                                  <title>{tool}</title>
                                  <use href={`https://api.iconify.design/${logoData.icon}.svg`} />
                                </svg>
                              ) : (
                                <span className="text-xs font-mono text-muted-foreground">
                                  {tool.substring(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground text-center group-hover:text-blue-500 transition-colors leading-tight">{tool}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground/50 mt-5">These are tools I've used in shipped projects, not a wishlist.</p>
            </div>
          </Reveal>
        </div>

        {/* ── GitHub Activity ── */}        <section>
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight mb-8">GitHub Activity</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="border border-foreground/10 rounded-2xl p-4 md:p-6">
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center items-center min-w-0">
                <GitHubStatCard
                  src="https://github-readme-stats.vercel.app/api?username=bitan&theme=dark&hide_border=true&show_icons=true&bg_color=00000000&title_color=3b82f6&icon_color=3b82f6&text_color=ffffff&count_private=true"
                  alt="GitHub Stats"
                  fallback={<StatFallback label="GitHub Stats" lines={[{ k: "Commits", v: "—" }, { k: "PRs", v: "—" }, { k: "Issues", v: "—" }, { k: "Stars", v: "—" }]} />}
                />
                <GitHubStatCard
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=bitan&theme=dark&hide_border=true&layout=compact&bg_color=00000000&title_color=3b82f6&text_color=ffffff&langs_count=6"
                  alt="Top Languages"
                  fallback={<StatFallback label="Top Languages" lines={[{ k: "TypeScript", v: "~40%" }, { k: "JavaScript", v: "~35%" }, { k: "HTML/CSS", v: "~15%" }, { k: "Other", v: "~10%" }]} />}
                />
              </div>
              <p className="text-center mt-4">
                <a href="https://github.com/bitan" target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono text-blue-500 hover:underline">
                  github.com/bitan ↗
                </a>
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── Testimonials ── */}
      </main>
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
