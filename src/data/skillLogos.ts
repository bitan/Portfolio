// Skill logos mapping — using Iconify render API for reliable image loading
// Format: skillName -> { url: 'iconify render url', color: 'hex-color' }

export const skillLogos: Record<string, { url: string; color?: string }> = {
  // Frontend
  "React": { url: "https://api.iconify.design/logos:react.svg?color=white", color: "#61dafb" },
  "Next.js": { url: "https://api.iconify.design/logos:nextjs-icon.svg?color=white", color: "#ffffff" },
  "TypeScript": { url: "https://api.iconify.design/logos:typescript-icon.svg?color=white", color: "#3178c6" },
  "Tailwind CSS": { url: "https://api.iconify.design/logos:tailwindcss-icon.svg?color=white", color: "#06b6d4" },
  "HTML5 / CSS3": { url: "https://api.iconify.design/logos:html-5.svg?color=white", color: "#e34f26" },
  "HTML / CSS": { url: "https://api.iconify.design/logos:html-5.svg?color=white", color: "#e34f26" },
  
  // Backend
  "Node.js": { url: "https://api.iconify.design/logos:nodejs-icon.svg?color=white", color: "#6da55f" },
  "Python": { url: "https://api.iconify.design/logos:python.svg?color=white", color: "#3776ab" },
  "PHP": { url: "https://api.iconify.design/logos:php.svg?color=white", color: "#777bb4" },
  
  // Databases
  "Firebase": { url: "https://api.iconify.design/logos:firebase.svg?color=white", color: "#ffca28" },
  "MySQL": { url: "https://api.iconify.design/logos:mysql-icon.svg?color=white", color: "#4479a1" },
  "SQLite": { url: "https://api.iconify.design/logos:sqlite.svg?color=white", color: "#003b57" },
  
  // Deploy & Cloud
  "Vercel": { url: "https://api.iconify.design/logos:vercel-icon.svg?color=white", color: "#ffffff" },
  "Netlify": { url: "https://api.iconify.design/logos:netlify-icon.svg?color=white", color: "#00c7b7" },
  "Railway": { url: "https://api.iconify.design/logos:railway-app-icon.svg?color=white", color: "#0b0d0e" },
  "Firebase Hosting": { url: "https://api.iconify.design/logos:firebase.svg?color=white", color: "#ffca28" },
  
  // Design
  "Figma": { url: "https://api.iconify.design/logos:figma.svg?color=white", color: "#f24e1e" },
  "Canva": { url: "https://api.iconify.design/logos:canva.svg?color=white", color: "#00c4cc" },
};
