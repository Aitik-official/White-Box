"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PromoBannerStripsProps {
  banners: {
    img: string;
    title: string;
    subtitle: string;
  }[];
}

export default function PromoBannerStrips({ banners }: PromoBannerStripsProps) {
  return (
    <section className="section-wrapper-modern" style={{ padding: "16px 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {banners.map((b, idx) => (
            <div 
              key={idx}
              className="promo-strip-card"
              style={{
                position: "relative",
                height: "160px",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: "var(--shadow-sm)",
                transition: "var(--transition)",
                cursor: "pointer",
                background: "#f1f5f9"
              }}
            >
              <Image 
                src={b.img} 
                alt={b.title} 
                fill 
                style={{ objectFit: "cover" }}
                className="promo-strip-img"
              />
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 32px",
                  background: "linear-gradient(90deg, rgba(13, 27, 70, 0.88) 0%, rgba(13, 27, 70, 0.45) 60%, transparent 100%)",
                  color: "#fff",
                  zIndex: 2,
                }}
              >
                <span 
                  style={{ 
                    fontSize: "11px", 
                    textTransform: "uppercase", 
                    letterSpacing: "1.5px", 
                    color: "var(--wb-cyan)", 
                    fontWeight: 800,
                    marginBottom: "4px" 
                  }}
                >
                  {b.subtitle}
                </span>
                <h3 
                  style={{ 
                    fontSize: "20px", 
                    fontWeight: 800, 
                    maxWidth: "280px", 
                    lineHeight: 1.25, 
                    marginBottom: "12px",
                    color: "#ffffff"
                  }}
                >
                  {b.title}
                </h3>
                <Link 
                  href="#products" 
                  style={{ 
                    fontSize: "12px", 
                    fontWeight: 800, 
                    color: "#ffffff", 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "6px",
                    width: "fit-content",
                    background: "rgba(255, 255, 255, 0.18)",
                    backdropFilter: "blur(8px)",
                    padding: "6px 14px",
                    borderRadius: "var(--radius-pill)",
                    border: "1px solid rgba(255, 255, 255, 0.35)",
                    transition: "var(--transition)"
                  }}
                  className="promo-cta-pill"
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
