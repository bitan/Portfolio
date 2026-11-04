export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const err = error as any;
    switch (err.code) {
      case "auth/permission-denied":
        return "Access denied. Are you authenticated?";
      case "auth/unauthenticated":
        return "You must be logged in to make changes.";
      case "permission-denied":
        return "You don't have permission to perform this action.";
      case "resource-exhausted":
        return "Firestore quota exceeded. Please try again later.";
      case "deadline-exceeded":
        return "Request timed out. Please try again.";
      case "unavailable":
        return "Service unavailable. Please try again later.";
      default:
        return err.message || "An error occurred";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error) || "An unexpected error occurred";
}

export function getFieldError(errors: Record<string, string>, field: string): string | undefined {
  return errors[field] || errors[field.split(".")[0]];
}

export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as any).code;
    return ["network-error", "unavailable", "deadline-exceeded"].includes(code);
  }
  return false;
}

export function isDuplicateError(error: unknown): boolean {
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as any).message;
    return typeof msg === "string" && (msg.includes("duplicate") || msg.includes("already exists"));
  }
  return false;
}
