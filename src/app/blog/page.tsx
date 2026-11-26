"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Calendar, MessageSquare, ArrowRight } from "lucide-react";

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/blogs?published=true&_t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.blogs)) setBlogs(data.blogs);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <CartDrawer />
      <Header />

      <main className="container" style={{ padding: "36px 20px 60px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0d1b46", marginBottom: "6px" }}>
            From Our Tech Blog
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Guides, tips, and insights from the WhiteBox team.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontWeight: 700 }}>Loading articles...</div>
        ) : blogs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <p style={{ color: "#64748b", fontWeight: 600 }}>No blog articles yet. Add some from the Admin Panel.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {blogs.map((post) => (
              <article
                key={post._id || post.slug}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Link href={`/blog/${post.slug}`} style={{ position: "relative", height: "190px", display: "block", background: "#f1f5f9" }}>
                  {post.image ? (
                    <Image src={post.image} alt={post.title} fill sizes="400px" style={{ objectFit: "cover" }} />
                  ) : null}
                </Link>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} color="#0066ff" /> {post.date}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <MessageSquare size={12} color="#0066ff" /> {post.comments || "0 Comments"}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "8px", lineHeight: 1.35 }}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, flex: 1, marginBottom: "14px" }}>
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ fontSize: "13px", fontWeight: 800, color: "#0066ff", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
