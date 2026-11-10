import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Returns the resume URL from API settings, falls back to the static PDF
export function useResumeUrl() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/-settings");
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      } catch {
        return {};
      }
    },
  });

  return settings?.resumeUrl || "/Bitanya-Tigabe-Resume.pdf";
}
