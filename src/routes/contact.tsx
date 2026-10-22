import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Github, Linkedin, Mail } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/shared/Reveal";
import { socials } from "@/data/socials";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bitanya Tigabe" },
      { name: "description", content: "Get in touch with Bitanya Tigabe — open to collaborations, freelance work, and conversations about code." },
    ],
  }),
  component: ContactPage,
});

const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";

function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const { saveMessage } = await import("@/lib/firestore");
      await saveMessage({ name: formState.name, email: formState.email, message: formState.message });
      if (EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID") {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
          { from_name: formState.name, from_email: formState.email, message: formState.message },
          EMAILJS_PUBLIC_KEY);
      }
      setFormStatus("sent");
      setFormState({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setFormStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-24">

        <Reveal>
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">Let's Build<br />Something.</h1>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Open to collaborations, open-source projects, freelance work, or just a good conversation about code and design.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left — contact links */}
          <Reveal dir="left">
            <div className="space-y-6">
              <div className="space-y-4">
                <a href="mailto:btsarmybita95@gmail.com" className="flex items-center gap-3 text-sm hover:text-blue-500 transition-colors group">
                  <Mail size={15} className="text-blue-500 shrink-0" strokeWidth={1.75} />
                  <span className="group-hover:underline">btsarmybita95@gmail.com</span>
                </a>
                <a href="https://github.com/bitan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-blue-500 transition-colors group">
                  <Github size={15} className="text-blue-500 shrink-0" strokeWidth={1.75} />
                  <span className="group-hover:underline">github.com/bitan</span>
                </a>
                <a href="https://linkedin.com/in/bitanya-tigabe" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-blue-500 transition-colors group">
                  <Linkedin size={15} className="text-blue-500 shrink-0" strokeWidth={1.75} />
                  <span className="group-hover:underline">LinkedIn</span>
                </a>
              </div>

              <div className="pt-4 border-t border-foreground/10">
                <p className="text-xs font-mono text-muted-foreground mb-4 uppercase tracking-widest">Elsewhere</p>
                <div className="flex flex-wrap gap-2">
                  {socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-foreground/15 text-muted-foreground hover:border-blue-500 hover:text-blue-500 hover:scale-110 transition-all duration-200">
                        <Icon size={15} strokeWidth={1.75} />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-foreground/10">
                <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-widest">Response time</p>
                <p className="text-sm text-muted-foreground">Usually within 24 hours.</p>
              </div>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={100}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formStatus === "sent" && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm text-green-500 font-mono">
                  ✓ Message sent — I'll get back to you soon!
                </div>
              )}
              {formStatus === "error" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400 font-mono">
                  ✗ Something went wrong. Email me directly at{" "}
                  <a href="mailto:btsarmybita95@gmail.com" className="underline">btsarmybita95@gmail.com</a>
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-xs font-mono text-muted-foreground mb-1.5">Name</label>
                <input id="name" type="text" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Jane Doe" className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-muted-foreground/40" />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-mono text-muted-foreground mb-1.5">Email</label>
                <input id="email" type="email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="jane@example.com" className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-muted-foreground/40" />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-mono text-muted-foreground mb-1.5">Message</label>
                <textarea id="message" required rows={6} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tell me about your project or idea..." className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-muted-foreground/40 resize-none" />
              </div>
              <button type="submit" disabled={formStatus === "sending" || formStatus === "sent"}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100">
                {formStatus === "sending" && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {formStatus === "sending" ? "Sending..." : formStatus === "sent" ? "✓ Sent!" : "Send Message →"}
              </button>
            </form>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
