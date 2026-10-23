const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface UploadResult {
  url: string;       // secure HTTPS URL
  publicId: string;  // Cloudinary public_id for future management
}

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * Works directly from the browser — no backend needed.
 *
 * @param file       The File object to upload
 * @param folder     Cloudinary folder path e.g. "projects/devpulse"
 * @param onProgress Optional callback receiving 0–100 progress
 */
export function uploadToCloudinary(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, publicId: data.public_id });
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload failed — network error")));

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`);
    xhr.send(formData);
  });
}
