import { json } from "@tanstack/start";
import { db } from "@/lib/turso";

export interface Social {
  id: string;
  label: string;
  href: string;
  order: number;
}

export async function GET() {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM socials ORDER BY `order` ASC",
      args: [],
    });

    const socials = result.rows.map((row: any) => ({
      id: row.id,
      label: row.label,
      href: row.href,
      order: row.order || 0,
    }));

    return json(socials);
  } catch (error) {
    return json({ error: "Failed to fetch socials" }, { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as Social;
    const { id, label, href, order } = body;

    await db.execute({
      sql: `
        INSERT INTO socials (id, label, href, \`order\`)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          label = excluded.label, href = excluded.href, \`order\` = excluded.\`order\`
      `,
      args: [id, label, href, order || 0],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to save social" }, { status: 500 });
  }
}

export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    await db.execute({
      sql: "DELETE FROM socials WHERE id = ?",
      args: [id],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete social" }, { status: 500 });
  }
}
