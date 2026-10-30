import React from "react";
import { notFound } from "next/navigation";
import { ALL_PRODUCTS, getProductBySlug } from "@/data/siteData";
import { getProductBySlugFromDB } from "@/lib/productsService";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return ALL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Pull live product data from MongoDB database
  let product = await getProductBySlugFromDB(slug);
  
  if (!product) {
    product = getProductBySlug(slug) || null;
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
