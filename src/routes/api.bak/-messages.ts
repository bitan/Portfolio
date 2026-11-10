import { json } from "@tanstack/start";
import { db } from "@/lib/turso";
import type { Message } from "@/lib/types";

export async function GET() {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM messages ORDER BY createdAt DESC",
      args: [],
    });

    const messages = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      message: row.message,
      read: row.read === 1,
      createdAt: row.createdAt,
    }));

    return json(messages);
  } catch (error) {
    return json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as { id: string; name: string; email: string; message: string; read?: boolean };
    const { id, name, email, message: msg, read } = body;

    await db.execute({
      sql: `
        INSERT INTO messages (id, name, email, message, read)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name, email = excluded.email, message = excluded.message,
          read = excluded.read
      `,
      args: [id, name, email, msg, read ? 1 : 0],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to save message" }, { status: 500 });
  }
}

export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    await db.execute({
      sql: "DELETE FROM messages WHERE id = ?",
      args: [id],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete message" }, { status: 500 });
  }
}

// Mark message as read
export async function PATCH({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    await db.execute({
      sql: "UPDATE messages SET read = 1 WHERE id = ?",
      args: [id],
    });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to mark message as read" }, { status: 500 });
  }
}
