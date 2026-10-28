import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTestimonials, saveTestimonial, deleteTestimonial, type Testimonial } from "@/lib/firestore";
import { Plus, Pencil, Trash2, X, Check, Loader, Quote } from "lucide-react";

const EMPTY: Testimonial = { id: "", name: "", role: "", body: "", avatarUrl: "", order: 0 };

export function TestimonialsPanel() {
  const qc = useQueryClient();
  const { data: testimonials = [], isLoading } = useQuery({ queryKey: ["admin-testimonials"], queryFn: fetchTestimonials });

  const saveMut   = useMutation({ mutationFn: saveTestimonial,   onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); setEditing(null); } });
  const deleteMut = useMutation({ mutationFn: deleteTestimonial, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }) });

  const [editing, setEditing]       = useState<Testimonial | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  if (isLoading) return <div className="flex justify-center py-20"><span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Testimonials</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Quotes from clients and collaborators — shown on the homepage and about page.</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY, order: testimonials.length })}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all">
          <Plus size={14} strokeWidth={2} /> Add Testimonial
        </button>
      </div>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="border border-foreground/10 rounded-xl p-4 flex items-start gap-4">
            <Quote size={16} className="text-blue-500/50 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <p className="text-sm italic text-muted-foreground line-clamp-2">"{t.body}"</p>
              <p className="text-xs font-semibold mt-1">{t.name}</p>
              <p className="text-[10px] text-muted-foreground">{t.role}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setEditing({ ...t })} className="p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all">
                <Pencil size={13} strokeWidth={1.75} />
              </button>
              {confirmDel === t.id ? (
                <>
                  <button onClick={() => { deleteMut.mutate(t.id); setConfirmDel(null); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><Check size={13} strokeWidth={2} /></button>
                  <button onClick={() => setConfirmDel(null)} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground"><X size={13} strokeWidth={2} /></button>
                </>
              ) : (
                <button onClick={() => setConfirmDel(t.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all">
                  <Trash2 size={13} strokeWidth={1.75} />
                </button>
              )}
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-16 border border-dashed border-foreground/10 rounded-2xl">
            <Quote size={32} className="text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">No testimonials yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add quotes from clients or collaborators.</p>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-background border border-foreground/15 rounded-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b border-foreground/10">
              <h3 className="font-bold text-lg">{editing.id ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground"><X size={16} strokeWidth={1.75} /></button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="ID (unique key)" value={editing.id} onChange={(v) => setEditing({ ...editing, id: v })} placeholder="haramaya-club-2025" />
              <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} placeholder="Meron Tadesse" />
              <Field label="Role / Organisation" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} placeholder="Founder, Haramaya Law Network" />
              <Field label="Quote" value={editing.body} onChange={(v) => setEditing({ ...editing, body: v })} textarea placeholder="What they said about working with you..." />
              <Field label="Avatar URL (optional)" value={editing.avatarUrl} onChange={(v) => setEditing({ ...editing, avatarUrl: v })} placeholder="https://..." />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-foreground/10">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-foreground/15 text-sm hover:bg-foreground/5 transition-all">Cancel</button>
              <button onClick={() => saveMut.mutate(editing)} disabled={saveMut.isPending || !editing.id || !editing.name || !editing.body}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {saveMut.isPending && <Loader size={13} className="animate-spin" />}
                {saveMut.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
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
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} className={`${cls} resize-none`} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}
