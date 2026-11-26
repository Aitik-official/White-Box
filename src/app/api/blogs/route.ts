import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDisplayDate(d?: string) {
  if (d && d.trim()) return d.trim();
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// GET all blogs (or one by slug)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const publishedOnly = searchParams.get("published") === "true";

    if (slug) {
      const blog = await Blog.findOne({ slug }).lean();
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(
        { success: true, blog },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    const query: Record<string, unknown> = {};
    if (publishedOnly) query.published = true;

    const blogs = await Blog.find(query).sort({ id: -1 }).lean();

    return NextResponse.json(
      { success: true, count: blogs.length, blogs },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Blogs API error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch blogs", blogs: [] }, { status: 500 });
  }
}

// POST create blog
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const title = (body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Blog title is required" }, { status: 400 });
    }

    const maxId = await Blog.findOne().sort({ id: -1 }).lean();
    const nextId = (maxId?.id || 0) + 1;

    let slug = (body.slug || "").trim() || slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) slug = `${slug}-${nextId}`;

    const blog = await Blog.create({
      id: nextId,
      slug,
      title,
      excerpt: (body.excerpt || "").trim(),
      content: (body.content || "").trim(),
      image: (body.image || "").trim(),
      date: formatDisplayDate(body.date),
      comments: body.comments || "0 Comments",
      author: (body.author || "WhiteBox Team").trim(),
      published: body.published !== false,
    });

    return NextResponse.json({ success: true, blog });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Create blog error:", error);
    return NextResponse.json({ error: error.message || "Failed to create blog" }, { status: 500 });
  }
}

// PUT update blog
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { _id, id, ...rest } = body;
    if (!_id && !id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    await connectDB();

    const updateData: Record<string, unknown> = { ...rest };
    if (updateData.title && !updateData.slug) {
      updateData.slug = slugify(String(updateData.title));
    }
    if (updateData.date !== undefined) {
      updateData.date = formatDisplayDate(String(updateData.date || ""));
    }

    const updated = await Blog.findOneAndUpdate(
      _id ? { _id } : { id },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog: updated });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Update blog error:", error);
    return NextResponse.json({ error: error.message || "Failed to update blog" }, { status: 500 });
  }
}

// DELETE blog(s)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const idsParam = searchParams.get("ids");

    let body: any = null;
    try {
      body = await req.json();
    } catch {}

    await connectDB();

    const bulkIds: string[] = body?.ids || (idsParam ? idsParam.split(",").filter(Boolean) : []);
    if (bulkIds.length > 0) {
      const result = await Blog.deleteMany({ _id: { $in: bulkIds } });
      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} blogs deleted`,
        deletedCount: result.deletedCount,
      });
    }

    if (!id) {
      return NextResponse.json({ error: "Blog ID required" }, { status: 400 });
    }

    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Blog "${deleted.title}" deleted` });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Delete blog error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete blog" }, { status: 500 });
  }
}
