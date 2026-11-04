import { json } from "@tanstack/react-start";
import { fetchProject, deleteProject } from "@/lib/firestore";

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const project = await fetchProject(params.slug);
    if (!project) {
      return json({ error: "Project not found" }, { status: 404 });
    }
    return json(project);
  } catch (error) {
    return json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function DELETE({ params }: { params: { slug: string } }) {
  try {
    await deleteProject(params.slug);
    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete" }, { status: 500 });
  }
}
