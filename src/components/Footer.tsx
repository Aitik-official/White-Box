"use client";

import React from "react";
import Link from "next/link";
import { 
  Truck, 
  ShieldCheck, 
  Headphones, 
  RotateCcw, 
  Smile, 
  PhoneCall
} from "lucide-react";
import WhiteBoxLogo from "./WhiteBoxLogo";

export default function Footer() {
  return (
    <footer className="modern-footer">
      <div className="container">
        {/* Modern Colorful 5 Guarantees Strip matching WhiteBox gradient hues */}
        <div className="features-modern-bar">
          <div className="features-modern-grid">
            <div className="feature-modern-item">
              <div className="feature-icon-box" style={{ background: "linear-gradient(135deg, #00b4d8 0%, #0066ff 100%)" }}>
                <Truck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "2px" }}>Free Shipping</h4>
                <p style={{ fontSize: "12px", color: "#64748b" }}>On all orders above $120</p>
              </div>
            </div>

            <div className="feature-modern-item">
              <div className="feature-icon-box" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "2px" }}>Safe Payment</h4>
                <p style={{ fontSize: "12px", color: "#64748b" }}>100% secure checkout</p>
              </div>
            </div>

            <div className="feature-modern-item">
              <div className="feature-icon-box" style={{ background: "linear-gradient(135deg, #7928ca 0%, #d91b5c 100%)" }}>
                <Headphones size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "2px" }}>24/7 Support</h4>
                <p style={{ fontSize: "12px", color: "#64748b" }}>Dedicated live specialists</p>
              </div>
            </div>

            <div className="feature-modern-item">
              <div className="feature-icon-box" style={{ background: "linear-gradient(135deg, #ff5722 0%, #ff3d00 100%)" }}>
                <RotateCcw size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "2px" }}>Money Back</h4>
                <p style={{ fontSize: "12px", color: "#64748b" }}>30-day hassle-free returns</p>
              </div>
            </div>

            <div className="feature-modern-item">
              <div className="feature-icon-box" style={{ background: "linear-gradient(135deg, #ec407a 0%, #b71c1c 100%)" }}>
                <Smile size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "2px" }}>WhiteBox Quality</h4>
                <p style={{ fontSize: "12px", color: "#64748b" }}>Factory certified devices</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Top Links */}
        <div className="footer-modern-grid">
          <div>
            <div style={{ marginBottom: "20px" }}>
              <WhiteBoxLogo height={38} variant="light" />
            </div>
            
            <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "20px" }}>
              WhiteBox is your premier destination for high-performance consumer hardware, precision tools, and smart lifestyle gear.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ff8a65", fontWeight: 700 }}>
              <PhoneCall size={18} />
              <span>06-900-6789-00</span>
            </div>
          </div>

          <div>
            <h4 className="footer-modern-title">Information</h4>
            <ul style={{ listStyle: "none" }}>
              <li className="footer-link-item"><Link href="#shipping">Shipping & Returns</Link></li>
              <li className="footer-link-item"><Link href="#contact">Contact Us</Link></li>
              <li className="footer-link-item"><Link href="#blog">Blog & Tech Guides</Link></li>
              <li className="footer-link-item"><Link href="#sitemap">Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-modern-title">Brands</h4>
            <ul style={{ listStyle: "none" }}>
              <li className="footer-link-item"><Link href="#brands">WhiteBox Hardware</Link></li>
              <li className="footer-link-item"><Link href="#brands">OFS Premium</Link></li>
              <li className="footer-link-item"><Link href="#brands">Common Good</Link></li>
              <li className="footer-link-item"><Link href="#brands">Sagaform Tech</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-modern-title">Categories</h4>
            <ul style={{ listStyle: "none" }}>
              <li className="footer-link-item"><Link href="#flash-deals">Flash Deals</Link></li>
              <li className="footer-link-item"><Link href="#categories">Gaming Controllers</Link></li>
              <li className="footer-link-item"><Link href="#categories">Power Saws & Drills</Link></li>
              <li className="footer-link-item"><Link href="#categories">Smart Audio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-modern-title">Sign Up For WhiteBox VIP</h4>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>
              Join 60,000+ members and get early access to flash drops and exclusive weekend coupons.
            </p>

            <form 
              style={{ display: "flex" }}
              onSubmit={(e) => {
                e.preventDefault();
                alert("Welcome to the WhiteBox VIP club!");
              }}
            >
              <input 
                type="email" 
                placeholder="Enter email address..." 
                className="modern-newsletter-input" 
                required 
              />
              <button type="submit" className="modern-newsletter-btn">
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "24px", fontSize: "13px", color: "#64748b", flexWrap: "wrap", gap: "12px" }}>
          <div>
            &copy; 2026 WHITE BOX Inc. All rights reserved. Powered by Next.js & modern UI architecture.
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ background: "#0d1b46", border: "1px solid #1e293b", padding: "4px 10px", borderRadius: "6px", color: "#cbd5e1", fontSize: "11px", fontWeight: 700 }}>VISA</span>
            <span style={{ background: "#0d1b46", border: "1px solid #1e293b", padding: "4px 10px", borderRadius: "6px", color: "#cbd5e1", fontSize: "11px", fontWeight: 700 }}>MASTERCARD</span>
            <span style={{ background: "#0d1b46", border: "1px solid #1e293b", padding: "4px 10px", borderRadius: "6px", color: "#cbd5e1", fontSize: "11px", fontWeight: 700 }}>PAYPAL</span>
            <span style={{ background: "#0d1b46", border: "1px solid #1e293b", padding: "4px 10px", borderRadius: "6px", color: "#cbd5e1", fontSize: "11px", fontWeight: 700 }}>APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
