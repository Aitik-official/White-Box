import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlugFromDB, getProductsFromDB } from "@/lib/productsService";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Pull live product data from MongoDB database
  const product = await getProductBySlugFromDB(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products strictly from live database
  let relatedProducts: any[] = [];
  try {
    const deptProducts = await getProductsFromDB({ department: product.department });
    relatedProducts = deptProducts.filter((p: any) => p.slug !== slug).slice(0, 4);
  } catch (e) {
    relatedProducts = [];
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
