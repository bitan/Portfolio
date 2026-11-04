/**
 * Skills API routes
 * GET /api/skills - list all skills
 * POST /api/skills - create/update skill
 * DELETE /api/skills/:id - delete skill
 */

import { json } from "@tanstack/start";
import { db } from "@/lib/turso";
import type { Skill } from "@/lib/firestore";

// GET /api/skills
export async function GET() {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          s.id, s.t, s.order,
          GROUP_CONCAT(
            json_object('item', si.item, 'logoUrl', si.logoUrl), ','
          ) as items_str
        FROM skills s
        LEFT JOIN skill_items si ON s.id = si.skillId
        GROUP BY s.id
        ORDER BY s.order ASC
      `,
      args: [],
    });

    const skills = result.rows.map((row: any) => {
      let items: Record<string, string> = {};
      const logos: Record<string, string> = {};

      if (row.items_str) {
        try {
          const parsed = JSON.parse(`[${row.items_str}]`);
          parsed.forEach((item: any) => {
            items[item.item] = item.item;
            if (item.logoUrl) logos[item.item] = item.logoUrl;
          });
        } catch (e) {
          console.error("Failed to parse items for skill", row.id, e);
        }
      }

      return {
        id: row.id,
        t: row.t,
        items: Object.keys(items),
        logos,
        order: row.order,
      };
    });

    return json(skills);
  } catch (error) {
    console.error("❌ Failed to fetch skills:", error);
    return json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

// POST /api/skills (create/update)
export async function POST({ request }: { request: Request }) {
  try {
    const skill = (await request.json()) as Skill;

    if (!skill.id || !skill.t) {
      return json({ error: "Missing id or t" }, { status: 400 });
    }

    await db.execute("BEGIN TRANSACTION");

    try {
      // Upsert skill
      await db.execute({
        sql: `
          INSERT INTO skills (id, t, order, updatedAt)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            t = excluded.t, order = excluded.order, updatedAt = CURRENT_TIMESTAMP
        `,
        args: [skill.id, skill.t, skill.order ?? 0],
      });

      // Clear and re-insert items
      await db.execute({
        sql: "DELETE FROM skill_items WHERE skillId = ?",
        args: [skill.id],
      });

      for (let i = 0; i < (skill.items || []).length; i++) {
        const item = skill.items[i];
        const logoUrl = skill.logos?.[item] || "";

        await db.execute({
          sql: "INSERT INTO skill_items (skillId, item, logoUrl, `order`) VALUES (?, ?, ?, ?)",
          args: [skill.id, item, logoUrl, i],
        });
      }

      await db.execute("COMMIT");

      console.log("✅ Skill saved:", skill.id);
      return json({ success: true, id: skill.id });
    } catch (txnError) {
      await db.execute("ROLLBACK");
      throw txnError;
    }
  } catch (error) {
    console.error("❌ Failed to save skill:", error);
    return json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 }
    );
  }
}

// DELETE /api/skills/:id
export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return json({ error: "ID required" }, { status: 400 });
    }

    await db.execute({
      sql: "DELETE FROM skills WHERE id = ?",
      args: [id],
    });

    console.log("✅ Skill deleted:", id);
    return json({ success: true });
  } catch (error) {
    console.error("❌ Failed to delete skill:", error);
    return json({ error: "Failed to delete" }, { status: 500 });
  }
}
