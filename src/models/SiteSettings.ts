import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettingsDoc extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  bannerNotice: string;
  supportPhone: string;
  dealsTimerHours: number;
}

const SiteSettingsSchema = new Schema<ISiteSettingsDoc>(
  {
    heroTitle: { type: String, default: "Gaming Headset Brilliant Lighting Effect" },
    heroSubtitle: { type: String, default: "Wireless Connection With TV, Computer, Laptop..." },
    heroButtonText: { type: String, default: "DISCOVER NOW" },
    heroImage: { type: String, default: "/banners/banner-hero.webp" },
    bannerNotice: { type: String, default: "100% Buyer Protection & Genuine Warranty" },
    supportPhone: { type: String, default: "06-900-6789-00" },
    dealsTimerHours: { type: Number, default: 24 },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettingsDoc>("SiteSettings", SiteSettingsSchema);

