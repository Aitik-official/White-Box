// Browser-side helpers: shrink images before upload so they stay under Vercel's 4.5 MB
// request limit and load fast on the storefront.

export async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    // Keep the original only if resizing did not make it smaller
    if (!blob || (scale === 1 && blob.size >= file.size)) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

/** Compress + upload an image through /api/upload. Resolves with the hosted image URL. */
export async function uploadImage(file: File, maxDim = 1600): Promise<string> {
  const prepared = await compressImage(file, maxDim);

  const formData = new FormData();
  formData.append("file", prepared);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response (e.g. 413 from the host) */
  }

  if (res.status === 413) {
    throw new Error("Image is too large to upload (max ~4 MB). Please choose a smaller image.");
  }
  if (!res.ok || !data?.success || !data.url) {
    throw new Error(data?.error || "Image upload failed");
  }
  return data.url as string;
}
