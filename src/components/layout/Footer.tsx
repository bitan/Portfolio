import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { socials } from "@/data/socials";
import { fetchSettings } from "@/lib/firestore";
import { Mail } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("btsarmybita95@gmail.com");

  useEffect(() => {
    fetchSettings().then((s) => { if (s?.email) setEmail(s.email); }).catch(() => {});
  }, []);

  return (
    <footer className="border-t border-foreground/10 bg-background/50">
      {/* Main footer grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="font-mono text-lg font-bold tracking-tight">
            nabi<span className="text-blue-500">.</span>dev
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Full-stack developer and UI/UX designer from Dire Dawa, Ethiopia. Building web apps that actually ship.
          </p>
          <a href={`mailto:${email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 transition-colors">
            <Mail size={12} strokeWidth={1.75} />
            {email}
          </a>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">Navigation</p>
          <nav className="flex flex-col gap-2.5">
            {[
              { to: "/",            label: "Home"         },
              { to: "/projects",    label: "Projects"     },
              { to: "/about",       label: "About"        },
              { to: "/certificates",label: "Certificates" },
              { to: "/contact",     label: "Work with me" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Social + location */}
        <div className="space-y-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">Find me</p>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-foreground/15 text-muted-foreground hover:border-blue-500 hover:text-blue-500 hover:scale-110 transition-all duration-200">
                  <Icon size={15} strokeWidth={1.75} />
                </a>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">Dire Dawa, Ethiopia 🇪🇹</p>
          <p className="text-xs text-muted-foreground">UTC+3 — East Africa Time</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-foreground/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3">
          <p className="font-mono text-[10px] md:text-xs text-muted-foreground text-center">© 2026 Bitanya "Nabi" Tigabe. All rights reserved.</p>
          <p className="hidden md:block font-mono text-xs text-muted-foreground">Built with React · TanStack · Tailwind CSS</p>
          <a href="https://github.com/bitan/visual-portfolio-builder-main" target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs text-blue-500 hover:underline">View source ↗</a>
        </div>
      </div>
    </footer>
  );
}
