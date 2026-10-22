import { useState } from "react";
import { seedFirestore } from "@/lib/firestore";
import { Database, AlertTriangle } from "lucide-react";

export function SeedPanel() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSeed() {
    setStatus("running");
    try {
      await seedFirestore();
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
        Run this once after setting up Firebase. It writes all the static portfolio data
        (projects, skills, proficiencies, settings) into Firestore so the admin panel
        and live site can read from it.
      </p>

      <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-4 flex gap-3 mb-8">
        <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={1.75} />
        <p className="text-sm text-yellow-400 leading-relaxed">
          This will overwrite any existing data in Firestore with the static defaults.
          Only run this on a fresh database or if you want to reset to defaults.
        </p>
      </div>

      {status === "done" && (
        <div className="border border-green-500/20 bg-green-500/5 rounded-xl p-4 mb-6 text-sm text-green-400">
          ✓ Firestore seeded successfully! All projects, skills, and settings are now in the database.
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
        {status === "running" ? "Seeding..." : status === "done" ? "✓ Done" : "Seed Firestore"}
      </button>
    </div>
  );
}
