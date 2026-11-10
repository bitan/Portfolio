import { json } from "@tanstack/start";
import { db } from "@/lib/turso";

export async function GET() {
  try {
    const [msgs, projects, certs, testimonials] = await Promise.all([
      db.execute({ sql: "SELECT * FROM messages", args: [] }),
      db.execute({ sql: "SELECT * FROM projects", args: [] }),
      db.execute({ sql: "SELECT * FROM certificates", args: [] }),
      db.execute({ sql: "SELECT * FROM testimonials", args: [] }),
    ]);

    const unreadCount = (msgs.rows as any[]).filter((d: any) => !d.read).length;

    // Last 5 messages
    const recentMessages = (msgs.rows as any[])
      .map((d: any) => ({ name: d.name, email: d.email, createdAt: d.createdAt }))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);

    return json({
      counts: {
        messages: msgs.rows.length,
        unread: unreadCount,
        projects: projects.rows.length,
        certificates: certs.rows.length,
        testimonials: testimonials.rows.length,
      },
      recentMessages,
    });
  } catch (error) {
    return json({ error: String(error) }, { status: 500 });
  }
}
