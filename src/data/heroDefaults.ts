// Shared homepage hero defaults — used by the Settings API, the admin panel, and the homepage HeroSection.

export interface HeroTile {
  title: string;
  category: string;
  image: string;
  link: string;
}

export const DEFAULT_HERO_TILES: HeroTile[] = [
  {
    title: "Pro Smartphone 5G",
    category: "Cellphone & Tablets",
    image: "https://res.cloudinary.com/rpdxkihi/image/upload/v1795245604/whitebox/banners/tile-1.webp",
    link: "/shop?category=Smartphones",
  },
  {
    title: "Phone Galaxy S10",
    category: "Cellphone & Tablets",
    image: "https://res.cloudinary.com/rpdxkihi/image/upload/v1795245606/whitebox/banners/tile-2.webp",
    link: "/shop?q=Galaxy",
  },
  {
    title: "Wireless Earbuds",
    category: "Wireless Earbuds",
    image: "https://res.cloudinary.com/rpdxkihi/image/upload/v1795245606/whitebox/banners/tile-3.webp",
    link: "/shop?category=Wireless%20Earbuds",
  },
  {
    title: "Executive Lounge Chair",
    category: "Decor & Furniture",
    image: "https://res.cloudinary.com/rpdxkihi/image/upload/v1795245607/whitebox/banners/tile-4.webp",
    link: "/shop?department=Home%20%26%20Furniture",
  },
];

export type HeroState = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  heroLink: string;
  heroTiles: HeroTile[];
};

export const DEFAULT_HERO: HeroState = {
  heroTitle: "Gaming Headset Brilliant Lighting Effect",
  heroSubtitle: "Wireless Connection With TV, Computer, Laptop...",
  heroButtonText: "DISCOVER NOW",
  heroImage: "https://res.cloudinary.com/rpdxkihi/image/upload/v1795245604/whitebox/banners/banner-hero.webp",
  heroLink: "/shop?department=Electronics%20%26%20Gadgets",
  heroTiles: DEFAULT_HERO_TILES,
};

// Turn a raw settings document into render-ready hero data (falls back to defaults per field)
export function normalizeHero(s: any): HeroState {
  if (!s) return DEFAULT_HERO;
  const tiles: HeroTile[] =
    Array.isArray(s.heroTiles) && s.heroTiles.length > 0
      ? s.heroTiles.map((t: any) => ({
          title: t?.title || "",
          category: t?.category || "",
          image: t?.image || "",
          link: t?.link || "/shop",
        }))
      : DEFAULT_HERO_TILES;
  return {
    heroTitle: s.heroTitle || DEFAULT_HERO.heroTitle,
    heroSubtitle: s.heroSubtitle || DEFAULT_HERO.heroSubtitle,
    heroButtonText: s.heroButtonText || DEFAULT_HERO.heroButtonText,
    heroImage: s.heroImage || DEFAULT_HERO.heroImage,
    heroLink: s.heroLink || DEFAULT_HERO.heroLink,
    heroTiles: tiles,
  };
}
