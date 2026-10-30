"use client";

import React, { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { Product } from "@/data/siteData";
import ProductCard from "./ProductCard";

interface DealsSectionProps {
  products: Product[];
}

export default function DealsSection({ products }: DealsSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 48,
    seconds: 52
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.oldPrice).concat(products.slice(0, 4)).slice(0, 4);

  return (
    <section className="section-wrapper-modern" id="flash-deals">
      <div className="container">
        <div className="deals-modern-banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div 
                style={{ 
                  width: "44px", 
                  height: "44px", 
                  borderRadius: "12px", 
                  background: "#ff4742", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  color: "#fff" 
                }}
              >
                <Flame size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b", margin: 0 }}>Flash Deals of the Week</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Special limited quantity offers with huge savings</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>Offer ends in:</span>
              <span className="timer-bubble">{String(timeLeft.hours).padStart(2, "0")}h</span>
              <span style={{ fontWeight: 800, color: "#ff4742" }}>:</span>
              <span className="timer-bubble">{String(timeLeft.minutes).padStart(2, "0")}m</span>
              <span style={{ fontWeight: 800, color: "#ff4742" }}>:</span>
              <span className="timer-bubble">{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>
          </div>

          <div className="products-modern-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {dealProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
