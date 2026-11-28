import HomeClient from "./HomeClient";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { normalizeHero, type HeroState } from "@/data/heroDefaults";

// Homepage is pre-rendered with the admin-edited hero baked into the HTML (no flash of old
// images, no extra API round-trip) and refreshed at most every 30s — or instantly when the
// admin saves settings (see revalidatePath in /api/settings).
export const revalidate = 30;

async function getHero(): Promise<HeroState | null> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    if (!settings) return null;
    return normalizeHero(JSON.parse(JSON.stringify(settings)));
  } catch (err) {
    console.warn("Could not load hero settings on the server:", err);
    return null; // HeroSection falls back to fetching on the client
  }
}

export default async function Home() {
  const initialHero = await getHero();
  return <HomeClient initialHero={initialHero} />;
}
