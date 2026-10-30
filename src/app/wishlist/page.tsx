"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { ALL_PRODUCTS } from "@/data/siteData";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, toast, addToCart } = useCart();

  const wishlistedProducts = ALL_PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="wb-container">
      {toast && (
        <div className="toast-msg">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      <CartDrawer />
      <Header />

      <main style={{ padding: "40px 0 80px", minHeight: "65vh" }}>
        <div className="container">
          {/* Breadcrumb & Header */}
          <div style={{ marginBottom: "28px" }}>
            <Link 
              href="/shop" 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--wb-blue)",
                marginBottom: "12px"
              }}
            >
              <ArrowLeft size={14} /> Back to Products
            </Link>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h1 style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Heart size={28} color="#ff4742" fill="#ff4742" />
                  My Saved Wishlist
                </h1>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {wishlistedProducts.length} item{wishlistedProducts.length === 1 ? "" : "s"} saved for later
                </p>
              </div>

              {wishlistedProducts.length > 0 && (
                <button
                  onClick={() => {
                    wishlistedProducts.forEach((p) => addToCart(p));
                  }}
                  style={{
                    background: "var(--grad-box)",
                    color: "#ffffff",
                    padding: "10px 20px",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 800,
                    fontSize: "13px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <ShoppingBag size={16} />
                  Add All To Cart
                </button>
              )}
            </div>
          </div>

          {/* Wishlist Items Grid or Empty State */}
          {wishlistedProducts.length === 0 ? (
            <div 
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-card)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <div 
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#fff1f2",
                  color: "#ff4742",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px"
                }}
              >
                <Heart size={36} />
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "8px" }}>
                Your wishlist is currently empty
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto 24px" }}>
                Explore our catalog of smartphones, pro audio, tools, and lifestyle electronics to save your favorites!
              </p>
              <Link
                href="/shop"
                className="checkout-btn"
                style={{ display: "inline-block", width: "auto", padding: "12px 32px", textDecoration: "none" }}
              >
                Explore Products Now
              </Link>
            </div>
          ) : (
            <div className="products-modern-grid">
              {wishlistedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

