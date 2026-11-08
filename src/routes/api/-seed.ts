import { json } from "@tanstack/start";
import { seedTurso } from "@/lib/turso";

export async function POST({ request }: { request: Request }) {
  try {
    await seedTurso();
    return json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return json({ success: false, error: String(error) }, { status: 500 });
  }
}

