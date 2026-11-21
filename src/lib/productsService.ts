import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ALL_PRODUCTS, Product as ProductType } from "@/data/siteData";

export async function getProductsFromDB(filter?: {
  department?: string;
  category?: string;
  search?: string;
}): Promise<ProductType[]> {
  try {
    await connectDB();

    const count = await Product.countDocuments();
    if (count === 0) {
      // Auto seed Cloudinary-backed products
      await Product.insertMany(ALL_PRODUCTS);
    }

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
    if (docs && docs.length > 0) {
      return JSON.parse(JSON.stringify(docs));
    }
    return ALL_PRODUCTS;
  } catch (e: any) {
    // Flow link fallback: Ensures zero user disruption if database or IP is unreachable
    console.warn("Database fallback to Cloudinary catalog cache:", e.message || e);
    let list = [...ALL_PRODUCTS];
    if (filter?.department) list = list.filter(p => p.department.toLowerCase() === filter.department!.toLowerCase());
    if (filter?.category) list = list.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return list;
  }
}

export async function getProductBySlugFromDB(slug: string): Promise<ProductType | null> {
  try {
    await connectDB();
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(ALL_PRODUCTS);
    }

    const doc = await Product.findOne({ slug }).lean();
    if (!doc) return ALL_PRODUCTS.find((p) => p.slug === slug) || null;
    return JSON.parse(JSON.stringify(doc));
  } catch (e: any) {
    console.warn("Database fallback for product slug:", e.message || e);
    return ALL_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}
