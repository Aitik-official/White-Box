"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, logout, toast } = useCart();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, isRegister ? name : undefined);
    router.push("/shop");
  };

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

      <main style={{ padding: "60px 0", minHeight: "65vh", background: "var(--bg-page)" }}>
        <div className="container" style={{ maxWidth: "480px" }}>
          {user ? (
            /* Logged in state / Account dashboard preview */
            <div 
              style={{
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                padding: "36px",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--border-card)",
                textAlign: "center"
              }}
            >
              <div 
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background: "var(--grad-box)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  color: "#ffffff"
                }}
              >
                <User size={36} />
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "4px" }}>
                {user.name}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
                {user.email}
              </p>

              <div 
                style={{
                  background: "#f8fafc",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  color: "#166534"
                }}
              >
                <CheckCircle2 size={18} color="#16a34a" />
                <span>Verified WhiteBox Customer Account</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link 
                  href="/shop" 
                  className="checkout-btn"
                  style={{ textDecoration: "none" }}
                >
                  Continue Shopping
                </Link>
                <Link 
                  href="/wishlist" 
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-sm)",
                    background: "#f1f5f9",
                    color: "var(--wb-navy)",
                    fontWeight: 700,
                    fontSize: "13px"
                  }}
                >
                  View My Wishlist
                </Link>
                <button
                  onClick={logout}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-sm)",
                    color: "#ef4444",
                    fontWeight: 700,
                    fontSize: "13px"
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Login & Register Form */
            <div
              style={{
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                padding: "38px 32px",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--border-card)"
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 900, color: "var(--wb-navy)", marginBottom: "8px" }}>
                  {isRegister ? "Create WhiteBox Account" : "Welcome Back"}
                </h1>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {isRegister
                    ? "Join thousands of members enjoying genuine warranties & flash deals"
                    : "Sign in to access your orders, saved addresses & wishlist"}
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {isRegister && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                      Full Name
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-card)",
                          outline: "none",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-card)",
                        outline: "none",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>
                      Password
                    </label>
                    {!isRegister && (
                      <span style={{ fontSize: "12px", color: "var(--wb-blue)", cursor: "pointer", fontWeight: 600 }}>
                        Forgot?
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-card)",
                      outline: "none",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="checkout-btn"
                  style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <span>{isRegister ? "Create Account" : "Sign In to WhiteBox"}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-light)", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {isRegister ? "Already have an account?" : "New to WhiteBox?"}{" "}
                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    style={{ color: "var(--wb-blue)", fontWeight: 800, textDecoration: "underline" }}
                  >
                    {isRegister ? "Sign In" : "Create an Account"}
                  </button>
                </p>
              </div>

              <div 
                style={{
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "var(--text-light)"
                }}
              >
                <ShieldCheck size={14} color="#10b981" />
                <span>256-Bit SSL Encrypted & Protected</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

