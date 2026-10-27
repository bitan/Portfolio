import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { fetchCertificates, fetchCategories, type Certificate, type Category } from "@/lib/firestore";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/shared/Reveal";
import { ExternalLink, Award } from "lucide-react";

export const Route = createFileRoute("/certificates/")({
  head: () => ({
    meta: [
      { title: "Certificates — Bitanya (Nabi) Tigabe" },
      { name: "description", content: "Certifications and credentials earned by Bitanya Tigabe (Nabi)." },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCertificates(), fetchCategories()])
      .then(([certs, cats]) => { setCertificates(certs); setCategories(cats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build cert-specific categories from what's actually used
  const certCategories = Array.from(new Set(certificates.map((c) => c.category).filter(Boolean)));
  const filtered = activeCategory === "All" ? certificates : certificates.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-24">

        <Reveal>
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">Certificates</h1>
            <p className="text-muted-foreground text-sm max-w-xl">Credentials and certifications I've earned across development, design, and cloud platforms.</p>
          </div>
        </Reveal>

        {/* Category filter */}
        {certCategories.length > 0 && (
          <Reveal delay={80}>
            <div className="flex flex-wrap gap-2 mb-12">
              <button onClick={() => setActiveCategory("All")}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${activeCategory === "All" ? "bg-foreground text-background" : "border border-foreground/20 text-muted-foreground hover:text-foreground"}`}>
                All ({certificates.length})
              </button>
              {certCategories.map((cat) => {
                const firestoreCat = categories.find((c) => c.label === cat);
                const count = certificates.filter((c) => c.category === cat).length;
                return (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className="px-4 py-1.5 rounded-full text-xs font-mono transition-all border"
                    style={activeCategory === cat
                      ? { background: firestoreCat?.color ?? "#3b82f6", borderColor: firestoreCat?.color ?? "#3b82f6", color: "#fff" }
                      : { borderColor: `${firestoreCat?.color ?? "#3b82f6"}40`, color: firestoreCat?.color ?? "#3b82f6" }}>
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && certificates.length === 0 && (
          <div className="text-center py-24 border border-dashed border-foreground/10 rounded-2xl">
            <Award size={40} className="text-muted-foreground/20 mx-auto mb-4" strokeWidth={1} />
            <p className="text-muted-foreground text-sm">No certificates added yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add certificates from the admin panel.</p>
          </div>
        )}

        {/* Certificates grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((cert, i) => (
              <Reveal key={cert.id} delay={i * 60}>
                <div className="group border border-foreground/10 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 flex flex-col h-full">
                  {/* Badge / Image */}
                  <div className="relative w-full h-44 bg-foreground/5 flex items-center justify-center overflow-hidden">
                    {cert.imageUrl ? (
                      <img src={cert.imageUrl} alt={cert.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                        <Award size={40} strokeWidth={1} />
                        <span className="text-xs font-mono">No image</span>
                      </div>
                    )}
                    {cert.category && (
                      <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-full border"
                        style={(() => {
                          const cat = categories.find((c) => c.label === cert.category);
                          return cat
                            ? { color: cat.color, borderColor: `${cat.color}40`, background: `${cat.color}15` }
                            : { color: "#3b82f6", borderColor: "#3b82f640", background: "#3b82f615" };
                        })()}>
                        {cert.category}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-sm leading-snug mb-1 group-hover:text-blue-500 transition-colors">{cert.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{cert.issuer}</p>
                    {cert.date && (
                      <p className="text-[10px] font-mono text-muted-foreground/60 mb-3">
                        {new Date(cert.date + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </p>
                    )}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                        className="mt-auto flex items-center gap-1.5 text-xs font-mono text-blue-500 hover:underline">
                        <ExternalLink size={11} strokeWidth={1.75} />
                        Verify credential
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
