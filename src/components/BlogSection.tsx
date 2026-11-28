"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageSquare, ArrowRight } from "lucide-react";

export default function BlogSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch("/api/blogs?published=true");
        const data = await res.json();
        if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setPosts(data.blogs.slice(0, 6));
        } else {
          setPosts([]);
        }
      } catch (e) {
        console.warn("Could not load blogs:", e);
        setPosts([]);
      } finally {
        setLoaded(true);
      }
    }
    loadBlogs();
  }, []);

  const displayPosts = posts;
  if (!loaded || displayPosts.length === 0) return null;

  return (
    <section className="section-wrapper-modern" id="blog" style={{ background: "transparent", padding: "48px 0" }}>
      <div className="container">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            From Our Tech Blog
            <span className="section-pill-tag">INSIGHTS</span>
          </h2>
          <Link
            href="/blog"
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--wb-blue)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            All Articles →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          {displayPosts.map((post: any) => {
            const href = post.slug ? `/blog/${post.slug}` : "/blog";
            const key = post._id || post.slug || post.id;
            return (
              <article
                key={key}
                className="blog-modern-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  transition: "var(--transition)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Link href={href} style={{ position: "relative", height: "200px", overflow: "hidden", background: "#f1f5f9", display: "block" }}>
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                      className="blog-card-img"
                    />
                  ) : null}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      background: "rgba(13, 27, 70, 0.75)",
                      backdropFilter: "blur(6px)",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "var(--radius-pill)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Calendar size={12} color="var(--wb-cyan)" />
                    {post.date}
                  </div>
                </Link>

                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <MessageSquare size={13} color="var(--wb-blue)" />
                      {post.comments || "0 Comments"}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 800,
                      lineHeight: 1.35,
                      marginBottom: "10px",
                      color: "var(--text-main)",
                      transition: "var(--transition)",
                    }}
                    className="blog-title-link"
                  >
                    <Link href={href}>{post.title}</Link>
                  </h3>

                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "18px", flex: 1 }}>
                    {post.excerpt}
                  </p>

                  <Link
                    href={href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      color: "var(--wb-blue)",
                      fontWeight: 800,
                      transition: "var(--transition)",
                    }}
                    className="blog-read-more"
                  >
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
