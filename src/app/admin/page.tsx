"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import WhiteBoxLogo from "@/components/WhiteBoxLogo";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  ExternalLink, 
  RefreshCw,
  Search,
  CheckCircle,
  Truck,
  Clock,
  DollarSign,
  Users
} from "lucide-react";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings">("overview");

  // Check saved session auth
  useEffect(() => {
    if (sessionStorage.getItem("wb_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("wb_admin_auth", "true");
      } else {
        setPinError(data.error || "Invalid PIN");
      }
    } catch {
      setPinError("Connection error");
    }
  };
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroButtonText: "",
    heroImage: "",
    bannerNotice: "",
    supportPhone: "",
    dealsTimerHours: 24,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Edit / Add Product Modal state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordersRes, setRes] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (prodRes.products) setProducts(prodRes.products);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (setRes.settings) setSettings(setRes.settings);
    } catch (e) {
      console.error(e);
      notify("Error loading data from MongoDB");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Save product changes (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isAddMode ? "POST" : "PUT";
      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        notify(isAddMode ? "Product created successfully!" : "Product updated!");
        setEditingProduct(null);
        setIsAddMode(false);
        loadAllData();
      } else {
        notify(data.error || "Failed to save product");
      }
    } catch (e) {
      notify("Failed to connect to database");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number, _id?: string) => {
    if (!confirm("Are you sure you want to delete this product from MongoDB?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}&_id=${_id || ""}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notify("Product deleted from database");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      notify("Failed to delete product");
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Order ${orderId} updated to ${status}`);
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
        );
      }
    } catch (e) {
      notify("Failed to update order");
    }
  };

  // Save frontend site settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        notify("Frontend website settings updated in MongoDB!");
      }
    } catch (e) {
      notify("Failed to update settings");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--wb-navy)", fontFamily: "var(--font-family)", padding: "20px" }}>
        <div style={{ background: "#ffffff", borderRadius: "16px", padding: "40px", maxWidth: "420px", width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ marginBottom: "20px" }}>
            <WhiteBoxLogo height={42} variant="dark" />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "6px" }}>
            Admin Access Required
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
            Enter your WhiteBox security PIN to access the database management panel.
          </p>

          <form onSubmit={handlePinSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter Admin PIN..."
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                border: "1.5px solid var(--border-card)",
                fontSize: "15px",
                textAlign: "center",
                outline: "none",
                letterSpacing: "3px"
              }}
            />

            {pinError && (
              <div style={{ color: "#ef4444", fontSize: "12px", fontWeight: 700 }}>
                {pinError}
              </div>
            )}

            <button
              type="submit"
              className="checkout-btn"
              style={{ padding: "14px", marginTop: "4px" }}
            >
              Verify PIN & Enter
            </button>

            <Link href="/" style={{ fontSize: "13px", color: "var(--wb-blue)", fontWeight: 700, marginTop: "8px" }}>
              ← Return to Store
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "var(--font-family)" }}>
      {/* Toast Alert */}
      {toast && (
        <div 
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            background: "var(--wb-navy)",
            color: "#ffffff",
            padding: "14px 24px",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 9999,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside 
        style={{
          width: "280px",
          background: "var(--wb-navy)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0
        }}
      >
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <WhiteBoxLogo height={36} variant="dark" />
          <div style={{ fontSize: "11px", color: "var(--wb-cyan)", fontWeight: 800, marginTop: "8px", letterSpacing: "1px" }}>
            CENTRAL ADMIN PANEL
          </div>
        </div>

        <nav style={{ padding: "20px 14px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "overview" ? "#ffffff" : "#94a3b8",
              background: activeTab === "overview" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <LayoutDashboard size={18} />
            Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab("products")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "products" ? "#ffffff" : "#94a3b8",
              background: activeTab === "products" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <Package size={18} />
            Manage Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "orders" ? "#ffffff" : "#94a3b8",
              background: activeTab === "orders" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <ShoppingBag size={18} />
            Orders & Sales ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "settings" ? "#ffffff" : "#94a3b8",
              background: activeTab === "settings" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <Sliders size={18} />
            Frontend Content & Banners
          </button>
        </nav>

        <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.08)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700
            }}
          >
            <span>View Live Website</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 900, color: "var(--wb-navy)" }}>
              {activeTab === "overview" && "Store Analytics & Overview"}
              {activeTab === "products" && "Product Catalog Manager"}
              {activeTab === "orders" && "Customer Orders"}
              {activeTab === "settings" && "Frontend Hero & Settings"}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Directly connected to MongoDB Atlas (<code style={{ color: "var(--wb-blue)" }}>whitebox_db</code>)
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={loadAllData}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffffff",
                padding: "10px 18px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-card)",
                fontWeight: 700,
                fontSize: "13px",
                color: "var(--text-main)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <RefreshCw size={14} />
              Sync DB
            </button>

            {activeTab === "products" && (
              <button
                onClick={() => {
                  setIsAddMode(true);
                  setEditingProduct({
                    title: "",
                    slug: "",
                    price: "₹1,999",
                    rawPrice: 1999,
                    oldPrice: "₹2,499",
                    brand: "WhiteBox",
                    vendor: "WhiteBox Official",
                    category: "Smartphones",
                    department: "Electronics & Gadgets",
                    img: "/products/product-1.webp",
                    description: "High quality gear crafted for durability and speed.",
                    stockCount: 50,
                    inStock: true,
                    tag: "NEW",
                    tagColor: "#10b981"
                  });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--grad-box)",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 800,
                  fontSize: "13px",
                  boxShadow: "0 4px 12px rgba(217, 27, 92, 0.3)"
                }}
              >
                <Plus size={16} />
                Add New Product
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            {/* Top Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
                  <span>Total Revenue</span>
                  <DollarSign size={18} color="#10b981" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", marginTop: "10px" }}>
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
                  <span>Active Catalog Items</span>
                  <Package size={18} color="var(--wb-blue)" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", marginTop: "10px" }}>
                  {stats.totalProducts}
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
                  <span>Customer Orders</span>
                  <ShoppingBag size={18} color="var(--wb-purple)" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", marginTop: "10px" }}>
                  {stats.totalOrders}
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
                  <span>Registered Users</span>
                  <Users size={18} color="var(--wb-orange)" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", marginTop: "10px" }}>
                  {stats.totalUsers}
                </div>
              </div>
            </div>

            {/* Recent Orders in MongoDB */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid var(--border-card)", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "16px" }}>
                Latest Live Orders in MongoDB
              </h3>
              {orders.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No orders placed yet. Place an order on the checkout page to see it appear here in real time!</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-card)", color: "var(--text-muted)" }}>
                        <th style={{ padding: "12px" }}>Order ID</th>
                        <th style={{ padding: "12px" }}>Customer</th>
                        <th style={{ padding: "12px" }}>Items</th>
                        <th style={{ padding: "12px" }}>Total</th>
                        <th style={{ padding: "12px" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                          <td style={{ padding: "12px", fontWeight: 800, color: "var(--wb-blue)" }}>{o.orderId}</td>
                          <td style={{ padding: "12px" }}>{o.customerName} ({o.customerEmail})</td>
                          <td style={{ padding: "12px" }}>{o.items?.length || 1} product(s)</td>
                          <td style={{ padding: "12px", fontWeight: 700 }}>₹{o.total?.toLocaleString("en-IN")}</td>
                          <td style={{ padding: "12px" }}>
                            <span 
                              style={{ 
                                padding: "4px 10px", 
                                borderRadius: "var(--radius-pill)", 
                                fontSize: "11px", 
                                fontWeight: 800,
                                background: o.status === "delivered" ? "#dcfce7" : "#fef3c7",
                                color: o.status === "delivered" ? "#166534" : "#92400e"
                              }}
                            >
                              {o.status?.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeTab === "products" && (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid var(--border-card)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-card)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "14px 12px" }}>Product</th>
                    <th style={{ padding: "14px 12px" }}>Category</th>
                    <th style={{ padding: "14px 12px" }}>Price</th>
                    <th style={{ padding: "14px 12px" }}>Stock</th>
                    <th style={{ padding: "14px 12px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id || p.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <img 
                          src={p.img} 
                          alt={p.title} 
                          style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "6px", background: "#f8fafc" }} 
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: "var(--wb-navy)" }}>{p.title}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Brand: {p.brand}</div>
                        </div>
                      </td>
                      <td style={{ padding: "12px" }}>{p.category}</td>
                      <td style={{ padding: "12px", fontWeight: 800, color: "var(--wb-navy)" }}>{p.price}</td>
                      <td style={{ padding: "12px" }}>
                        <span 
                          style={{ 
                            padding: "4px 8px", 
                            borderRadius: "6px", 
                            fontSize: "11px", 
                            fontWeight: 700,
                            background: p.inStock ? "#dcfce7" : "#fee2e2",
                            color: p.inStock ? "#166534" : "#991b1b"
                          }}
                        >
                          {p.inStock ? `${p.stockCount || 10} In Stock` : "Out of Stock"}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              setIsAddMode(false);
                              setEditingProduct(p);
                            }}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#f1f5f9",
                              color: "var(--wb-blue)",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Edit size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p._id)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "6px",
                              background: "#fee2e2",
                              color: "#ef4444",
                              fontWeight: 700
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGER */}
        {activeTab === "orders" && (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid var(--border-card)", boxShadow: "var(--shadow-sm)" }}>
            {orders.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No customer orders yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {orders.map((o) => (
                  <div 
                    key={o._id} 
                    style={{
                      border: "1px solid var(--border-card)",
                      borderRadius: "12px",
                      padding: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "16px"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--wb-navy)" }}>{o.orderId}</span>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-main)", marginTop: "4px" }}>
                        <strong>Customer:</strong> {o.customerName} ({o.customerPhone}) • {o.address}, {o.city}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                        <strong>Items:</strong> {o.items?.map((i: any) => `${i.title} (x${i.quantity})`).join(", ")}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>TOTAL</div>
                        <div style={{ fontSize: "18px", fontWeight: 900, color: "var(--wb-navy)" }}>₹{o.total?.toLocaleString("en-IN")}</div>
                      </div>

                      <select
                        value={o.status || "processing"}
                        onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid var(--border-card)",
                          fontWeight: 700,
                          fontSize: "13px",
                          outline: "none"
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FRONTEND SITE SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "32px", border: "1px solid var(--border-card)", boxShadow: "var(--shadow-sm)", maxWidth: "800px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "6px" }}>
              Live Frontend Website Controls
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
              Changes made here update the homepage banners, top bar notices, and hero section instantly in MongoDB.
            </p>

            <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                  Hero Main Heading
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                    Top Bar Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                    Top Bar Banner Guarantee Notice
                  </label>
                  <input
                    type="text"
                    value={settings.bannerNotice}
                    onChange={(e) => setSettings({ ...settings, bannerNotice: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                style={{ width: "fit-content", padding: "12px 32px", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Save size={16} />
                Save & Apply Live Changes
              </button>
            </form>
          </div>
        )}

        {/* Modal: Add or Edit Product */}
        {editingProduct && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(13, 27, 70, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
          >
            <div 
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "28px",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--wb-navy)" }}>
                  {isAddMode ? "Add New Product" : `Edit Product: ${editingProduct.title}`}
                </h3>
                <button 
                  onClick={() => setEditingProduct(null)}
                  style={{ fontSize: "20px", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Product Title</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Price (e.g. ₹19,999)</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.price || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Old Price (Strikeout)</label>
                    <input
                      type="text"
                      value={editingProduct.oldPrice || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Category</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.category || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Department</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.department || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, department: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Image Path or URL</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.img || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, img: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    style={{ padding: "10px 18px", borderRadius: "8px", background: "#f1f5f9", fontWeight: 700 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="checkout-btn"
                    style={{ width: "auto", padding: "10px 24px" }}
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

