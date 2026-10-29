import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import portrait from "@/assets/AV123.png";
import { useTheme } from "@/hooks/use-theme";
import { projects as staticProjects, type Project } from "@/data/projects";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/shared/Reveal";
import { TestimonialsSection } from "@/components/shared/Testimonials";
import { useResumeUrl } from "@/hooks/use-resume";
import { fetchSkills, fetchProjects, fetchSettings } from "@/lib/firestore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bitanya (Nabi) Tigabe — Full-Stack Developer" },
      { name: "description", content: "Portfolio of Bitanya Tigabe, known as Nabi — a full-stack developer from Dire Dawa, Ethiopia." },
      { property: "og:title", content: "Bitanya (Nabi) Tigabe — Full-Stack Developer" },
      { property: "og:description", content: "Full-stack developer specializing in web development, software engineering, and UI/UX design." },
    ],
  }),
  component: HomePage,
});

// ─── Typewriter ───────────────────────────────────────────────────────────────

const ROLES = ["Full-Stack Developer", "UI / UX Designer", "Open Source Builder", "Web App Engineer", "Software Developer"];

function useTypewriter(words: string[], typingSpeed = 80, deletingSpeed = 40, pauseMs = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "deleting">("typing");
  useEffect(() => {
    const current = words[wordIdx];
    if (phase === "typing") {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("deleting"), pauseMs);
        return () => clearTimeout(t);
      }
    }
    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed);
        return () => clearTimeout(t);
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }
  }, [displayed, phase, wordIdx, words, typingSpeed, deletingSpeed, pauseMs]);
  return displayed;
}

