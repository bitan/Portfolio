const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const RAW_PRESET    = import.meta.env.VITE_CLOUDINARY_RAW_PRESET;

export interface UploadResult {
  url: string;
  publicId: string;
}

export function uploadToCloudinary(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const isPdf   = file.type === "application/pdf";
    const isVideo = file.type.startsWith("video/");

    // PDFs use the raw preset + raw resource type
    // Videos use the media preset + video resource type
    // Everything else is an image
    const resourceType = isPdf ? "raw" : isVideo ? "video" : "image";
    const preset       = isPdf ? RAW_PRESET : UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    formData.append("folder", folder);
    formData.append("access_mode", "public");

    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (!data.secure_url) {
          reject(new Error(data.error?.message ?? "Upload failed — no URL returned"));
          return;
        }
        resolve({ url: data.secure_url, publicId: data.public_id });
      } else {
        let msg = `Upload failed (${xhr.status})`;
        try { msg = JSON.parse(xhr.responseText).error?.message ?? msg; } catch {}
        reject(new Error(msg));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload failed — network error")));

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);
    xhr.send(formData);
  });
}
