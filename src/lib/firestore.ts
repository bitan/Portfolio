import {
  collection, doc, getDocs, getDoc, setDoc, addDoc,
  updateDoc, deleteDoc, orderBy, query, writeBatch,
  serverTimestamp, Timestamp, type Firestore,
} from "firebase/firestore";
import { db as _db } from "./firebase";
import { uploadToCloudinary } from "./cloudinary";
import type { Project } from "@/data/projects";
import { projects as staticProjects } from "@/data/projects";
import { skills as staticSkills, proficiencies as staticProficiencies } from "@/data/static";

// Safe db getter — throws a readable error if Firebase isn't configured
function db(): Firestore {
  if (!_db) throw new Error("Firebase is not configured. Fill in .env.local");
  return _db;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Skill {
  id: string;
  t: string;
  items: string[];
  logos?: Record<string, string>; // Maps tool name to logo URL
  order: number;
}

export interface Proficiency {
  id: string;
  name: string;
  pct: number;
  color: string;
  order: number;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  bio: string;
  statProjects: string;
  statLanguages: string;
  statCloud: string;
  resumeUrl: string;
  currentlyBuilding: { title: string; description: string; tags: string[] }[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Timestamp | null;
}

export interface Category {
  id: string;
  label: string;
  color: string;
  order: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  credentialUrl: string;
  imageUrl: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;       // e.g. "Founder, Haramaya Law Network"
  body: string;       // the quote
  avatarUrl: string;  // optional photo
  order: number;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const q = query(collection(db(), "testimonials"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Testimonial), id: d.id }));
}

export async function saveTestimonial(t: Testimonial): Promise<void> {
  const { id, ...data } = t;
  await setDoc(doc(db(), "testimonials", id), data, { merge: true });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db(), "testimonials", id));
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const q = query(collection(db(), "categories"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Category), id: d.id }));
}

export async function saveCategory(cat: Category): Promise<void> {
  const { id, ...data } = cat;
  await setDoc(doc(db(), "categories", id), data, { merge: true });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db(), "categories", id));
}

// ─── Certificates ─────────────────────────────────────────────────────────────

export async function fetchCertificates(): Promise<Certificate[]> {
  const q = query(collection(db(), "certificates"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Certificate), id: d.id }));
}

export async function saveCertificate(cert: Certificate): Promise<void> {
  const { id, ...data } = cert;
  await setDoc(doc(db(), "certificates", id), data, { merge: true });
}

export async function deleteCertificate(id: string): Promise<void> {
  await deleteDoc(doc(db(), "certificates", id));
}

export async function uploadCertificateImage(
  id: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  const result = await uploadToCloudinary(file, `certificates/${id}`, onProgress);
  return result.url;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function fetchProjects(): Promise<Project[]> {
  const q = query(collection(db(), "projects"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Project), slug: d.id }));
}

export async function fetchProject(slug: string): Promise<Project | null> {
  const snap = await getDoc(doc(db(), "projects", slug));
  if (!snap.exists()) return null;
  return { ...(snap.data() as Project), slug: snap.id };
}

export async function saveProject(project: Project): Promise<void> {
  const { slug, ...data } = project;
  await setDoc(doc(db(), "projects", slug), data, { merge: true });
}

export async function deleteProject(slug: string): Promise<void> {
  await deleteDoc(doc(db(), "projects", slug));
}

export async function reorderProjects(slugs: string[]): Promise<void> {
  const batch = writeBatch(db());
  slugs.forEach((slug, i) => batch.update(doc(db(), "projects", slug), { order: i }));
  await batch.commit();
}

// ─── Media upload ─────────────────────────────────────────────────────────────

export async function uploadProjectMedia(
  slug: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  const result = await uploadToCloudinary(file, `projects/${slug}`, onProgress);
  return result.url;
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function saveMessage(data: { name: string; email: string; message: string }): Promise<void> {
  await addDoc(collection(db(), "messages"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function fetchMessages(): Promise<Message[]> {
  const q = query(collection(db(), "messages"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Message), id: d.id }));
}

export async function markMessageRead(id: string): Promise<void> {
  await updateDoc(doc(db(), "messages", id), { read: true });
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db(), "messages", id));
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export async function fetchSkills(): Promise<Skill[]> {
  const q = query(collection(db(), "skills"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Skill), id: d.id }));
}

