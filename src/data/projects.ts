export interface Project {
  slug: string;
  n: string;
  t: string;
  lang: string;
  tags: string[];
  y: string;
  d: string;
  url: string;
  live: string;
  category: string;        // e.g. "Web App", "Client Work", "Open Source"
  isPrivate: boolean;      // hides GitHub link if true
  mediaUrl: string;        // Firebase Storage URL for screen recording or screenshot
  mediaType: "video" | "image" | "";  // type of uploaded media
  // Detail page extras
  problem: string;
  solution: string;
  learned: string[];
  highlights: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    slug: "devpulse",
    n: "01",
    t: "DevPulse — AI Productivity Dashboard",
    lang: "TypeScript",
    tags: ["TypeScript", "Firebase", "Node.js", "React"],
    y: "2026",
    d: "A dual-purpose project: a Node.js CLI tool that tracks developer commands to Firebase Firestore, plus a React dashboard that visualizes that data.",
    url: "https://github.com/bitan/DevPulse-AI-Developer-Productivity-Dashboard",
    live: "https://dev-pulse-ai-developer-productivity.vercel.app/",
    category: "Web App",
    isPrivate: false,
    mediaUrl: "",
    mediaType: "",
    problem:
      "Developers have no passive way to see where their time actually goes. Most productivity tools require manual input — which defeats the purpose when you're deep in a flow state.",
    solution:
      "A CLI wrapper intercepts terminal commands and silently logs them to Firestore in real time. A React dashboard then visualises the data — commands run, time spent per tool, streaks, and productivity trends — without any manual effort from the developer.",
    learned: [
      "Designing event-driven pipelines between a CLI and a cloud database",
      "Firebase Firestore real-time listeners and security rules",
      "Recharts for interactive data visualisation",
      "Building a Node.js CLI tool with commander and async I/O",
    ],
    highlights: [
      { label: "Stack", value: "React · Node.js · TypeScript · Firebase" },
      { label: "Year", value: "2026" },
      { label: "Type", value: "Full-stack" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    slug: "road-app",
    n: "02",
    t: "Road App — Smart Transport System",
    lang: "TypeScript",
    tags: ["React", "Maps API", "TypeScript", "Routing"],
    y: "2026",
    d: "Solves traffic, transportation and road stress by revealing the best and most efficient routes to public transport users — real-time, intelligent navigation.",
    url: "https://github.com/bitan/road-app",
    live: "",
    category: "Web App",
    isPrivate: false,
    mediaUrl: "",
    mediaType: "",
    problem:
      "Public transport in Dire Dawa is opaque — users have no reliable way to know which route is fastest, how congested a road is, or when the next bus is coming.",
    solution:
      "A React web app that integrates a Maps API to surface optimal public transport routes in real time. The interface is designed mobile-first for low-bandwidth conditions, with clear route visualisation and estimated travel times.",
    learned: [
      "Integrating and customising third-party Maps APIs",
      "Routing algorithm basics and graph traversal for transport networks",
      "Designing for low-bandwidth, mobile-first users",
      "State management for real-time data updates in React",
    ],
    highlights: [
      { label: "Stack", value: "React · TypeScript · Maps API" },
      { label: "Year", value: "2026" },
      { label: "Type", value: "Frontend" },
      { label: "Status", value: "In development" },
    ],
  },
  {
    slug: "haramaya-law-network",
    n: "03",
    t: "Haramaya Female Law Students Network",
    lang: "TypeScript",
    tags: ["TypeScript", "React", "UI/UX"],
    y: "2025",
    d: "An introductory website prototype built for the Haramaya Female Law Students & Legal Professionals Network club — clean, professional, and accessible.",
    url: "https://github.com/bitan/dignified-authority-network",
    live: "https://dignified-authority.vercel.app/",
    category: "Client Work",
    isPrivate: false,
    mediaUrl: "",
    mediaType: "",
    problem:
      "The club had no web presence — no way for prospective members, mentors, or partners to discover or contact them online.",
    solution:
      "A clean, professional static site that introduces the club, its mission, and its members. Designed in Figma first, then built in React with Tailwind CSS. Deployed to Vercel for zero-maintenance hosting.",
    learned: [
      "Translating a Figma design system into a React component library",
      "Accessibility-first design — semantic HTML, ARIA labels, contrast ratios",
      "Working with a real client and iterating on feedback",
      "Deploying and maintaining a production site on Vercel",
    ],
    highlights: [
      { label: "Stack", value: "React · TypeScript · Tailwind CSS" },
      { label: "Year", value: "2025" },
      { label: "Type", value: "Client project" },
      { label: "Status", value: "Live" },
    ],
  },
  {
    slug: "bud-web",
    n: "04",
    t: "Budget Manager — bud-web",
    lang: "HTML/JS",
    tags: ["HTML", "CSS", "JavaScript"],
    y: "2025",
    d: "A company budget management website that tracks income, expenses, and financial summaries in a clean, accessible interface.",
    url: "https://github.com/bitan/bud-web",
    live: "",
    category: "Client Work",
    isPrivate: false,
    mediaUrl: "",
    mediaType: "",
    problem:
      "A small company was tracking its budget in spreadsheets — error-prone, hard to share, and impossible to visualise at a glance.",
    solution:
      "A vanilla HTML/CSS/JS web app with no framework overhead. Income and expenses are logged, categorised, and summarised. Financial totals update live as data is entered, keeping the UI snappy on low-end devices.",
    learned: [
      "Building interactive UIs without a framework — DOM manipulation and event handling",
      "Structuring a vanilla JS project for maintainability",
      "Local storage persistence without a backend",
      "Designing for non-technical users",
    ],
    highlights: [
      { label: "Stack", value: "HTML · CSS · JavaScript" },
      { label: "Year", value: "2025" },
      { label: "Type", value: "Client project" },
      { label: "Status", value: "In development" },
    ],
  },
  {
    slug: "album-finder",
    n: "05",
    t: "Album Finder",
    lang: "JavaScript",
    tags: ["JavaScript", "Music API", "CSS"],
    y: "2025",
    d: "Search albums via a music API and save favorites to a personal collection. Clean UI with persistent local storage. Deployed on Railway.",
    url: "https://github.com/bitan/Album-Finder",
    live: "https://album-finder-production-fb96.up.railway.app/",
    category: "Personal",
    isPrivate: false,
    mediaUrl: "",
    mediaType: "",
    problem:
      "A personal itch — wanting a clean, minimal way to search for albums and keep a saved list without signing up for yet another service.",
    solution:
      "A JavaScript app that hits a music API, displays results with cover art and metadata, and lets you save favourites to local storage. Deployed on Railway for persistent uptime.",
    learned: [
      "Working with third-party REST APIs — authentication, rate limits, pagination",
      "Local storage as a lightweight persistence layer",
      "Deploying a Node-backed app to Railway",
      "Building a polished UI with vanilla CSS — no framework",
    ],
    highlights: [
      { label: "Stack", value: "JavaScript · Music API · CSS" },
      { label: "Year", value: "2025" },
      { label: "Type", value: "Personal project" },
      { label: "Status", value: "Live" },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
