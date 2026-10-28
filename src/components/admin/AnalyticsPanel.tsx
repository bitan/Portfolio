import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from "firebase/firestore";
import { db as _db } from "@/lib/firebase";
import { BarChart2, MessageSquare, FolderKanban, Award, Eye } from "lucide-react";

interface Counts {
  messages: number;
  unread: number;
  projects: number;
  certificates: number;
  testimonials: number;
}

export function AnalyticsPanel() {
  const [counts, setCounts] = useState<Counts>({ messages: 0, unread: 0, projects: 0, certificates: 0, testimonials: 0 });
  const [recentMessages, setRecentMessages] = useState<{ name: string; email: string; createdAt: Timestamp | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!_db) { setLoading(false); return; }
    const db = _db;

    async function load() {
      try {
        const [msgs, projects, certs, testimonials] = await Promise.all([
          getDocs(collection(db, "messages")),
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "certificates")),
          getDocs(collection(db, "testimonials")),
        ]);

        const unread = msgs.docs.filter((d) => !d.data().read).length;
        setCounts({
          messages: msgs.size,
          unread,
          projects: projects.size,
          certificates: certs.size,
          testimonials: testimonials.size,
        });

        // Last 5 messages
        const recent = msgs.docs
          .map((d) => ({ name: d.data().name as string, email: d.data().email as string, createdAt: d.data().createdAt as Timestamp | null }))
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
          .slice(0, 5);
        setRecentMessages(recent);
      } catch {}
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  const stats = [
    { label: "Total messages",  value: counts.messages,     icon: MessageSquare,  color: "text-blue-500",   bg: "bg-blue-500/10" },
    { label: "Unread messages", value: counts.unread,       icon: MessageSquare,  color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Projects",        value: counts.projects,     icon: FolderKanban,   color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Certificates",    value: counts.certificates, icon: Award,          color: "text-green-500",  bg: "bg-green-500/10" },
    { label: "Testimonials",    value: counts.testimonials, icon: BarChart2,      color: "text-pink-500",   bg: "bg-pink-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1">Overview</h2>
        <p className="text-xs text-muted-foreground">A snapshot of your portfolio content and activity.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="border border-foreground/10 rounded-2xl p-4 flex flex-col gap-3">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <Icon size={15} className={s.color} strokeWidth={1.75} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent messages */}
      <div>
        <h3 className="font-semibold text-base mb-4">Recent Messages</h3>
        {recentMessages.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-foreground/10 rounded-2xl">
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentMessages.map((m, i) => (
              <div key={i} className="border border-foreground/10 rounded-xl p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-500">{m.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                  </div>
                </div>
                {m.createdAt && (
                  <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">
                    {m.createdAt.toDate().toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cloudflare Analytics note */}
      <div className="border border-foreground/10 rounded-2xl p-5 flex items-start gap-3">
        <Eye size={16} className="text-blue-500 shrink-0 mt-0.5" strokeWidth={1.75} />
        <div>
          <p className="text-sm font-medium">Page view analytics</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Visitor stats, top pages, and referrers are available in your{" "}
            <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Cloudflare dashboard
            </a>{" "}
            under Analytics → Web Analytics. Make sure to set your <code className="bg-foreground/10 px-1 rounded">VITE_CF_ANALYTICS_TOKEN</code> env var.
          </p>
        </div>
      </div>
    </div>
  );
}
