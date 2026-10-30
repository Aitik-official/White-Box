"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Eye, Heart, ShoppingBag, Zap, Check } from "lucide-react";
import { Product } from "@/data/siteData";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [added, setAdded] = useState(false);

  const isFavorite = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    router.push("/checkout");
  };

  return (
    <div 
      className="product-modern-card"
      style={{ cursor: "pointer" }}
      onClick={() => router.push(`/product/${product.slug}`)}
    >
      {/* Product Tag/Badge */}
      {product.tag && (
        <span 
          className="product-tag-badge"
          style={{ background: product.tagColor || "var(--grad-box)" }}
        >
          {product.tag}
        </span>
      )}

      {/* Thumbnail */}
      <div className="product-modern-thumb">
        <Image 
          src={product.img} 
          alt={product.title} 
          width={180} 
          height={180}
          className="product-modern-img"
        />

        <div className="modern-hover-actions">
          <button 
            className="modern-action-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} color={isFavorite ? "#ff4742" : "#334155"} fill={isFavorite ? "#ff4742" : "none"} />
          </button>
          <button 
            className="modern-action-btn"
            title="Quick view product page"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/product/${product.slug}`);
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span className="product-modern-brand">{product.brand}</span>
        <span style={{ fontSize: "10px", color: "#0066ff", fontWeight: 700 }}>{product.vendor}</span>
      </div>

      <h4 className="product-modern-title">
        <Link href={`/product/${product.slug}`}>{product.title}</Link>
      </h4>

      <div className="product-modern-rating">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={13} 
            fill={i < Math.floor(product.rating) ? "#f59e0b" : "none"} 
            color="#f59e0b" 
          />
        ))}
        <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "4px" }}>
          ({product.reviewsCount || 85})
        </span>
      </div>

      <div className="product-modern-pricing">
        <span className="price-main">{product.price}</span>
        {product.oldPrice && (
          <span className="price-strike">{product.oldPrice}</span>
        )}
      </div>

      {/* Action Buttons: Add To Cart + Instant Buy Now */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        <button 
          className="modern-cart-btn"
          onClick={handleAddToCart}
          style={{
            background: added ? "#10b981" : undefined,
            color: added ? "#ffffff" : undefined,
            padding: "8px 6px",
            fontSize: "12px"
          }}
        >
          {added ? (
            <>
              <Check size={14} />
              Added!
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              Cart
            </>
          )}
        </button>

        <button 
          onClick={handleBuyNow}
          className="modern-buy-pulse"
          style={{
            background: "var(--grad-box)",
            color: "#ffffff",
            borderRadius: "8px",
            fontWeight: 800,
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            padding: "8px 6px",
            boxShadow: "0 2px 8px rgba(217, 27, 92, 0.25)",
            transition: "all 0.2s ease"
          }}
        >
          <Zap size={13} />
          Buy Now
        </button>
      </div>
    </div>
  );
}
