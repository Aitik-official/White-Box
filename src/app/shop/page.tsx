"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { ALL_PRODUCTS, DEPARTMENTS_DATA, VENDORS } from "@/data/siteData";
import { Filter, SlidersHorizontal, ArrowUpDown, Check, Star, RefreshCw } from "lucide-react";
import { useCart } from "@/context/CartContext";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialDepartment = searchParams.get("department") || "";
  const initialTag = searchParams.get("tag") || "";

  const [searchFilter, setSearchFilter] = useState(initialQuery);
  const [selectedDept, setSelectedDept] = useState(initialDepartment);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [maxPrice, setMaxPrice] = useState<number>(50000);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      // Search term
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matches = 
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Department filter
      if (selectedDept && p.department !== selectedDept) return false;

      // Category filter
      if (selectedCategory && p.category !== selectedCategory) return false;

      // Tag filter
      if (initialTag && p.tag !== initialTag) return false;

      // Vendor filter
      if (selectedVendors.length > 0 && !selectedVendors.includes(p.vendor)) return false;

      // Rating filter
      if (minRating > 0 && p.rating < minRating) return false;

      // Price filter
      if (p.rawPrice > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.rawPrice - b.rawPrice;
      if (sortBy === "price-high") return b.rawPrice - a.rawPrice;
      if (sortBy === "rating") return b.rating - a.rating;
      return a.id - b.id; // featured default
    });
  }, [searchFilter, selectedDept, selectedCategory, initialTag, selectedVendors, minRating, sortBy, maxPrice]);

  const toggleVendor = (vendorName: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorName) ? prev.filter(v => v !== vendorName) : [...prev, vendorName]
    );
  };

  const clearAllFilters = () => {
    setSearchFilter("");
    setSelectedDept("");
    setSelectedCategory("");
    setSelectedVendors([]);
    setMinRating(0);
    setMaxPrice(50000);
    setSortBy("featured");
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Breadcrumb Bar */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "14px 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
            <Link href="/" style={{ color: "#0066ff", fontWeight: 600 }}>Home</Link>
            <span>/</span>
            <Link href="/shop" style={{ color: "#0066ff", fontWeight: 600 }}>Store Catalog</Link>
            {selectedDept && (
              <>
                <span>/</span>
                <span style={{ color: "#0f172a", fontWeight: 700 }}>{selectedDept}</span>
              </>
            )}
            {selectedCategory && (
              <>
                <span>/</span>
                <span style={{ color: "#0f172a", fontWeight: 700 }}>{selectedCategory}</span>
              </>
            )}
            {searchFilter && (
              <>
                <span>/</span>
                <span>Search results for &ldquo;{searchFilter}&rdquo;</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog View: Sidebar Filters + Products Grid */}
      <div className="container" style={{ padding: "30px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "30px", alignItems: "start" }}>
          
          {/* Left Filter Sidebar (Amazon / Flipkart Style) */}
          <aside style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, fontSize: "16px", color: "#0f172a" }}>
                <Filter size={18} color="#0066ff" />
                Filters
              </div>
              <button 
                onClick={clearAllFilters}
                style={{ fontSize: "12px", color: "#ef4444", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}
              >
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            {/* Department Accordion */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", marginBottom: "12px", letterSpacing: "0.5px" }}>
                Departments
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  onClick={() => { setSelectedDept(""); setSelectedCategory(""); }}
                  style={{
                    textAlign: "left",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: !selectedDept ? 800 : 500,
                    background: !selectedDept ? "#e0f2fe" : "transparent",
                    color: !selectedDept ? "#0066ff" : "#475569"
                  }}
                >
                  All Departments ({ALL_PRODUCTS.length})
                </button>
                {DEPARTMENTS_DATA.map((d) => {
                  const count = ALL_PRODUCTS.filter(p => p.department === d.name).length;
                  const isSelected = selectedDept === d.name;
                  return (
                    <button
                      key={d.slug}
                      onClick={() => { setSelectedDept(d.name); setSelectedCategory(""); }}
                      style={{
                        textAlign: "left",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: isSelected ? 800 : 500,
                        background: isSelected ? "#e0f2fe" : "transparent",
                        color: isSelected ? "#0066ff" : "#475569",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>{d.name}</span>
                      <span style={{ fontSize: "11px", opacity: 0.7 }}>({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price Slider */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", marginBottom: "12px", letterSpacing: "0.5px" }}>
                Price Range
              </h4>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#0d1b46", marginBottom: "8px" }}>
                <span>₹0</span>
                <span>Up to ₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <input 
                type="range" 
                min={2000} 
                max={50000} 
                step={2000} 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0066ff" }}
              />
            </div>

            {/* Verified Vendors */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", marginBottom: "12px", letterSpacing: "0.5px" }}>
                Certified Vendors
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {VENDORS.map((v) => {
                  const isChecked = selectedVendors.includes(v.name);
                  return (
                    <label 
                      key={v.id} 
                      style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => toggleVendor(v.name)}
                        style={{ width: "16px", height: "16px", accentColor: "#0066ff", cursor: "pointer" }}
                      />
                      <span>{v.name}</span>
                      <span style={{ marginLeft: "auto", fontSize: "11px", color: "#f59e0b", display: "flex", alignItems: "center" }}>
                        ★ {v.rating}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Customer Rating Filter */}
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", marginBottom: "12px", letterSpacing: "0.5px" }}>
                Customer Ratings
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[4.5, 4.0, 3.5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMinRating(minRating === star ? 0 : star)}
                    style={{
                      textAlign: "left",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: minRating === star ? 800 : 500,
                      background: minRating === star ? "#fef3c7" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{star} Stars & above</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid + Sorting Bar */}
          <div>
            {/* Top Toolbar */}
            <div 
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "16px 22px",
                border: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "14px"
              }}
            >
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  {selectedDept || (searchFilter ? `Search: "${searchFilter}"` : "All Catalog Products")}
                </h2>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Showing {filteredProducts.length} results matching your criteria
                </span>
              </div>

              {/* Sorting Options */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0f172a",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="featured">Featured / Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div 
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "60px 20px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0"
                }}
              >
                <Filter size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                  No products matched your filters
                </h3>
                <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
                  Try relaxing your price limits or reset all applied filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  style={{
                    background: "var(--grad-box)",
                    color: "#ffffff",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "13px"
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { toast } = useCart();

  return (
    <div>
      {toast && (
        <div className="toast-modern">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}
      <CartDrawer />
      <Header />
      <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading Store Catalog...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
