"use client";

import React from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal,
    formatINR,
    clearCart
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div 
              style={{ 
                width: "36px", 
                height: "36px", 
                borderRadius: "10px", 
                background: "var(--grad-box)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                color: "#fff" 
              }}
            >
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0d1b46", margin: 0 }}>WhiteBox Cart</h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>{cart.length} item{cart.length === 1 ? "" : "s"} selected</span>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)} 
            aria-label="Close cart"
            style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={18} color="#64748b" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
              <div 
                style={{ 
                  width: "68px", 
                  height: "68px", 
                  borderRadius: "50%", 
                  background: "#f1f5f9", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  margin: "0 auto 16px" 
                }}
              >
                <ShoppingBag size={32} color="#94a3b8" />
              </div>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>Your cart is empty</h4>
              <p style={{ fontSize: "13px", color: "#64748b" }}>Add products from the catalog to get started</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} style={{ display: "flex", gap: "14px", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
                <Image 
                  src={item.product.img} 
                  alt={item.product.title} 
                  width={64} 
                  height={64}
                  style={{ objectFit: "contain", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "4px", background: "#f8fafc" }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "4px", lineHeight: 1.3 }}>
                    {item.product.title}
                  </h4>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0d1b46" }}>
                    {item.product.price}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#fff" }}>
                      <button 
                        style={{ padding: "4px 8px", color: "#475569" }}
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: "12px", fontWeight: 700, padding: "0 8px" }}>{item.quantity}</span>
                      <button 
                        style={{ padding: "4px 8px", color: "#475569" }}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      style={{ color: "#ef4444", marginLeft: "auto", padding: "4px" }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "18px" }}>
              <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 600 }}>Subtotal:</span>
              <span style={{ fontSize: "20px", fontWeight: 900, color: "#0d1b46" }}>{formatINR(subtotal)}</span>
            </div>

            <button 
              className="checkout-btn"
              onClick={() => alert(`WhiteBox Secure Checkout:\n\nProcessing order of ${cart.length} items for ${formatINR(subtotal)}`)}
            >
              Proceed To Checkout
            </button>

            <button 
              onClick={clearCart}
              style={{ 
                width: "100%", 
                marginTop: "12px", 
                fontSize: "12px", 
                color: "#94a3b8",
                fontWeight: 600,
                textAlign: "center"
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
