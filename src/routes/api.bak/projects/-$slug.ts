import { json } from "@tanstack/react-start";
import { db } from "@/lib/turso";

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM projects WHERE slug = ?",
      args: [params.slug],
    });
    
    const project = result.rows[0];
    if (!project) {
      return json({ error: "Project not found" }, { status: 404 });
    }
    return json(project);
  } catch (error) {
    return json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function DELETE({ params }: { params: { slug: string } }) {
  try {
    await db.execute({
      sql: "DELETE FROM projects WHERE slug = ?",
      args: [params.slug],
    });
    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete" }, { status: 500 });
  }
}
