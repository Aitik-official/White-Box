"use client";

import React from "react";
import Image from "next/image";

export default function WhiteBoxLogo({ 
  height = 42, 
  variant = "light"
}: { 
  height?: number; 
  variant?: "light" | "dark";
}) {
  // Calculated width based on logo aspect ratio (694 / 219 ~= 3.16)
  const width = Math.round(height * 3.16);

  return (
    <div 
      style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        height, 
        position: "relative",
      }}
    >
      <Image 
        src="/whitebox-logo.png" 
        alt="WHITE BOX Logo" 
        width={width}
        height={height}
        style={{
          height: "100%",
          width: "auto",
          objectFit: "contain",
          display: "block"
        }}
        priority
      />
    </div>
  );
}
