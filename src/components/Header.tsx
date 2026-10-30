"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  ChevronRight, 
  Smartphone, 
  Gamepad2, 
  Wrench, 
  Sliders, 
  Armchair, 
  Watch, 
  Scissors,
  Check,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import WhiteBoxLogo from "./WhiteBoxLogo";
import { DEPARTMENTS_DATA, ALL_PRODUCTS } from "@/data/siteData";

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone size={16} />,
  Gamepad2: <Gamepad2 size={16} />,
  Wrench: <Wrench size={16} />,
  Sliders: <Sliders size={16} />,
  Armchair: <Armchair size={16} />,
  Watch: <Watch size={16} />,
  Scissors: <Scissors size={16} />,
};

// Alphabetically sorted departments
const SORTED_DEPARTMENTS = [...DEPARTMENTS_DATA].sort((a, b) => a.name.localeCompare(b.name));

export default function Header() {
  const router = useRouter();
  const { totalItems, subtotal, formatINR, setIsCartOpen, wishlist } = useCart();
  const [deptOpen, setDeptOpen] = useState(false);
  const [hoveredDept, setHoveredDept] = useState<string | null>(SORTED_DEPARTMENTS[0].slug);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<typeof ALL_PRODUCTS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDeptOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live auto-complete search as user types
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matches = ALL_PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q)
      ).slice(0, 5);
      setSearchSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/shop`);
    }
  };

  const activeDepartment = SORTED_DEPARTMENTS.find(d => d.slug === hoveredDept) || SORTED_DEPARTMENTS[0];

  return (
    <header className="site-header">
      {/* Top Banner Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-inner">
            <div className="header-top-left">
              <span>Got Question? Call WhiteBox Care 24/7:</span>
              <strong style={{ letterSpacing: "0.3px" }}>06-900-6789-00</strong>
              <span style={{ margin: "0 8px", opacity: 0.3 }}>|</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--wb-cyan)", fontWeight: 600 }}>
                <ShieldCheck size={14} /> 100% Buyer Protection & Genuine Warranty
              </span>
            </div>

            <div className="header-top-right">
              <div className="header-top-link">
                <span>My Account</span>
                <ChevronDown size={12} />
              </div>

              <Link href="/checkout" className="header-top-link">
                <span>Direct Checkout</span>
              </Link>

              <div className="header-top-link">
                <span>INR (₹)</span>
                <ChevronDown size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Branding & Live Predictive Search & Header Badges */}
      <div className="header-center">
        <div className="container">
          <div className="header-center-grid">
            {/* Official WHITE BOX Logo */}
            <div>
              <Link href="/" style={{ display: "inline-block" }}>
                <WhiteBoxLogo height={44} variant="light" />
              </Link>
            </div>

            {/* Smart E-Commerce Search Bar with instant live auto-complete */}
            <div className="header-search" ref={searchRef} style={{ position: "relative" }}>
              <form 
                className="search-form-modern" 
                onSubmit={handleSearchSubmit}
              >
                <input 
                  type="text" 
                  className="search-input-modern" 
                  placeholder="Search over 50,000+ electronic products, tools & brands (e.g., OnePlus, Drill, Headset)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                />
                <button type="submit" className="search-button-modern">
                  <Search size={16} style={{ marginRight: "6px" }} />
                  Search
                </button>
              </form>

              {/* Predictive Auto-Complete Modal */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div 
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
                    zIndex: 200,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <div style={{ padding: "8px 16px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                    Matching Products
                  </div>
                  {searchSuggestions.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.slug}`}
                      onClick={() => setShowSuggestions(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "12px 16px",
                        borderBottom: "1px solid #f8fafc",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                    >
                      <img src={prod.img} alt={prod.title} style={{ width: "38px", height: "38px", objectFit: "contain", borderRadius: "6px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{prod.title}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>in {prod.category} • by <strong style={{ color: "#0066ff" }}>{prod.vendor}</strong></div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#0d1b46" }}>{prod.price}</div>
                    </Link>
                  ))}
                  <div style={{ padding: "10px", background: "#f8fafc", textAlign: "center" }}>
                    <button 
                      onClick={handleSearchSubmit} 
                      style={{ fontSize: "12px", fontWeight: 700, color: "#0066ff" }}
                    >
                      View all results for &ldquo;{searchQuery}&rdquo; →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Header User / Wishlist / Cart Actions */}
            <div className="header-actions-modern">
              {/* Sign in / Account */}
              <Link href="/login" className="action-pill-modern">
                <div className="action-icon-modern">
                  <User size={22} strokeWidth={2} />
                </div>
                <div className="action-texts">
                  <span className="action-top-label">Account</span>
                  <span className="action-main-label">Sign In / Profile</span>
                </div>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="action-pill-modern">
                <div className="action-icon-modern">
                  <Heart size={22} strokeWidth={2} />
                  {wishlist.length > 0 && (
                    <span className="cart-bubble" style={{ background: "var(--wb-orange)" }}>
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <div className="action-texts">
                  <span className="action-top-label">Saved</span>
                  <span className="action-main-label">Wishlist ({wishlist.length})</span>
                </div>
              </Link>

              {/* Cart Pill with Badge and INR amount */}
              <div 
                className="action-pill-modern" 
                onClick={() => setIsCartOpen(true)}
              >
                <div className="action-icon-modern">
                  <ShoppingBag size={24} strokeWidth={1.75} />
                  <span className="cart-bubble">{totalItems}</span>
                </div>
                <div className="action-texts">
                  <span className="action-top-label">Cart</span>
                  <span className="action-main-label" style={{ color: "#ff8a65" }}>
                    {formatINR(subtotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Bottom: Sorted Multi-Tier Mega Department Dropdown + Nav */}
      <div className="header-bottom-modern">
        <div className="container">
          <div className="header-bottom-inner-modern">
            {/* Sorted Mega Department Menu */}
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <div 
                className="dept-trigger-btn"
                onClick={() => setDeptOpen(!deptOpen)}
                style={{
                  background: deptOpen ? "rgba(255,255,255,0.15)" : "transparent",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  transition: "background 0.2s"
                }}
              >
                <Menu size={20} />
                <span>ALL CATEGORIES (A-Z)</span>
                <ChevronDown size={14} style={{ transform: deptOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>

              {/* Amazon / Flipkart Style 2-Column Mega Flyout Menu */}
              {deptOpen && (
                <div 
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    left: 0,
                    width: "680px",
                    background: "#ffffff",
                    borderRadius: "14px",
                    boxShadow: "0 20px 45px rgba(0,0,0,0.22)",
                    border: "1px solid #e2e8f0",
                    display: "grid",
                    gridTemplateColumns: "260px 1fr",
                    zIndex: 250,
                    overflow: "hidden",
                    animation: "fadeInDown 0.2s ease"
                  }}
                >
                  {/* Left Column: Sorted Main Departments */}
                  <div style={{ background: "#f8fafc", borderRight: "1px solid #e2e8f0", padding: "10px 0" }}>
                    <div style={{ padding: "8px 18px", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                      Shop By Department (Sorted)
                    </div>
                    {SORTED_DEPARTMENTS.map((dept) => {
                      const isHovered = (hoveredDept === dept.slug);
                      return (
                        <div 
                          key={dept.slug}
                          onMouseEnter={() => setHoveredDept(dept.slug)}
                          onClick={() => {
                            setDeptOpen(false);
                            router.push(`/shop?department=${encodeURIComponent(dept.name)}`);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "11px 18px",
                            cursor: "pointer",
                            background: isHovered ? "#ffffff" : "transparent",
                            color: isHovered ? "#0066ff" : "#1e293b",
                            fontWeight: isHovered ? 800 : 600,
                            borderLeft: isHovered ? "3px solid #0066ff" : "3px solid transparent",
                            fontSize: "13px",
                            transition: "all 0.15s"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {iconMap[dept.icon] || <Wrench size={16} />}
                            <span>{dept.name}</span>
                          </div>
                          <ChevronRight size={14} color={isHovered ? "#0066ff" : "#94a3b8"} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Subcategories & Browse Link */}
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(0, 102, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0066ff" }}>
                          {iconMap[activeDepartment.icon]}
                        </div>
                        <div>
                          <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>{activeDepartment.name}</h4>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>Select a category to browse catalog</span>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {activeDepartment.subcategories.map((sub, i) => (
                          <Link
                            key={i}
                            href={`/shop?category=${encodeURIComponent(sub)}`}
                            onClick={() => setDeptOpen(false)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: "6px",
                              fontSize: "13px",
                              color: "#334155",
                              fontWeight: 500,
                              background: "#f8fafc",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#e0f2fe";
                              e.currentTarget.style.color = "#0066ff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#f8fafc";
                              e.currentTarget.style.color = "#334155";
                            }}
                          >
                            • {sub}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: "24px", paddingTop: "14px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>All items with 100% WhiteBox Guarantee</span>
                      <Link
                        href={`/shop?department=${encodeURIComponent(activeDepartment.name)}`}
                        onClick={() => setDeptOpen(false)}
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#0066ff",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        Explore All {activeDepartment.name} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Navigation Links */}
            <nav className="nav-links-modern">
              <div className="nav-item-modern">
                <Link href="/">Home</Link>
              </div>
              <div className="nav-item-modern">
                <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={14} color="#ff7043" />
                  All Products
                </Link>
              </div>
              <div className="nav-item-modern">
                <Link href="/shop?tag=HOT">Flash Deals</Link>
              </div>
              <div className="nav-item-modern">
                <Link href="/shop?department=Electronics%20%26%20Gadgets">Electronics</Link>
              </div>
              <div className="nav-item-modern">
                <Link href="/shop?department=Power%20%26%20Hand%20Tools">Tools & Workshop</Link>
              </div>
              <div className="nav-item-modern">
                <Link href="/wishlist">Wishlist ({wishlist.length})</Link>
              </div>
              <div className="nav-item-modern">
                <Link href="/cart">My Cart ({totalItems})</Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
