export const FILE_VALIDATION = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_LOGO_SIZE: 2 * 1024 * 1024, // 2MB for logos
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm"],
  ALLOWED_LOGO_TYPES: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
};

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_VALIDATION.MAX_IMAGE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    const maxMB = FILE_VALIDATION.MAX_IMAGE_SIZE / 1024 / 1024;
    return { valid: false, error: `Image too large (${sizeMB}MB max, got ${maxMB}MB)` };
  }

  if (!FILE_VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid image format. Allowed: JPG, PNG, WebP" };
  }

  return { valid: true };
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_VALIDATION.MAX_VIDEO_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    const maxMB = FILE_VALIDATION.MAX_VIDEO_SIZE / 1024 / 1024;
    return { valid: false, error: `Video too large (${sizeMB}MB max, got ${maxMB}MB)` };
  }

  if (!FILE_VALIDATION.ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid video format. Allowed: MP4, WebM" };
  }

  return { valid: true };
}

export function validateProjectMedia(file: File): { valid: boolean; error?: string } {
  const isVideo = file.type.startsWith("video/");

  if (isVideo) {
    return validateVideoFile(file);
  } else {
    return validateImageFile(file);
  }
}

export function validateLogoFile(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_VALIDATION.MAX_LOGO_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    const maxMB = FILE_VALIDATION.MAX_LOGO_SIZE / 1024 / 1024;
    return { valid: false, error: `Logo too large (${sizeMB}MB max, got ${maxMB}MB)` };
  }

  if (!FILE_VALIDATION.ALLOWED_LOGO_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid logo format. Allowed: JPG, PNG, WebP, SVG" };
  }

  return { valid: true };
}

export function getFileTypeLabel(type: string): string {
  const imageTypes: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WebP",
    "image/svg+xml": "SVG",
  };

  const videoTypes: Record<string, string> = {
    "video/mp4": "MP4",
    "video/webm": "WebM",
  };

  return imageTypes[type] || videoTypes[type] || "Unknown";
}
