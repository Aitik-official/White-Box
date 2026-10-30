"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Zap } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, subtotal, formatINR, clearCart } = useCart();

  const shippingFee = subtotal > 1500 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <CartDrawer />
      <Header />

      <div className="container" style={{ padding: "36px 20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", marginBottom: "24px" }}>
          Shopping Cart ({cart.reduce((a, c) => a + c.quantity, 0)} Items)
        </h1>

        {cart.length === 0 ? (
          <div 
            style={{ 
              background: "#ffffff", 
              borderRadius: "20px", 
              padding: "70px 20px", 
              textAlign: "center", 
              border: "1px solid #e2e8f0" 
            }}
          >
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <ShoppingBag size={40} color="#94a3b8" />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
              Your shopping cart is empty
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
              Explore over 50,000+ top electronics, power tools, and smart gear.
            </p>
            <Link 
              href="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--grad-box)",
                color: "#ffffff",
                padding: "12px 32px",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "14px",
                boxShadow: "0 4px 15px rgba(217, 27, 92, 0.3)"
              }}
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>
            {/* Left: Cart Item List */}
            <div style={{ background: "#ffffff", borderRadius: "18px", padding: "28px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9", marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Item Details</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Subtotal</span>
              </div>

              {cart.map((item) => {
                const rawPrice = parseFloat(item.product.price.replace(/[^0-9.]/g, "")) || 0;
                const itemTotal = rawPrice * item.quantity;

                return (
                  <div 
                    key={item.product.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      padding: "20px 0",
                      borderBottom: "1px solid #f8fafc"
                    }}
                  >
                    <div style={{ width: "90px", height: "90px", position: "relative", flexShrink: 0, borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                      <Image src={item.product.img} alt={item.product.title} fill style={{ objectFit: "contain", padding: "6px" }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#0066ff" }}>{item.product.brand}</span>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
                        <Link href={`/product/${item.product.slug}`}>{item.product.title}</Link>
                      </h4>
                      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
                        Seller: <strong>{item.product.vendor}</strong>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#fff" }}>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            style={{ padding: "6px 12px", color: "#475569" }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ padding: "6px 14px", fontWeight: 800, fontSize: "13px", color: "#0f172a" }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            style={{ padding: "6px 12px", color: "#475569" }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          style={{ color: "#ef4444", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "17px", fontWeight: 900, color: "#0d1b46" }}>
                        {formatINR(itemTotal)}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {item.product.price} each
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link href="/shop" style={{ fontSize: "13px", color: "#0066ff", fontWeight: 700 }}>
                  ← Continue Shopping
                </Link>
                <button 
                  onClick={clearCart} 
                  style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Right: Order Summary Box */}
            <div style={{ background: "#ffffff", borderRadius: "18px", padding: "28px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "18px" }}>
                Order Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "18px", borderBottom: "1px solid #f1f5f9", marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                  <span>Items Subtotal:</span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{formatINR(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                  <span>Delivery Charge:</span>
                  <span style={{ fontWeight: 700, color: shippingFee === 0 ? "#10b981" : "#0f172a" }}>
                    {shippingFee === 0 ? "FREE" : formatINR(shippingFee)}
                  </span>
                </div>
                {shippingFee === 0 && (
                  <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}>
                    ✓ Qualified for Free Express Shipping
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Total Payable:</span>
                <span style={{ fontSize: "24px", fontWeight: 900, color: "#0d1b46" }}>{formatINR(grandTotal)}</span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "10px",
                  background: "var(--grad-box)",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 15px rgba(217, 27, 92, 0.35)",
                  letterSpacing: "0.5px"
                }}
              >
                <Zap size={18} /> PROCEED TO CHECKOUT
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginTop: "16px", fontSize: "12px", color: "#64748b" }}>
                <ShieldCheck size={16} color="#10b981" /> 256-Bit SSL Encrypted & Protected Checkout
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
