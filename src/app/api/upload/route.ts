import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Try uploading to Cloudinary
    try {
      const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "whitebox/products",
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) {
                reject(error || new Error("Cloudinary upload failed"));
              } else {
                resolve({
                  secure_url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            }
          );
          uploadStream.end(buffer);
        }
      );

      if (uploadResult?.secure_url) {
        return NextResponse.json({
          success: true,
          url: uploadResult.secure_url,
          storage: "cloudinary",
        });
      }
    } catch (cloudErr) {
      console.warn("Cloudinary direct upload encountered an issue:", cloudErr);
      // Serverless hosts (Vercel) have a read-only disk, so a local fallback can never work there.
      if (process.env.VERCEL) {
        const message = (cloudErr as { message?: string })?.message || "Cloudinary upload failed";
        return NextResponse.json({ error: `Image upload failed: ${message}` }, { status: 502 });
      }
    }

    // 2. Resilient Fallback: Local public/uploads/ storage
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, safeName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${safeName}`,
      storage: "local",
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
