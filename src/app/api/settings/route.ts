import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

const DEFAULT_SETTINGS = {
  heroTitle: "Gaming Headset Brilliant Lighting Effect",
  heroSubtitle: "Wireless Connection With TV, Computer, Laptop...",
  heroButtonText: "DISCOVER NOW",
  heroImage: "/banners/banner-hero.webp",
  bannerNotice: "100% Buyer Protection & Genuine Warranty",
  supportPhone: "06-900-6789-00",
  dealsTimerHours: 24,
};

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
    }
    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ success: false, settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ ...DEFAULT_SETTINGS, ...body });
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    console.error("Settings PUT error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
