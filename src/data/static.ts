// Static fallback data — used for seeding Firestore and as offline fallback

export const skills = [
  { t: "Frontend",           items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 / CSS3"] },
  { t: "Backend",            items: ["Node.js", "PHP", "Python", "Java", "Kotlin"] },
  { t: "Databases",          items: ["MySQL", "SQLite", "Firebase"] },
  { t: "Cloud & Deploy",     items: ["AWS", "Vercel", "Netlify", "Firebase Hosting"] },
  { t: "Design",             items: ["Figma", "Canva", "Photoshop", "Blender"] },
  { t: "Currently Learning", items: ["Next.js (deep dive)", "TypeScript", "Database Design"] },
];

export const proficiencies = [
  { name: "HTML / CSS",     pct: 90, color: "#e34f26" },
  { name: "JavaScript",     pct: 82, color: "#f7df1e" },
  { name: "React",          pct: 78, color: "#61dafb" },
  { name: "TypeScript",     pct: 55, color: "#007acc" },
  { name: "Node.js",        pct: 65, color: "#6da55f" },
  { name: "Python",         pct: 60, color: "#3670a0" },
  { name: "MySQL / SQLite", pct: 62, color: "#4479a1" },
  { name: "Firebase",       pct: 70, color: "#ffca28" },
  { name: "Figma",          pct: 75, color: "#f24e1e" },
  { name: "Next.js",        pct: 45, color: "#ffffff" },
];
