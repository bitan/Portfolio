const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
    // PDFs and other non-image/video files must use the "raw" resource type
    const isPdf   = file.type === "application/pdf";
    const isVideo = file.type.startsWith("video/");
    const resourceType = isPdf ? "raw" : isVideo ? "video" : "image";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

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
          reject(new Error(data.error?.message ?? "Upload failed"));
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
