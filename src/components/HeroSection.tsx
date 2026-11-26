"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_HERO, DEFAULT_HERO_TILES, HeroTile } from "@/data/heroDefaults";

type HeroState = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  heroLink: string;
  heroTiles: HeroTile[];
};

export default function HeroSection() {
  // Start with defaults so the layout renders immediately, then swap in admin-edited values
  const [hero, setHero] = useState<HeroState>(DEFAULT_HERO);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/settings?_t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.success || !data.settings) return;
        const s = data.settings;
        const tiles: HeroTile[] =
          Array.isArray(s.heroTiles) && s.heroTiles.length > 0 ? s.heroTiles : DEFAULT_HERO_TILES;
        setHero({
          heroTitle: s.heroTitle || DEFAULT_HERO.heroTitle,
          heroSubtitle: s.heroSubtitle || DEFAULT_HERO.heroSubtitle,
          heroButtonText: s.heroButtonText || DEFAULT_HERO.heroButtonText,
          heroImage: s.heroImage || DEFAULT_HERO.heroImage,
          heroLink: s.heroLink || DEFAULT_HERO.heroLink,
          heroTiles: tiles,
        });
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="hero-mordern-section">
      <div className="container">
        <div className="hero-mordern-grid">
          {/* Main Hero Banner — full image background */}
          <Link href={hero.heroLink} className="hero-main-card" style={{ position: "relative", overflow: "hidden", display: "block" }}>
            {hero.heroImage && (
              <Image
                src={hero.heroImage}
                alt={hero.heroTitle}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                style={{ objectFit: "cover", objectPosition: "center" }}
                priority
              />
            )}
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
                {hero.heroTitle}
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
                {hero.heroSubtitle}
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
                {hero.heroButtonText}
              </span>
            </div>
          </Link>

          {/* Tile Cards — editable from admin */}
          <div className="modern-tiles-grid">
            {hero.heroTiles.map((tile, i) => (
              <Link
                key={`${tile.title}-${i}`}
                href={tile.link || "/shop"}
                className="modern-tile-card"
                style={{ position: "relative", overflow: "hidden", display: "block", borderRadius: "24px" }}
              >
                {tile.image && (
                  <Image
                    src={tile.image}
                    alt={tile.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                )}
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
