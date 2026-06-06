import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import portrait from "@/assets/AV123.png";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bitanya Tigabe — Full-Stack Developer" },
      { name: "description", content: "Portfolio of Bitanya Tigabe, a full-stack developer from Dire Dawa, Ethiopia. Building web apps, software, and UI/UX experiences." },
      { property: "og:title", content: "Bitanya Tigabe — Full-Stack Developer" },
      { property: "og:description", content: "Full-stack developer specializing in web development, software engineering, and UI/UX design." },
    ],
  }),
  component: Index,
});

// ─── Data ────────────────────────────────────────────────────────────────────

const projects = [
  {
    n: "01",
    t: "DevPulse — AI Productivity Dashboard",
    lang: "TypeScript",
    tags: ["TypeScript", "Firebase", "Node.js", "React"],
    y: "2026",
    d: "A dual-purpose project: a Node.js CLI tool that tracks developer commands to Firebase Firestore, plus a React dashboard that visualizes that data.",
    url: "https://github.com/bitan/DevPulse-AI-Developer-Productivity-Dashboard",
    live: "https://dev-pulse-ai-developer-productivity.vercel.app/",
  },
  {
    n: "02",
    t: "Road App — Smart Transport System",
    lang: "TypeScript",
    tags: ["React", "Maps API", "TypeScript", "Routing"],
    y: "2026",
    d: "Solves traffic, transportation and road stress by revealing the best and most efficient routes to public transport users — real-time, intelligent navigation.",
    url: "https://github.com/bitan/road-app",
    live: "",
  },
  {
    n: "03",
    t: "Haramaya Female Law Students Network",
    lang: "TypeScript",
    tags: ["TypeScript", "React", "UI/UX"],
    y: "2025",
    d: "An introductory website prototype built for the Haramaya Female Law Students & Legal Professionals Network club — clean, professional, and accessible.",
    url: "https://github.com/bitan/dignified-authority-network",
    live: "https://dignified-authority.vercel.app/",
  },
  {
    n: "04",
    t: "Budget Manager — bud-web",
    lang: "HTML/JS",
    tags: ["HTML", "CSS", "JavaScript"],
    y: "2025",
    d: "A company budget management website that tracks income, expenses, and financial summaries in a clean, accessible interface.",
    url: "https://github.com/bitan/bud-web",
    live: "",
  },
  {
    n: "05",
    t: "Album Finder",
    lang: "JavaScript",
    tags: ["JavaScript", "Music API", "CSS"],
    y: "2025",
    d: "Search albums via a music API and save favorites to a personal collection. Clean UI with persistent local storage. Deployed on Railway.",
    url: "https://github.com/bitan/Album-Finder",
    live: "https://album-finder-production-fb96.up.railway.app/",
  },
];

const skills = [
  { t: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 / CSS3"] },
  { t: "Backend", items: ["Node.js", "PHP", "Python", "Java", "Kotlin"] },
  { t: "Databases", items: ["MySQL", "SQLite", "Firebase"] },
  { t: "Cloud & Deploy", items: ["AWS", "Vercel", "Netlify", "Firebase Hosting"] },
  { t: "Design", items: ["Figma", "Canva", "Photoshop", "Blender"] },
  { t: "Currently Learning", items: ["Next.js (deep dive)", "TypeScript", "Database Design"] },
];

// Proficiency bars — honest self-assessment
const proficiencies = [
  { name: "HTML / CSS",    pct: 90, color: "#e34f26" },
  { name: "JavaScript",   pct: 82, color: "#f7df1e" },
  { name: "React",        pct: 78, color: "#61dafb" },
  { name: "TypeScript",   pct: 55, color: "#007acc" },
  { name: "Node.js",      pct: 65, color: "#6da55f" },
  { name: "Python",       pct: 60, color: "#3670a0" },
  { name: "MySQL / SQLite", pct: 62, color: "#4479a1" },
  { name: "Firebase",     pct: 70, color: "#ffca28" },
  { name: "Figma",        pct: 75, color: "#f24e1e" },
  { name: "Next.js",      pct: 45, color: "#ffffff" },
];

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

// ─── Typewriter hook ─────────────────────────────────────────────────────────

const ROLES = [
  "Full-Stack Developer",
  "UI / UX Designer",
  "Open Source Builder",
  "Web App Engineer",
  "Software Developer",
];

function useTypewriter(words: string[], typingSpeed = 80, deletingSpeed = 40, pauseMs = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

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
    <span className="font-mono text-blue-500 text-[11px] tracking-[0.15em]">
      {text}
      <span
        style={{
          display: "inline-block",
          width: "2px",
          height: "0.9em",
          background: "currentColor",
          marginLeft: "2px",
          verticalAlign: "middle",
          animation: "blink 1s step-end infinite",
        }}
      />
    </span>
  );
}

