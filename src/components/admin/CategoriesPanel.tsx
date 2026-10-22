import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, saveCategory, deleteCategory, type Category } from "@/lib/firestore";
import { Plus, Trash2, Check, X, Pencil, Loader } from "lucide-react";

const DEFAULT_COLORS = [
  "#3b82f6", "#a855f7", "#f59e0b", "#22c55e",
  "#ec4899", "#ef4444", "#06b6d4", "#f97316",
];

export function CategoriesPanel() {
  const qc = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const saveMut = useMutation({
    mutationFn: saveCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); setEditing(null); setAdding(false); },
  });
  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState(DEFAULT_COLORS[0]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function handleAdd() {
    if (!newLabel.trim()) return;
    const id = newLabel.toLowerCase().replace(/[\s/]+/g, "-");
    saveMut.mutate({ id, label: newLabel.trim(), color: newColor, order: categories.length });
    setNewLabel("");
    setNewColor(DEFAULT_COLORS[0]);
  }

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Project Categories</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Categories appear as filter tabs on the portfolio and as badges on project cards.
          </p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all"
        >
          <Plus size={14} strokeWidth={2} /> New Category
        </button>
      </div>

      {/* Category list */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="border border-foreground/10 rounded-xl p-4 flex items-center justify-between gap-4">
            {editing?.id === cat.id ? (
              /* Inline edit */
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="color"
                  value={editing.color}
                  onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border border-foreground/10 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                />
                <button
                  onClick={() => saveMut.mutate({ ...editing, label: editing.label })}
                  disabled={saveMut.isPending}
                  className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                >
                  {saveMut.isPending ? <Loader size={13} className="animate-spin" /> : <Check size={13} strokeWidth={2} />}
                </button>
                <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground transition-all">
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            ) : (
              /* Display */
              <>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-4 h-4 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span
                    className="text-xs font-mono px-2.5 py-1 rounded-full border font-medium"
                    style={{ color: cat.color, borderColor: `${cat.color}40`, background: `${cat.color}15` }}
                  >
                    {cat.label}
                  </span>
                  <span className="text-xs text-muted-foreground/50 font-mono">{cat.id}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditing({ ...cat })}
                    className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Pencil size={13} strokeWidth={1.75} />
                  </button>
                  {confirmDelete === cat.id ? (
                    <>
                      <button
                        onClick={() => { deleteMut.mutate(cat.id); setConfirmDelete(null); }}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <Check size={13} strokeWidth={2} />
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground transition-all">
                        <X size={13} strokeWidth={2} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(cat.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                    >
                      <Trash2 size={13} strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {categories.length === 0 && !adding && (
          <div className="text-center py-12 border border-dashed border-foreground/10 rounded-2xl">
            <p className="text-sm text-muted-foreground">No categories yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Create one above, or run Seed DB to load defaults.</p>
          </div>
        )}
      </div>

      {/* Add new */}
      {adding && (
        <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-5 space-y-4">
          <p className="text-sm font-medium">New Category</p>

          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5">Name</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }}
              placeholder="e.g. UI/UX, Systems, Mobile..."
              autoFocus
              className="w-full bg-background border border-foreground/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2">Badge Color</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DEFAULT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={`w-6 h-6 rounded-full transition-all ${newColor === c ? "ring-2 ring-offset-2 ring-offset-background ring-white scale-110" : "hover:scale-110"}`}
                  style={{ background: c }}
                />
              ))}
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-6 h-6 rounded-full cursor-pointer border border-foreground/10 bg-transparent"
                title="Custom color"
              />
            </div>

            {/* Live preview */}
            {newLabel && (
              <span
                className="text-xs font-mono px-2.5 py-1 rounded-full border font-medium inline-block"
                style={{ color: newColor, borderColor: `${newColor}40`, background: `${newColor}15` }}
              >
                {newLabel}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim() || saveMut.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-all disabled:opacity-60"
            >
              {saveMut.isPending ? <Loader size={13} className="animate-spin" /> : <Plus size={13} strokeWidth={2} />}
              Create
            </button>
            <button
              onClick={() => { setAdding(false); setNewLabel(""); }}
              className="px-4 py-2 border border-foreground/15 rounded-lg text-sm hover:bg-foreground/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-foreground/10 pt-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Deleting a category does <strong>not</strong> remove it from existing projects — those projects will just show no category badge until you reassign them.
        </p>
      </div>
    </div>
  );
}
