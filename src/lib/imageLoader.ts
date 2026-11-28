// Custom next/image loader.
// Cloudinary images are resized and converted to the best format (WebP/AVIF) on the fly,
// so visitors download a small file instead of the original upload.
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.includes("res.cloudinary.com") && src.includes("/image/upload/")) {
    // Already transformed (or a pre-sized URL) — leave it alone
    if (/\/image\/upload\/(?:[a-z]{1,3}_[^/,]+,?)+\//.test(src)) return src;
    return src.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
  }
  // Local public files — width query only keeps srcset URLs distinct
  if (src.startsWith("/") && !src.startsWith("//")) {
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
  }
  return src;
}
