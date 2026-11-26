import mongoose, { Schema, Document } from "mongoose";

export interface IBlogDoc extends Document {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  comments: string;
  author: string;
  published: boolean;
}

const BlogSchema = new Schema<IBlogDoc>(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    date: { type: String, default: "" },
    comments: { type: String, default: "0 Comments" },
    author: { type: String, default: "WhiteBox Team" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model<IBlogDoc>("Blog", BlogSchema);
