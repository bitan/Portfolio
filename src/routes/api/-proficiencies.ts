import { json } from "@tanstack/react-start";
import { fetchProficiencies, saveProficiency, deleteProficiency } from "@/lib/firestore";
import type { Proficiency } from "@/lib/firestore";

export async function GET() {
  try {
    const proficiencies = await fetchProficiencies();
    return json(proficiencies);
  } catch (error) {
    return json({ error: "Failed to fetch proficiencies" }, { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as Proficiency;
    await saveProficiency(body);
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
    await deleteProficiency(id);
    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete proficiency" }, { status: 500 });
  }
}
