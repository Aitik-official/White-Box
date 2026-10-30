import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { ALL_PRODUCTS } from "@/data/siteData";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const department = searchParams.get("department");
    const search = searchParams.get("q");
    const slug = searchParams.get("slug");

    // Auto-seed if database collection is empty
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(ALL_PRODUCTS);
    }

    if (slug) {
      const singleProduct = await Product.findOne({ slug }).lean();
      if (!singleProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ product: singleProduct });
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

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
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

    const newProduct = await Product.create({
      ...body,
      id: nextId,
      slug,
      rawPrice: typeof body.rawPrice === "number" ? body.rawPrice : parseFloat(body.price?.replace(/[^0-9.]/g, "") || "0"),
      gallery: body.gallery || [body.img],
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

// Admin: Delete product
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const _id = searchParams.get("_id");

    await connectDB();

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
