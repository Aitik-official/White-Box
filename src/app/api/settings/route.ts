import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { DEFAULT_HERO } from "@/data/heroDefaults";

const DEFAULT_SETTINGS = {
  ...DEFAULT_HERO,
  bannerNotice: "100% Buyer Protection & Genuine Warranty",
  supportPhone: "06-900-6789-00",
  dealsTimerHours: 24,
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    let settings: any = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
      settings = settings.toObject();
    }
    // Fill any fields missing from older documents (e.g. heroLink, heroTiles)
    const merged = {
      ...DEFAULT_SETTINGS,
      ...settings,
      heroTiles:
        Array.isArray(settings.heroTiles) && settings.heroTiles.length > 0
          ? settings.heroTiles
          : DEFAULT_SETTINGS.heroTiles,
    };
    return NextResponse.json(
      { success: true, settings: merged },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ success: false, settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    // Never let the client overwrite Mongo internals
    const { _id, __v, createdAt, updatedAt, ...payload } = body;

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ ...DEFAULT_SETTINGS, ...payload });
    } else {
      Object.assign(settings, payload);
      await settings.save();
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    console.error("Settings PUT error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
