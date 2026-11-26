import mongoose, { Schema, Document } from "mongoose";
import { DEFAULT_HERO, DEFAULT_HERO_TILES, HeroTile } from "@/data/heroDefaults";

export interface ISiteSettingsDoc extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  heroLink: string;
  heroTiles: HeroTile[];
  bannerNotice: string;
  supportPhone: string;
  dealsTimerHours: number;
  isProductsSeeded?: boolean;
  isCategoriesSeeded?: boolean;
}

const HeroTileSchema = new Schema<HeroTile>(
  {
    title: { type: String, default: "" },
    category: { type: String, default: "" },
    image: { type: String, default: "" },
    link: { type: String, default: "/shop" },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettingsDoc>(
  {
    heroTitle: { type: String, default: DEFAULT_HERO.heroTitle },
    heroSubtitle: { type: String, default: DEFAULT_HERO.heroSubtitle },
    heroButtonText: { type: String, default: DEFAULT_HERO.heroButtonText },
    heroImage: { type: String, default: DEFAULT_HERO.heroImage },
    heroLink: { type: String, default: DEFAULT_HERO.heroLink },
    heroTiles: { type: [HeroTileSchema], default: DEFAULT_HERO_TILES },
    bannerNotice: { type: String, default: "100% Buyer Protection & Genuine Warranty" },
    supportPhone: { type: String, default: "06-900-6789-00" },
    dealsTimerHours: { type: Number, default: 24 },
    isProductsSeeded: { type: Boolean, default: false },
    isCategoriesSeeded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Re-register on hot reload so new schema fields (heroLink, heroTiles) are never dropped
if (mongoose.models.SiteSettings) {
  mongoose.deleteModel("SiteSettings");
}

export default mongoose.model<ISiteSettingsDoc>("SiteSettings", SiteSettingsSchema);
