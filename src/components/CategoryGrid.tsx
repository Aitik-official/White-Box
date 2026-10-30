"use client";

import React from "react";
import Link from "next/link";
import { 
  Sliders, 
  Zap, 
  Radio, 
  Disc, 
  Square, 
  Scissors, 
  Maximize2, 
  Wrench 
} from "lucide-react";
import { CATEGORIES } from "@/data/siteData";

const iconMap: Record<string, React.ReactNode> = {
  Sliders: <Sliders size={24} />,
  Zap: <Zap size={24} />,
  Radio: <Radio size={24} />,
  Disc: <Disc size={24} />,
  Square: <Square size={24} />,
  Scissors: <Scissors size={24} />,
  Maximize2: <Maximize2 size={24} />,
  Wrench: <Wrench size={24} />,
};

export default function CategoryGrid() {
  return (
    <section className="section-wrapper-modern" id="categories">
      <div className="container">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            Popular Categories
            <span className="section-pill-tag">EXPLORE</span>
          </h2>
          <Link 
            href="/shop" 
            style={{ 
              fontSize: "13px", 
              fontWeight: 700, 
              color: "var(--wb-blue)" 
            }}
          >
            View All Categories →
          </Link>
        </div>

        <div className="category-modern-strip">
          {CATEGORIES.map((cat, idx) => (
            <Link key={idx} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-modern-card">
              <div 
                className="category-icon-circle"
                style={{ background: cat.gradient }}
              >
                {iconMap[cat.icon] || <Wrench size={24} />}
              </div>
              <h4 className="category-title-modern">{cat.name}</h4>
              <span className="category-subtitle-modern">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
