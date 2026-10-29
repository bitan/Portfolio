// Skill logos mapping — using lucide-react icons (already installed)
// These are reliable, fast, and don't require external API calls

import type { LucideIcon } from "lucide-react";

// We'll import specific icons as needed in components
export const skillLogos: Record<string, { iconName: string; color?: string }> = {
  // Frontend
  "React": { iconName: "react", color: "#61dafb" },
  "Next.js": { iconName: "arrow-right", color: "#ffffff" },
  "TypeScript": { iconName: "code", color: "#3178c6" },
  "Tailwind CSS": { iconName: "palette", color: "#06b6d4" },
  "HTML5 / CSS3": { iconName: "code-2", color: "#e34f26" },
  "HTML / CSS": { iconName: "code-2", color: "#e34f26" },
  
  // Backend
  "Node.js": { iconName: "server", color: "#6da55f" },
  "Python": { iconName: "snake", color: "#3776ab" },
  "PHP": { iconName: "code", color: "#777bb4" },
  
  // Databases
  "Firebase": { iconName: "database", color: "#ffca28" },
  "MySQL": { iconName: "database", color: "#4479a1" },
  "SQLite": { iconName: "database", color: "#003b57" },
  
  // Deploy & Cloud
  "Vercel": { iconName: "cloud", color: "#ffffff" },
  "Netlify": { iconName: "cloud-upload", color: "#00c7b7" },
  "Railway": { iconName: "train", color: "#0b0d0e" },
  "Firebase Hosting": { iconName: "database", color: "#ffca28" },
  
  // Design
  "Figma": { iconName: "square", color: "#f24e1e" },
  "Canva": { iconName: "image", color: "#00c4cc" },
};
