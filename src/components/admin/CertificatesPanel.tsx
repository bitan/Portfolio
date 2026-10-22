import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCertificates, saveCertificate, deleteCertificate,
  uploadCertificateImage, type Certificate,
} from "@/lib/firestore";
import { Plus, Pencil, Trash2, X, Check, Loader, Upload, Award, ExternalLink } from "lucide-react";

const EMPTY: Certificate = {
  id: "", title: "", issuer: "", date: "", category: "",
  credentialUrl: "", imageUrl: "", order: 0,
};

export function CertificatesPanel() {
  const qc = useQueryClient();
  const { data: certs = [], isLoading } = useQuery({ queryKey: ["admin-certs"], queryFn: fetchCertificates });
  const saveMut   = useMutation({ mutationFn: saveCertificate,   onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-certs"] }); setEditing(null); } });
  const deleteMut = useMutation({ mutationFn: deleteCertificate, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-certs"] }) });

  const [editing, setEditing] = useState<Certificate | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (isLoading) return <div className="flex justify-center py-20"><span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Certificates</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{certs.length} certificates</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY, order: certs.length })}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all">
          <Plus size={14} strokeWidth={2} /> Add Certificate
        </button>
      </div>

      <div className="space-y-3">
        {certs.map((cert) => (
          <div key={cert.id} className="border border-foreground/10 rounded-xl p-4 flex items-center gap-4 hover:border-foreground/20 transition-colors">
            {cert.imageUrl
              ? <img src={cert.imageUrl} alt={cert.title} className="w-12 h-12 object-contain rounded-lg border border-foreground/10 shrink-0" />
              : <div className="w-12 h-12 rounded-lg border border-foreground/10 bg-foreground/5 flex items-center justify-center shrink-0"><Award size={20} className="text-muted-foreground/40" strokeWidth={1} /></div>
            }
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{cert.title}</p>
              <p className="text-xs text-muted-foreground truncate">{cert.issuer} {cert.date && `· ${cert.date}`}</p>
              {cert.category && <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded mt-1 inline-block">{cert.category}</span>}
            </div>
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-500 transition-colors p-1.5 shrink-0">
                <ExternalLink size={13} strokeWidth={1.75} />
              </a>
            )}
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setEditing({ ...cert })} className="p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all">
                <Pencil size={14} strokeWidth={1.75} />
              </button>
              {confirmDelete === cert.id ? (
                <>
                  <button onClick={() => { deleteMut.mutate(cert.id); setConfirmDelete(null); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><Check size={13} strokeWidth={2} /></button>
                  <button onClick={() => setConfirmDelete(null)} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground"><X size={13} strokeWidth={2} /></button>
                </>
              ) : (
                <button onClick={() => setConfirmDelete(cert.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all">
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              )}
            </div>
          </div>
        ))}

        {certs.length === 0 && (
          <div className="text-center py-16 border border-dashed border-foreground/10 rounded-2xl">
            <Award size={36} className="text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">No certificates yet.</p>
          </div>
        )}
      </div>

      {editing && (
        <CertModal cert={editing} saving={saveMut.isPending} onSave={(c) => saveMut.mutate(c)} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function CertModal({ cert, saving, onSave, onClose }: {
  cert: Certificate; saving: boolean; onSave: (c: Certificate) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<Certificate>({ ...cert });
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof Certificate, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !form.id) { setUploadError("Set the ID first before uploading."); return; }
    setUploadError(""); setUploadProgress(0);
    try {
      const url = await uploadCertificateImage(form.id, file, setUploadProgress);
      set("imageUrl", url); setUploadProgress(null);
    } catch { setUploadError("Upload failed. Check Firebase Storage rules."); setUploadProgress(null); }
  }

  const cls = "w-full bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-muted-foreground/40";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-background border border-foreground/15 rounded-2xl w-full max-w-xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <h3 className="font-bold text-lg">{cert.title ? "Edit Certificate" : "Add Certificate"}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground"><X size={16} strokeWidth={1.75} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono text-muted-foreground mb-1.5">ID (unique key)</label><input type="text" value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="meta-frontend-2025" className={cls} /></div>
            <div><label className="block text-xs font-mono text-muted-foreground mb-1.5">Date (YYYY-MM)</label><input type="month" value={form.date} onChange={(e) => set("date", e.target.value)} className={cls} /></div>
          </div>
          <div><label className="block text-xs font-mono text-muted-foreground mb-1.5">Title</label><input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Meta Frontend Developer Certificate" className={cls} /></div>
          <div><label className="block text-xs font-mono text-muted-foreground mb-1.5">Issuer</label><input type="text" value={form.issuer} onChange={(e) => set("issuer", e.target.value)} placeholder="Coursera / Meta / Google / AWS..." className={cls} /></div>
          <div><label className="block text-xs font-mono text-muted-foreground mb-1.5">Category</label><input type="text" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Frontend, Cloud, Design..." className={cls} /></div>
          <div><label className="block text-xs font-mono text-muted-foreground mb-1.5">Credential URL</label><input type="url" value={form.credentialUrl} onChange={(e) => set("credentialUrl", e.target.value)} placeholder="https://coursera.org/verify/..." className={cls} /></div>

          {/* Image upload */}
          <div className="border border-dashed border-foreground/20 rounded-xl p-4 space-y-3">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Badge / Certificate Image</p>
            {form.imageUrl && (
              <div className="flex items-center gap-4">
                <img src={form.imageUrl} alt="Badge" className="w-16 h-16 object-contain rounded-lg border border-foreground/10" />
                <button onClick={() => set("imageUrl", "")} className="text-xs text-red-400 hover:text-red-300">Remove</button>
              </div>
            )}
            {uploadProgress !== null && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Uploading...</span><span>{uploadProgress}%</span></div>
                <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden"><div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${uploadProgress}%` }} /></div>
              </div>
            )}
            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={uploadProgress !== null}
              className="flex items-center gap-2 text-sm border border-foreground/15 rounded-lg px-4 py-2 hover:bg-foreground/5 transition-all disabled:opacity-50">
              <Upload size={14} strokeWidth={1.75} />
              {form.imageUrl ? "Replace image" : "Upload image"}
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-foreground/10">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-foreground/15 text-sm hover:bg-foreground/5 transition-all">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.id || !form.title}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {saving && <Loader size={13} className="animate-spin" />}
            {saving ? "Saving..." : "Save Certificate"}
          </button>
        </div>
      </div>
    </div>
  );
}
