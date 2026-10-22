import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSkills, saveSkill, deleteSkill,
  fetchProficiencies, saveProficiency, deleteProficiency,
  type Skill, type Proficiency,
} from "@/lib/firestore";
import { skills as staticSkills, proficiencies as staticProfs } from "@/data/static";
import { Plus, Trash2, Check, X, Loader } from "lucide-react";

export function SkillsPanel() {
  const qc = useQueryClient();

  const { data: skills = staticSkills.map((s, i) => ({ ...s, id: s.t.toLowerCase().replace(/\s+/g, "-"), order: i })), isLoading: loadingSkills } =
    useQuery({ queryKey: ["admin-skills"], queryFn: fetchSkills });

  const { data: profs = staticProfs.map((p, i) => ({ ...p, id: p.name.toLowerCase().replace(/[\s/]+/g, "-"), order: i })), isLoading: loadingProfs } =
    useQuery({ queryKey: ["admin-profs"], queryFn: fetchProficiencies });

  const saveSkillMut   = useMutation({ mutationFn: saveSkill,        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-skills"] }) });
  const deleteSkillMut = useMutation({ mutationFn: deleteSkill,      onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-skills"] }) });
  const saveProfMut    = useMutation({ mutationFn: saveProficiency,   onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-profs"] }) });
  const deleteProfMut  = useMutation({ mutationFn: deleteProficiency, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-profs"] }) });

  const [newSkill, setNewSkill]   = useState<Partial<Skill>>({ t: "", items: [], order: skills.length });
  const [newProf, setNewProf]     = useState<Partial<Proficiency>>({ name: "", pct: 50, color: "#3b82f6", order: profs.length });
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* ── Skill Categories ── */}
      <div>
        <h2 className="text-xl font-bold mb-1">Skill Categories</h2>
        <p className="text-xs text-muted-foreground mb-6">The toolbox grid on the portfolio</p>

        <div className="space-y-2 mb-6">
          {loadingSkills ? <LoadingSpinner /> : skills.map((s) => (
            <div key={s.id} className="border border-foreground/10 rounded-xl p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-sm">{s.t}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{s.items.join(", ")}</p>
              </div>
              {confirmDel === s.id ? (
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { deleteSkillMut.mutate(s.id); setConfirmDel(null); }} className="p-1.5 rounded bg-red-500/10 text-red-400"><Check size={12} strokeWidth={2} /></button>
                  <button onClick={() => setConfirmDel(null)} className="p-1.5 rounded hover:bg-foreground/5 text-muted-foreground"><X size={12} strokeWidth={2} /></button>
                </div>
              ) : (
                <button onClick={() => setConfirmDel(s.id)} className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all shrink-0">
                  <Trash2 size={13} strokeWidth={1.75} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add skill category */}
        <div className="border border-dashed border-foreground/15 rounded-xl p-4 space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Add Category</p>
          <input type="text" placeholder="Category name" value={newSkill.t} onChange={(e) => setNewSkill({ ...newSkill, t: e.target.value })}
            className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
          <input type="text" placeholder="Items (comma separated)" value={newSkill.items?.join(", ")}
            onChange={(e) => setNewSkill({ ...newSkill, items: e.target.value.split(",").map((i) => i.trim()).filter(Boolean) })}
            className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
          <button
            disabled={!newSkill.t || saveSkillMut.isPending}
            onClick={() => {
              const id = (newSkill.t ?? "").toLowerCase().replace(/\s+/g, "-");
              saveSkillMut.mutate({ id, t: newSkill.t!, items: newSkill.items ?? [], order: skills.length });
              setNewSkill({ t: "", items: [], order: skills.length + 1 });
            }}
            className="flex items-center gap-2 w-full justify-center py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-all disabled:opacity-60"
          >
            {saveSkillMut.isPending ? <Loader size={13} className="animate-spin" /> : <Plus size={13} strokeWidth={2} />}
            Add Category
          </button>
        </div>
      </div>

      {/* ── Proficiency Bars ── */}
      <div>
        <h2 className="text-xl font-bold mb-1">Proficiency Bars</h2>
        <p className="text-xs text-muted-foreground mb-6">The animated skill bars on the portfolio</p>

        <div className="space-y-2 mb-6">
          {loadingProfs ? <LoadingSpinner /> : profs.map((p) => (
            <div key={p.id} className="border border-foreground/10 rounded-xl p-3 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <span className="text-xs font-mono text-muted-foreground">{p.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
              </div>
              {confirmDel === p.id ? (
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { deleteProfMut.mutate(p.id); setConfirmDel(null); }} className="p-1.5 rounded bg-red-500/10 text-red-400"><Check size={12} strokeWidth={2} /></button>
                  <button onClick={() => setConfirmDel(null)} className="p-1.5 rounded hover:bg-foreground/5 text-muted-foreground"><X size={12} strokeWidth={2} /></button>
                </div>
              ) : (
                <button onClick={() => setConfirmDel(p.id)} className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all shrink-0">
                  <Trash2 size={13} strokeWidth={1.75} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add proficiency */}
        <div className="border border-dashed border-foreground/15 rounded-xl p-4 space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Add Skill Bar</p>
          <input type="text" placeholder="Skill name" value={newProf.name} onChange={(e) => setNewProf({ ...newProf, name: e.target.value })}
            className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Percentage: {newProf.pct}%</label>
              <input type="range" min={1} max={100} value={newProf.pct} onChange={(e) => setNewProf({ ...newProf, pct: Number(e.target.value) })} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Color</label>
              <input type="color" value={newProf.color} onChange={(e) => setNewProf({ ...newProf, color: e.target.value })} className="h-9 w-12 rounded cursor-pointer border border-foreground/10 bg-transparent" />
            </div>
          </div>
          <button
            disabled={!newProf.name || saveProfMut.isPending}
            onClick={() => {
              const id = (newProf.name ?? "").toLowerCase().replace(/[\s/]+/g, "-");
              saveProfMut.mutate({ id, name: newProf.name!, pct: newProf.pct ?? 50, color: newProf.color ?? "#3b82f6", order: profs.length });
              setNewProf({ name: "", pct: 50, color: "#3b82f6", order: profs.length + 1 });
            }}
            className="flex items-center gap-2 w-full justify-center py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-all disabled:opacity-60"
          >
            {saveProfMut.isPending ? <Loader size={13} className="animate-spin" /> : <Plus size={13} strokeWidth={2} />}
            Add Skill Bar
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return <div className="flex justify-center py-10"><span className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;
}
