import { json } from "@tanstack/react-start";
import { db } from "@/lib/turso";
import type { Proficiency } from "@/lib/firestore";

export async function GET() {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM proficiencies ORDER BY `order` ASC",
      args: [],
    });

    const proficiencies = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      pct: row.pct || 0,
      color: row.color || "#333333",
      order: row.order || 0,
    }));

    return json(proficiencies);
  } catch (error) {
    return json({ error: "Failed to fetch proficiencies" }, { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as Proficiency;
    const { id, name, pct, color, order } = body;

    await db.execute({
      sql: `
        INSERT INTO proficiencies (id, name, pct, color, \`order\`)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name, pct = excluded.pct, color = excluded.color,
          \`order\` = excluded.\`order\`
      `,
      args: [id, name, pct || 0, color || "#333333", order || 0],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to save proficiency" }, { status: 500 });
  }
}

export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    await db.execute({
      sql: "DELETE FROM proficiencies WHERE id = ?",
      args: [id],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete proficiency" }, { status: 500 });
  }
}
