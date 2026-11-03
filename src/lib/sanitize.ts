/**
 * Basic XSS prevention by escaping HTML special characters
 * For production, use DOMPurify or similar library
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";

  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return String(input).replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char] || char);
}

export function isSuspiciousInput(input: string): boolean {
  // Check for common XSS patterns
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick=, onerror=, etc
    /<iframe/gi,
    /<embed/gi,
    /<object/gi,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
}

export function validateAndSanitize(input: string): { valid: boolean; sanitized: string; error?: string } {
  if (isSuspiciousInput(input)) {
    return {
      valid: false,
      sanitized: input,
      error: "Input contains potentially dangerous content",
    };
  }

  return {
    valid: true,
    sanitized: sanitizeInput(input),
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .slice(0, 50); // Max 50 chars
}
