import { Link } from "@tanstack/react-router";
import { socials } from "@/data/socials";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link to="/" className="font-mono text-lg font-bold tracking-tight">
            bitan<span className="text-blue-500">.</span>dev
          </Link>
          <div className="flex items-center gap-3">
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
          <p className="font-mono text-xs text-muted-foreground">Dire Dawa, Ethiopia 🇪🇹</p>
        </div>
        <div className="border-t border-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-muted-foreground">© 2026 Bitanya Tigabe. All rights reserved.</p>
          <p className="font-mono text-xs text-muted-foreground">Built with React · TanStack · Tailwind CSS</p>
          <a href="https://github.com/bitan/visual-portfolio-builder-main" target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs text-blue-500 hover:underline">View source ↗</a>
        </div>
      </div>
    </footer>
  );
}
