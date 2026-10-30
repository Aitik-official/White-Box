"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const HERO_CARDS = [
  {
    href: "/shop?department=Electronics%20%26%20Gadgets",
    image: "/banners/banner-hero.webp",
    alt: "Gaming Headset",
    label: "DISCOVER NOW",
    title: "Gaming Headset Brilliant Lighting Effect",
    subtitle: "Wireless Connection With TV, Computer, Laptop...",
    isMain: true,
  },
];

const TILE_CARDS = [
  {
    href: "/shop?category=Smartphones",
    image: "/banners/tile-1.webp",
    alt: "Pro Smartphone 5G",
    title: "Pro Smartphone 5G",
    category: "Cellphone & Tablets",
  },
  {
    href: "/shop?q=Galaxy",
    image: "/banners/tile-2.webp",
    alt: "Phone Galaxy S10",
    title: "Phone Galaxy S10",
    category: "Cellphone & Tablets",
  },
  {
    href: "/shop?category=Wireless%20Earbuds",
    image: "/banners/tile-3.webp",
    alt: "Wireless Earbuds",
    title: "Wireless Earbuds",
    category: "Wireless Earbuds",
  },
  {
    href: "/shop?department=Home%20%26%20Furniture",
    image: "/banners/tile-4.webp",
    alt: "Executive Lounge Chair",
    title: "Executive Lounge Chair",
    category: "Decor & Furniture",
  },
];

export default function HeroSection() {
  return (
    <section className="hero-mordern-section">
      <div className="container">
        <div className="hero-mordern-grid">
          {/* Main Hero Banner — full image background */}
          <Link href="/shop?department=Electronics%20%26%20Gadgets" className="hero-main-card" style={{ position: "relative", overflow: "hidden", display: "block" }}>
            <Image
              src="/banners/banner-hero.webp"
              alt="Gaming Headset"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
            {/* Gradient overlay for text legibility */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 65%, transparent 100%)",
                zIndex: 1,
              }}
            />
            <div className="hero-card-content" style={{ position: "relative", zIndex: 2, maxWidth: "420px" }}>
              <h1
                className="hero-card-title"
                style={{
                  fontSize: "38px",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: "-0.5px",
                  color: "#ffffff",
                  marginBottom: "12px",
                  textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                }}
              >
                Gaming Headset Brilliant Lighting Effect
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: "28px",
                  textShadow: "0 1px 6px rgba(0,0,0,0.3)",
                }}
              >
                Wireless Connection With TV, Computer, Laptop...
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "11px 32px",
                  borderRadius: "9999px",
                  border: "2px solid rgba(255,255,255,0.95)",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(6px)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "12px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                DISCOVER NOW
              </span>
            </div>
          </Link>

          {/* 4 Tile Cards */}
          <div className="modern-tiles-grid">
            {TILE_CARDS.map((tile) => (
              <Link
                key={tile.alt}
                href={tile.href}
                className="modern-tile-card"
                style={{ position: "relative", overflow: "hidden", display: "block", borderRadius: "24px" }}
              >
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                {/* Bottom gradient for text */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.20) 50%, transparent 100%)",
                    zIndex: 1,
                  }}
                />
                <div
                  className="tile-content"
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "18px",
                    zIndex: 2,
                  }}
                >
                  <h3
                    className="tile-title"
                    style={{
                      fontSize: "17px",
                      fontWeight: 800,
                      color: "#fff",
                      lineHeight: 1.25,
                      marginBottom: "2px",
                      textShadow: "0 1px 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    {tile.title}
                  </h3>
                  <p
                    className="tile-category"
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: 500,
                    }}
                  >
                    {tile.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
