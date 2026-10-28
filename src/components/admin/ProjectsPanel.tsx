import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, saveProject, deleteProject, uploadProjectMedia, fetchCategories } from "@/lib/firestore";
import { projects as staticProjects, type Project } from "@/data/projects";
import { Plus, Pencil, Trash2, X, Check, Loader, Upload, Video, Image, Lock, Tag } from "lucide-react";

const EMPTY_PROJECT: Project = {
  slug: "", n: "", t: "", lang: "", tags: [], y: new Date().getFullYear().toString(),
  d: "", url: "", live: "", category: "", isPrivate: false,
  mediaUrl: "", mediaType: "", problem: "", solution: "", learned: [], highlights: [],
};

export function ProjectsPanel() {
  const qc = useQueryClient();
  const { data: projects = staticProjects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: fetchProjects,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const saveMut = useMutation({
    mutationFn: saveProject,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const [editing, setEditing] = useState<Project | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("All");

  if (isLoading) return <LoadingSpinner />;

  const catLabels = ["All", ...categories.map((c) => c.label)];
  const filtered = filterCat === "All" ? projects : projects.filter((p) => p.category === filterCat);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Projects</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{projects.length} total · {filtered.length} shown</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_PROJECT })}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all"
        >
          <Plus size={14} strokeWidth={2} /> Add Project
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {catLabels.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              filterCat === c
                ? "bg-blue-500 text-white"
                : "border border-foreground/15 text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Project list */}
      <div className="space-y-2">
        {filtered.map((p) => (
          <div key={p.slug} className="border border-foreground/10 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-foreground/20 transition-colors">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">{p.n}</span>
                <span className="font-mono text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">{p.y}</span>
                {p.category && (
                  <span className="font-mono text-[10px] bg-foreground/5 border border-foreground/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Tag size={9} strokeWidth={2} />{p.category}
                  </span>
                )}
                {p.isPrivate && (
                  <span className="font-mono text-[10px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Lock size={9} strokeWidth={2} />Private
                  </span>
                )}
                {p.mediaUrl && (
                  <span className="font-mono text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                    {p.mediaType === "video" ? <Video size={9} strokeWidth={2} /> : <Image size={9} strokeWidth={2} />}
                    Media
                  </span>
                )}
              </div>
              <p className="font-medium text-sm truncate">{p.t}</p>
              <p className="text-xs text-muted-foreground truncate">{p.d}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setEditing({ ...p })} className="p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all">
                <Pencil size={14} strokeWidth={1.75} />
              </button>
              {confirmDelete === p.slug ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => { deleteMut.mutate(p.slug); setConfirmDelete(null); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                    <Check size={13} strokeWidth={2} />
                  </button>
                  <button onClick={() => setConfirmDelete(null)} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground transition-all">
                    <X size={13} strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(p.slug)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all">
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProjectModal
          project={editing}
          categories={categories.map((c) => c.label)}
          saving={saveMut.isPending}
          onSave={(p) => saveMut.mutate(p)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function ProjectModal({ project, categories, saving, onSave, onClose }: {
  project: Project;
  categories: string[];
  saving: boolean;
  onSave: (p: Project) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Project>({ ...project });
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof Project, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !form.slug) { setUploadError("Set the slug first before uploading."); return; }
    setUploadError("");
    setUploadProgress(0);
    try {
      const isVideo = file.type.startsWith("video/");
      const url = await uploadProjectMedia(form.slug, file, setUploadProgress);
      set("mediaUrl", url);
      set("mediaType", isVideo ? "video" : "image");
      setUploadProgress(null);
    } catch (err) {
      setUploadError(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
      setUploadProgress(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-background border border-foreground/15 rounded-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <h3 className="font-bold text-lg">{project.slug ? "Edit Project" : "Add Project"}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground"><X size={16} strokeWidth={1.75} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug (URL key)" value={form.slug} onChange={(v) => set("slug", v)} placeholder="devpulse" />
            <Field label="Number" value={form.n} onChange={(v) => set("n", v)} placeholder="01" />
          </div>
          <Field label="Title" value={form.t} onChange={(v) => set("t", v)} placeholder="My Project" />
          <Field label="Short description" value={form.d} onChange={(v) => set("d", v)} textarea placeholder="One line summary..." />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Year" value={form.y} onChange={(v) => set("y", v)} placeholder="2026" />
            <Field label="Language" value={form.lang} onChange={(v) => set("lang", v)} placeholder="TypeScript" />
          </div>

          {/* Category + Privacy */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">— None —</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => set("isPrivate", !form.isPrivate)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.isPrivate ? "bg-blue-500" : "bg-foreground/20"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPrivate ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm">Private project</span>
              </label>
            </div>
          </div>

          <Field label="Tags (comma separated)" value={form.tags.join(", ")} onChange={(v) => set("tags", v.split(",").map((t) => t.trim()).filter(Boolean))} placeholder="React, Firebase, Node.js" />

          {/* URLs */}
          <Field label={form.isPrivate ? "GitHub URL (hidden on portfolio)" : "GitHub URL"} value={form.url} onChange={(v) => set("url", v)} placeholder="https://github.com/bitan/..." />
          <Field label="Live URL (optional)" value={form.live} onChange={(v) => set("live", v)} placeholder="https://..." />

          {/* Media upload */}
          <div className="border border-dashed border-foreground/20 rounded-xl p-4 space-y-3">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Project Media</p>
            <p className="text-xs text-muted-foreground">Upload a screen recording (MP4/WebM) or screenshot (JPG/PNG) for private projects or to show the UI.</p>

            {form.mediaUrl && (
              <div className="rounded-lg overflow-hidden border border-foreground/10 bg-foreground/5">
                {form.mediaType === "video"
                  ? <video src={form.mediaUrl} controls className="w-full max-h-48 object-contain" />
                  : <img src={form.mediaUrl} alt="Project media" className="w-full max-h-48 object-contain" />
                }
                <div className="flex items-center justify-between px-3 py-2 border-t border-foreground/10">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {form.mediaType === "video" ? <Video size={11} /> : <Image size={11} />}
                    {form.mediaType === "video" ? "Video" : "Image"} uploaded
                  </span>
                  <button onClick={() => { set("mediaUrl", ""); set("mediaType", ""); }} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                </div>
              </div>
            )}

            {uploadProgress !== null && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Uploading...</span><span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

            <input ref={fileRef} type="file" accept="video/*,image/*" onChange={handleFileUpload} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadProgress !== null}
              className="flex items-center gap-2 text-sm border border-foreground/15 rounded-lg px-4 py-2 hover:bg-foreground/5 transition-all disabled:opacity-50"
            >
              <Upload size={14} strokeWidth={1.75} />
              {form.mediaUrl ? "Replace media" : "Upload media"}
            </button>
          </div>

          {/* Detail fields */}
          <Field label="Problem" value={form.problem} onChange={(v) => set("problem", v)} textarea placeholder="What problem does this solve?" />
          <Field label="Solution" value={form.solution} onChange={(v) => set("solution", v)} textarea placeholder="How did you solve it?" />
          <Field label="What I learned (one per line)" value={form.learned.join("\n")} onChange={(v) => set("learned", v.split("\n").filter(Boolean))} textarea placeholder={"Lesson 1\nLesson 2"} />
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-foreground/10">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-foreground/15 text-sm hover:bg-foreground/5 transition-all">Cancel</button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.slug || !form.t}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving && <Loader size={13} className="animate-spin" />}
            {saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>
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

function LoadingSpinner() {
  return <div className="flex justify-center py-20"><span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;
}
