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

export const DEFAULT_HERO = {
  heroTitle: "Gaming Headset Brilliant Lighting Effect",
  heroSubtitle: "Wireless Connection With TV, Computer, Laptop...",
  heroButtonText: "DISCOVER NOW",
  heroImage: "https://res.cloudinary.com/rpdxkihi/image/upload/v1795245604/whitebox/banners/banner-hero.webp",
  heroLink: "/shop?department=Electronics%20%26%20Gadgets",
  heroTiles: DEFAULT_HERO_TILES,
};
