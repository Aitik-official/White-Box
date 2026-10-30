"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhiteBoxLogo from "@/components/WhiteBoxLogo";
import { useCart } from "@/context/CartContext";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Printer, 
  Download,
  ShieldCheck,
  Check
} from "lucide-react";

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "WB-849102";
  const { formatINR } = useCart();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("last_order");
      if (stored) {
        try {
          setOrder(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const customerName = order?.customer?.fullName || "Aarav Gupta";
  const deliveryAddress = order?.customer?.address 
    ? `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}` 
    : "Flat 402, Royal Palms Residency, MG Road, Bengaluru, Karnataka - 560001";
  const totalAmount = order?.total || 24499;
  const paymentMethodLabel = order?.paymentMethod === "cod" ? "Cash on Delivery" : order?.paymentMethod === "card" ? "Credit/Debit Card" : "UPI Instant Payment";

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <div className="container" style={{ padding: "40px 20px" }}>
        {/* Success Banner Card */}
        <div 
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "48px 36px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            textAlign: "center",
            maxWidth: "850px",
            margin: "0 auto 36px"
          }}
        >
          <div 
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#dcfce7",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 20px rgba(22, 163, 74, 0.2)"
            }}
          >
            <CheckCircle size={48} />
          </div>

          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", marginBottom: "8px" }}>
            Order Placed Successfully!
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b", marginBottom: "20px" }}>
            Thank you, <strong>{customerName}</strong>. Your order has been registered and verified by our vendor network.
          </p>

          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "12px", 
              background: "#f1f5f9", 
              padding: "10px 24px", 
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: 800,
              color: "#0d1b46"
            }}
          >
            <span>Order Reference:</span>
            <span style={{ color: "#0066ff" }}>#{orderId}</span>
          </div>

          {/* Progress Order Status Timeline */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "40px", paddingTop: "30px", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <Check size={18} />
              </div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>Confirmed</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Payment Verified</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#0066ff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <Package size={18} />
              </div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#0066ff" }}>Packing</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>At Vendor Hub</div>
            </div>

            <div style={{ textAlign: "center", opacity: 0.5 }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#e2e8f0", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <Truck size={18} />
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>In Transit</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Express Courier</div>
            </div>

            <div style={{ textAlign: "center", opacity: 0.5 }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#e2e8f0", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <CheckCircle size={18} />
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>Delivered</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Expected Tomorrow</div>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div 
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "36px",
            border: "1px solid #e2e8f0",
            maxWidth: "850px",
            margin: "0 auto"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", paddingBottom: "24px", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>
                <MapPin size={14} color="#0066ff" /> Shipping Address
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>{customerName}</div>
              <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>{deliveryAddress}</div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>
                <Calendar size={14} color="#0066ff" /> Payment & Delivery
              </div>
              <div style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
                Payment Method: <strong style={{ color: "#0f172a" }}>{paymentMethodLabel}</strong>
              </div>
              <div style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
                Expected Arrival: <strong style={{ color: "#16a34a" }}>Tomorrow, 5:00 PM</strong>
              </div>
              <div style={{ fontSize: "13px", color: "#475569" }}>
                Total Paid: <strong style={{ color: "#0d1b46", fontSize: "16px" }}>{formatINR(totalAmount)}</strong>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "28px", flexWrap: "wrap", gap: "12px" }}>
            <button 
              onClick={() => window.print()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                color: "#334155"
              }}
            >
              <Printer size={16} /> Print Tax Invoice
            </button>

            <Link
              href="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--grad-box)",
                color: "#ffffff",
                padding: "12px 30px",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "14px",
                boxShadow: "0 4px 15px rgba(217, 27, 92, 0.3)"
              }}
            >
              Continue Browsing Store <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
