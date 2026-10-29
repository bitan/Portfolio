import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { useResumeUrl } from "@/hooks/use-resume";

const navLinks = [
  { to: "/projects", label: "Projects"      },
  { to: "/about",    label: "About"         },
  { to: "/contact",  label: "Work with me"  },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  const { location } = useRouterState();
  const resumeUrl = useResumeUrl();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur border-b border-foreground/10 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="font-mono text-sm font-bold tracking-tight hover:opacity-70 transition-opacity">
          nabi<span className="text-blue-500">.</span>dev
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => {
            const isActive = location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative text-sm transition-colors duration-200"
                style={{ color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}
              >
                {l.label}
                <span
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ opacity: isActive ? 1 : 0, transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                />
              </Link>
            );
          })}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-11 h-11 flex items-center justify-center rounded-full border border-foreground/20 hover:border-blue-500 hover:text-blue-500 transition-all text-sm"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <a href="https://github.com/bitan" target="_blank" rel="noopener noreferrer"
            className="text-sm border border-foreground/30 px-4 py-1.5 rounded-full hover:bg-foreground hover:text-background transition-all">
            GitHub ↗
          </a>
          <a href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm border border-blue-500 text-blue-500 px-4 py-1.5 rounded-full hover:bg-blue-500 hover:text-white transition-all">
            Resume ↓
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-3"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-72 border-b border-foreground/10" : "max-h-0"}`}>
        <nav className="bg-background/95 backdrop-blur px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-3">
              {l.label}
            </Link>
          ))}
          <a href="https://github.com/bitan" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline py-3">GitHub ↗</a>
          <a href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline font-medium py-3">Resume ↓</a>
          <button onClick={toggle} className="text-sm text-left text-muted-foreground hover:text-foreground transition-colors py-3">
            {theme === "dark" ? "☀ Switch to Light Mode" : "☾ Switch to Dark Mode"}
          </button>
        </nav>
      </div>
    </header>
  );
}
