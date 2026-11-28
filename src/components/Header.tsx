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
  Sparkles,
  Laptop,
  Tv,
  Headphones,
  Camera,
  Shirt,
  Layers,
  Package
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import WhiteBoxLogo from "./WhiteBoxLogo";

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone size={16} />,
  Gamepad2: <Gamepad2 size={16} />,
  Wrench: <Wrench size={16} />,
  Sliders: <Sliders size={16} />,
  Armchair: <Armchair size={16} />,
  Watch: <Watch size={16} />,
  Scissors: <Scissors size={16} />,
  Laptop: <Laptop size={16} />,
  Tv: <Tv size={16} />,
  Headphones: <Headphones size={16} />,
  Camera: <Camera size={16} />,
  Shirt: <Shirt size={16} />,
  Layers: <Layers size={16} />,
  ShoppingBag: <ShoppingBag size={16} />,
  Sparkles: <Sparkles size={16} />,
  Package: <Package size={16} />,
};

// Helper to sort main categories and their subcategories alphabetically (A-Z)
const sortCategoriesAZ = (cats: any[]) => {
  return [...cats]
    .map((cat: any) => ({
      ...cat,
      subcategories: Array.isArray(cat.subcategories)
        ? [...cat.subcategories].sort((a: string, b: string) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
          )
        : [],
    }))
    .sort((a: any, b: any) =>
      (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
    );
};

export default function Header() {
  const router = useRouter();
  const { totalItems, subtotal, formatINR, setIsCartOpen, wishlist } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [deptOpen, setDeptOpen] = useState(false);
  const [hoveredDept, setHoveredDept] = useState<string | null>("");
  const [openNavCat, setOpenNavCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navCatsRef = useRef<HTMLElement>(null);

  // Fetch live categories from MongoDB backend API (Sorted A-Z)
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          const sorted = sortCategoriesAZ(data.categories);
          setCategories(sorted);
          if (sorted.length > 0) {
            if (!hoveredDept || !sorted.some((c: any) => c.slug === hoveredDept)) {
              setHoveredDept(sorted[0].slug);
            }
          }
        }
      } catch (e) {
        console.warn("Could not load categories in header:", e);
      }
    }
    loadCategories();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDeptOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (navCatsRef.current && !navCatsRef.current.contains(e.target as Node)) {
        setOpenNavCat(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live auto-complete search from live database API
  useEffect(() => {
    let active = true;
    if (searchQuery.trim().length > 1) {
      fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}&_t=${Date.now()}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (!active) return;
          if (data.success && Array.isArray(data.products)) {
            setSearchSuggestions(data.products.slice(0, 5));
            setShowSuggestions(data.products.length > 0);
          } else {
            setSearchSuggestions([]);
            setShowSuggestions(false);
          }
        })
        .catch(() => {
          if (!active) return;
          setSearchSuggestions([]);
          setShowSuggestions(false);
        });
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
    return () => { active = false; };
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

  const activeDepartment = categories.find((d: any) => d.slug === hoveredDept) || categories[0] || null;

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
                      {prod.img ? (
                        <img src={prod.img} alt={prod.title} style={{ width: "38px", height: "38px", objectFit: "contain", borderRadius: "6px" }} />
                      ) : (
                        <div style={{ width: "38px", height: "38px", borderRadius: "6px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ShoppingBag size={18} color="#94a3b8" />
                        </div>
                      )}
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
                  className="dept-mega-dropdown"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    left: 0,
                    width: "min(680px, calc(100vw - 32px))",
                    background: "#ffffff",
                    borderRadius: "14px",
                    boxShadow: "0 20px 45px rgba(0,0,0,0.22)",
                    border: "1px solid #e2e8f0",
                    display: "grid",
                    gridTemplateColumns: "minmax(200px, 260px) 1fr",
                    zIndex: 250,
                    overflow: "hidden",
                    animation: "fadeInDown 0.2s ease"
                  }}
                >
                  {/* Left Column: Sorted Main Categories */}
                  <div style={{ background: "#f8fafc", borderRight: "1px solid #e2e8f0", padding: "10px 0", maxHeight: "420px", overflowY: "auto" }}>
                    <div style={{ padding: "8px 18px", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                      Main Categories ({categories.length})
                    </div>
                    {categories.map((dept: any) => {
                      const isHovered = (hoveredDept === dept.slug);
                      return (
                        <div 
                          key={dept._id || dept.slug}
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

                  {/* Right Column: Mini Categories (Subcategories) & Browse Link */}
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(0, 102, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0066ff" }}>
                          {iconMap[activeDepartment?.icon] || <Wrench size={16} />}
                        </div>
                        <div>
                          <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>{activeDepartment?.name}</h4>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>
                            {(activeDepartment?.subcategories || []).length} Mini Categories available
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
                        {(activeDepartment?.subcategories || []).length === 0 ? (
                          <div style={{ fontSize: "13px", color: "#64748b", gridColumn: "1 / -1", padding: "10px 0" }}>
                            <p style={{ marginBottom: "10px" }}>Browse all products directly in this category:</p>
                            <Link
                              href={`/shop?department=${encodeURIComponent(activeDepartment?.name || "")}`}
                              onClick={() => setDeptOpen(false)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                background: "#0066ff",
                                color: "#ffffff",
                                fontSize: "12px",
                                fontWeight: 700
                              }}
                            >
                              Browse {activeDepartment?.name} Products →
                            </Link>
                          </div>
                        ) : (
                          (activeDepartment?.subcategories || []).map((sub: string, i: number) => (
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
                          ))
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: "24px", paddingTop: "14px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <Link
                        href="/shop?vendor=WhiteBox%20Official"
                        onClick={() => setDeptOpen(false)}
                        style={{ fontSize: "12px", color: "#0066ff", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "3px" }}
                      >
                        All items with 100% WhiteBox Guarantee →
                      </Link>
                      {activeDepartment && (
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
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Navigation Links — main categories; mini categories in dropdown */}
            <nav className="nav-links-modern" ref={navCatsRef}>
              <div className="nav-item-modern">
                <Link href="/">Home</Link>
              </div>
              <div className="nav-item-modern">
                <Link href="/shop?tag=HOT">Flash Deals</Link>
              </div>
              {categories.map((cat: any) => {
                const catKey = cat._id || cat.slug || cat.name;
                const minis: string[] = Array.isArray(cat.subcategories) ? cat.subcategories : [];
                const hasMinis = minis.length > 0;
                const isOpen = openNavCat === catKey;

                return (
                  <div
                    key={catKey}
                    className="nav-item-modern"
                    style={{ position: "relative" }}
                    onMouseEnter={() => hasMinis && setOpenNavCat(catKey)}
                    onMouseLeave={() => setOpenNavCat(null)}
                  >
                    {hasMinis ? (
                      <button
                        type="button"
                        onClick={() => setOpenNavCat(isOpen ? null : catKey)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background: "transparent",
                          border: "none",
                          color: isOpen ? "var(--header-accent-cyan)" : "#ffffff",
                          fontSize: "12px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                          padding: "6px 0",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          lineHeight: 1.2,
                        }}
                      >
                        {cat.name}
                        <ChevronDown size={12} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                      </button>
                    ) : (
                      <Link href={`/shop?department=${encodeURIComponent(cat.name)}`}>
                        {cat.name}
                      </Link>
                    )}

                    {hasMinis && isOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          minWidth: "200px",
                          background: "#ffffff",
                          borderRadius: "10px",
                          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.18)",
                          border: "1px solid #e2e8f0",
                          padding: "8px",
                          zIndex: 120,
                          marginTop: "0",
                          paddingTop: "10px",
                        }}
                      >
                        <Link
                          href={`/shop?department=${encodeURIComponent(cat.name)}`}
                          onClick={() => setOpenNavCat(null)}
                          style={{
                            display: "block",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "#0066ff",
                            textTransform: "none",
                            letterSpacing: 0,
                            marginBottom: "4px",
                          }}
                        >
                          All {cat.name}
                        </Link>
                        {minis.map((mini) => (
                          <Link
                            key={mini}
                            href={`/shop?category=${encodeURIComponent(mini)}`}
                            onClick={() => setOpenNavCat(null)}
                            style={{
                              display: "block",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#334155",
                              textTransform: "none",
                              letterSpacing: 0,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#e0f2fe";
                              e.currentTarget.style.color = "#0066ff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "#334155";
                            }}
                          >
                            {mini}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
