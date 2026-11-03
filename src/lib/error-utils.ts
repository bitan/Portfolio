import { FirebaseError } from "firebase/app";

export function getErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
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
        return error.message || "An error occurred";
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
  if (error instanceof FirebaseError) {
    return ["network-error", "unavailable", "deadline-exceeded"].includes(error.code);
  }
  return false;
}

export function isDuplicateError(error: unknown): boolean {
  if (error instanceof FirebaseError) {
    return error.message?.includes("duplicate") || error.message?.includes("already exists");
  }
  return false;
}