export async function saveSkill(skill: Skill): Promise<void> {
  const { id, ...data } = skill;
  await setDoc(doc(db(), "skills", id), data, { merge: true });
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db(), "skills", id));
}

export async function uploadSkillLogo(
  skillId: string,
  toolName: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  const result = await uploadToCloudinary(file, `skills/${skillId}/${toolName}`, onProgress);
  return result.url;
}

// ─── Proficiencies ────────────────────────────────────────────────────────────

export async function fetchProficiencies(): Promise<Proficiency[]> {
  const q = query(collection(db(), "proficiencies"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Proficiency), id: d.id }));
}

export async function saveProficiency(p: Proficiency): Promise<void> {
  const { id, ...data } = p;
  await setDoc(doc(db(), "proficiencies", id), data, { merge: true });
}

export async function deleteProficiency(id: string): Promise<void> {
  await deleteDoc(doc(db(), "proficiencies", id));
}

// ─── Site settings ────────────────────────────────────────────────────────────

export async function fetchSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db(), "settings", "main"));
  if (!snap.exists()) return null;
  return snap.data() as SiteSettings;
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await setDoc(doc(db(), "settings", "main"), settings, { merge: true });
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

export async function seedFirestore(): Promise<void> {
  const batch = writeBatch(db());

  staticProjects.forEach((p, i) => {
    const { slug, ...data } = p;
    batch.set(doc(db(), "projects", slug), { ...data, order: i });
  });

  const defaultCategories = [
    { label: "Web App",     color: "#3b82f6", order: 0 },
    { label: "UI/UX",       color: "#a855f7", order: 1 },
    { label: "Client Work", color: "#f59e0b", order: 2 },
    { label: "Open Source", color: "#22c55e", order: 3 },
    { label: "Personal",    color: "#ec4899", order: 4 },
    { label: "Systems",     color: "#ef4444", order: 5 },
  ];
  defaultCategories.forEach((c) => {
    const id = c.label.toLowerCase().replace(/[\s/]+/g, "-");
    batch.set(doc(db(), "categories", id), { ...c, id });
  });

  staticSkills.forEach((s, i) => {
    const id = s.t.toLowerCase().replace(/\s+/g, "-");
    batch.set(doc(db(), "skills", id), { ...s, id, order: i });
  });

  staticProficiencies.forEach((p, i) => {
    const id = p.name.toLowerCase().replace(/[\s/]+/g, "-");
    batch.set(doc(db(), "proficiencies", id), { ...p, id, order: i });
  });

  batch.set(doc(db(), "settings", "main"), {
    name: "Bitanya Tigabe",
    tagline: "Full-Stack Developer",
    location: "Dire Dawa · Ethiopia",
    email: "btsarmybita95@gmail.com",
    github: "https://github.com/bitan",
    linkedin: "https://linkedin.com/in/bitanya-tigabe",
    twitter: "https://x.com/@nabilara976",
    instagram: "https://instagram.com/nabilara24",
    facebook: "https://facebook.com/SuziBi",
    tiktok: "https://tiktok.com/@bita186",
    bio: "I'm a self-taught full-stack developer based in Dire Dawa, Ethiopia. I build web apps, tools, and experiences — from UI design to backend logic.",
    statProjects: "10+",
    statLanguages: "8+",
    statCloud: "4+",
    currentlyBuilding: [
      { title: "Bar Daily Tracker", description: "Tracks drinks, food, income, and costs for a bar — daily summaries and analytics dashboard.", tags: ["React", "Firebase", "Charts"] },
      { title: "Budget from Wallet/Banking App", description: "Reads user budgets from mobile banking apps and provides smart financial insights.", tags: ["Next.js", "TypeScript", "API"] },
    ],
  });

  await batch.commit();
  console.log("✓ Firestore seeded successfully");
}

