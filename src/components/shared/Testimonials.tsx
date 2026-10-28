import { useState, useEffect } from "react";
import { fetchTestimonials, type Testimonial } from "@/lib/firestore";
import { Reveal } from "@/components/shared/Reveal";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials().then(setTestimonials).catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 bg-foreground/[0.02] border-t border-foreground/10">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">What people say</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <div className="border border-foreground/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-blue-500/20 transition-colors h-full">
                <Quote size={20} className="text-blue-500/40 shrink-0" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">"{t.body}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-foreground/8">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name}
                      className="w-9 h-9 rounded-full object-cover border border-foreground/10"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-blue-500">{t.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold leading-tight">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
