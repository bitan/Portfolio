import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, saveSettings, type SiteSettings } from "@/lib/firestore";
import { Loader, Plus, Trash2, ExternalLink } from "lucide-react";

const DEFAULT_SETTINGS: SiteSettings = {
  name: "Bitanya Tigabe", tagline: "Full-Stack Developer",
  location: "Dire Dawa · Ethiopia", email: "btsarmybita95@gmail.com",
  github: "https://github.com/bitan", linkedin: "https://linkedin.com/in/bitanya-tigabe",
  twitter: "https://x.com/nabilara976", instagram: "https://instagram.com/nabilara24",
  facebook: "https://facebook.com/SuziBi", tiktok: "https://tiktok.com/@bita186",
  bio: "I'm a self-taught full-stack developer based in Dire Dawa, Ethiopia.",
  statProjects: "10+", statLanguages: "8+", statCloud: "4+",
  resumeUrl: "",
  currentlyBuilding: [],
};

export function SettingsPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: fetchSettings });
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => { if (data) setForm({ ...DEFAULT_SETTINGS, ...data }); }, [data]);

  const saveMut = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-settings"] }),
  });

  const set = (k: keyof SiteSettings, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  if (isLoading) return <div className="flex justify-center py-20"><span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-8">

      {/* Personal info */}
      <Section title="Personal Info">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name"     value={form.name}     onChange={(v) => set("name", v)} />
          <Field label="Tagline"  value={form.tagline}  onChange={(v) => set("tagline", v)} />
          <Field label="Location" value={form.location} onChange={(v) => set("location", v)} />
          <Field label="Email"    value={form.email}    onChange={(v) => set("email", v)} />
        </div>
        <Field label="Bio" value={form.bio} onChange={(v) => set("bio", v)} textarea />
      </Section>

      {/* Stats */}
      <Section title="Stats Bar">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Projects"  value={form.statProjects}  onChange={(v) => set("statProjects", v)}  placeholder="10+" />
          <Field label="Languages" value={form.statLanguages} onChange={(v) => set("statLanguages", v)} placeholder="8+"  />
          <Field label="Cloud"     value={form.statCloud}     onChange={(v) => set("statCloud", v)}     placeholder="4+"  />
        </div>
      </Section>

      {/* Resume */}
      <Section title="Resume / CV">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Paste a direct link to your resume PDF. Use Google Drive, Dropbox, or any public URL.
        </p>
        <div className="space-y-3">
          <Field
            label="Resume URL"
            value={form.resumeUrl}
            onChange={(v) => set("resumeUrl", v)}
            placeholder="https://drive.google.com/file/d/.../view"
          />
          {form.resumeUrl && (
            <div className="flex items-center gap-3">
              <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-500 hover:underline">
                <ExternalLink size={12} strokeWidth={1.75} /> Test link
              </a>
              <button onClick={() => set("resumeUrl", "")}
                className="text-xs text-red-400 hover:text-red-300 transition-colors">
                Remove
              </button>
            </div>
          )}
        </div>
        <p className="text-[11px] font-mono text-muted-foreground/50 leading-relaxed">
          For Google Drive: open the file → Share → change to "Anyone with the link" → copy link.<br />
          For Dropbox: share → copy link → change <code>?dl=0</code> to <code>?dl=1</code> for direct download.
        </p>
      </Section>

      {/* Social links */}
      <Section title="Social Links">
        <div className="grid grid-cols-2 gap-4">
          <Field label="GitHub"    value={form.github}    onChange={(v) => set("github", v)} />
          <Field label="LinkedIn"  value={form.linkedin}  onChange={(v) => set("linkedin", v)} />
          <Field label="X/Twitter" value={form.twitter}   onChange={(v) => set("twitter", v)} />
          <Field label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} />
          <Field label="Facebook"  value={form.facebook}  onChange={(v) => set("facebook", v)} />
          <Field label="TikTok"    value={form.tiktok}    onChange={(v) => set("tiktok", v)} />
        </div>
      </Section>

      {/* Currently Building */}
      <Section title="Currently Building">
        <div className="space-y-3 mb-4">
          {form.currentlyBuilding.map((item, i) => (
            <div key={i} className="border border-foreground/10 rounded-xl p-4 space-y-2 relative">
              <button
                onClick={() => set("currentlyBuilding", form.currentlyBuilding.filter((_, j) => j !== i))}
                className="absolute top-3 right-3 p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
              >
                <Trash2 size={13} strokeWidth={1.75} />
              </button>
              <Field label="Title" value={item.title} onChange={(v) => {
                const updated = [...form.currentlyBuilding];
                updated[i] = { ...updated[i], title: v };
                set("currentlyBuilding", updated);
              }} />
              <Field label="Description" value={item.description} onChange={(v) => {
                const updated = [...form.currentlyBuilding];
                updated[i] = { ...updated[i], description: v };
                set("currentlyBuilding", updated);
              }} textarea />
              <Field label="Tags (comma separated)" value={item.tags.join(", ")} onChange={(v) => {
                const updated = [...form.currentlyBuilding];
                updated[i] = { ...updated[i], tags: v.split(",").map((t) => t.trim()).filter(Boolean) };
                set("currentlyBuilding", updated);
              }} />
            </div>
          ))}
        </div>
        <button
          onClick={() => set("currentlyBuilding", [...form.currentlyBuilding, { title: "", description: "", tags: [] }])}
          className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 transition-colors"
        >
          <Plus size={13} strokeWidth={2} /> Add item
        </button>
      </Section>

      {/* Save */}
      <button
        onClick={() => saveMut.mutate(form)}
        disabled={saveMut.isPending}
        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all disabled:opacity-60"
      >
        {saveMut.isPending && <Loader size={14} className="animate-spin" />}
        {saveMut.isPending ? "Saving..." : "Save Settings"}
      </button>
      {saveMut.isSuccess && <p className="text-sm text-green-500">✓ Settings saved!</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-base mb-4 pb-2 border-b border-foreground/10">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean;
}) {
  const cls = "w-full bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-muted-foreground/40";
  return (
    <div>
      <label className="block text-xs font-mono text-muted-foreground mb-1.5">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${cls} resize-none`} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}
