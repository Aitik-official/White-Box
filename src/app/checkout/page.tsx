"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import WhiteBoxLogo from "@/components/WhiteBoxLogo";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building, 
  Truck, 
  Lock, 
  CheckCircle2, 
  ArrowLeft,
  ShoppingBag
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, formatINR, clearCart } = useCart();

  // Form states
  const [formData, setFormData] = useState({
    fullName: "Aarav Gupta",
    email: "aarav.gupta@example.com",
    phone: "9876543210",
    address: "Flat 402, Royal Palms Residency, MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [upiId, setUpiId] = useState("aarav@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8921");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("892");
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingFee = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Generate random order id
    const orderId = "WB-" + Math.floor(100000 + Math.random() * 900000);

    // Save order data for confirmation page
    const orderSummary = {
      orderId,
      items: cart,
      total: grandTotal,
      customer: formData,
      paymentMethod,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("last_order", JSON.stringify(orderSummary));
    }

    setTimeout(() => {
      clearCart();
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 1500);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Secure Header */}
      <header style={{ background: "var(--wb-navy)", borderBottom: "2px solid #0066ff", padding: "16px 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/">
            <WhiteBoxLogo height={38} variant="light" />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ffffff", fontSize: "13px", fontWeight: 700 }}>
            <Lock size={16} color="#00b4d8" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: "36px 20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#0066ff", fontWeight: 700 }}>
            <ArrowLeft size={16} /> Return to Shopping Cart
          </Link>
        </div>

        <form onSubmit={handlePaymentSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "36px", alignItems: "start" }}>
            
            {/* Left Column: Shipping Details & Payment Selection */}
            <div>
              {/* Step 1: Delivery Address */}
              <div style={{ background: "#ffffff", borderRadius: "18px", padding: "28px", border: "1px solid #e2e8f0", marginBottom: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#0066ff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px" }}>
                    1
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Delivery Address</h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName} 
                      onChange={handleInputChange}
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone} 
                      onChange={handleInputChange}
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Email Address (for order tracking & receipt)</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Street Address / Flat / Building</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address} 
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city} 
                      onChange={handleInputChange}
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state} 
                      onChange={handleInputChange}
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>PIN Code</label>
                    <input 
                      type="text" 
                      name="pincode"
                      value={formData.pincode} 
                      onChange={handleInputChange}
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method (UPI, Cards, NetBanking, COD) */}
              <div style={{ background: "#ffffff", borderRadius: "18px", padding: "28px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#0066ff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px" }}>
                    2
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Select Payment Option</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                  {/* UPI (Google Pay / PhonePe / Paytm) */}
                  <label 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "16px",
                      borderRadius: "12px",
                      border: paymentMethod === "upi" ? "2px solid #0066ff" : "1px solid #cbd5e1",
                      background: paymentMethod === "upi" ? "#f0f7ff" : "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === "upi"} 
                      onChange={() => setPaymentMethod("upi")}
                      style={{ width: "18px", height: "18px", accentColor: "#0066ff" }}
                    />
                    <Smartphone size={22} color="#0066ff" />
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>UPI Instant Payment (GPay, PhonePe, Paytm, BHIM)</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Instant verification with 0% processing fee</div>
                    </div>
                  </label>

                  {paymentMethod === "upi" && (
                    <div style={{ padding: "14px 18px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Enter UPI ID / VPA</label>
                      <input 
                        type="text" 
                        value={upiId} 
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                      />
                    </div>
                  )}

                  {/* Credit / Debit Card */}
                  <label 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "16px",
                      borderRadius: "12px",
                      border: paymentMethod === "card" ? "2px solid #0066ff" : "1px solid #cbd5e1",
                      background: paymentMethod === "card" ? "#f0f7ff" : "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === "card"} 
                      onChange={() => setPaymentMethod("card")}
                      style={{ width: "18px", height: "18px", accentColor: "#0066ff" }}
                    />
                    <CreditCard size={22} color="#7928ca" />
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>Credit / Debit / ATM Cards</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Visa, MasterCard, RuPay, Maestro accepted</div>
                    </div>
                  </label>

                  {paymentMethod === "card" && (
                    <div style={{ padding: "14px 18px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Card Number</label>
                        <input 
                          type="text" 
                          value={cardNumber} 
                          onChange={(e) => setCardNumber(e.target.value)}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                        />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Expiry (MM/YY)</label>
                          <input 
                            type="text" 
                            value={cardExpiry} 
                            onChange={(e) => setCardExpiry(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>CVV</label>
                          <input 
                            type="password" 
                            value={cardCvv} 
                            onChange={(e) => setCardCvv(e.target.value)}
                            maxLength={4}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery */}
                  <label 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "16px",
                      borderRadius: "12px",
                      border: paymentMethod === "cod" ? "2px solid #0066ff" : "1px solid #cbd5e1",
                      background: paymentMethod === "cod" ? "#f0f7ff" : "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === "cod"} 
                      onChange={() => setPaymentMethod("cod")}
                      style={{ width: "18px", height: "18px", accentColor: "#0066ff" }}
                    />
                    <Truck size={22} color="#10b981" />
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>Cash on Delivery (Pay upon arrival)</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Pay cash or UPI directly to delivery agent</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Final Place Order */}
            <div style={{ background: "#ffffff", borderRadius: "18px", padding: "28px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", position: "sticky", top: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "18px" }}>
                Order Summary ({cart.length} items)
              </h3>

              {/* Items preview list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "240px", overflowY: "auto", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9", marginBottom: "16px" }}>
                {cart.map((item) => (
                  <div key={item.product.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <img src={item.product.img} alt={item.product.title} style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.product.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        Qty: {item.quantity} • {item.product.vendor}
                      </div>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#0d1b46" }}>
                      {item.product.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fee Calculations */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b" }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{formatINR(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b" }}>
                  <span>Delivery Charges:</span>
                  <span style={{ fontWeight: 700, color: shippingFee === 0 ? "#10b981" : "#0f172a" }}>
                    {shippingFee === 0 ? "FREE" : formatINR(shippingFee)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b" }}>
                  <span>GST & Platform Handling:</span>
                  <span style={{ fontWeight: 700, color: "#10b981" }}>INCLUDED</span>
                </div>
              </div>

              {/* Total Payable */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Grand Total:</span>
                <span style={{ fontSize: "26px", fontWeight: 900, color: "#0d1b46" }}>{formatINR(grandTotal)}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "10px",
                  background: isProcessing ? "#94a3b8" : "var(--grad-box)",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 4px 15px rgba(217, 27, 92, 0.35)",
                  cursor: isProcessing ? "not-allowed" : "pointer"
                }}
              >
                {isProcessing ? (
                  <span>Processing Secure Payment...</span>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    CONFIRM & PAY {formatINR(grandTotal)}
                  </>
                )}
              </button>

              <div style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "#64748b" }}>
                By placing this order you agree to WhiteBox terms of service & 7-day return policy.
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
