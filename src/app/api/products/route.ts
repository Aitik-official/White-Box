import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
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
      console.log("No products found in MongoDB. Seeding initial catalog...");
      await Product.insertMany(ALL_PRODUCTS);
      console.log(`Seeded ${ALL_PRODUCTS.length} products into MongoDB!`);
    }

    if (slug) {
      const singleProduct = await Product.findOne({ slug }).lean();
      if (!singleProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ product: singleProduct });
    }

    // Build query filter
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
