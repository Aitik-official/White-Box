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
import { PRODUCTS, PROMO_STRIPS } from "@/data/siteData";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { toast } = useCart();

  // Split products for multiple categorized sliders matching wb-duka2
  const topSelling = PRODUCTS.slice(0, 7);
  const hotTrending = PRODUCTS.slice(2, 9);
  const topFeatured = PRODUCTS.slice(4, 12);

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
        <DealsSection products={PRODUCTS} />

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

      </main>

      {/* Footer with Services Strip, Multi-column links & Payment Badges */}
      <Footer />
    </div>
  );
}
