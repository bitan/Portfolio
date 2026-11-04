import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveProficiency, deleteProficiency, fetchProficiencies } from "@/lib/turso-client";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Proficiency } from "@/lib/firestore";

export function ProficienciesPanel() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Proficiency>>({
    name: "",
    pct: 50,
    color: "#3b82f6",
    order: 0,
  });

  const { data: proficiencies = [], isLoading } = useQuery({
    queryKey: ["proficiencies"],
    queryFn: fetchProficiencies,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const id = editingId || `prof-${Date.now()}`;
      await saveProficiency({
        id,
        ...form,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proficiencies"] });
      setForm({ name: "", pct: 50, color: "#3b82f6", order: 0 });
      setEditingId(null);
      toast.success(editingId ? "Updated" : "Added");
    },
    onError: () => toast.error("Failed to save"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProficiency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proficiencies"] });
      toast.success("Deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleEdit = (p: Proficiency) => {
    setEditingId(p.id);
    setForm(p);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", pct: 50, color: "#3b82f6", order: 0 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">Proficiencies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 border border-foreground/20 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Percentage"
            value={form.pct || 0}
            onChange={(e) => setForm({ ...form, pct: parseInt(e.target.value) })}
            min="0"
            max="100"
            className="px-3 py-2 border border-foreground/20 rounded-lg text-sm"
          />
          <input
            type="color"
            value={form.color || "#3b82f6"}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="px-3 py-2 border border-foreground/20 rounded-lg"
          />
          <input
            type="number"
            placeholder="Order"
            value={form.order || 0}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
            className="px-3 py-2 border border-foreground/20 rounded-lg text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => saveMutation.mutate()}
            disabled={!form.name || saveMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            <Plus size={16} />
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-foreground/20 rounded-lg text-sm hover:border-foreground/40"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-foreground/10 pt-6">
        <h4 className="font-semibold mb-4">Existing Proficiencies</h4>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : proficiencies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No proficiencies yet.</p>
        ) : (
          <div className="space-y-3">
            {proficiencies.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 border border-foreground/10 rounded-lg hover:border-blue-500/30"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: p.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.pct}%</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-2 py-1 text-xs border border-foreground/20 rounded hover:border-blue-500 hover:text-blue-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(p.id)}
                    disabled={deleteMutation.isPending}
                    className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
