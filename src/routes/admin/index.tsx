import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { SignIn } from "@clerk/react";
import { ProjectsPanel } from "@/components/admin/ProjectsPanel";
import { SkillsPanel } from "@/components/admin/SkillsPanel";
import { ProficienciesPanel } from "@/components/admin/ProficienciesPanel";
import { SocialsPanel } from "@/components/admin/SocialsPanel";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { SeedPanel } from "@/components/admin/SeedPanel";
import { MessagesPanel } from "@/components/admin/MessagesPanel";
import { CategoriesPanel } from "@/components/admin/CategoriesPanel";
import { CertificatesPanel } from "@/components/admin/CertificatesPanel";
import { TestimonialsPanel } from "@/components/admin/TestimonialsPanel";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { LogOut, FolderKanban, Wrench, Settings, Database, Mail, LayoutGrid, Award, MessageSquareQuote, BarChart2, Share2, Gauge } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — nabi.dev" }] }),
  component: AdminPage,
});

type Tab = "analytics" | "messages" | "projects" | "categories" | "certificates" | "testimonials" | "skills" | "proficiencies" | "socials" | "settings" | "seed";

function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("analytics");

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xs font-mono text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // ── Not authenticated ─────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="font-mono text-2xl font-bold">nabi<span className="text-blue-500">.</span>dev</p>
            <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
          </div>
          <SignIn routing="hash" signUpUrl="/admin/sign-up" />
        </div>
      </div>
    );
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "analytics",    label: "Analytics",     icon: <BarChart2 size={15} strokeWidth={1.75} /> },
    { id: "messages",     label: "Messages",      icon: <Mail size={15} strokeWidth={1.75} /> },
    { id: "projects",     label: "Projects",      icon: <FolderKanban size={15} strokeWidth={1.75} /> },
    { id: "categories",   label: "Categories",    icon: <LayoutGrid size={15} strokeWidth={1.75} /> },
    { id: "certificates", label: "Certificates",  icon: <Award size={15} strokeWidth={1.75} /> },
    { id: "testimonials", label: "Testimonials",  icon: <MessageSquareQuote size={15} strokeWidth={1.75} /> },
    { id: "skills",       label: "Skills",        icon: <Wrench size={15} strokeWidth={1.75} /> },
    { id: "proficiencies", label: "Proficiencies", icon: <Gauge size={15} strokeWidth={1.75} /> },
    { id: "socials",      label: "Social Links",  icon: <Share2 size={15} strokeWidth={1.75} /> },
    { id: "settings",     label: "Settings",      icon: <Settings size={15} strokeWidth={1.75} /> },
    { id: "seed",         label: "Seed DB",       icon: <Database size={15} strokeWidth={1.75} /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <p className="font-mono text-sm font-bold">
            nabi<span className="text-blue-500">.</span>dev
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
        {tab === "analytics"    && <AnalyticsPanel />}
        {tab === "messages"     && <MessagesPanel />}
        {tab === "projects"     && <ProjectsPanel />}
        {tab === "categories"   && <CategoriesPanel />}
        {tab === "certificates" && <CertificatesPanel />}
        {tab === "testimonials" && <TestimonialsPanel />}
        {tab === "skills"       && <SkillsPanel />}
        {tab === "proficiencies" && <ProficienciesPanel />}
        {tab === "socials"      && <SocialsPanel />}
        {tab === "settings"     && <SettingsPanel />}
        {tab === "seed"         && <SeedPanel />}
      </div>
    </div>
  );
}

