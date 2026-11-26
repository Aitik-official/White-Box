import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryDoc extends Document {
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
  order: number;
  description?: string;
}

const CategorySchema = new Schema<ICategoryDoc>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    icon: { type: String, default: "Wrench" },
    subcategories: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategoryDoc>("Category", CategorySchema);
