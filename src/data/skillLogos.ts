// Skill logos mapping — using Iconify CDN
// Format: skillName -> { icon: 'icon-set:icon-name', color: 'hex-color' }

export const skillLogos: Record<string, { icon: string; color: string }> = {
  // Frontend
  "React": { icon: "logos:react", color: "#61dafb" },
  "Next.js": { icon: "logos:nextjs-icon", color: "#ffffff" },
  "TypeScript": { icon: "logos:typescript-icon", color: "#3178c6" },
  "Tailwind CSS": { icon: "logos:tailwindcss-icon", color: "#06b6d4" },
  "HTML5 / CSS3": { icon: "logos:html-5", color: "#e34f26" },
  "HTML / CSS": { icon: "logos:html-5", color: "#e34f26" },
  
  // Backend
  "Node.js": { icon: "logos:nodejs-icon", color: "#6da55f" },
  "Python": { icon: "logos:python", color: "#3776ab" },
  "PHP": { icon: "logos:php", color: "#777bb4" },
  
  // Databases
  "Firebase": { icon: "logos:firebase", color: "#ffca28" },
  "MySQL": { icon: "logos:mysql-icon", color: "#4479a1" },
  "SQLite": { icon: "logos:sqlite", color: "#003b57" },
  
  // Deploy & Cloud
  "Vercel": { icon: "logos:vercel-icon", color: "#ffffff" },
  "Netlify": { icon: "logos:netlify-icon", color: "#00c7b7" },
  "Railway": { icon: "logos:railway-app-icon", color: "#0b0d0e" },
  "Firebase Hosting": { icon: "logos:firebase", color: "#ffca28" },
  
  // Design
  "Figma": { icon: "logos:figma", color: "#f24e1e" },
  "Canva": { icon: "logos:canva", color: "#00c4cc" },
};
