import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveSocial, deleteSocial, fetchSocials } from "@/lib/turso-client";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Social {
  id: string;
  label: string;
  href: string;
  order: number;
}

export function SocialsPanel() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Social>>({
    label: "",
    href: "",
    order: 0,
  });

  const { data: socials = [], isLoading } = useQuery({
    queryKey: ["socials"],
    queryFn: fetchSocials,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const id = editingId || `social-${Date.now()}`;
      await saveSocial({
        id,
        ...form,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socials"] });
      setForm({ label: "", href: "", order: 0 });
      setEditingId(null);
      toast.success(editingId ? "Updated" : "Added");
    },
    onError: () => toast.error("Failed to save"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSocial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socials"] });
      toast.success("Deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleEdit = (s: Social) => {
    setEditingId(s.id);
    setForm(s);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ label: "", href: "", order: 0 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Label (e.g., GitHub)"
            value={form.label || ""}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="px-3 py-2 border border-foreground/20 rounded-lg text-sm"
          />
          <input
            type="url"
            placeholder="URL"
            value={form.href || ""}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
            className="px-3 py-2 border border-foreground/20 rounded-lg text-sm"
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
            disabled={!form.label || !form.href || saveMutation.isPending}
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
        <h4 className="font-semibold mb-4">Existing Links</h4>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : socials.length === 0 ? (
          <p className="text-sm text-muted-foreground">No social links yet.</p>
        ) : (
          <div className="space-y-3">
            {socials.map((s: Social) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 border border-foreground/10 rounded-lg hover:border-blue-500/30"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.label}</p>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline truncate"
                  >
                    {s.href}
                  </a>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="px-2 py-1 text-xs border border-foreground/20 rounded hover:border-blue-500 hover:text-blue-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(s.id)}
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
