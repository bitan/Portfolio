import { useEffect, useState } from "react";
import { fetchSettings } from "@/lib/firestore";

// Returns the resume URL from Firestore settings, falls back to the static PDF
export function useResumeUrl() {
  const [url, setUrl] = useState("/Bitanya-Tigabe-Resume.pdf");

  useEffect(() => {
    fetchSettings()
      .then((s) => { if (s?.resumeUrl) setUrl(s.resumeUrl); })
      .catch(() => {});
  }, []);

  return url;
}
