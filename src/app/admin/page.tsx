"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import WhiteBoxLogo from "@/components/WhiteBoxLogo";
import { DEFAULT_HERO, DEFAULT_HERO_TILES } from "@/data/heroDefaults";
import { uploadImage } from "@/lib/uploadImage";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  ExternalLink, 
  RefreshCw,
  Search,
  CheckCircle,
  DollarSign,
  Users,
  Layers,
  FolderPlus,
  Upload,
  Image as ImageIcon,
  Tag,
  X,
  PlusCircle,
  Smartphone,
  Gamepad2,
  Wrench,
  Armchair,
  Watch,
  Scissors,
  Laptop,
  Tv,
  Headphones,
  Camera,
  Shirt,
  Sparkles,
  Loader2,
  ChevronDown,
  FileText
} from "lucide-react";

const ICON_OPTIONS = [
  { name: "Smartphone", icon: <Smartphone size={16} /> },
  { name: "Gamepad2", icon: <Gamepad2 size={16} /> },
  { name: "Wrench", icon: <Wrench size={16} /> },
  { name: "Sliders", icon: <Sliders size={16} /> },
  { name: "Armchair", icon: <Armchair size={16} /> },
  { name: "Watch", icon: <Watch size={16} /> },
  { name: "Scissors", icon: <Scissors size={16} /> },
  { name: "Laptop", icon: <Laptop size={16} /> },
  { name: "Tv", icon: <Tv size={16} /> },
  { name: "Headphones", icon: <Headphones size={16} /> },
  { name: "Camera", icon: <Camera size={16} /> },
  { name: "Shirt", icon: <Shirt size={16} /> },
  { name: "Sparkles", icon: <Sparkles size={16} /> },
  { name: "Package", icon: <Package size={16} /> },
  { name: "Layers", icon: <Layers size={16} /> },
];

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "orders" | "blogs" | "settings">("overview");

  // Check saved session auth
  useEffect(() => {
    if (sessionStorage.getItem("wb_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("wb_admin_auth", "true");
      } else {
        setPinError(data.error || "Invalid PIN");
      }
    } catch {
      setPinError("Connection error");
    }
  };

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [isAddBlogMode, setIsAddBlogMode] = useState(false);
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false);
  const [settings, setSettings] = useState<any>({
    heroTitle: "",
    heroSubtitle: "",
    heroButtonText: "",
    heroImage: "",
    heroLink: "",
    heroTiles: DEFAULT_HERO_TILES,
    bannerNotice: "",
    supportPhone: "",
    dealsTimerHours: 24,
  });
  const [uploadingSettingsImage, setUploadingSettingsImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Search filters
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Product Add / Edit Modal state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState("");
  const [isCustomMainCat, setIsCustomMainCat] = useState(false);
  const [isCustomMiniCat, setIsCustomMiniCat] = useState(false);
  const [mainCatDropdownOpen, setMainCatDropdownOpen] = useState(false);
  const [miniCatDropdownOpen, setMiniCatDropdownOpen] = useState(false);
  const [mainCatMenuPos, setMainCatMenuPos] = useState<{ top: number; left: number; width: number; openUp: boolean } | null>(null);
  const [miniCatMenuPos, setMiniCatMenuPos] = useState<{ top: number; left: number; width: number; openUp: boolean } | null>(null);
  const mainCatTriggerRef = useRef<HTMLButtonElement>(null);
  const miniCatTriggerRef = useRef<HTMLButtonElement>(null);

  // Category Modal state
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    slug: "",
    icon: "Smartphone",
    subcategories: "",
  });
  const [isAddMiniOpen, setIsAddMiniOpen] = useState(false);
  const [selectedCategoryForMini, setSelectedCategoryForMini] = useState<any | null>(null);
  const [newMiniCategoryName, setNewMiniCategoryName] = useState("");

  // Bulk selection states for all admin pages
  const [selectedProductIds, setSelectedProductIds] = useState<(string | number)[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const [statsRes, prodRes, ordersRes, setRes, catRes, blogRes] = await Promise.all([
        fetch(`/api/admin/stats?_t=${timestamp}`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
        fetch(`/api/products?_t=${timestamp}`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
        fetch(`/api/orders?_t=${timestamp}`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
        fetch(`/api/settings?_t=${timestamp}`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
        fetch(`/api/categories?_t=${timestamp}`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
        fetch(`/api/blogs?_t=${timestamp}`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({})),
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (prodRes.products) setProducts(prodRes.products);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (setRes.settings) {
        setSettings({
          ...DEFAULT_HERO,
          ...setRes.settings,
          heroTiles:
            Array.isArray(setRes.settings.heroTiles) && setRes.settings.heroTiles.length > 0
              ? setRes.settings.heroTiles
              : DEFAULT_HERO_TILES,
        });
      }
      if (catRes.categories) setCategories(catRes.categories);
      if (blogRes.blogs) setBlogs(blogRes.blogs);
    } catch (e) {
      console.error(e);
      notify("Error loading data from MongoDB");
    } finally {
      setLoading(false);
    }
  };

  const loadCategoriesData = async () => {
    try {
      const res = await fetch(`/api/categories?_t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Image Upload Handler (Cloudinary + local fallback)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgressMsg("Uploading image to Cloudinary...");
    try {
      const url = await uploadImage(file, 1400);
      notify("Image uploaded successfully!");
      if (isGallery) {
        setEditingProduct((prev: any) => ({
          ...prev,
          gallery: [...(prev.gallery || []), url],
        }));
      } else {
        setEditingProduct((prev: any) => ({
          ...prev,
          img: url,
          gallery: prev.gallery && prev.gallery.length > 0 ? prev.gallery : [url],
        }));
      }
    } catch (err) {
      console.error(err);
      notify(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setUploadingImage(false);
      setUploadProgressMsg("");
      e.target.value = "";
    }
  };

  // Save product changes (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isAddMode ? "POST" : "PUT";
      const dept = (editingProduct.department || editingProduct.mainCategory || categories[0]?.name || "").trim();
      // Only keep a real mini — never copy main category name or product title into mini
      let mini = (editingProduct.miniCategory || "").trim();
      if (!mini || mini === dept || mini === (editingProduct.title || "").trim()) {
        mini = "";
      }

      const homeSec = editingProduct.homeSection || "all";
      let homeSecs = Array.isArray(editingProduct.homeSections) ? editingProduct.homeSections.filter(Boolean) : [];
      if (homeSec === "all" || homeSecs.includes("all") || homeSecs.length === 0) {
        homeSecs = ["top-selling", "flash-deals", "hot-trending", "top-featured"];
      } else if (homeSec === "none") {
        homeSecs = [];
      }

      const payload = {
        ...editingProduct,
        department: dept,
        mainCategory: dept,
        category: mini || dept,
        miniCategory: mini,
        homeSection: homeSec,
        homeSections: homeSecs,
      };

      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        notify(isAddMode ? "Product created successfully!" : "Product updated!");
        setEditingProduct(null);
        setIsAddMode(false);
        loadAllData();
      } else {
        notify(data.error || "Failed to save product");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to connect to database");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number, _id?: string) => {
    if (!confirm("Are you sure you want to delete this product from MongoDB?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}&_id=${_id || ""}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notify("Product deleted from database");
        setProducts((prev) => prev.filter((p) => p.id !== id && (!p._id || p._id !== _id)));
        setSelectedProductIds((prev) => prev.filter((item) => item !== id && item !== _id));
      } else {
        notify(data.error || "Failed to delete product");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to delete product");
    }
  };

  // Toggle selection for single product
  const toggleSelectProduct = (idVal: string | number) => {
    setSelectedProductIds((prev) =>
      prev.includes(idVal) ? prev.filter((id) => id !== idVal) : [...prev, idVal]
    );
  };

  // Select all or deselect all filtered products
  const toggleSelectAllProducts = (filteredList: any[]) => {
    if (selectedProductIds.length === filteredList.length && filteredList.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredList.map((p) => p._id || p.id));
    }
  };

  // Bulk delete products
  const handleBulkDeleteProducts = async () => {
    if (selectedProductIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products from MongoDB?`)) return;

    try {
      const ids: number[] = [];
      const _ids: string[] = [];
      selectedProductIds.forEach((val) => {
        if (typeof val === "number") ids.push(val);
        else if (typeof val === "string" && val.length === 24) _ids.push(val);
        else if (!isNaN(Number(val))) ids.push(Number(val));
        else _ids.push(String(val));
      });

      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, _ids }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`${data.deletedCount || selectedProductIds.length} products deleted successfully!`);
        setProducts((prev) => prev.filter((p) => !selectedProductIds.includes(p.id) && !selectedProductIds.includes(p._id)));
        setSelectedProductIds([]);
      } else {
        notify(data.error || "Failed to bulk delete products");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to connect to server");
    }
  };

  // Toggle selection for single category
  const toggleSelectCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Select all or deselect all filtered categories
  const toggleSelectAllCategories = (filteredList: any[]) => {
    if (selectedCategoryIds.length === filteredList.length && filteredList.length > 0) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(filteredList.map((c) => c._id));
    }
  };

  // Bulk delete categories
  const handleBulkDeleteCategories = async () => {
    if (selectedCategoryIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedCategoryIds.length} selected Main Categories and all their mini categories?`)) return;

    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedCategoryIds }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`${data.deletedCount || selectedCategoryIds.length} categories deleted successfully!`);
        setCategories((prev) => prev.filter((c) => !selectedCategoryIds.includes(c._id)));
        setSelectedCategoryIds([]);
        loadCategoriesData();
      } else {
        notify(data.error || "Failed to bulk delete categories");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to connect to server");
    }
  };

  // Bulk clear mini categories for a specific category
  const handleBulkClearMinis = async (catId: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete all mini categories inside "${catName}"?`)) return;
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: catId, subcategories: [] }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`All mini categories cleared from ${catName}`);
        setCategories((prev) =>
          prev.map((c) => (c._id === catId ? { ...c, subcategories: [] } : c))
        );
        loadCategoriesData();
      } else {
        notify(data.error || "Failed to clear mini categories");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to connect to server");
    }
  };

  // Toggle selection for single order
  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Select all or deselect all orders
  const toggleSelectAllOrders = (orderList: any[]) => {
    if (selectedOrderIds.length === orderList.length && orderList.length > 0) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orderList.map((o) => o.orderId));
    }
  };

  // Delete single order
  const handleDeleteOrder = async (orderId: string, _id?: string) => {
    if (!confirm(`Are you sure you want to delete order "${orderId}"?`)) return;
    try {
      const res = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}&id=${_id || ""}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notify(`Order ${orderId} deleted successfully!`);
        setOrders((prev) => prev.filter((o) => o.orderId !== orderId && o._id !== _id));
        setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
      } else {
        notify(data.error || "Failed to delete order");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to delete order");
    }
  };

  // Bulk delete orders
  const handleBulkDeleteOrders = async () => {
    if (selectedOrderIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedOrderIds.length} selected orders from MongoDB?`)) return;

    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrderIds }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`${data.deletedCount || selectedOrderIds.length} orders deleted successfully!`);
        setOrders((prev) => prev.filter((o) => !selectedOrderIds.includes(o.orderId)));
        setSelectedOrderIds([]);
      } else {
        notify(data.error || "Failed to bulk delete orders");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to connect to server");
    }
  };

  // Create Main Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryData.name.trim()) {
      notify("Category name is required");
      return;
    }
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategoryData),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Main Category "${newCategoryData.name}" created!`);
        setIsAddCategoryOpen(false);
        setNewCategoryData({ name: "", slug: "", icon: "Smartphone", subcategories: "" });
        loadCategoriesData();
      } else {
        notify(data.error || "Failed to create category");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to connect to server");
    }
  };

  // Add Mini Category to Main Category
  const handleAddMiniCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryForMini || !newMiniCategoryName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_mini",
          categoryId: selectedCategoryForMini._id,
          miniCategory: newMiniCategoryName.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Mini Category added to ${selectedCategoryForMini.name}!`);
        setIsAddMiniOpen(false);
        setNewMiniCategoryName("");
        setSelectedCategoryForMini(null);
        loadCategoriesData();
      } else {
        notify(data.error || "Failed to add mini category");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to connect to server");
    }
  };

  // Delete Mini Category
  const handleDeleteMiniCategory = async (categoryId: string, miniName: string) => {
    if (!confirm(`Are you sure you want to remove mini category "${miniName}"?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${categoryId}&miniCategory=${encodeURIComponent(miniName)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notify(`Mini category "${miniName}" removed!`);
        setCategories((prev) =>
          prev.map((c) =>
            c._id === categoryId
              ? { ...c, subcategories: (c.subcategories || []).filter((s: string) => s !== miniName) }
              : c
          )
        );
        loadCategoriesData();
      } else {
        notify(data.error || "Failed to remove mini category");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to remove mini category");
    }
  };

  // Delete Main Category
  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Delete Main Category "${categoryName}" and all its mini categories?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${categoryId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notify(`Main Category "${categoryName}" deleted!`);
        setCategories((prev) => prev.filter((c) => c._id !== categoryId));
        setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
        loadCategoriesData();
      } else {
        notify(data.error || "Failed to delete category");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to delete category");
    }
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBlog) return;
    setUploadingBlogImage(true);
    try {
      const url = await uploadImage(file, 1600);
      setEditingBlog({ ...editingBlog, image: url });
      notify("Blog image uploaded!");
    } catch (err) {
      console.error(err);
      notify(err instanceof Error ? err.message : "Error uploading blog image");
    } finally {
      setUploadingBlogImage(false);
      e.target.value = "";
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title?.trim()) {
      notify("Blog title is required");
      return;
    }
    try {
      const method = isAddBlogMode ? "POST" : "PUT";
      const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBlog),
      });
      const data = await res.json();
      if (data.success) {
        notify(isAddBlogMode ? "Blog published!" : "Blog updated!");
        setEditingBlog(null);
        setIsAddBlogMode(false);
        loadAllData();
      } else {
        notify(data.error || "Failed to save blog");
      }
    } catch (err) {
      console.error(err);
      notify("Error saving blog");
    }
  };

  const handleDeleteBlog = async (blogId: string, title: string) => {
    if (!confirm(`Delete blog "${title}"?`)) return;
    try {
      const res = await fetch(`/api/blogs?id=${blogId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        notify(`Blog "${title}" deleted`);
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      } else {
        notify(data.error || "Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      notify("Failed to delete blog");
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Order ${orderId} updated to ${status}`);
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
        );
      }
    } catch (e) {
      console.error(e);
      notify("Failed to update order");
    }
  };

  // Upload an image for a homepage hero/tile field (key identifies the field for the spinner)
  const uploadSettingsImage = async (file: File, key: string, apply: (url: string) => void) => {
    setUploadingSettingsImage(key);
    try {
      // Hero banner can be wider than the small tiles
      const url = await uploadImage(file, key === "hero" ? 1920 : 1000);
      apply(url);
      notify("Image uploaded! Click Save & Apply Live Changes to publish.");
    } catch (err) {
      console.error(err);
      notify(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setUploadingSettingsImage(null);
    }
  };

  // Image field: live preview + URL input + upload from device
  const renderSettingsImageField = (key: string, label: string, value: string, onChange: (url: string) => void) => {
    const isUploading = uploadingSettingsImage === key;
    return (
      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>{label}</label>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <div style={{ width: "140px", height: "84px", borderRadius: "8px", overflow: "hidden", background: "#f1f5f9", border: "1px solid var(--border-card)", flexShrink: 0, position: "relative" }}>
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>No image</span>
            )}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              type="text"
              value={value}
              placeholder="https://... or upload from device"
              onChange={(e) => onChange(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none", fontSize: "13px" }}
            />
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                width: "fit-content",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "var(--wb-navy)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
                cursor: uploadingSettingsImage ? "not-allowed" : "pointer",
                opacity: uploadingSettingsImage && !isUploading ? 0.6 : 1,
              }}
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              <span>{isUploading ? "Uploading..." : "Upload from device"}</span>
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={!!uploadingSettingsImage}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) uploadSettingsImage(file, key, onChange);
                }}
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

  // Update one of the four homepage side tiles
  const setTileField = (index: number, patch: Record<string, string>) => {
    setSettings((prev: any) => ({
      ...prev,
      heroTiles: (prev.heroTiles || DEFAULT_HERO_TILES).map((t: any, i: number) => (i === index ? { ...t, ...patch } : t)),
    }));
  };

  // Save frontend site settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notify("Frontend website settings updated in MongoDB!");
      } else {
        notify(data.error || "Failed to update settings");
      }
    } catch (e) {
      console.error(e);
      notify("Failed to update settings");
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.department?.toLowerCase().includes(q)
    );
  });

  const filteredCategories = categories.filter((c) => {
    if (!categorySearch.trim()) return true;
    const q = categorySearch.toLowerCase();
    const matchesName = c.name?.toLowerCase().includes(q);
    const matchesSub = c.subcategories?.some((s: string) => s.toLowerCase().includes(q));
    return matchesName || matchesSub;
  });

  // Selected category in product modal for mini-category filtering
  const currentSelectedMainCat = categories.find(
    (c) => c.name === (editingProduct?.department || editingProduct?.mainCategory)
  );
  const availableMiniCategories = currentSelectedMainCat?.subcategories || [];

  const closeCatDropdowns = () => {
    setMainCatDropdownOpen(false);
    setMiniCatDropdownOpen(false);
    setMainCatMenuPos(null);
    setMiniCatMenuPos(null);
  };

  const openFixedDropdown = (
    trigger: HTMLElement | null,
    setOpen: (v: boolean) => void,
    setPos: (p: { top: number; left: number; width: number; openUp: boolean } | null) => void,
    currentlyOpen: boolean
  ) => {
    if (currentlyOpen) {
      setOpen(false);
      setPos(null);
      return;
    }
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuMaxH = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < menuMaxH && rect.top > menuMaxH;
    setPos({
      top: openUp ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 180),
      openUp,
    });
    setOpen(true);
  };

  // Close category dropdowns on outside click / scroll / resize
  useEffect(() => {
    if (!mainCatDropdownOpen && !miniCatDropdownOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (mainCatTriggerRef.current?.contains(t)) return;
      if (miniCatTriggerRef.current?.contains(t)) return;
      const menus = document.querySelectorAll("[data-cat-dropdown-menu]");
      for (const m of menus) {
        if (m.contains(t)) return;
      }
      closeCatDropdowns();
    };
    const onScrollOrResize = () => closeCatDropdowns();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("resize", onScrollOrResize);
    // Close when the modal body scrolls (capture so nested overflow is caught)
    document.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [mainCatDropdownOpen, miniCatDropdownOpen]);

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--wb-navy)", fontFamily: "var(--font-family)", padding: "20px" }}>
        <div style={{ background: "#ffffff", borderRadius: "16px", padding: "40px", maxWidth: "420px", width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ marginBottom: "20px" }}>
            <WhiteBoxLogo height={42} variant="dark" />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "6px" }}>
            Admin Access Required
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
            Enter your WhiteBox security PIN to access the database management panel.
          </p>

          <form onSubmit={handlePinSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter Admin PIN..."
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                border: "1.5px solid var(--border-card)",
                fontSize: "15px",
                textAlign: "center",
                outline: "none",
                letterSpacing: "3px"
              }}
            />

            {pinError && (
              <div style={{ color: "#ef4444", fontSize: "12px", fontWeight: 700 }}>
                {pinError}
              </div>
            )}

            <button
              type="submit"
              className="checkout-btn"
              style={{ padding: "14px", marginTop: "4px" }}
            >
              Verify PIN & Enter
            </button>

            <Link href="/" style={{ fontSize: "13px", color: "var(--wb-blue)", fontWeight: 700, marginTop: "8px" }}>
              ← Return to Store
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout-container" style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "var(--font-family)" }}>
      {/* Toast Alert */}
      {toast && (
        <div 
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            background: "var(--wb-navy)",
            color: "#ffffff",
            padding: "14px 24px",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 9999,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside 
        className="admin-sidebar"
        style={{
          width: "280px",
          background: "var(--wb-navy)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0
        }}
      >
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <WhiteBoxLogo height={36} variant="dark" />
          <div style={{ fontSize: "11px", color: "var(--wb-cyan)", fontWeight: 800, marginTop: "8px", letterSpacing: "1px" }}>
            CENTRAL ADMIN PANEL
          </div>
        </div>

        <nav style={{ padding: "20px 14px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "overview" ? "#ffffff" : "#94a3b8",
              background: activeTab === "overview" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <LayoutDashboard size={18} />
            Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab("products")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "products" ? "#ffffff" : "#94a3b8",
              background: activeTab === "products" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <Package size={18} />
            Manage Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "categories" ? "#ffffff" : "#94a3b8",
              background: activeTab === "categories" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <Layers size={18} />
            Categories (Main & Mini) ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "orders" ? "#ffffff" : "#94a3b8",
              background: activeTab === "orders" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <ShoppingBag size={18} />
            Orders & Sales ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("blogs")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "blogs" ? "#ffffff" : "#94a3b8",
              background: activeTab === "blogs" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <FileText size={18} />
            Tech Blog ({blogs.length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: activeTab === "settings" ? "#ffffff" : "#94a3b8",
              background: activeTab === "settings" ? "var(--grad-box)" : "transparent",
              fontWeight: 700,
              fontSize: "14px",
              width: "100%",
              textAlign: "left"
            }}
          >
            <Sliders size={18} />
            Frontend Content & Banners
          </button>
        </nav>

        <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.08)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700
            }}
          >
            <span>View Live Website</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content" style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        {/* Header Bar */}
        <div className="admin-header-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 900, color: "var(--wb-navy)" }}>
              {activeTab === "overview" && "Store Analytics & Overview"}
              {activeTab === "products" && "Product Catalog Manager"}
              {activeTab === "categories" && "Main & Mini Categories Manager"}
              {activeTab === "orders" && "Customer Orders"}
              {activeTab === "blogs" && "Tech Blog Manager"}
              {activeTab === "settings" && "Frontend Hero & Settings"}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Directly connected to MongoDB Atlas (<code style={{ color: "var(--wb-blue)" }}>whitebox_db</code>)
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={loadAllData}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffffff",
                padding: "10px 18px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-card)",
                fontWeight: 700,
                fontSize: "13px",
                color: "var(--text-main)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <RefreshCw size={14} />
              Sync DB
            </button>

            {activeTab === "products" && (
              <button
                onClick={() => {
                  setIsAddMode(true);
                  setIsCustomMainCat(false);
                  setIsCustomMiniCat(false);
                  closeCatDropdowns();
                  const firstCat = categories[0];
                  setEditingProduct({
                    title: "",
                    slug: "",
                    price: "₹1,999",
                    rawPrice: 1999,
                    oldPrice: "₹2,499",
                    brand: "WhiteBox",
                    vendor: "WhiteBox Official",
                    department: firstCat?.name || "",
                    mainCategory: firstCat?.name || "",
                    category: firstCat?.name || "",
                    miniCategory: "",
                    img: "",
                    gallery: [],
                    description: "Premium performance crafted with high precision and durability.",
                    stockCount: 50,
                    inStock: true,
                    homeSection: "all",
                    homeSections: ["top-selling", "flash-deals", "hot-trending", "top-featured"],
                    tag: "NEW",
                    tagColor: "#10b981"
                  });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--grad-box)",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 800,
                  fontSize: "13px",
                  boxShadow: "0 4px 12px rgba(217, 27, 92, 0.3)"
                }}
              >
                <Plus size={16} />
                Add New Product
              </button>
            )}

            {activeTab === "categories" && (
              <button
                onClick={() => {
                  setNewCategoryData({
                    name: "",
                    slug: "",
                    icon: "Smartphone",
                    subcategories: "",
                  });
                  setIsAddCategoryOpen(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--grad-box)",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 800,
                  fontSize: "13px",
                  boxShadow: "0 4px 12px rgba(217, 27, 92, 0.3)"
                }}
              >
                <FolderPlus size={16} />
                Add Main Category
              </button>
            )}

            {activeTab === "blogs" && (
              <button
                onClick={() => {
                  setIsAddBlogMode(true);
                  setEditingBlog({
                    title: "",
                    excerpt: "",
                    content: "",
                    image: "",
                    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                    comments: "0 Comments",
                    author: "WhiteBox Team",
                    published: true,
                  });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--grad-box)",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 800,
                  fontSize: "13px",
                  boxShadow: "0 4px 12px rgba(217, 27, 92, 0.3)"
                }}
              >
                <Plus size={16} />
                Add Blog Article
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            {/* Top Stat Cards */}
            <div className="admin-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", marginBottom: "32px" }}>
              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
                  <span>Total Revenue</span>
                  <DollarSign size={18} color="#10b981" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", marginTop: "10px" }}>
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
                  <span>Active Products</span>
                  <Package size={18} color="var(--wb-blue)" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", marginTop: "10px" }}>
                  {stats.totalProducts}
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
                  <span>Main Categories</span>
                  <Layers size={18} color="var(--wb-cyan)" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", marginTop: "10px" }}>
                  {categories.length}
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
                  <span>Customer Orders</span>
                  <ShoppingBag size={18} color="var(--wb-purple)" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", marginTop: "10px" }}>
                  {stats.totalOrders}
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
                  <span>Registered Users</span>
                  <Users size={18} color="var(--wb-orange)" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--wb-navy)", marginTop: "10px" }}>
                  {stats.totalUsers}
                </div>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid var(--border-card)", marginBottom: "32px", display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--wb-navy)" }}>Category & Product Architecture</h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Manage Main Categories (Departments) and Mini Categories (Subcategories), then link products with images.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("categories")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "#0066ff",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700
                }}
              >
                <Layers size={16} /> Manage Categories
              </button>
              <button
                onClick={() => {
                  setActiveTab("products");
                  setIsAddMode(true);
                  setIsCustomMainCat(false);
                  setIsCustomMiniCat(false);
                  closeCatDropdowns();
                  const firstCat = categories[0];
                  setEditingProduct({
                    title: "",
                    price: "₹1,999",
                    rawPrice: 1999,
                    brand: "WhiteBox",
                    vendor: "WhiteBox Official",
                    department: firstCat?.name || "",
                    mainCategory: firstCat?.name || "",
                    category: firstCat?.name || "",
                    miniCategory: "",
                    img: "",
                    gallery: [],
                    description: "Crafted for high performance.",
                    stockCount: 50,
                    inStock: true,
                    homeSection: "all",
                    homeSections: ["top-selling", "flash-deals", "hot-trending", "top-featured"],
                  });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "var(--grad-box)",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700
                }}
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Recent Orders in MongoDB */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid var(--border-card)", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "16px" }}>
                Latest Live Orders in MongoDB
              </h3>
              {orders.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No orders placed yet. Place an order on the checkout page to see it appear here in real time!</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-card)", color: "var(--text-muted)" }}>
                        <th style={{ padding: "12px" }}>Order ID</th>
                        <th style={{ padding: "12px" }}>Customer</th>
                        <th style={{ padding: "12px" }}>Items</th>
                        <th style={{ padding: "12px" }}>Total</th>
                        <th style={{ padding: "12px" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                          <td style={{ padding: "12px", fontWeight: 800, color: "var(--wb-blue)" }}>{o.orderId}</td>
                          <td style={{ padding: "12px" }}>{o.customerName} ({o.customerEmail})</td>
                          <td style={{ padding: "12px" }}>{o.items?.length || 1} product(s)</td>
                          <td style={{ padding: "12px", fontWeight: 700 }}>₹{o.total?.toLocaleString("en-IN")}</td>
                          <td style={{ padding: "12px" }}>
                            <span 
                              style={{ 
                                padding: "4px 10px", 
                                borderRadius: "var(--radius-pill)", 
                                fontSize: "11px", 
                                fontWeight: 800,
                                background: o.status === "delivered" ? "#dcfce7" : "#fef3c7",
                                color: o.status === "delivered" ? "#166534" : "#92400e"
                              }}
                            >
                              {o.status?.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeTab === "products" && (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid var(--border-card)", boxShadow: "var(--shadow-sm)" }}>
            {/* Search and Filter Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ position: "relative", maxWidth: "380px", width: "100%" }}>
                <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search products by title, brand, category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px 10px 38px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-card)",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 700 }}>
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {/* Bulk Action Bar for Products */}
            {selectedProductIds.length > 0 && (
              <div 
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  marginBottom: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontWeight: 800, color: "#991b1b", fontSize: "14px" }}>
                    ✓ {selectedProductIds.length} of {filteredProducts.length} product(s) selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProductIds([])}
                    style={{ fontSize: "12px", color: "#64748b", background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}
                  >
                    Clear Selection
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBulkDeleteProducts}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#ef4444",
                    color: "#ffffff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "13px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)"
                  }}
                >
                  <Trash2 size={14} />
                  Delete Selected Products ({selectedProductIds.length})
                </button>
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-card)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "14px 12px", width: "42px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                        onChange={() => toggleSelectAllProducts(filteredProducts)}
                        style={{ width: "16px", height: "16px", accentColor: "#ef4444", cursor: "pointer" }}
                        title="Select All Products"
                      />
                    </th>
                    <th style={{ padding: "14px 12px" }}>Product</th>
                    <th style={{ padding: "14px 12px" }}>Main Category (Dept)</th>
                    <th style={{ padding: "14px 12px" }}>Mini Category</th>
                    <th style={{ padding: "14px 12px" }}>Home Section</th>
                    <th style={{ padding: "14px 12px" }}>Price</th>
                    <th style={{ padding: "14px 12px" }}>Stock</th>
                    <th style={{ padding: "14px 12px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const isSelected = selectedProductIds.includes(p._id) || selectedProductIds.includes(p.id);
                    return (
                      <tr 
                        key={p._id || p.id} 
                        style={{ 
                          borderBottom: "1px solid var(--border-light)",
                          background: isSelected ? "#fef2f2" : "transparent"
                        }}
                      >
                        <td style={{ padding: "12px", width: "42px", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectProduct(p._id || p.id)}
                            style={{ width: "16px", height: "16px", accentColor: "#ef4444", cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                          {p.img ? (
                            <img 
                              src={p.img} 
                              alt={p.title} 
                              style={{ width: "46px", height: "46px", objectFit: "contain", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0" }} 
                            />
                          ) : (
                            <div style={{ width: "46px", height: "46px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ImageIcon size={20} color="#94a3b8" />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 800, color: "var(--wb-navy)" }}>{p.title}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Brand: <strong>{p.brand}</strong> • {p.vendor}</div>
                          </div>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "6px", background: "#f1f5f9", fontWeight: 700, fontSize: "12px", color: "#0f172a" }}>
                            {p.department || p.mainCategory || "General"}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          {(!p.miniCategory || p.miniCategory === p.department || p.miniCategory === p.mainCategory || p.miniCategory === p.title) ? (
                            <span style={{ padding: "4px 8px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #e2e8f0", fontWeight: 600, fontSize: "11px", color: "#94a3b8" }}>
                              — No Mini
                            </span>
                          ) : (
                            <span style={{ padding: "4px 8px", borderRadius: "6px", background: "#e0f2fe", fontWeight: 700, fontSize: "12px", color: "#0066ff" }}>
                              {p.miniCategory}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              background:
                                p.homeSection === "top-selling"
                                  ? "#fef3c7"
                                  : p.homeSection === "flash-deals"
                                  ? "#fee2e2"
                                  : p.homeSection === "hot-trending"
                                  ? "#ffedd5"
                                  : p.homeSection === "top-featured"
                                  ? "#ede9fe"
                                  : p.homeSection === "none"
                                  ? "#f1f5f9"
                                  : "#e0f2fe",
                              color:
                                p.homeSection === "top-selling"
                                  ? "#92400e"
                                  : p.homeSection === "flash-deals"
                                  ? "#991b1b"
                                  : p.homeSection === "hot-trending"
                                  ? "#9a3412"
                                  : p.homeSection === "top-featured"
                                  ? "#5b21b6"
                                  : p.homeSection === "none"
                                  ? "#64748b"
                                  : "#0066ff",
                              border: "1px solid rgba(0,0,0,0.06)",
                              display: "inline-block",
                              whiteSpace: "nowrap"
                            }}
                          >
                            {p.homeSection === "top-selling"
                              ? "Top Selling"
                              : p.homeSection === "flash-deals"
                              ? "Flash Deals"
                              : p.homeSection === "hot-trending"
                              ? "Hot Trending"
                              : p.homeSection === "top-featured"
                              ? "Top Featured"
                              : p.homeSection === "none"
                              ? "Catalog Only"
                              : "All Sections"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", fontWeight: 800, color: "var(--wb-navy)" }}>{p.price}</td>
                        <td style={{ padding: "12px" }}>
                          <span 
                            style={{ 
                              padding: "4px 8px", 
                              borderRadius: "6px", 
                              fontSize: "11px", 
                              fontWeight: 700,
                              background: p.inStock ? "#dcfce7" : "#fee2e2",
                              color: p.inStock ? "#166534" : "#991b1b"
                            }}
                          >
                            {p.inStock ? `${p.stockCount || 10} In Stock` : "Out of Stock"}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => {
                                setIsAddMode(false);
                                setIsCustomMainCat(false);
                                setIsCustomMiniCat(false);
                                setEditingProduct(p);
                              }}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                background: "#f1f5f9",
                                color: "var(--wb-blue)",
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Edit size={13} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p._id)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                background: "#fee2e2",
                                color: "#ef4444",
                                fontWeight: 700
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGER (MAIN & MINI CATEGORIES) */}
        {activeTab === "categories" && (
          <div>
            {/* Top Toolbar */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px 24px", border: "1px solid var(--border-card)", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: "280px" }}>
                <div style={{ position: "relative", maxWidth: "340px", width: "100%" }}>
                  <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    placeholder="Filter categories or mini categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 38px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-card)",
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--text-main)", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={filteredCategories.length > 0 && selectedCategoryIds.length === filteredCategories.length}
                    onChange={() => toggleSelectAllCategories(filteredCategories)}
                    style={{ width: "16px", height: "16px", accentColor: "#ef4444", cursor: "pointer" }}
                  />
                  <span>Select All Categories ({filteredCategories.length})</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => {
                    setNewCategoryData({
                      name: "",
                      slug: "",
                      icon: "Smartphone",
                      subcategories: "",
                    });
                    setIsAddCategoryOpen(true);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--grad-box)",
                    color: "#ffffff",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(217, 27, 92, 0.25)"
                  }}
                >
                  <FolderPlus size={16} />
                  + Create Main Category
                </button>
              </div>
            </div>

            {/* Bulk Action Bar for Categories */}
            {selectedCategoryIds.length > 0 && (
              <div 
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontWeight: 800, color: "#991b1b", fontSize: "14px" }}>
                    ✓ {selectedCategoryIds.length} of {filteredCategories.length} Main Category(s) selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryIds([])}
                    style={{ fontSize: "12px", color: "#64748b", background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}
                  >
                    Clear Selection
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBulkDeleteCategories}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#ef4444",
                    color: "#ffffff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "13px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)"
                  }}
                >
                  <Trash2 size={14} />
                  Delete Selected Categories ({selectedCategoryIds.length})
                </button>
              </div>
            )}

            {/* Categories Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
              {filteredCategories.map((cat) => {
                const iconObj = ICON_OPTIONS.find((i) => i.name === cat.icon);
                const isSelected = selectedCategoryIds.includes(cat._id);
                return (
                  <div
                    key={cat._id || cat.slug}
                    style={{
                      background: isSelected ? "#fff5f5" : "#ffffff",
                      borderRadius: "16px",
                      border: isSelected ? "1.5px solid #f87171" : "1px solid var(--border-card)",
                      padding: "20px",
                      boxShadow: "var(--shadow-sm)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.2s"
                    }}
                  >
                    <div>
                      {/* Category Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectCategory(cat._id)}
                            style={{ width: "18px", height: "18px", accentColor: "#ef4444", cursor: "pointer" }}
                            title="Select Category"
                          />
                          <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(0, 102, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0066ff" }}>
                            {iconObj?.icon || <Wrench size={18} />}
                          </div>
                          <div>
                            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--wb-navy)" }}>{cat.name}</h3>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Slug: <code>{cat.slug}</code></span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteCategory(cat._id, cat.name)}
                          title="Delete Main Category"
                          style={{
                            padding: "6px 8px",
                            borderRadius: "6px",
                            background: "#fee2e2",
                            color: "#ef4444",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Mini Categories Section */}
                      <div style={{ marginTop: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                            Mini Categories ({cat.subcategories?.length || 0})
                          </span>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleBulkClearMinis(cat._id, cat.name)}
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: "#ef4444",
                                  background: "#fee2e2",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  border: "none",
                                  cursor: "pointer"
                                }}
                                title="Clear all mini categories in this main category"
                              >
                                Clear Minis
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCategoryForMini(cat);
                                setNewMiniCategoryName("");
                                setIsAddMiniOpen(true);
                              }}
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#0066ff",
                                background: "#e0f2fe",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Plus size={12} /> Add Mini
                            </button>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", minHeight: "50px" }}>
                          {(!cat.subcategories || cat.subcategories.length === 0) ? (
                            <div style={{ fontSize: "12px", color: "#64748b", padding: "6px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ padding: "2px 6px", borderRadius: "4px", background: "#f1f5f9", fontSize: "10px", fontWeight: 700, color: "#475569" }}>Standalone</span>
                              <span>No mini categories. Products are filed directly as &quot;{cat.name}&quot;.</span>
                            </div>
                          ) : (
                            cat.subcategories.map((mini: string, idx: number) => (
                              <span
                                key={idx}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: "#f1f5f9",
                                  color: "#1e293b",
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  border: "1px solid #e2e8f0"
                                }}
                              >
                                <span>{mini}</span>
                                <button
                                  onClick={() => handleDeleteMiniCategory(cat._id, mini)}
                                  title={`Remove ${mini}`}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "transparent",
                                    color: "#94a3b8",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    padding: "2px"
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "18px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Link
                        href={`/shop?department=${encodeURIComponent(cat.name)}`}
                        target="_blank"
                        style={{ fontSize: "12px", fontWeight: 700, color: "var(--wb-blue)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <span>View in Store</span>
                        <ExternalLink size={12} />
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedCategoryForMini(cat);
                          setNewMiniCategoryName("");
                          setIsAddMiniOpen(true);
                        }}
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#0f172a",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          padding: "5px 12px",
                          borderRadius: "6px"
                        }}
                      >
                        + Add Subcategory
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGER */}
        {activeTab === "orders" && (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid var(--border-card)", boxShadow: "var(--shadow-sm)" }}>
            {/* Orders Toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--text-main)", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                    onChange={() => toggleSelectAllOrders(orders)}
                    style={{ width: "16px", height: "16px", accentColor: "#ef4444", cursor: "pointer" }}
                  />
                  <span>Select All Orders ({orders.length})</span>
                </label>
              </div>

              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 700 }}>
                Total Live Orders: {orders.length}
              </div>
            </div>

            {/* Bulk Action Bar for Orders */}
            {selectedOrderIds.length > 0 && (
              <div 
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontWeight: 800, color: "#991b1b", fontSize: "14px" }}>
                    ✓ {selectedOrderIds.length} of {orders.length} order(s) selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderIds([])}
                    style={{ fontSize: "12px", color: "#64748b", background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}
                  >
                    Clear Selection
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBulkDeleteOrders}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#ef4444",
                    color: "#ffffff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "13px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)"
                  }}
                >
                  <Trash2 size={14} />
                  Delete Selected Orders ({selectedOrderIds.length})
                </button>
              </div>
            )}

            {orders.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No customer orders yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {orders.map((o) => {
                  const isSelected = selectedOrderIds.includes(o.orderId);
                  return (
                    <div 
                      key={o._id || o.orderId} 
                      style={{
                        border: isSelected ? "1.5px solid #f87171" : "1px solid var(--border-card)",
                        background: isSelected ? "#fff5f5" : "#ffffff",
                        borderRadius: "12px",
                        padding: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "16px",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(o.orderId)}
                          style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#ef4444", cursor: "pointer" }}
                          title="Select Order"
                        />
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--wb-navy)" }}>{o.orderId}</span>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {new Date(o.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-main)", marginTop: "4px" }}>
                            <strong>Customer:</strong> {o.customerName} ({o.customerPhone}) • {o.address}, {o.city}
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                            <strong>Items:</strong> {o.items?.map((i: any) => `${i.title} (x${i.quantity})`).join(", ")}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>TOTAL</div>
                          <div style={{ fontSize: "18px", fontWeight: 900, color: "var(--wb-navy)" }}>₹{o.total?.toLocaleString("en-IN")}</div>
                        </div>

                        <select
                          value={o.status || "processing"}
                          onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-card)",
                            fontWeight: 700,
                            fontSize: "13px",
                            outline: "none"
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(o.orderId, o._id)}
                          title="Delete Order"
                          style={{
                            padding: "8px 10px",
                            borderRadius: "8px",
                            background: "#fee2e2",
                            color: "#ef4444",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: TECH BLOG MANAGER */}
        {activeTab === "blogs" && (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid var(--border-card)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--wb-navy)", margin: 0 }}>From Our Tech Blog</h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                  Articles appear on the homepage and open a full detail page when clicked.
                </p>
              </div>
              <Link href="/blog" target="_blank" style={{ fontSize: "12px", fontWeight: 700, color: "#0066ff", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                View Blog Page <ExternalLink size={12} />
              </Link>
            </div>

            {blogs.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", border: "1px dashed #cbd5e1", borderRadius: "12px", color: "#64748b" }}>
                No blog articles yet. Click <strong>Add Blog Article</strong> to create one.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "72px 1fr auto",
                      gap: "14px",
                      alignItems: "center",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                    }}
                  >
                    <div style={{ width: "72px", height: "56px", borderRadius: "8px", overflow: "hidden", background: "#e2e8f0", position: "relative" }}>
                      {blog.image ? (
                        <img src={blog.image} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FileText size={18} color="#94a3b8" />
                        </div>
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "14px", marginBottom: "2px" }}>{blog.title}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        {blog.date} • {blog.author || "WhiteBox Team"} • {blog.published === false ? "Draft" : "Published"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {blog.excerpt}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        style={{
                          padding: "7px 10px",
                          borderRadius: "8px",
                          background: "#e0f2fe",
                          color: "#0066ff",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          setIsAddBlogMode(false);
                          setEditingBlog({ ...blog });
                        }}
                        style={{
                          padding: "7px 10px",
                          borderRadius: "8px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          color: "#0f172a",
                          fontSize: "12px",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog._id, blog.title)}
                        style={{
                          padding: "7px 10px",
                          borderRadius: "8px",
                          background: "#fef2f2",
                          color: "#ef4444",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FRONTEND SITE SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "32px", border: "1px solid var(--border-card)", boxShadow: "var(--shadow-sm)", maxWidth: "800px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "6px" }}>
              Live Frontend Website Controls
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
              Changes made here update the homepage banners, top bar notices, and hero section instantly in MongoDB.
            </p>

            <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* MAIN HERO BANNER */}
              <div style={{ border: "1px solid var(--border-card)", borderRadius: "12px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "2px" }}>Main Hero Banner</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>The large banner on the left side of the homepage.</p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>Heading</label>
                  <input
                    type="text"
                    value={settings.heroTitle || ""}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>Subtitle</label>
                  <input
                    type="text"
                    value={settings.heroSubtitle || ""}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>Button Text</label>
                    <input
                      type="text"
                      value={settings.heroButtonText || ""}
                      onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>Click Link (e.g. /shop?department=Electronics)</label>
                    <input
                      type="text"
                      value={settings.heroLink || ""}
                      onChange={(e) => setSettings({ ...settings, heroLink: e.target.value })}
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                    />
                  </div>
                </div>

                {renderSettingsImageField("hero", "Banner Image", settings.heroImage || "", (url) => setSettings({ ...settings, heroImage: url }))}
              </div>

              {/* FOUR SIDE TILES */}
              <div style={{ border: "1px solid var(--border-card)", borderRadius: "12px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--wb-navy)", marginBottom: "2px" }}>Side Tiles (4 cards)</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>The four cards on the right side of the hero banner.</p>
                </div>

                {(settings.heroTiles || DEFAULT_HERO_TILES).map((tile: any, i: number) => (
                  <div key={i} style={{ border: "1px dashed var(--border-card)", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <strong style={{ fontSize: "13px", color: "var(--text-main)" }}>Tile {i + 1}</strong>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>Title</label>
                        <input
                          type="text"
                          value={tile.title || ""}
                          onChange={(e) => setTileField(i, { title: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>Small Label (category text)</label>
                        <input
                          type="text"
                          value={tile.category || ""}
                          onChange={(e) => setTileField(i, { category: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>Click Link (e.g. /shop?category=Smartphones)</label>
                      <input
                        type="text"
                        value={tile.link || ""}
                        onChange={(e) => setTileField(i, { link: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                      />
                    </div>

                    {renderSettingsImageField(`tile-${i}`, "Tile Image", tile.image || "", (url) => setTileField(i, { image: url }))}
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                    Top Bar Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                    Top Bar Banner Guarantee Notice
                  </label>
                  <input
                    type="text"
                    value={settings.bannerNotice}
                    onChange={(e) => setSettings({ ...settings, bannerNotice: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-card)", outline: "none" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                style={{ width: "fit-content", padding: "12px 32px", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Save size={16} />
                Save & Apply Live Changes
              </button>
            </form>
          </div>
        )}

        {/* MODAL 1: ADD / EDIT PRODUCT */}
        {editingProduct && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(13, 27, 70, 0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeCatDropdowns();
                setEditingProduct(null);
              }
            }}
          >
            <div 
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "680px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "var(--shadow-lg)",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 30px 14px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--wb-navy)" }}>
                    {isAddMode ? "Add New Product to Store" : `Edit Product: ${editingProduct.title}`}
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Fill product details and upload product image to Cloudinary.
                  </span>
                </div>
                <button 
                  onClick={() => { closeCatDropdowns(); setEditingProduct(null); }}
                  style={{ fontSize: "20px", color: "var(--text-muted)", cursor: "pointer", background: "transparent", border: "none" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "22px 30px 30px", overflowY: "auto", flex: 1, minHeight: 0 }}>
                {/* Title */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                    value={editingProduct.title || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                  />
                </div>

                {/* Price and Old Price */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Selling Price * (e.g. ₹19,999)</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.price || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Original Price (Strikeout)</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹24,999"
                      value={editingProduct.oldPrice || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                    />
                  </div>
                </div>

                {/* Main Category & Mini Category Selection */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  {/* Main Category */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 700 }}>Main Category (Department) *</label>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !isCustomMainCat;
                          setIsCustomMainCat(next);
                          closeCatDropdowns();
                          // Switching back to list — open the fixed dropdown next tick
                          if (next === false) {
                            setTimeout(() => {
                              openFixedDropdown(
                                mainCatTriggerRef.current,
                                setMainCatDropdownOpen,
                                setMainCatMenuPos,
                                false
                              );
                            }, 50);
                          }
                        }}
                        style={{ fontSize: "10px", color: "#0066ff", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                      >
                        {isCustomMainCat ? "Select from list" : "+ Custom"}
                      </button>
                    </div>

                    {isCustomMainCat ? (
                      <input
                        type="text"
                        required
                        placeholder="Type custom main category"
                        value={editingProduct.department || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          // Changing main must clear leftover mini so it never lands in navbar dropdowns
                          setEditingProduct({
                            ...editingProduct,
                            department: val,
                            mainCategory: val,
                            category: val,
                            miniCategory: "",
                          });
                        }}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                      />
                    ) : (
                      <>
                        <input
                          type="hidden"
                          required
                          value={editingProduct.department || editingProduct.mainCategory || ""}
                          onChange={() => {}}
                        />
                        <button
                          ref={mainCatTriggerRef}
                          type="button"
                          onClick={() => {
                            setMiniCatDropdownOpen(false);
                            setMiniCatMenuPos(null);
                            openFixedDropdown(
                              mainCatTriggerRef.current,
                              setMainCatDropdownOpen,
                              setMainCatMenuPos,
                              mainCatDropdownOpen
                            );
                          }}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-card)",
                            fontSize: "13px",
                            outline: "none",
                            background: "#ffffff",
                            textAlign: "left",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: editingProduct.department || editingProduct.mainCategory ? "#0f172a" : "#94a3b8",
                          }}
                        >
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {editingProduct.department || editingProduct.mainCategory || "Select main category"}
                          </span>
                          <ChevronDown size={14} color="#64748b" style={{ flexShrink: 0, transform: mainCatDropdownOpen ? "rotate(180deg)" : "none" }} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Mini Category */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>
                        Mini Category (Subcategory) <span style={{ fontWeight: 500, color: "var(--text-muted)", fontSize: "11px" }}>(Optional)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCustomMiniCat(!isCustomMiniCat)}
                        style={{ fontSize: "10px", color: "#0066ff", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                      >
                        {isCustomMiniCat ? "Select from list" : "+ Custom"}
                      </button>
                    </div>

                    {availableMiniCategories.length === 0 ? (
                      <div>
                        <div style={{
                          padding: "9px 12px",
                          borderRadius: "8px",
                          background: "#ffffff",
                          border: "1px dashed #cbd5e1",
                          fontSize: "12px",
                          color: "#475569",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px"
                        }}>
                          <div style={{ fontWeight: 700, color: "#1e293b" }}>
                            No mini categories in {editingProduct.department || "this category"}
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            Leave empty — product stays under the main category only (no dropdown mini).
                          </div>
                        </div>
                        {isCustomMiniCat && (
                          <div style={{ marginTop: "6px" }}>
                            <input
                              type="text"
                              placeholder="Optional: Type mini category (or leave blank)"
                              value={editingProduct.miniCategory && editingProduct.miniCategory !== editingProduct.department ? editingProduct.miniCategory : ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditingProduct({
                                  ...editingProduct,
                                  category: val.trim() || editingProduct.department,
                                  miniCategory: val.trim(),
                                });
                              }}
                              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "12px" }}
                            />
                          </div>
                        )}
                      </div>
                    ) : isCustomMiniCat ? (
                      <input
                        type="text"
                        placeholder="Optional: Type mini category (or leave blank)"
                        value={editingProduct.miniCategory && editingProduct.miniCategory !== editingProduct.department ? editingProduct.miniCategory : ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingProduct({
                            ...editingProduct,
                            category: val.trim() || editingProduct.department,
                            miniCategory: val.trim(),
                          });
                        }}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                      />
                    ) : (
                      <button
                        ref={miniCatTriggerRef}
                        type="button"
                        onClick={() => {
                          setMainCatDropdownOpen(false);
                          setMainCatMenuPos(null);
                          openFixedDropdown(
                            miniCatTriggerRef.current,
                            setMiniCatDropdownOpen,
                            setMiniCatMenuPos,
                            miniCatDropdownOpen
                          );
                        }}
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          borderRadius: "8px",
                          border: "1px solid var(--border-card)",
                          fontSize: "13px",
                          outline: "none",
                          background: "#ffffff",
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: "#0f172a",
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {(editingProduct.miniCategory && editingProduct.miniCategory !== editingProduct.department
                            ? editingProduct.miniCategory
                            : (editingProduct.category && editingProduct.category !== editingProduct.department ? editingProduct.category : ""))
                            || `None (Use "${editingProduct.department || "Main Category"}")`}
                        </span>
                        <ChevronDown size={14} color="#64748b" style={{ flexShrink: 0, transform: miniCatDropdownOpen ? "rotate(180deg)" : "none" }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* PRODUCT IMAGE UPLOAD SECTION */}
                <div style={{ background: "#ffffff", border: "1.5px dashed #cbd5e1", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 800, color: "var(--wb-navy)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <ImageIcon size={16} color="#0066ff" />
                      Product Image & Upload
                    </label>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Supported: WEBP, PNG, JPG</span>
                  </div>

                  {/* Upload Controls & Preview */}
                  <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                    {/* Preview Thumbnail */}
                    <div style={{ width: "80px", height: "80px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {editingProduct.img ? (
                        <img 
                          src={editingProduct.img} 
                          alt="Product preview" 
                          style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                        />
                      ) : (
                        <ImageIcon size={28} color="#94a3b8" />
                      )}
                    </div>

                    {/* File Picker & Upload Button */}
                    <div style={{ flex: 1, minWidth: "220px" }}>
                      <label 
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 18px",
                          borderRadius: "8px",
                          background: "#0066ff",
                          color: "#ffffff",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: uploadingImage ? "not-allowed" : "pointer",
                          opacity: uploadingImage ? 0.7 : 1,
                          boxShadow: "0 2px 8px rgba(0, 102, 255, 0.25)"
                        }}
                      >
                        {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <span>{uploadingImage ? uploadProgressMsg : "Upload Image from Device"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={(e) => handleFileUpload(e, false)}
                          style={{ display: "none" }}
                        />
                      </label>

                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
                        Directly uploads to Cloudinary CDN (<code style={{ color: "#0066ff" }}>rpdxkihi</code>)
                      </div>
                    </div>
                  </div>

                  {/* Manual URL input fallback */}
                  <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                      Or Image URL / Cloudinary CDN Path:
                    </label>
                    <input
                      type="text"
                      placeholder="https://res.cloudinary.com/... or upload above"
                      value={editingProduct.img || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, img: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-card)", fontSize: "12px" }}
                    />
                  </div>
                </div>

                {/* Brand & Vendor */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. OnePlus, WhiteBox, Bosch"
                      value={editingProduct.brand || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Vendor</label>
                    <input
                      type="text"
                      placeholder="e.g. WhiteBox Official"
                      value={editingProduct.vendor || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, vendor: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                    />
                  </div>
                </div>

                {/* Stock & Tag */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", alignItems: "center" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Stock Count</label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.stockCount || 10}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: parseInt(e.target.value) || 0 })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Product Badge / Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. HOT, NEW, SALE"
                      value={editingProduct.tag || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ paddingTop: "18px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock ?? true}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                        style={{ width: "18px", height: "18px", accentColor: "#0066ff" }}
                      />
                      <span>In Stock</span>
                    </label>
                  </div>
                </div>

                {/* HOMEPAGE SECTION SELECTOR BOXES (NO DROPDOWN) */}
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1.5px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <label style={{ fontSize: "13px", fontWeight: 800, color: "var(--wb-navy)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Layers size={16} color="#0066ff" />
                        Homepage Display Section (Selector Boxes)
                      </label>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Click selector boxes below to choose which homepage section(s) this product appears in
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct({
                            ...editingProduct,
                            homeSection: "all",
                            homeSections: ["top-selling", "flash-deals", "hot-trending", "top-featured"],
                          });
                        }}
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: "#e0f2fe",
                          color: "#0066ff",
                          border: "1px solid #bfdbfe",
                          cursor: "pointer"
                        }}
                      >
                        ✓ Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct({
                            ...editingProduct,
                            homeSection: "none",
                            homeSections: [],
                          });
                        }}
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: "#f1f5f9",
                          color: "#64748b",
                          border: "1px solid #cbd5e1",
                          cursor: "pointer"
                        }}
                      >
                        ✕ Hide from Home (Catalog Only)
                      </button>
                    </div>
                  </div>

                  {/* Grid of 4 Selector Boxes (No dropdown!) */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {[
                      {
                        id: "top-selling",
                        title: "Top Best Selling",
                        badge: "Top Carousel",
                        desc: "Main carousel under the hero banner",
                        icon: "🔥",
                      },
                      {
                        id: "flash-deals",
                        title: "Flash Deals",
                        badge: "Countdown Deals",
                        desc: "Special flash deals countdown section",
                        icon: "⚡",
                      },
                      {
                        id: "hot-trending",
                        title: "Hot Trending Products",
                        badge: "Middle Carousel",
                        desc: "Trending items carousel in middle of page",
                        icon: "📈",
                      },
                      {
                        id: "top-featured",
                        title: "Top Featured Products",
                        badge: "Bottom Carousel",
                        desc: "Curated featured showcase carousel",
                        icon: "⭐",
                      },
                    ].map((sec) => {
                      const isSelected =
                        editingProduct.homeSection === "all" ||
                        editingProduct.homeSection === sec.id ||
                        (Array.isArray(editingProduct.homeSections) && editingProduct.homeSections.includes(sec.id));

                      return (
                        <div
                          key={sec.id}
                          onClick={() => {
                            let currentList: string[] = [];
                            if (editingProduct.homeSection === "all") {
                              currentList = ["top-selling", "flash-deals", "hot-trending", "top-featured"];
                            } else if (Array.isArray(editingProduct.homeSections) && editingProduct.homeSections.length > 0) {
                              currentList = [...editingProduct.homeSections];
                            } else if (editingProduct.homeSection && editingProduct.homeSection !== "none") {
                              currentList = [editingProduct.homeSection];
                            }

                            let nextList: string[];
                            if (currentList.includes(sec.id)) {
                              nextList = currentList.filter((s) => s !== sec.id);
                            } else {
                              nextList = [...currentList, sec.id];
                            }

                            const mainSection = nextList.length === 4 ? "all" : (nextList.length === 0 ? "none" : nextList[0]);
                            setEditingProduct({
                              ...editingProduct,
                              homeSection: mainSection,
                              homeSections: nextList,
                            });
                          }}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            background: isSelected ? "#eff6ff" : "#ffffff",
                            border: isSelected ? "2px solid #0066ff" : "1.5px solid #cbd5e1",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: isSelected ? "0 2px 8px rgba(0, 102, 255, 0.12)" : "none",
                            userSelect: "none"
                          }}
                        >
                          {/* Checkbox selector box */}
                          <div style={{ marginTop: "2px" }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{
                                width: "18px",
                                height: "18px",
                                accentColor: "#0066ff",
                                cursor: "pointer"
                              }}
                            />
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                              <div style={{ fontSize: "13px", fontWeight: 800, color: isSelected ? "#0066ff" : "var(--wb-navy)" }}>
                                <span style={{ marginRight: "4px" }}>{sec.icon}</span>
                                {sec.title}
                              </div>
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: isSelected ? "#0066ff" : "#f1f5f9",
                                  color: isSelected ? "#ffffff" : "#64748b"
                                }}
                              >
                                {sec.badge}
                              </span>
                            </div>
                            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>
                              {sec.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Selection Summary */}
                  <div style={{ marginTop: "12px", fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                    <strong>Active on Homepage:</strong>
                    {editingProduct.homeSection === "none" || (Array.isArray(editingProduct.homeSections) && editingProduct.homeSections.length === 0) ? (
                      <span style={{ color: "#ef4444", fontWeight: 700 }}>None (Hidden from home, store catalog only)</span>
                    ) : editingProduct.homeSection === "all" || (Array.isArray(editingProduct.homeSections) && editingProduct.homeSections.length === 4) ? (
                      <span style={{ color: "#0066ff", fontWeight: 700 }}>★ All 4 Homepage Sections</span>
                    ) : (
                      <span style={{ color: "#0066ff", fontWeight: 700 }}>
                        {(editingProduct.homeSections || [editingProduct.homeSection]).filter(Boolean).map((s: string) => {
                          if (s === "top-selling") return "Top Best Selling";
                          if (s === "flash-deals") return "Flash Deals";
                          if (s === "hot-trending") return "Hot Trending";
                          if (s === "top-featured") return "Top Featured";
                          return s;
                        }).join(" • ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Product Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe product highlights and specifications..."
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                  />
                </div>

                {/* Submit Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => { closeCatDropdowns(); setEditingProduct(null); }}
                    style={{ padding: "10px 18px", borderRadius: "8px", background: "#f1f5f9", fontWeight: 700, fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="checkout-btn"
                    style={{ width: "auto", padding: "10px 28px", fontSize: "13px" }}
                  >
                    {isAddMode ? "Create Product" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Fixed category menus — outside modal overflow so they are never clipped */}
            {mainCatDropdownOpen && mainCatMenuPos && (
              <div
                data-cat-dropdown-menu
                style={{
                  position: "fixed",
                  top: mainCatMenuPos.top,
                  left: mainCatMenuPos.left,
                  width: mainCatMenuPos.width,
                  transform: mainCatMenuPos.openUp ? "translateY(-100%)" : "none",
                  maxHeight: "220px",
                  overflowY: "auto",
                  background: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.22)",
                  zIndex: 1100,
                  padding: "6px",
                }}
              >
                {categories.length === 0 ? (
                  <div style={{ padding: "10px 12px", fontSize: "12px", color: "#64748b" }}>No categories yet. Create one in Categories.</div>
                ) : (
                  categories.map((c) => {
                    const selected = (editingProduct.department || editingProduct.mainCategory) === c.name;
                    return (
                      <button
                        key={c._id || c.name}
                        type="button"
                        onClick={() => {
                          // Selecting a main category clears mini — user picks mini separately (optional)
                          setEditingProduct({
                            ...editingProduct,
                            department: c.name,
                            mainCategory: c.name,
                            category: c.name,
                            miniCategory: "",
                          });
                          closeCatDropdowns();
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "9px 12px",
                          borderRadius: "7px",
                          border: "none",
                          background: selected ? "#e0f2fe" : "transparent",
                          color: selected ? "#0066ff" : "#0f172a",
                          fontWeight: selected ? 800 : 600,
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        {c.name}
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {miniCatDropdownOpen && miniCatMenuPos && (
              <div
                data-cat-dropdown-menu
                style={{
                  position: "fixed",
                  top: miniCatMenuPos.top,
                  left: miniCatMenuPos.left,
                  width: miniCatMenuPos.width,
                  transform: miniCatMenuPos.openUp ? "translateY(-100%)" : "none",
                  maxHeight: "220px",
                  overflowY: "auto",
                  background: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.22)",
                  zIndex: 1100,
                  padding: "6px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct({
                      ...editingProduct,
                      category: editingProduct.department,
                      miniCategory: "",
                    });
                    closeCatDropdowns();
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: "7px",
                    border: "none",
                    background: "transparent",
                    color: "#64748b",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  None (Use &quot;{editingProduct.department || "Main Category"}&quot;)
                </button>
                {availableMiniCategories.map((sub: string) => {
                  const selected =
                    editingProduct.miniCategory === sub ||
                    (editingProduct.category === sub && editingProduct.category !== editingProduct.department);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          category: sub,
                          miniCategory: sub,
                        });
                        closeCatDropdowns();
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 12px",
                        borderRadius: "7px",
                        border: "none",
                        background: selected ? "#e0f2fe" : "transparent",
                        color: selected ? "#0066ff" : "#0f172a",
                        fontWeight: selected ? 800 : 600,
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODAL 2: ADD NEW MAIN CATEGORY */}
        {isAddCategoryOpen && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(13, 27, 70, 0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
          >
            <div 
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "520px",
                padding: "28px",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--wb-navy)" }}>
                  Create New Main Category
                </h3>
                <button 
                  onClick={() => setIsAddCategoryOpen(false)}
                  style={{ fontSize: "20px", color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCategory} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Main Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Home & Automation"
                    value={newCategoryData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      setNewCategoryData({ ...newCategoryData, name, slug });
                    }}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Category Slug
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. smart-home"
                    value={newCategoryData.slug}
                    onChange={(e) => setNewCategoryData({ ...newCategoryData, slug: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Icon
                  </label>
                  <select
                    value={newCategoryData.icon}
                    onChange={(e) => setNewCategoryData({ ...newCategoryData, icon: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px", background: "#ffffff" }}
                  >
                    {ICON_OPTIONS.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Initial Mini Categories <span style={{ fontWeight: 500, color: "var(--text-muted)", fontSize: "11px" }}>(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Optional: e.g. Smart Lighting, Security Cameras. Leave blank to create a Main Category without mini categories."
                    value={newCategoryData.subcategories}
                    onChange={(e) => setNewCategoryData({ ...newCategoryData, subcategories: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                  />
                  <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Leave blank to create a standalone category. Products can be added directly to this category.
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    style={{ padding: "10px 18px", borderRadius: "8px", background: "#f1f5f9", fontWeight: 700, fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="checkout-btn"
                    style={{ width: "auto", padding: "10px 24px", fontSize: "13px" }}
                  >
                    Create Main Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: ADD MINI CATEGORY TO MAIN CATEGORY */}
        {isAddMiniOpen && selectedCategoryForMini && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(13, 27, 70, 0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
          >
            <div 
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "460px",
                padding: "26px",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--wb-navy)" }}>
                    Add Mini Category
                  </h3>
                  <span style={{ fontSize: "12px", color: "#0066ff", fontWeight: 700 }}>
                    Inside: {selectedCategoryForMini.name}
                  </span>
                </div>
                <button 
                  onClick={() => setIsAddMiniOpen(false)}
                  style={{ fontSize: "20px", color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMiniCategory} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Mini Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Curved Gaming Monitors"
                    value={newMiniCategoryName}
                    onChange={(e) => setNewMiniCategoryName(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setIsAddMiniOpen(false)}
                    style={{ padding: "9px 16px", borderRadius: "8px", background: "#f1f5f9", fontWeight: 700, fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="checkout-btn"
                    style={{ width: "auto", padding: "9px 22px", fontSize: "13px" }}
                  >
                    Add Mini Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT BLOG */}
        {editingBlog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(13, 27, 70, 0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditingBlog(null);
                setIsAddBlogMode(false);
              }
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "720px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 26px 14px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--wb-navy)" }}>
                    {isAddBlogMode ? "Add Blog Article" : "Edit Blog Article"}
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Shows in &quot;From Our Tech Blog&quot; — click opens full detail page.
                  </span>
                </div>
                <button
                  onClick={() => {
                    setEditingBlog(null);
                    setIsAddBlogMode(false);
                  }}
                  style={{ fontSize: "20px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveBlog} style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "20px 26px 26px", overflowY: "auto", flex: 1 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Title *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title || ""}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    placeholder="e.g. How to Choose the Right Wireless Headset"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Date</label>
                    <input
                      type="text"
                      value={editingBlog.date || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })}
                      placeholder="November 25, 2026"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Author</label>
                    <input
                      type="text"
                      value={editingBlog.author || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                      placeholder="WhiteBox Team"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Comments label</label>
                    <input
                      type="text"
                      value={editingBlog.comments || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, comments: e.target.value })}
                      placeholder="0 Comments"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Short Excerpt (card preview)</label>
                  <textarea
                    rows={2}
                    value={editingBlog.excerpt || ""}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                    placeholder="One or two sentences shown on the homepage blog card..."
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Full Article Content</label>
                  <textarea
                    rows={8}
                    value={editingBlog.content || ""}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    placeholder="Write the full blog article here. Use blank lines to separate paragraphs."
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-card)", fontSize: "13px", lineHeight: 1.5 }}
                  />
                </div>

                <div style={{ border: "1.5px dashed #cbd5e1", borderRadius: "12px", padding: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 800, marginBottom: "10px", color: "var(--wb-navy)" }}>
                    Cover Image
                  </label>
                  <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ width: "90px", height: "64px", borderRadius: "8px", overflow: "hidden", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {editingBlog.image ? (
                        <img src={editingBlog.image} alt="Blog cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <ImageIcon size={22} color="#94a3b8" />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <label
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "9px 14px",
                          borderRadius: "8px",
                          background: "#0066ff",
                          color: "#ffffff",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          marginBottom: "8px",
                        }}
                      >
                        <Upload size={14} />
                        {uploadingBlogImage ? "Uploading..." : "Upload Image"}
                        <input type="file" accept="image/*" hidden disabled={uploadingBlogImage} onChange={handleBlogImageUpload} />
                      </label>
                      <input
                        type="text"
                        value={editingBlog.image || ""}
                        onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                        placeholder="Or paste image URL"
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-card)", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={editingBlog.published !== false}
                    onChange={(e) => setEditingBlog({ ...editingBlog, published: e.target.checked })}
                    style={{ width: "16px", height: "16px", accentColor: "#0066ff" }}
                  />
                  Published (show on homepage & blog page)
                </label>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBlog(null);
                      setIsAddBlogMode(false);
                    }}
                    style={{ padding: "10px 18px", borderRadius: "8px", background: "#f1f5f9", fontWeight: 700, fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="checkout-btn" style={{ width: "auto", padding: "10px 24px", fontSize: "13px" }}>
                    {isAddBlogMode ? "Publish Article" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
