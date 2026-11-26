import React from "react";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let blog: any = null;
  let related: any[] = [];

  try {
    await connectDB();
    blog = await Blog.findOne({ slug, published: true }).lean();
    if (blog) {
      related = await Blog.find({ published: true, slug: { $ne: slug } })
        .sort({ id: -1 })
        .limit(3)
        .lean();
    }
  } catch (e) {
    console.error("Blog detail fetch error:", e);
  }

  if (!blog) {
    notFound();
  }

  return (
    <BlogDetailClient
      blog={JSON.parse(JSON.stringify(blog))}
      related={JSON.parse(JSON.stringify(related))}
    />
  );
}
