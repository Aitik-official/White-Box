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

  const [logoSrc, setLogoSrc] = React.useState(
    "https://res.cloudinary.com/rpdxkihi/image/upload/v1795245602/whitebox/brand/whitebox-logo.png"
  );

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
        src={logoSrc} 
        alt="WHITE BOX Logo" 
        width={width}
        height={height}
        onError={() => setLogoSrc("/whitebox-logo.png")}
        style={{
          width: "auto",
          height: "auto",
          maxHeight: `${height}px`,
          objectFit: "contain",
          display: "block"
        }}
        priority
      />
    </div>
  );
}
