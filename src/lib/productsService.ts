import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Product as ProductType } from "@/data/siteData";

export async function getProductsFromDB(filter?: {
  department?: string;
  category?: string;
  search?: string;
}): Promise<ProductType[]> {
  try {
    await connectDB();

    const query: Record<string, unknown> = {};
    if (filter?.department) {
      query.department = { $regex: new RegExp(`^${filter.department}$`, "i") };
    }
    if (filter?.category) {
      query.category = { $regex: new RegExp(`^${filter.category}$`, "i") };
    }
    if (filter?.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: "i" } },
        { brand: { $regex: filter.search, $options: "i" } },
        { category: { $regex: filter.search, $options: "i" } },
      ];
    }

    const docs = await Product.find(query).sort({ id: 1 }).lean();
    return JSON.parse(JSON.stringify(docs || []));
  } catch (e: any) {
    console.error("Database query failed in getProductsFromDB:", e.message || e);
    return [];
  }
}

export async function getProductBySlugFromDB(slug: string): Promise<ProductType | null> {
  try {
    await connectDB();
    const doc = await Product.findOne({ slug }).lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  } catch (e: any) {
    console.error("Database query failed in getProductBySlugFromDB:", e.message || e);
    return null;
  }
}
