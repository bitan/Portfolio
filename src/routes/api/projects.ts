/**
 * Projects API routes
 * GET /api/projects - list all projects
 * POST /api/projects - create/update project
 * DELETE /api/projects/:slug - delete project
 */

import { json } from "@tanstack/start";
import { db } from "@/lib/turso";
import type { Project } from "@/data/projects";

// GET /api/projects
export async function GET() {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          p.slug, p.n, p.t, p.d, p.lang, p.y, p.url, p.live, 
          p.category, p.isPrivate, p.mediaUrl, p.mediaType, 
          p.problem, p.solution,
          GROUP_CONCAT(pt.tag, ',') as tags_str,
          GROUP_CONCAT(pl.item, '||') as learned_str,
          GROUP_CONCAT(
            json_object('label', ph.label, 'value', ph.value), ','
          ) as highlights_str
        FROM projects p
        LEFT JOIN project_tags pt ON p.slug = pt.projectSlug
        LEFT JOIN project_learned pl ON p.slug = pl.projectSlug
        LEFT JOIN project_highlights ph ON p.slug = ph.projectSlug
        GROUP BY p.slug
        ORDER BY p.y DESC, p.n DESC
      `,
      args: [],
    });

    const projects = result.rows.map((row: any) => ({
      slug: row.slug,
      n: row.n,
      t: row.t,
      d: row.d,
      lang: row.lang,
      y: row.y,
      url: row.url || "",
      live: row.live || "",
      category: row.category || "",
      isPrivate: row.isPrivate === 1,
      mediaUrl: row.mediaUrl || "",
      mediaType: row.mediaType || "",
      problem: row.problem || "",
      solution: row.solution || "",
      tags: row.tags_str ? row.tags_str.split(",").filter(Boolean) : [],
      learned: row.learned_str
        ? row.learned_str.split("||").filter(Boolean)
        : [],
      highlights: row.highlights_str
        ? JSON.parse(`[${row.highlights_str}]`)
        : [],
    }));

    return json(projects);
  } catch (error) {
    console.error("❌ Failed to fetch projects:", error);
    return json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/projects (create/update)
export async function POST({ request }: { request: Request }) {
  try {
    const project = (await request.json()) as Project;

    // Validate required fields
    if (!project.slug || !project.t || !project.d) {
      return json(
        { error: "Missing required fields: slug, t, d" },
        { status: 400 }
      );
    }

    // Use transaction to ensure consistency
    await db.execute("BEGIN TRANSACTION");

    try {
      // Upsert main project
      await db.execute({
        sql: `
          INSERT INTO projects (
            slug, n, t, d, lang, y, url, live, category, isPrivate, 
            mediaUrl, mediaType, problem, solution, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(slug) DO UPDATE SET
            n = excluded.n, t = excluded.t, d = excluded.d, lang = excluded.lang,
            y = excluded.y, url = excluded.url, live = excluded.live,
            category = excluded.category, isPrivate = excluded.isPrivate,
            mediaUrl = excluded.mediaUrl, mediaType = excluded.mediaType,
            problem = excluded.problem, solution = excluded.solution,
            updatedAt = CURRENT_TIMESTAMP
        `,
        args: [
          project.slug,
          project.n,
          project.t,
          project.d,
          project.lang,
          project.y,
          project.url,
          project.live,
          project.category,
          project.isPrivate ? 1 : 0,
          project.mediaUrl,
          project.mediaType,
          project.problem,
          project.solution,
        ],
      });

      // Clear and re-insert tags
      await db.execute({
        sql: "DELETE FROM project_tags WHERE projectSlug = ?",
        args: [project.slug],
      });

      for (const tag of project.tags || []) {
        await db.execute({
          sql: "INSERT INTO project_tags (projectSlug, tag) VALUES (?, ?)",
          args: [project.slug, tag],
        });
      }

      // Clear and re-insert learned items
      await db.execute({
        sql: "DELETE FROM project_learned WHERE projectSlug = ?",
        args: [project.slug],
      });

      for (let i = 0; i < (project.learned || []).length; i++) {
        await db.execute({
          sql: "INSERT INTO project_learned (projectSlug, item, `order`) VALUES (?, ?, ?)",
          args: [project.slug, project.learned![i], i],
        });
      }

      // Clear and re-insert highlights
      await db.execute({
        sql: "DELETE FROM project_highlights WHERE projectSlug = ?",
        args: [project.slug],
      });

      for (let i = 0; i < (project.highlights || []).length; i++) {
        await db.execute({
          sql: "INSERT INTO project_highlights (projectSlug, label, value, `order`) VALUES (?, ?, ?, ?)",
          args: [
            project.slug,
            project.highlights![i].label,
            project.highlights![i].value,
            i,
          ],
        });
      }

      await db.execute("COMMIT");

      console.log("✅ Project saved:", project.slug);
      return json({ success: true, slug: project.slug });
    } catch (txnError) {
      await db.execute("ROLLBACK");
      throw txnError;
    }
  } catch (error) {
    console.error("❌ Failed to save project:", error);
    return json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:slug
export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const slug = url.pathname.split("/").pop();

    if (!slug) {
      return json({ error: "Slug required" }, { status: 400 });
    }

    await db.execute({
      sql: "DELETE FROM projects WHERE slug = ?",
      args: [slug],
    });

    console.log("✅ Project deleted:", slug);
    return json({ success: true });
  } catch (error) {
    console.error("❌ Failed to delete project:", error);
    return json({ error: "Failed to delete" }, { status: 500 });
  }
}