// ─── Skill Bar component ─────────────────────────────────────────────────────

function SkillBar({ name, pct, color, delay = 0 }: { name: string; pct: number; color: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium">{name}</span>
        <span
          className="text-xs font-mono transition-opacity duration-300"
          style={{ color, opacity: visible ? 1 : 0 }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden">
        <div
          style={{
            height: "100%",
            borderRadius: "9999px",
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            width: visible ? `${pct}%` : "0%",
            transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

type RevealDir = "up" | "left" | "right" | "fade";

function Reveal({
  children,
  delay = 0,
  dir = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: RevealDir;
}) {
  const { ref, visible } = useReveal();

  const hiddenTransform: Record<RevealDir, string> = {
    up:    "translateY(28px)",
    left:  "translateX(-28px)",
    right: "translateX(28px)",
    fade:  "none",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : hiddenTransform[dir],
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Active section hook ─────────────────────────────────────────────────────

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);
  return active;
}

// ─── Social links data ────────────────────────────────────────────────────────

const socials = [
  { label: "GitHub",    href: "https://github.com/bitan",           icon: "⌥" },
  { label: "Instagram", href: "https://instagram.com/nabilara24",   icon: "◈" },
  { label: "X",         href: "https://x.com/@nabilara976",         icon: "✕" },
  { label: "TikTok",    href: "https://tiktok.com/@bita186",        icon: "♪" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/bitanya-tigabe", icon: "in" },
  { label: "Facebook",  href: "https://facebook.com/SuziBi",        icon: "f" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const { theme, toggle } = useTheme();
  const activeSection = useActiveSection(["projects", "skills", "about", "contact"]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Opens default mail client with pre-filled content
    const subject = encodeURIComponent(`Portfolio Contact from ${formState.name}`);
    const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`);
    window.location.href = `mailto:btsarmybita95@gmail.com?subject=${subject}&body=${body}`;
    setFormSent(true);
    setFormState({ name: "", email: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased page-enter">

      {/* ── Sticky Nav ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur border-b border-foreground/10 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 md:px-12 h-16 flex items-center justify-between">
          <a href="#" className="font-mono text-sm font-bold tracking-tight hover:opacity-70 transition-opacity">
            bitan<span className="text-blue-500">.</span>dev
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => {
              const id = l.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative text-sm transition-colors duration-200"
                  style={{ color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}
                >
                  {l.label}
                  {/* Active underline dot */}
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-blue-500 transition-all duration-300"
                    style={{ opacity: isActive ? 1 : 0, transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </a>
              );
            })}
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-foreground/20 hover:border-blue-500 hover:text-blue-500 transition-all text-sm"
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <a
              href="https://github.com/bitan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm border border-foreground/30 px-4 py-1.5 rounded-full hover:bg-foreground hover:text-background transition-all"
            >
              GitHub ↗
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64 border-b border-foreground/10" : "max-h-0"}`}>
          <nav className="bg-background/95 backdrop-blur px-6 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                {l.label}
              </a>
            ))}
            <a href="https://github.com/bitan" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
              GitHub ↗
            </a>
            <button
              onClick={() => { toggle(); setMenuOpen(false); }}
              className="text-sm text-left text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {theme === "dark" ? "☀ Switch to Light Mode" : "☾ Switch to Dark Mode"}
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero — Editorial Magazine Style ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Outer frame border */}
        <div className="mx-auto w-full max-w-[1300px] px-4 md:px-8 py-6 md:py-10">
          <div className="relative border border-foreground/70 p-4 md:p-8 overflow-hidden min-h-[85vh] flex flex-col">

            {/* Top-left meta block */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 max-w-[220px]">
              <TypeWriter />
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground mt-1">Dire Dawa · Ethiopia</p>
              <p className="text-xs font-mono text-blue-500 mt-2">github.com/bitan</p>
            </div>

            {/* Top-right meta block */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-right max-w-[220px]">
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground leading-relaxed">
                React · Next.js · TypeScript<br />Node.js · Python · Firebase
              </p>
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground mt-1">Est. 2024</p>
            </div>

            {/* Giant name — behind everything */}
            <h1
              className="pointer-events-none absolute inset-x-0 top-[28%] md:top-[30%] text-center font-serif font-black leading-[0.85] tracking-tighter text-foreground z-0 select-none"
              style={{ fontSize: "clamp(4rem, 18vw, 16rem)" }}
            >
              BIT<span className="italic font-light">AN</span>YA
            </h1>

            {/* Center portrait — overlapping the name */}
            <div className="flex-1 flex items-end justify-center relative z-10 mt-8" style={{ background: "transparent" }}>
              <img
                src={portrait}
                alt="Bitanya Tigabe"
                className="relative z-10 h-[60vh] md:h-[72vh] w-auto object-contain"
                style={{
                  maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
                }}
              />
            </div>

            {/* Bottom-left bio */}
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20 max-w-[220px]">
              <p className="font-serif text-base font-semibold">Bitanya Tigabe</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed italic">
                Building things for the web,<br />one commit at a time.
              </p>
            </div>

            {/* Bottom-right quote */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 text-right max-w-[220px]">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "You have to learn the rules<br />of the game. And then you<br />have to play better than<br />anyone else."
              </p>
            </div>

            {/* Script signature */}
            <p className="pointer-events-none absolute right-[8%] bottom-[22%] font-serif italic text-2xl md:text-5xl text-foreground/80 z-20 rotate-[-4deg] select-none">
              bitan
            </p>

            {/* Bottom center CTA */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-4">
              <a
                href="#projects"
                className="text-[10px] font-sans uppercase tracking-[0.2em] border-b border-foreground/50 pb-0.5 hover:text-blue-500 hover:border-blue-500 active:scale-95 transition-all duration-200"
              >
                View Work ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-foreground/10 py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: "10+", l: "Projects Built" },
            { n: "8+", l: "Languages & Frameworks" },
            { n: "4+", l: "Cloud Platforms" },
            { n: "∞", l: "Keyboard Shortcuts Collected 😄" },
          ].map((s) => (
            <Reveal key={s.l}>
              <p className="text-3xl md:text-4xl font-bold text-blue-500">{s.n}</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foreground/20 pb-4 mb-12">
            <div>
              <p className="font-mono text-blue-500 text-xs mb-2">// selected work</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Projects</h2>
            </div>
            <a href="https://github.com/bitan" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
              all repos ↗
            </a>
          </div>
        </Reveal>

        {/* Featured project — full width */}
        <Reveal delay={80}>
          <a
            href={projects[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block mb-8 border border-foreground/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
          >
            {/* Preview image */}
            <div className="relative w-full h-52 md:h-72 bg-foreground/5 overflow-hidden">
              <img
                src={`https://opengraph.githubassets.com/1/bitan/DevPulse-AI-Developer-Productivity-Dashboard`}
                alt="DevPulse preview"                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 text-foreground text-xs font-mono px-4 py-2 rounded-full border border-foreground/20">
                  View on GitHub ↗
                </span>
              </div>
              {/* Featured badge */}
              <span className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full">
                Featured
              </span>
            </div>
            {/* Card body */}
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-xs text-muted-foreground">{projects[0].n}</span>
                <span className="font-mono text-xs text-muted-foreground">{projects[0].y}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 group-hover:text-blue-500 transition-colors">{projects[0].t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">{projects[0].d}</p>
              <div className="flex flex-wrap gap-2">
                {projects[0].tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <span className="text-xs font-mono text-blue-500">View on GitHub ↗</span>
                {projects[0].live && (
                  <a
                    href={projects[0].live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-mono text-green-500 hover:underline"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>            </div>
          </a>
        </Reveal>

        {/* Remaining projects — 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.slice(1).map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <div className="group flex flex-col border border-foreground/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full">
                {/* Preview image */}
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative w-full h-40 bg-foreground/5 overflow-hidden flex-shrink-0">
                    <img
                      src={`https://opengraph.githubassets.com/1/bitan/${p.url.split("/").pop()}`}
                      alt={`${p.t} preview`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = "none";
                        const parent = el.parentElement;
                        if (parent) {
                          parent.style.background = "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)";
                          parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:2rem;color:#3b82f6;opacity:0.4">&lt;/&gt;</div>`;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                  </div>
                </a>
                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-xs text-muted-foreground">{p.n}</span>
                    <span className="font-mono text-xs text-muted-foreground">{p.y}</span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-blue-500 transition-colors leading-snug">{p.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{p.d}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-500 hover:underline">
                      GitHub ↗
                    </a>
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-green-500 hover:underline">
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* In Progress */}
        <Reveal delay={200}>
          <div className="mt-10 border border-dashed border-foreground/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="font-mono text-xs text-green-400">currently building</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-foreground/10 rounded-xl p-4">
                <h3 className="font-bold mb-1 text-sm">Bar Daily Tracker</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Tracks drinks, food, income, and costs for a bar — daily summaries and analytics dashboard.</p>
                <div className="flex gap-1.5 mt-3">
                  {["React", "Firebase", "Charts"].map(t => (
                    <span key={t} className="text-[10px] font-mono bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              <div className="border border-foreground/10 rounded-xl p-4">
                <h3 className="font-bold mb-1 text-sm">Budget from Wallet/Banking App</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Reads user budgets from mobile banking apps and provides smart financial insights.</p>
                <div className="flex gap-1.5 mt-3">
                  {["Next.js", "TypeScript", "API"].map(t => (
                    <span key={t} className="text-[10px] font-mono bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className="py-24 px-6 md:px-12 bg-foreground/[0.02] border-y border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="font-mono text-blue-500 text-xs mb-2">// what I work with</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Skills & Tools</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Left — animated proficiency bars */}
            <Reveal dir="left">
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-6 uppercase tracking-widest">Proficiency</p>
                <div className="space-y-5">
                  {proficiencies.map((s, i) => (
                    <SkillBar key={s.name} name={s.name} pct={s.pct} color={s.color} delay={i * 60} />
                  ))}
                </div>
                <p className="text-[10px] font-mono text-muted-foreground/50 mt-4">* honest self-assessment, always improving</p>
              </div>
            </Reveal>

            {/* Right — tool category grid */}
            <Reveal dir="right" delay={100}>
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-6 uppercase tracking-widest">Toolbox</p>
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((g, i) => (
                    <div
                      key={g.t}
                      className="border border-foreground/10 rounded-xl p-4 hover:border-blue-500/30 transition-colors"
                      style={{
                        opacity: 1,
                        animationDelay: `${i * 60}ms`,
                      }}
                    >
                      <p className="font-mono text-[10px] text-blue-500 mb-2 uppercase tracking-widest">
                        {g.t === "Currently Learning" ? "🔥 Learning" : g.t}
                      </p>
                      <ul className="space-y-1">
                        {g.items.map((item) => (
                          <li key={item} className="text-xs flex items-center gap-1.5 text-muted-foreground">
                            <span className="w-1 h-1 rounded-full bg-blue-500/60 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* GitHub Stats */}
          <Reveal delay={200}>
            <div className="mt-16 border border-foreground/10 rounded-2xl p-6">
              <p className="font-mono text-xs text-blue-500 mb-6">// github stats</p>
              <div className="flex flex-wrap gap-4 justify-center items-center">
                <img
                  src="https://github-readme-stats.vercel.app/api?username=bitan&theme=dark&hide_border=true&show_icons=true&bg_color=00000000&title_color=3b82f6&icon_color=3b82f6&text_color=ffffff"
                  alt="GitHub Stats"
                  className="h-40 object-contain"
                  loading="lazy"
                />
                <img
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=bitan&theme=dark&hide_border=true&layout=compact&bg_color=00000000&title_color=3b82f6&text_color=ffffff"
                  alt="Top Languages"
                  className="h-40 object-contain"
                  loading="lazy"
                />
                <img
                  src="https://nirzak-streak-stats.vercel.app/?user=bitan&theme=dark&hide_border=true&background=00000000&ring=3b82f6&fire=3b82f6&currStreakLabel=3b82f6"
                  alt="GitHub Streak"
                  className="h-40 object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <Reveal dir="left">
            <div>
              <p className="font-mono text-blue-500 text-xs mb-2">// about me</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
                Developer.<br />Designer.<br />Builder.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                I'm Bitanya Tigabe, a self-driven full-stack developer based in Dire Dawa, Ethiopia. I build web apps, software tools, and UI/UX experiences — from frontend interfaces to backend systems.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                I'm currently focused on open-source finance and productivity apps, and looking to collaborate with developers who care about real-world impact. I'm also actively learning Next.js, TypeScript, and database design.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ask me about frontend basics, portfolios, UI & app design — and yes, I collect keyboard shortcuts like people collect stickers. 😄
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} dir="right">
            <div className="space-y-4">
              <p className="font-mono text-xs text-blue-500 mb-4">// looking for</p>
              {[
                { icon: "🤝", t: "Collaboration", d: "Open-source finance & productivity apps" },
                { icon: "🧩", t: "Help with", d: "Backend integration & database design for real-time features" },
                { icon: "📚", t: "Learning", d: "Next.js · TypeScript · Databases" },
                { icon: "💬", t: "Ask me about", d: "Frontend basics, portfolios, UI & app design" },
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
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-foreground/[0.02] border-t border-foreground/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <Reveal>
            <div>
              <p className="font-mono text-blue-500 text-xs mb-2">// get in touch</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Let's Build<br />Something.</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Open to collaborations, open-source projects, freelance work, or just a good conversation about code and design.
              </p>
              <div className="space-y-4">
                <a href="mailto:btsarmybita95@gmail.com" className="flex items-center gap-3 text-sm hover:text-blue-500 transition-colors group">
                  <span className="font-mono text-blue-500">✉</span>
                  <span className="group-hover:underline">btsarmybita95@gmail.com</span>
                </a>
                <a href="https://github.com/bitan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-blue-500 transition-colors group">
                  <span className="font-mono text-blue-500">⌥</span>
                  <span className="group-hover:underline">github.com/bitan</span>
                </a>
                <a href="https://linkedin.com/in/bitanya-tigabe" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-blue-500 transition-colors group">
                  <span className="font-mono text-blue-500">in</span>
                  <span className="group-hover:underline">LinkedIn</span>
                </a>
              </div>
              <div className="flex gap-4 mt-8">
                <a href="https://instagram.com/nabilara24" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
                <a href="https://tiktok.com/@bita186" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">TikTok</a>
                <a href="https://x.com/@nabilara976" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">X / Twitter</a>
                <a href="https://facebook.com/SuziBi" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">Facebook</a>
              </div>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal delay={100}>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formSent && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-500 font-mono">
                  ✓ Opening your mail client... thanks for reaching out!
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-xs font-mono text-muted-foreground mb-1.5">// your name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-muted-foreground/40"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-mono text-muted-foreground mb-1.5">// your email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="jane@example.com"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-muted-foreground/40"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-mono text-muted-foreground mb-1.5">// message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tell me about your project or idea..."
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-muted-foreground/40 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {formSent ? "✓ Message Sent!" : "Send Message →"}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-foreground/10 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Top row — logo + socials */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <a href="#" className="font-mono text-lg font-bold tracking-tight">
              bitan<span className="text-blue-500">.</span>dev
            </a>
            {/* Social icon buttons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-foreground/15 text-muted-foreground hover:border-blue-500 hover:text-blue-500 hover:scale-110 transition-all duration-200 text-xs font-mono"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Dire Dawa, Ethiopia 🇪🇹
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-mono text-xs text-muted-foreground">
              © 2026 Bitanya Tigabe. All rights reserved.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Built with React · TanStack · Tailwind CSS
            </p>
            <a
              href="https://github.com/bitan/visual-portfolio-builder-main"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-blue-500 hover:underline transition-all"
            >
              View source ↗
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
