import { json } from "@tanstack/start";
import {
  collection, getDocs, setDoc, deleteDoc, doc, orderBy, query,
  type Firestore,
} from "firebase/firestore";
import { db as _db } from "@/lib/firebase";

function db(): Firestore {
  if (!_db) throw new Error("Firebase is not configured");
  return _db;
}

export interface Social {
  id: string;
  label: string;
  href: string;
  order: number;
}

export async function GET() {
  try {
    const q = query(collection(db(), "socials"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    const socials = snap.docs.map((d) => ({ ...(d.data() as Social), id: d.id }));
    return json(socials);
  } catch (error) {
    return json({ error: "Failed to fetch socials" }, { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as Social;
    const { id, ...data } = body;
    await setDoc(doc(db(), "socials", id), data, { merge: true });
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
    await deleteDoc(doc(db(), "socials", id));
    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to delete social" }, { status: 500 });
  }
}
