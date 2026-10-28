import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSkills, saveSkill, deleteSkill,
  type Skill,
} from "@/lib/firestore";
import { skills as staticSkills } from "@/data/static";
import { Plus, Trash2, Check, X, Loader, Pencil } from "lucide-react";

export function SkillsPanel() {
  const qc = useQueryClient();

  const { data: skills = staticSkills.map((s, i) => ({ ...s, id: s.t.toLowerCase().replace(/\s+/g, "-"), order: i })), isLoading } =
    useQuery({ queryKey: ["admin-skills"], queryFn: fetchSkills });

  const saveSkillMut   = useMutation({ mutationFn: saveSkill,   onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-skills"] }); setEditing(null); } });
  const deleteSkillMut = useMutation({ mutationFn: deleteSkill, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-skills"] }) });

  const [newSkill, setNewSkill]   = useState<Partial<Skill>>({ t: "", items: [], order: 0 });
  const [editing, setEditing]     = useState<Skill | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [adding, setAdding]       = useState(false);

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Skill Categories</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            These appear as the toolbox grid on the About page. Only list tools you've actually shipped with.
          </p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all"
        >
          <Plus size={14} strokeWidth={2} /> Add Category
        </button>
      </div>

      {/* Category list */}
      {isLoading ? (
        <div className="flex justify-center py-10"><span className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {skills.map((s) => (
            <div key={s.id} className="border border-foreground/10 rounded-xl overflow-hidden">
              {editing?.id === s.id ? (
                /* Inline edit */
                <div className="p-4 space-y-3">
                  <input
                    type="text"
                    value={editing.t}
                    onChange={(e) => setEditing({ ...editing, t: e.target.value })}
                    placeholder="Category name"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editing.items.join(", ")}
                    onChange={(e) => setEditing({ ...editing, items: e.target.value.split(",").map((i) => i.trim()).filter(Boolean) })}
                    placeholder="Tools (comma separated)"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveSkillMut.mutate(editing)}
                      disabled={saveSkillMut.isPending || !editing.t}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs hover:bg-blue-600 transition-all disabled:opacity-60"
                    >
                      {saveSkillMut.isPending ? <Loader size={11} className="animate-spin" /> : <Check size={11} strokeWidth={2} />}
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-3 py-1.5 rounded-lg border border-foreground/15 text-xs hover:bg-foreground/5 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Display row */
                <div className="p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{s.t}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {s.items.map((item) => (
                        <span key={item} className="text-[10px] font-mono border border-foreground/10 bg-foreground/5 px-2 py-0.5 rounded-full text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => { setEditing({ ...s }); setAdding(false); }}
                      className="p-1.5 rounded hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all"
                    >
                      <Pencil size={13} strokeWidth={1.75} />
                    </button>
                    {confirmDel === s.id ? (
                      <>
                        <button onClick={() => { deleteSkillMut.mutate(s.id); setConfirmDel(null); }} className="p-1.5 rounded bg-red-500/10 text-red-400"><Check size={12} strokeWidth={2} /></button>
                        <button onClick={() => setConfirmDel(null)} className="p-1.5 rounded hover:bg-foreground/5 text-muted-foreground"><X size={12} strokeWidth={2} /></button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDel(s.id)} className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all">
                        <Trash2 size={13} strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {skills.length === 0 && !adding && (
            <div className="text-center py-12 border border-dashed border-foreground/10 rounded-2xl">
              <p className="text-sm text-muted-foreground">No categories yet.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Run Seed DB to load defaults, or add one above.</p>
            </div>
          )}
        </div>
      )}

      {/* Add new */}
      {adding && (
        <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">New Category</p>
          <input
            type="text"
            placeholder="Category name e.g. Frontend"
            value={newSkill.t}
            onChange={(e) => setNewSkill({ ...newSkill, t: e.target.value })}
            autoFocus
            className="w-full bg-background border border-foreground/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Tools (comma separated) e.g. React, TypeScript"
            value={newSkill.items?.join(", ")}
            onChange={(e) => setNewSkill({ ...newSkill, items: e.target.value.split(",").map((i) => i.trim()).filter(Boolean) })}
            className="w-full bg-background border border-foreground/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <div className="flex gap-2">
            <button
              disabled={!newSkill.t || saveSkillMut.isPending}
              onClick={() => {
                const id = (newSkill.t ?? "").toLowerCase().replace(/\s+/g, "-");
                saveSkillMut.mutate({ id, t: newSkill.t!, items: newSkill.items ?? [], order: skills.length });
                setNewSkill({ t: "", items: [], order: 0 });
                setAdding(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-all disabled:opacity-60"
            >
              {saveSkillMut.isPending ? <Loader size={13} className="animate-spin" /> : <Plus size={13} strokeWidth={2} />}
              Add
            </button>
            <button
              onClick={() => { setAdding(false); setNewSkill({ t: "", items: [], order: 0 }); }}
              className="px-4 py-2 border border-foreground/15 rounded-lg text-sm hover:bg-foreground/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-foreground/10 pt-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Only list tools you've shipped something with. The About page displays exactly what's here.
        </p>
      </div>
    </div>
  );
}
