"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { Product, ALL_PRODUCTS } from "@/data/siteData";
import { useCart } from "@/context/CartContext";
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Zap, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Plus, 
  Minus, 
  Check, 
  Store,
  Clock,
  Sparkles
} from "lucide-react";

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist, toast } = useCart();
  const [selectedImg, setSelectedImg] = useState(product.img);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  const isFavorite = wishlist.includes(product.id);

  const galleryImages = [product.img, ...(product.gallery || [])].filter((v, i, a) => a.indexOf(v) === i);

  const relatedProducts = ALL_PRODUCTS.filter(p => p.id !== product.id && p.department === product.department).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {toast && (
        <div className="toast-modern">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      <CartDrawer />
      <Header />

      {/* Breadcrumb Navigation */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
            <Link href="/" style={{ color: "#0066ff", fontWeight: 600 }}>Home</Link>
            <span>/</span>
            <Link href={`/shop?department=${encodeURIComponent(product.department)}`} style={{ color: "#0066ff", fontWeight: 600 }}>
              {product.department}
            </Link>
            <span>/</span>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: "#0066ff", fontWeight: 600 }}>
              {product.category}
            </Link>
            <span>/</span>
            <span style={{ color: "#0f172a", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "350px" }}>
              {product.title}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Box (Amazon / Flipkart layout) */}
      <div className="container" style={{ padding: "30px 20px" }}>
        <div 
          className="product-detail-grid"
          style={{ 
            background: "#ffffff", 
            borderRadius: "20px", 
            padding: "36px", 
            border: "1px solid #e2e8f0", 
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            display: "grid",
            gridTemplateColumns: "1.1fr 1.3fr 1fr",
            gap: "36px",
            alignItems: "start"
          }}
        >
          {/* Column 1: Image Gallery */}
          <div>
            {/* Main Stage Image */}
            <div 
              style={{
                position: "relative",
                height: "380px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                marginBottom: "16px",
                overflow: "hidden"
              }}
            >
              <Image 
                src={selectedImg} 
                alt={product.title} 
                fill 
                style={{ objectFit: "contain", padding: "16px" }}
                priority
              />
              {product.tag && (
                <span 
                  className="product-tag-badge"
                  style={{ top: "16px", left: "16px", background: product.tagColor || "var(--grad-box)" }}
                >
                  {product.tag}
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            <div style={{ display: "flex", gap: "10px" }}>
              {galleryImages.map((imgUrl, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedImg(imgUrl)}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "10px",
                    border: selectedImg === imgUrl ? "2px solid #0066ff" : "1px solid #cbd5e1",
                    padding: "4px",
                    cursor: "pointer",
                    position: "relative",
                    background: "#f8fafc"
                  }}
                >
                  <Image src={imgUrl} alt="Thumbnail" fill style={{ objectFit: "contain", padding: "4px" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Product Specifications & Details */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#0066ff", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Brand: {product.brand}
              </span>
              <span style={{ color: "#cbd5e1" }}>•</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748b" }}>
                <Store size={14} color="#0066ff" /> Sold by: <strong style={{ color: "#0f172a" }}>{product.vendor}</strong>
                <span style={{ background: "#dbeafe", color: "#1e40af", padding: "1px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: 700 }}>VERIFIED</span>
              </div>
            </div>

            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", lineHeight: 1.3, marginBottom: "12px" }}>
              {product.title}
            </h1>

            {/* Ratings & Reviews */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#fef3c7", padding: "3px 8px", borderRadius: "6px" }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontSize: "13px", fontWeight: 800, color: "#92400e" }}>{product.rating}</span>
              </div>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                <strong>{product.reviewsCount}</strong> verified customer ratings
              </span>
              <span style={{ color: "#cbd5e1" }}>|</span>
              <span style={{ fontSize: "13px", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <Check size={14} /> In Stock ({product.stockCount} units available)
              </span>
            </div>

            {/* Price section */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "18px" }}>
              <span style={{ fontSize: "32px", fontWeight: 900, color: "#0d1b46" }}>
                {product.price}
              </span>
              {product.oldPrice && (
                <>
                  <span style={{ fontSize: "18px", color: "#94a3b8", textDecoration: "line-through" }}>
                    {product.oldPrice}
                  </span>
                  <span style={{ background: "#fee2e2", color: "#ef4444", fontSize: "12px", fontWeight: 800, padding: "2px 8px", borderRadius: "6px" }}>
                    SAVE ₹{((product.rawOldPrice || 0) - product.rawPrice).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>

            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, marginBottom: "20px" }}>
              {product.description}
            </p>

            {/* Highlight Bullets */}
            <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "10px", textTransform: "uppercase" }}>
                Key Highlights:
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {product.features.map((feat, i) => (
                  <li key={i} style={{ fontSize: "13px", color: "#334155", display: "flex", alignItems: "start", gap: "8px" }}>
                    <span style={{ color: "#10b981", fontWeight: 800 }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Buy Box (Flipkart / Amazon Buy Box) */}
          <div 
            style={{ 
              background: "#ffffff", 
              borderRadius: "16px", 
              border: "2px solid #e2e8f0", 
              padding: "24px", 
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)" 
            }}
          >
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Purchase Price:</div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#0d1b46", marginBottom: "14px" }}>
              {product.price}
            </div>

            {/* Delivery Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "18px", borderBottom: "1px solid #f1f5f9", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#334155" }}>
                <Truck size={18} color="#0066ff" />
                <span>FREE Express Delivery by <strong>Tomorrow, 5 PM</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#334155" }}>
                <ShieldCheck size={18} color="#10b981" />
                <span>1 Year Manufacturer Warranty Included</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#334155" }}>
                <RotateCcw size={18} color="#f59e0b" />
                <span>7 Days Hassle-Free Replacement</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>Quantity:</span>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: "8px 14px", background: "#f8fafc", color: "#0f172a", fontWeight: 700 }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: "8px 16px", fontWeight: 800, fontSize: "14px", color: "#0f172a" }}>
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: "8px 14px", background: "#f8fafc", color: "#0f172a", fontWeight: 700 }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
              <button 
                onClick={handleAddToCart}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  background: added ? "#10b981" : "#f1f5f9",
                  color: added ? "#ffffff" : "#0f172a",
                  fontWeight: 800,
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  border: "1px solid #cbd5e1"
                }}
              >
                {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                {added ? "Added To Cart!" : "Add to Cart"}
              </button>

              <button 
                onClick={handleBuyNow}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  background: "var(--grad-box)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 15px rgba(217, 27, 92, 0.35)"
                }}
              >
                <Zap size={18} />
                Instant Buy Now
              </button>
            </div>

            {/* Wishlist toggle */}
            <button 
              onClick={() => toggleWishlist(product.id)}
              style={{
                width: "100%",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: isFavorite ? "#ef4444" : "#64748b"
              }}
            >
              <Heart size={16} fill={isFavorite ? "#ef4444" : "none"} />
              {isFavorite ? "Saved in Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>

        {/* Tabbed Technical Specifications & Customer Reviews */}
        <div style={{ marginTop: "36px", background: "#ffffff", borderRadius: "20px", padding: "32px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", gap: "24px", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px", marginBottom: "24px" }}>
            <button
              onClick={() => setActiveTab("desc")}
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: activeTab === "desc" ? "#0066ff" : "#64748b",
                borderBottom: activeTab === "desc" ? "3px solid #0066ff" : "none",
                paddingBottom: "12px",
                marginBottom: "-14px"
              }}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: activeTab === "reviews" ? "#0066ff" : "#64748b",
                borderBottom: activeTab === "reviews" ? "3px solid #0066ff" : "none",
                paddingBottom: "12px",
                marginBottom: "-14px"
              }}
            >
              Customer Reviews ({product.reviewsCount})
            </button>
          </div>

          {activeTab === "desc" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {Object.entries(product.specs).map(([specKey, specVal], idx) => (
                <div 
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 18px",
                    background: idx % 2 === 0 ? "#f8fafc" : "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #f1f5f9"
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>{specKey}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{specVal}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ padding: "16px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "14px" }}>Rahul Sharma</span>
                  <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 700 }}>✓ Verified Buyer</span>
                  <span style={{ marginLeft: "auto", color: "#f59e0b" }}>★★★★★</span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569" }}>
                  Outstanding product quality! Delivered in under 24 hours in sealed packaging. Exactly as described and works like a charm.
                </p>
              </div>
              <div style={{ padding: "16px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "14px" }}>Priya Nair</span>
                  <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 700 }}>✓ Verified Buyer</span>
                  <span style={{ marginLeft: "auto", color: "#f59e0b" }}>★★★★★</span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569" }}>
                  Best value for money compared to other e-commerce sites. Customer support responded immediately when I inquired about warranty activation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Similar Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>
              Customers who viewed this item also bought
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
