import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";

export function Footer() {
  const { data: socials = [] } = useQuery({
    queryKey: ["socials"],
    queryFn: () => fetch("/api/-socials").then(r => r.json()).catch(() => []),
  });

  const { data: settings = {} } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/-settings").then(r => r.json()).catch(() => ({})),
  });

  const email = settings.email || "btsarmybita95@gmail.com";

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
            {socials.map((s: any) => {
              const iconMap: Record<string, any> = {
                "GitHub": () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
                "LinkedIn": () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>,
                "X": () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 002.856-3.915 10 10 0 01-2.837.856 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
                "Instagram": () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5m3.106-11.25a3.106 3.106 0 11-6.212 0 3.106 3.106 0 016.212 0m1.406-5.063c0 .779-.631 1.406-1.406 1.406-.779 0-1.406-.631-1.406-1.406 0-.775.631-1.406 1.406-1.406.775 0 1.406.631 1.406 1.406M8.02 18.306c-1.337 0-2.703-.156-3.989-.472v-6.957a8.496 8.496 0 0116.988 0v6.957c-1.286.316-2.652.472-3.989.472H8.02"/></svg>,
                "Facebook": () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                "TikTok": () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.498 3.094c-.474-.97-1.899-.936-2.356.048-.423.946-.279 2.144-.479 3.242-.136.722-.604 1.26-1.298 1.423-.894.207-1.783-.082-2.65.07-.67.11-1.206.482-1.543 1.07-.29.51-.57 1.027-.764 1.563-.24.66-.34 1.346-.664 1.956-.44.828-1.412 1.403-2.407 1.313-.977-.087-1.91-.605-2.29-1.511-.19-.448-.228-.943-.297-1.434-. .117-.022.213-.03.306-.03.52 0 1.038.03 1.545.046 1.032.032 1.99.197 2.91.474 1.233.363 2.454 1.018 3.364 1.968.9.94 1.62 2.11 1.98 3.41.363 1.323.26 2.77-.02 4.128-.53 2.54-2.03 4.74-4.22 5.84-2.18 1.1-4.97.81-6.89-.63-1.92-1.44-3.09-3.77-3.14-6.27-.02-1.25.18-2.53.53-3.73m-8.49-2.28c1.64-.13 3.3.08 4.82.66.56.21 1.08.48 1.58.8.1.07.22.15.33.19.13-1.15.32-2.3.67-3.41.06-.2.12-.42.15-.64-.25-.48-.57-.92-.94-1.3-.97-.99-2.37-1.6-3.73-1.63-1.35-.03-2.75.56-3.72 1.55-.97.99-1.6 2.38-1.63 3.73.21.07.4.18.6.28 1.16.65 2.27 1.45 3.18 2.47z"/></svg>,
              };

              const IconComponent = iconMap[s.label] || (() => <span className="text-xs">○</span>);

              return (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-foreground/15 text-muted-foreground hover:border-blue-500 hover:text-blue-500 hover:scale-110 transition-all duration-200"
                >
                  <IconComponent />
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
