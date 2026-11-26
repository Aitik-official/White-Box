import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";
import User from "@/models/User";
import SiteSettings from "@/models/SiteSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ALL_HOME_SECTIONS = ["top-selling", "flash-deals", "hot-trending", "top-featured"];

function normalizeHomeSections(homeSection?: string, homeSections?: string[]) {
  const section = (homeSection || "all").trim() || "all";
  if (section === "none") {
    return { homeSection: "none", homeSections: [] as string[] };
  }

  let sections = Array.isArray(homeSections) ? homeSections.map((s) => String(s).trim()).filter(Boolean) : [];

  // Expand "all" placeholder into every homepage section
  if (section === "all" || sections.includes("all") || sections.length === 0) {
    return { homeSection: "all", homeSections: [...ALL_HOME_SECTIONS] };
  }

  sections = Array.from(new Set(sections));
  return {
    homeSection: sections.length === 1 ? sections[0] : section,
    homeSections: sections,
  };
}

/**
 * Ensure Main Category exists for navbar/shop.
 * IMPORTANT: Never auto-add mini categories from product save —
 * product titles / leftover form values were polluting navbar dropdowns.
 * Mini categories are managed only in Categories admin.
 */
async function ensureMainCategoryExists(mainName: string) {
  const cleanMain = (mainName || "").trim();
  if (!cleanMain) return;

  const slug = cleanMain
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const existing = await Category.findOne({ $or: [{ name: cleanMain }, { slug }] });
  if (!existing) {
    await Category.create({
      name: cleanMain,
      slug,
      icon: "Layers",
      subcategories: [],
      order: 0,
    });
  }
}

/** Resolve main + optional mini. Empty mini stays empty (do NOT copy main name into mini). */
function resolveCategoryFields(body: {
  department?: string;
  mainCategory?: string;
  category?: string;
  miniCategory?: string;
  title?: string;
}) {
  const dept = (body.department || body.mainCategory || "").trim();
  let mini = (body.miniCategory || "").trim();

  // Ignore leftover category if it is just the main name or the product title
  const rawCat = (body.category || "").trim();
  if (!mini && rawCat && rawCat !== dept && rawCat !== (body.title || "").trim()) {
    mini = rawCat;
  }

  // Never treat main name or product title as a mini category
  if (!mini || mini === dept || mini === (body.title || "").trim()) {
    mini = "";
  }

  return {
    department: dept,
    mainCategory: dept,
    // Shop filters by category; when no mini, category = main department
    category: mini || dept,
    miniCategory: mini,
  };
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const department = searchParams.get("department");
    const search = searchParams.get("q");
    const slug = searchParams.get("slug");

    if (slug) {
      const singleProduct = await Product.findOne({ slug }).lean();
      if (!singleProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(
        { product: singleProduct },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    const query: Record<string, unknown> = {};
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (department) {
      query.department = { $regex: new RegExp(`^${department}$`, "i") };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query).sort({ id: 1 }).lean();

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Products API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products from MongoDB database" },
      { status: 500 }
    );
  }
}

// Admin: Create new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const maxIdProduct = await Product.findOne().sort({ id: -1 }).lean();
    const nextId = (maxIdProduct?.id || 12) + 1;

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const cats = resolveCategoryFields(body);
    const { homeSection, homeSections } = normalizeHomeSections(body.homeSection, body.homeSections);

    const imgUrl = (body.img || "").trim();
    const gallery = Array.isArray(body.gallery) && body.gallery.length > 0
      ? body.gallery.filter((g: any) => typeof g === "string" && g.trim().length > 0)
      : (imgUrl ? [imgUrl] : []);

    // Sync Main Category only — never push product/mini leftovers into navbar dropdowns
    await ensureMainCategoryExists(cats.department);

    const newProduct = await Product.create({
      ...body,
      img: imgUrl,
      gallery,
      ...cats,
      homeSection,
      homeSections,
      id: nextId,
      slug,
      rawPrice: typeof body.rawPrice === "number" ? body.rawPrice : parseFloat(body.price?.replace(/[^0-9.]/g, "") || "0"),
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    console.error("Create Product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// Admin: Update product
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { _id, id, ...updateData } = body;

    await connectDB();

    if (updateData.mainCategory && !updateData.department) {
      updateData.department = updateData.mainCategory;
    }
    if (updateData.department && !updateData.mainCategory) {
      updateData.mainCategory = updateData.department;
    }

    const cats = resolveCategoryFields({
      department: updateData.department,
      mainCategory: updateData.mainCategory,
      category: updateData.category,
      miniCategory: updateData.miniCategory,
      title: updateData.title,
    });
    if (cats.department) {
      Object.assign(updateData, cats);
      await ensureMainCategoryExists(cats.department);
    }

    if (updateData.homeSection !== undefined || updateData.homeSections !== undefined) {
      const normalized = normalizeHomeSections(updateData.homeSection, updateData.homeSections);
      updateData.homeSection = normalized.homeSection;
      updateData.homeSections = normalized.homeSections;
    }

    if (updateData.price && typeof updateData.rawPrice !== "number") {
      updateData.rawPrice = parseFloat(updateData.price.replace(/[^0-9.]/g, "") || "0");
    }

    const updated = await Product.findOneAndUpdate(
      _id ? { _id } : { id },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    console.error("Update Product error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Admin: Delete product or Bulk Delete
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const _id = searchParams.get("_id");
    const idsParam = searchParams.get("ids");
    const _idsParam = searchParams.get("_ids");

    let body: any = null;
    try {
      body = await req.json();
    } catch {}

    await connectDB();

    // 1. Bulk delete
    const bulkIds: number[] = body?.ids || (idsParam ? idsParam.split(",").map(Number).filter(Boolean) : []);
    const bulkMongoIds: string[] = body?._ids || (_idsParam ? _idsParam.split(",").filter(Boolean) : []);

    if (bulkIds.length > 0 || bulkMongoIds.length > 0) {
      const orConditions: any[] = [];
      if (bulkIds.length > 0) orConditions.push({ id: { $in: bulkIds } });
      if (bulkMongoIds.length > 0) orConditions.push({ _id: { $in: bulkMongoIds } });

      const result = await Product.deleteMany({ $or: orConditions });
      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} products deleted`,
        deletedCount: result.deletedCount,
      });
    }

    // 2. Single delete
    if (_id) {
      await Product.findByIdAndDelete(_id);
    } else if (id) {
      await Product.findOneAndDelete({ id: parseInt(id) });
    } else {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err: unknown) {
    console.error("Delete Product error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
