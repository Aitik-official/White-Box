import mongoose, { Schema, Document } from "mongoose";

export interface IProductDoc extends Document {
  id: number;
  slug: string;
  title: string;
  img: string;
  gallery: string[];
  price: string;
  rawPrice: number;
  oldPrice: string | null;
  rawOldPrice?: number | null;
  brand: string;
  vendor: string;
  vendorRating: number;
  category: string;
  department: string;
  mainCategory?: string;
  miniCategory?: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  tag?: string;
  tagColor?: string;
  homeSection?: string;
  homeSections?: string[];
}

const ProductSchema = new Schema<IProductDoc>(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    img: { type: String, required: true },
    gallery: { type: [String], default: [] },
    price: { type: String, required: true },
    rawPrice: { type: Number, required: true, index: true },
    oldPrice: { type: String, default: null },
    rawOldPrice: { type: Number, default: null },
    brand: { type: String, required: true, index: true },
    vendor: { type: String, required: true },
    vendorRating: { type: Number, default: 4.8 },
    category: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    mainCategory: { type: String, index: true },
    miniCategory: { type: String, index: true },
    homeSection: { type: String, default: "all", index: true },
    homeSections: {
      type: [String],
      default: ["top-selling", "flash-deals", "hot-trending", "top-featured"],
      index: true,
    },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    specs: { type: Map, of: String, default: {} },
    rating: { type: Number, default: 4.8, index: true },
    reviewsCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 10 },
    tag: { type: String },
    tagColor: { type: String },
  },
  { timestamps: true }
);

// High performance Compound text search index
ProductSchema.index({
  title: "text",
  brand: "text",
  category: "text",
  department: "text",
  description: "text",
});

export default mongoose.models.Product || mongoose.model<IProductDoc>("Product", ProductSchema);
