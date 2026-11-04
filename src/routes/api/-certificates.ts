import { json } from "@tanstack/start";
import { db } from "@/lib/turso";
import type { Certificate } from "@/lib/firestore";

export async function GET() {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM certificates ORDER BY `order` ASC",
      args: [],
    });

    const certificates = result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      issuer: row.issuer,
      date: row.date,
      category: row.category,
      credentialUrl: row.credentialUrl || "",
      imageUrl: row.imageUrl || "",
      order: row.order || 0,
    }));

    return json(certificates);
  } catch (error) {
    return json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as Certificate;
    const { id, title, issuer, date, category, credentialUrl, imageUrl, order } = body;

    await db.execute({
      sql: `
        INSERT INTO certificates (id, title, issuer, date, category, credentialUrl, imageUrl, \`order\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title, issuer = excluded.issuer, date = excluded.date,
          category = excluded.category, credentialUrl = excluded.credentialUrl,
          imageUrl = excluded.imageUrl, \`order\` = excluded.\`order\`
      `,
      args: [id, title, issuer, date, category, credentialUrl || "", imageUrl || "", order || 0],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to save certificate" }, { status: 500 });
  }
}

export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    await db.execute({
      sql: "DELETE FROM certificates WHERE id = ?",
      args: [id],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}
