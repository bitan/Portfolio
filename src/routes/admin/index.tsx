import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ProjectsPanel } from "@/components/admin/ProjectsPanel";
import { SkillsPanel } from "@/components/admin/SkillsPanel";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { SeedPanel } from "@/components/admin/SeedPanel";
import { MessagesPanel } from "@/components/admin/MessagesPanel";
import { CategoriesPanel } from "@/components/admin/CategoriesPanel";
import { CertificatesPanel } from "@/components/admin/CertificatesPanel";
import { LogOut, FolderKanban, Wrench, Settings, Database, Mail, LayoutGrid, Award } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — bitan.dev" }] }),
  component: AdminPage,
});

type Tab = "messages" | "projects" | "categories" | "certificates" | "skills" | "settings" | "seed";

function AdminPage() {
  const { user, loading, signIn, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("messages");
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL ?? "");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // ── Login screen ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    async function handleLogin(e: React.FormEvent) {
      e.preventDefault();
      setAuthError("");
      setAuthLoading(true);
      try {
        await signIn(email, password);
      } catch {
        setAuthError("Wrong email or password.");
      } finally {
        setAuthLoading(false);
      }
    }

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="font-mono text-2xl font-bold">bitan<span className="text-blue-500">.</span>dev</p>
            <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                {authError}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-muted-foreground mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-mono text-muted-foreground mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {authLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {authLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "messages",     label: "Messages",     icon: <Mail size={15} strokeWidth={1.75} /> },
    { id: "projects",     label: "Projects",     icon: <FolderKanban size={15} strokeWidth={1.75} /> },
    { id: "categories",   label: "Categories",   icon: <LayoutGrid size={15} strokeWidth={1.75} /> },
    { id: "certificates", label: "Certificates", icon: <Award size={15} strokeWidth={1.75} /> },
    { id: "skills",       label: "Skills",       icon: <Wrench size={15} strokeWidth={1.75} /> },
    { id: "settings",     label: "Settings",     icon: <Settings size={15} strokeWidth={1.75} /> },
    { id: "seed",         label: "Seed DB",      icon: <Database size={15} strokeWidth={1.75} /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <p className="font-mono text-sm font-bold">
            bitan<span className="text-blue-500">.</span>dev
            <span className="text-muted-foreground font-normal ml-2">/ admin</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden md:block">{user.email}</span>
            <a href="/" target="_blank" className="text-xs font-mono text-blue-500 hover:underline">View site ↗</a>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={13} strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-foreground/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                tab === t.id
                  ? "border-blue-500 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        {tab === "messages"     && <MessagesPanel />}
        {tab === "projects"     && <ProjectsPanel />}
        {tab === "categories"   && <CategoriesPanel />}
        {tab === "certificates" && <CertificatesPanel />}
        {tab === "skills"       && <SkillsPanel />}
        {tab === "settings"     && <SettingsPanel />}
        {tab === "seed"         && <SeedPanel />}
      </div>
    </div>
  );
}
