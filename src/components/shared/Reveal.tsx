import { useRef, useState, useEffect } from "react";

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export type RevealDir = "up" | "left" | "right" | "fade";

export function Reveal({
  children,
  delay = 0,
  dir = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: RevealDir;
}) {
  const { ref, visible } = useReveal();
  const hiddenTransform: Record<RevealDir, string> = {
    up:    "translateY(28px)",
    left:  "translateX(-28px)",
    right: "translateX(28px)",
    fade:  "none",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : hiddenTransform[dir],
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
