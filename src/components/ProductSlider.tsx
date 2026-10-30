"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/data/siteData";

interface ProductSliderProps {
  title: string;
  badge?: string;
  products: Product[];
  id?: string;
}

export default function ProductSlider({ title, badge = "FEATURED", products, id }: ProductSliderProps) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(products.length - itemsPerPage, prev + 1));
  };

  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="section-wrapper-modern" id={id}>
      <div className="container">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            {title}
            <span className="section-pill-tag">{badge}</span>
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button 
              className="modern-action-btn"
              onClick={handlePrev}
              disabled={startIndex === 0}
              style={{ opacity: startIndex === 0 ? 0.4 : 1 }}
              aria-label="Previous Products"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              className="modern-action-btn"
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= products.length}
              style={{ opacity: startIndex + itemsPerPage >= products.length ? 0.4 : 1 }}
              aria-label="Next Products"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="products-modern-grid">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