function TypeWriter() {
  const text = useTypewriter(ROLES);
  return (
    <span className="font-mono text-blue-500 text-sm md:text-[11px] tracking-[0.15em]">
      {text}
      <span style={{ display: "inline-block", width: "2px", height: "0.9em", background: "currentColor", marginLeft: "2px", verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
    </span>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────

function HomePage() {
  const resumeUrl = useResumeUrl();
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [stats, setStats] = useState({ statProjects: "10+", statLanguages: "8+", statCloud: "4+" });
  const [skillTags, setSkillTags] = useState<string[]>(
    ["React","TypeScript","Node.js","Firebase","Tailwind CSS","Next.js","Python","Figma","MySQL","Vercel","Netlify"]
  );

  useEffect(() => {
    fetchProjects().then((p) => { if (p.length) setProjects(p); }).catch(() => {});
    fetchSettings().then((s) => { if (s) setStats({ statProjects: s.statProjects, statLanguages: s.statLanguages, statCloud: s.statCloud }); }).catch(() => {});
    fetchSkills().then((s) => { if (s.length) setSkillTags(s.flatMap((cat) => cat.items)); }).catch(() => {});
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Nav />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-[1300px] px-4 md:px-8 py-6 md:py-10">
          <div className="relative border border-foreground/70 p-4 md:p-8 overflow-hidden min-h-[85vh] flex flex-col">
            {/* Desktop-only: all 4 corners absolutely positioned */}
            <div className="hidden md:flex flex-col">
              {/* Top-left */}
              <div className="absolute top-6 left-6 z-20 max-w-[220px]">
                <TypeWriter />
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground mt-1">Dire Dawa · Ethiopia</p>
                <p className="text-xs font-mono text-blue-500 mt-2">github.com/bitan</p>
              </div>
              {/* Top-right */}
              <div className="absolute top-6 right-6 z-20 text-right max-w-[220px]">
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground leading-relaxed">
                  React · Next.js · TypeScript<br />Node.js · Python · Firebase
                </p>
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground mt-1">Est. 2024</p>
              </div>
              {/* Bottom-left bio */}
              <div className="absolute bottom-6 left-6 z-20 max-w-[220px]">
                <p className="font-serif text-base font-semibold">Bitanya "Nabi" Tigabe</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed italic">Building things for the web,<br />one commit at a time.</p>
              </div>
              {/* Bottom-right quote */}
              <div className="absolute bottom-6 right-6 z-20 text-right max-w-[220px]">
                <p className="text-xs text-muted-foreground italic leading-relaxed">"You have to learn the rules<br />of the game. And then you<br />have to play better than<br />anyone else."</p>
              </div>
              {/* Desktop CTAs */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-6">
                <Link to="/projects" className="text-[10px] font-sans uppercase tracking-[0.2em] border-b border-foreground/50 pb-0.5 hover:text-blue-500 hover:border-blue-500 active:scale-95 transition-all duration-200">
                  View Work ↓
                </Link>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-sans uppercase tracking-[0.2em] border-b border-blue-500/60 text-blue-500 pb-0.5 hover:border-blue-500 active:scale-95 transition-all duration-200">
                  Resume ↓
                </a>
              </div>
            </div>

            {/* Main center content */}
            <h1 className="pointer-events-none absolute inset-x-0 top-[28%] md:top-[30%] text-center font-serif font-black leading-[0.85] tracking-tighter text-foreground z-0 select-none" style={{ fontSize: "clamp(4rem, 18vw, 16rem)" }}>
              BIT<span className="italic font-light">AN</span>YA
            </h1>
            <div className="flex-1 flex items-end justify-center relative z-10 mt-8">
              <img src={portrait} alt="Bitanya Tigabe" className="relative z-10 h-[60vh] md:h-[72vh] w-auto object-contain"
                style={{ maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)" }} />
            </div>
            <p className="pointer-events-none absolute right-[8%] bottom-[22%] font-serif italic text-2xl md:text-5xl text-foreground/80 z-20 rotate-[-4deg] select-none hidden md:block">Nabi</p>
          </div>
        </div>

        {/* Mobile-only: bio + CTAs below the hero frame */}
        <div className="md:hidden px-4 pt-6 pb-4 flex items-center justify-between gap-6 bg-background/50">
          <div className="flex-1">
            <p className="font-serif text-base font-semibold">Bitanya "Nabi" Tigabe</p>
            <p className="text-xs text-muted-foreground mt-1 italic">Building things for the web, one commit at a time.</p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link to="/projects" className="text-xs font-sans uppercase tracking-[0.15em] border-b border-foreground/50 pb-1 hover:text-blue-500 transition-all">
              View Work ↓
            </Link>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs font-sans uppercase tracking-[0.15em] border-b border-blue-500/60 text-blue-500 pb-1 hover:border-blue-500 transition-all">
              Resume ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-foreground/10 py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: stats.statProjects, l: "Projects Built" },
            { n: stats.statLanguages, l: "Languages & Frameworks" },
            { n: stats.statCloud, l: "Cloud Platforms" },
            { n: "∞", l: "Keyboard Shortcuts Collected 😄" },
          ].map((s) => (
            <Reveal key={s.l}>
              <p className="text-3xl md:text-4xl font-bold text-blue-500">{s.n}</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Featured Projects Teaser ── */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foreground/20 pb-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Selected Work</h2>
            <Link to="/projects" className="text-xs font-mono text-blue-500 hover:underline hidden md:block">All projects →</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.slice(0, 2).map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <Link to="/projects/$slug" params={{ slug: p.slug }} className="group block border border-foreground/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full">
                <div className="relative w-full h-44 bg-foreground/5 overflow-hidden">
                  <img src={p.mediaUrl || `https://opengraph.githubassets.com/1/bitan/${p.url.split("/").pop()}`}
                    alt={p.t} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-muted-foreground">{p.n}</span>
                    <span className="font-mono text-xs text-muted-foreground">{p.y}</span>
                  </div>
                  <h3 className="font-bold text-base mb-1 group-hover:text-blue-500 transition-colors leading-snug">{p.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{p.d}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-mono bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="mt-8 text-center">
            <Link to="/projects" className="inline-flex items-center gap-2 border border-foreground/20 rounded-full px-6 py-2.5 text-sm hover:border-blue-500 hover:text-blue-500 transition-all">
              View all projects →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Skills Strip ── */}
      <section className="py-16 px-6 md:px-12 bg-foreground/[0.02] border-y border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Skills & Tools</h2>
              <Link to="/about" className="text-xs font-mono text-blue-500 hover:underline hidden md:block">Full profile →</Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-2">
              {skillTags.map((s) => (
                <span key={s} className="text-xs font-mono border border-foreground/15 px-3 py-1.5 rounded-full text-muted-foreground hover:border-blue-500/50 hover:text-blue-500 transition-all">{s}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTAs ── */}
      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Work with me ── */}
      <section className="py-24 px-6 md:px-12 bg-foreground/[0.02] border-t border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between border-b border-foreground/20 pb-4 mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Work with me</h2>
              <Link to="/contact" className="text-xs font-mono text-blue-500 hover:underline hidden md:block">Start a project →</Link>
            </div>
          </Reveal>

          {/* Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
            {[
              { service: "Web App Development", desc: "Full-stack React apps with authentication, database, and deployment. From a simple CRUD tool to a real-time dashboard.", price: "From $300" },
              { service: "Client Websites", desc: "Fast, mobile-first websites for businesses, portfolios, and organisations. Designed in Figma, built in React, deployed on Vercel.", price: "From $150" },
              { service: "UI/UX Design", desc: "Figma designs and prototypes for web products. Wireframes, component systems, and handoff-ready specs.", price: "From $100" },
            ].map((s) => (
              <Reveal key={s.service}>
                <div className="border border-foreground/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all h-full flex flex-col">
                  <h3 className="font-bold text-base mb-2">{s.service}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
                  <p className="font-mono text-sm text-blue-500 mt-4">{s.price}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Process + details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-12">
            <Reveal dir="left">
              <div>
                <h3 className="font-bold text-lg mb-6">How it works</h3>
                <div className="space-y-4">
                  {[
                    { step: "01", title: "Message me", desc: "Describe what you need on the contact page. No lengthy forms." },
                    { step: "02", title: "Scope call", desc: "We talk through the project — requirements, timeline, budget." },
                    { step: "03", title: "Design first", desc: "I design in Figma so you see exactly what's being built before code starts." },
                    { step: "04", title: "Build & ship", desc: "I build it, test it, and deploy it. You get the code and the keys." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <span className="font-mono text-blue-500 text-xs mt-0.5 shrink-0 w-6">{item.step}</span>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal dir="right" delay={100}>
              <div>
                <h3 className="font-bold text-lg mb-6">Details</h3>
                <div className="space-y-3">
                  {[
                    { label: "Timezone",      value: "EAT — East Africa Time (UTC+3)" },
                    { label: "Availability",  value: "Open to freelance & part-time contracts" },
                    { label: "Response time", value: "Within 24 hours" },
                    { label: "Languages",     value: "English, Amharic" },
                    { label: "Delivery",      value: "GitHub repo + deployed URL + handoff docs" },
                    { label: "Payment",       value: "50% upfront, 50% on delivery" },
                  ].map((d) => (
                    <div key={d.label} className="flex items-start gap-3 text-sm pb-3 border-b border-foreground/8">
                      <span className="font-mono text-xs text-muted-foreground w-28 shrink-0 pt-0.5">{d.label}</span>
                      <span className="text-sm">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="text-center">
              <Link to="/contact" className="bg-blue-500 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all inline-flex items-center gap-2">
                Start a project →
              </Link>
              <p className="text-xs text-muted-foreground mt-3">No commitment. Just a conversation.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />

    </div>
  );
}
