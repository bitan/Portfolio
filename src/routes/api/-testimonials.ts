import { json } from "@tanstack/start";
import { db } from "@/lib/turso";
import type { Testimonial } from "@/lib/firestore";

export async function GET() {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM testimonials ORDER BY `order` ASC",
      args: [],
    });

    const testimonials = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      body: row.body,
      avatarUrl: row.avatarUrl || "",
      order: row.order || 0,
    }));

    return json(testimonials);
  } catch (error) {
    return json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as Testimonial;
    const { id, name, role, body: testimonialBody, avatarUrl, order } = body;

    await db.execute({
      sql: `
        INSERT INTO testimonials (id, name, role, body, avatarUrl, \`order\`)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name, role = excluded.role, body = excluded.body,
          avatarUrl = excluded.avatarUrl, \`order\` = excluded.\`order\`
      `,
      args: [id, name, role, testimonialBody, avatarUrl, order || 0],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to save testimonial" }, { status: 500 });
  }
}

export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    await db.execute({
      sql: "DELETE FROM testimonials WHERE id = ?",
      args: [id],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
