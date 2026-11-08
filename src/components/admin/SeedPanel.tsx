import { useState } from "react";
import { Database, AlertTriangle } from "lucide-react";

export function SeedPanel() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSeed() {
    setStatus("running");
    try {
      const res = await fetch("/api/-seed", { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setStatus("done");
    } catch (e) {
      setError(String(e));
      setStatus("error");
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold mb-2">Seed Database</h2>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Run this once to populate your Turso database with default projects, categories, skills, proficiencies, and settings.
      </p>

      <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-4 flex gap-3 mb-8">
        <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={1.75} />
        <p className="text-sm text-yellow-400 leading-relaxed">
          This inserts default data without overwriting existing data. Safe to run multiple times.
        </p>
      </div>

      {status === "done" && (
        <div className="border border-green-500/20 bg-green-500/5 rounded-xl p-4 mb-6 text-sm text-green-400">
          ✓ Turso database seeded successfully! All default projects, skills, and settings are now in the database.
          Switch to the Projects or Skills tab to start editing.
        </div>
      )}

      {status === "error" && (
        <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4 mb-6 text-sm text-red-400">
          ✗ Seed failed: {error}
        </div>
      )}

      <button
        onClick={handleSeed}
        disabled={status === "running" || status === "done"}
        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "running" ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Database size={15} strokeWidth={1.75} />
        )}
        {status === "running" ? "Seeding..." : status === "done" ? "✓ Done" : "Seed Turso Database"}
      </button>
    </div>
  );
}
