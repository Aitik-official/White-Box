import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET all Main Categories and their Mini Categories (Always Sorted A-Z)
// Only returns categories created in admin — no demo seed / static fallback.
export async function GET() {
  try {
    await connectDB();

    const rawCategories = await Category.find().lean();

    // Sort all main categories alphabetically (A-Z)
    const categories = [...rawCategories]
      .map((cat: any) => ({
        ...cat,
        subcategories: Array.isArray(cat.subcategories)
          ? [...cat.subcategories].sort((a: string, b: string) =>
              a.localeCompare(b, undefined, { sensitivity: "base" })
            )
          : [],
      }))
      .sort((a: any, b: any) =>
        (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
      );

    return NextResponse.json(
      {
        success: true,
        count: categories.length,
        categories,
      },
      {
        headers: {
          // Edge-cached for a few seconds: storefront stays fast, admin edits show up almost instantly
          "Cache-Control": "public, max-age=0, s-maxage=15, stale-while-revalidate=120",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Categories API error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories", count: 0, categories: [] },
      { status: 500 }
    );
  }
}

// POST: Create Main Category OR Add Mini Category to an existing Main Category
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    // Case 1: Add a Mini Category to an existing Main Category
    if (body.action === "add_mini" || (body.categoryId && body.miniCategory)) {
      const { categoryId, categoryName, miniCategory } = body;
      const cleanMini = (miniCategory || "").trim();

      if (!cleanMini) {
        return NextResponse.json({ error: "Mini category name is required" }, { status: 400 });
      }

      const query = categoryId ? { _id: categoryId } : { name: categoryName };
      const category = await Category.findOne(query);

      if (!category) {
        return NextResponse.json({ error: "Main category not found" }, { status: 404 });
      }

      if (!category.subcategories.includes(cleanMini)) {
        category.subcategories.push(cleanMini);
        await category.save();
      }

      return NextResponse.json({ success: true, category });
    }

    // Case 2: Create a new Main Category
    const { name, icon, subcategories, order } = body;
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Main Category name is required" }, { status: 400 });
    }

    const cleanName = name.trim();
    const slug =
      body.slug?.trim() ||
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Check existing
    const existing = await Category.findOne({
      $or: [{ name: cleanName }, { slug }],
    });
    if (existing) {
      return NextResponse.json(
        { error: `Category "${cleanName}" already exists` },
        { status: 400 }
      );
    }

    // Process initial mini categories if provided
    let miniList: string[] = [];
    if (Array.isArray(subcategories)) {
      miniList = subcategories.map((s: string) => s.trim()).filter(Boolean);
    } else if (typeof subcategories === "string") {
      miniList = subcategories
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    const newCategory = await Category.create({
      name: cleanName,
      slug,
      icon: icon || "Wrench",
      subcategories: miniList,
      order: typeof order === "number" ? order : 0,
      description: body.description || "",
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

// PUT: Update Main Category details or Mini Categories
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await connectDB();

    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const updated = await Category.findByIdAndUpdate(_id, { $set: updateData }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a Main Category, Remove a Mini Category, or Bulk Delete
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const miniCategory = searchParams.get("miniCategory");
    const idsParam = searchParams.get("ids");

    let body: any = null;
    try {
      body = await req.json();
    } catch {}

    await connectDB();

    // 1. Bulk delete Main Categories
    const bulkIds: string[] = body?.ids || (idsParam ? idsParam.split(",").filter(Boolean) : []);
    if (bulkIds.length > 0) {
      const result = await Category.deleteMany({ _id: { $in: bulkIds } });
      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} categories deleted`,
        deletedCount: result.deletedCount,
      });
    }

    // 2. Bulk remove mini categories from a Main Category
    if (body?.action === "bulk_delete_mini" && body?.categoryId && Array.isArray(body?.miniCategories)) {
      const updated = await Category.findByIdAndUpdate(
        body.categoryId,
        { $pull: { subcategories: { $in: body.miniCategories } } },
        { new: true }
      );
      return NextResponse.json({
        success: true,
        message: `${body.miniCategories.length} mini categories removed`,
        category: updated,
      });
    }

    if (!id) {
      return NextResponse.json({ error: "Category ID(s) required" }, { status: 400 });
    }

    // 3. Single mini category removal
    if (miniCategory) {
      const updated = await Category.findByIdAndUpdate(
        id,
        { $pull: { subcategories: miniCategory } },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Mini category "${miniCategory}" removed successfully`,
        category: updated,
      });
    }

    // 4. Single Main Category deletion
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Main category "${deleted.name}" deleted successfully`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
