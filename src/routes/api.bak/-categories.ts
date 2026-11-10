import { json } from "@tanstack/start";
import { db } from "@/lib/turso";
import type { Category } from "@/lib/types";

export async function GET() {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM categories ORDER BY id ASC",
      args: [],
    });

    const categories = result.rows.map((row: any) => ({
      id: row.id,
      label: row.label,
      color: row.color || "",
      order: row.order || 0,
    }));

    return json(categories);
  } catch (error) {
    return json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as Category;
    const { id, label, color, order } = body;

    await db.execute({
      sql: `
        INSERT INTO categories (id, label, color, createdAt)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          label = excluded.label, color = excluded.color
      `,
      args: [id, label, color || "", order || 0],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to save category" }, { status: 500 });
  }
}

export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    await db.execute({
      sql: "DELETE FROM categories WHERE id = ?",
      args: [id],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete category" }, { status: 500 });
  }
}
