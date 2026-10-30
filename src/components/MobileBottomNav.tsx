"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, wishlist, setIsCartOpen } = useCart();

  // Don't show bottom nav on admin dashboard
  if (pathname?.startsWith("/admin")) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <Link 
        href="/" 
        className={`bottom-nav-item ${isActive("/") ? "active" : ""}`}
      >
        <Home size={20} />
        <span>Home</span>
      </Link>

      <Link 
        href="/shop" 
        className={`bottom-nav-item ${isActive("/shop") ? "active" : ""}`}
      >
        <Compass size={20} />
        <span>Catalog</span>
      </Link>

      <Link 
        href="/wishlist" 
        className={`bottom-nav-item ${isActive("/wishlist") ? "active" : ""}`}
      >
        <div style={{ position: "relative" }}>
          <Heart size={20} />
          {wishlist.length > 0 && (
            <span className="bottom-nav-badge">{wishlist.length}</span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>

      <button 
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="bottom-nav-item"
      >
        <div style={{ position: "relative" }}>
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="bottom-nav-badge" style={{ background: "var(--grad-box)" }}>
              {totalItems}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <Link 
        href="/login" 
        className={`bottom-nav-item ${isActive("/login") ? "active" : ""}`}
      >
        <User size={20} />
        <span>Account</span>
      </Link>
    </nav>
  );
}
