"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Calendar, MessageSquare, ArrowLeft, User, ArrowRight } from "lucide-react";

export default function BlogDetailClient({
  blog,
  related = [],
}: {
  blog: any;
  related?: any[];
}) {
  const paragraphs = String(blog.content || blog.excerpt || "")
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <CartDrawer />
      <Header />

      <main>
        <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "14px 0" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "#0066ff", fontWeight: 600 }}>Home</Link>
              <span>/</span>
              <Link href="/blog" style={{ color: "#0066ff", fontWeight: 600 }}>Tech Blog</Link>
              <span>/</span>
              <span style={{ color: "#0f172a", fontWeight: 700 }}>{blog.title}</span>
            </div>
          </div>
        </div>

        <article className="container" style={{ padding: "36px 20px 60px", maxWidth: "860px" }}>
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#0066ff",
              marginBottom: "20px",
            }}
          >
            <ArrowLeft size={14} /> Back to all articles
          </Link>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={14} color="#0066ff" /> {blog.date}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <User size={14} color="#0066ff" /> {blog.author || "WhiteBox Team"}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <MessageSquare size={14} color="#0066ff" /> {blog.comments || "0 Comments"}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: "#0d1b46", lineHeight: 1.25, marginBottom: "20px" }}>
            {blog.title}
          </h1>

          {blog.image ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "min(420px, 55vw)",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "28px",
                background: "#e2e8f0",
              }}
            >
              <Image src={blog.image} alt={blog.title} fill sizes="860px" style={{ objectFit: "cover" }} />
            </div>
          ) : null}

          {blog.excerpt ? (
            <p style={{ fontSize: "17px", fontWeight: 600, color: "#334155", lineHeight: 1.6, marginBottom: "24px" }}>
              {blog.excerpt}
            </p>
          ) : null}

          <div style={{ fontSize: "15px", color: "#475569", lineHeight: 1.8 }}>
            {paragraphs.length > 0 ? (
              paragraphs.map((p: string, i: number) => (
                <p key={i} style={{ marginBottom: "16px" }}>
                  {p}
                </p>
              ))
            ) : (
              <p>Full article content coming soon.</p>
            )}
          </div>
        </article>

        {related.length > 0 && (
          <section className="container" style={{ padding: "0 20px 60px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0d1b46", marginBottom: "20px" }}>
              More From Our Tech Blog
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              {related.map((post) => (
                <Link
                  key={post._id || post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ position: "relative", height: "150px", background: "#f1f5f9" }}>
                    {post.image ? (
                      <Image src={post.image} alt={post.title} fill sizes="300px" style={{ objectFit: "cover" }} />
                    ) : null}
                  </div>
                  <div style={{ padding: "16px" }}>
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>{post.date}</div>
                    <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "8px", lineHeight: 1.35 }}>
                      {post.title}
                    </h3>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#0066ff", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      Read Article <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
