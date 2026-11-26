"use client";

import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductSlider from "@/components/ProductSlider";
import CategoryGrid from "@/components/CategoryGrid";
import DealsSection from "@/components/DealsSection";
import PromoBannerStrips from "@/components/PromoBannerStrips";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { PROMO_STRIPS } from "@/data/siteData";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { toast } = useCart();
  const [liveProducts, setLiveProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch(`/api/products?_t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setLiveProducts(data.products);
        } else if (Array.isArray(data.products)) {
          setLiveProducts(data.products);
        }
      } catch (e) {
        console.warn("Could not load live products on home:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadLiveProducts();
  }, []);

  // Filter products for homepage sections based on admin selector box choice
  const isHiddenFromHome = (p: any) =>
    p.homeSection === "none" ||
    (Array.isArray(p.homeSections) && p.homeSections.length === 0 && p.homeSection === "none");

  const isOnAllSections = (p: any) =>
    !p.homeSection ||
    p.homeSection === "all" ||
    (Array.isArray(p.homeSections) && (p.homeSections.includes("all") || p.homeSections.length === 0));

  const isOnSection = (p: any, section: string) => {
    if (isHiddenFromHome(p)) return false;
    if (p.homeSection === section) return true;
    if (Array.isArray(p.homeSections) && p.homeSections.includes(section)) return true;
    if (isOnAllSections(p)) return true;
    return false;
  };

  const topSelling = liveProducts.filter((p) => isOnSection(p, "top-selling"));
  const flashDeals = liveProducts.filter((p) => isOnSection(p, "flash-deals"));
  const hotTrending = liveProducts.filter((p) => isOnSection(p, "hot-trending"));
  const topFeatured = liveProducts.filter((p) => isOnSection(p, "top-featured"));

  return (
    <div className="wb-container">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-msg">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Header with Top Bar, Center Search/Actions & Bottom Department Menu */}
      <Header />

      {/* Main Content Area */}
      <main id="main-content">
        {/* Slideshow + 4 Side Banners (Hero Block) */}
        <HeroSection />

        {/* Section 1: Top Best Selling Carousel */}
        <ProductSlider
          title="Top Best Selling"
          products={topSelling}
          id="products"
        />

        {/* Section 2: Popular Categories Grid */}
        <CategoryGrid />

        {/* Section 3: Flash Deals with Live Countdown */}
        <DealsSection products={flashDeals.length > 0 ? flashDeals : liveProducts} />

        {/* Section 4: Promo Banner Strips */}
        <PromoBannerStrips banners={PROMO_STRIPS} />

        {/* Section 5: Hot Trending Products Carousel */}
        <ProductSlider
          title="Hot Trending Products"
          products={hotTrending}
        />

        {/* Section 7: Top Featured Products Carousel */}
        <ProductSlider
          title="Top Featured Products"
          products={topFeatured}
        />

        {/* Section 8: From Our Blog */}
        <BlogSection />

      </main>

      {/* Footer with Services Strip, Multi-column links & Payment Badges */}
      <Footer />
    </div>
  );
}
