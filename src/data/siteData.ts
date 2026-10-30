export interface Product {
  id: number;
  slug: string;
  title: string;
  img: string;
  gallery?: string[];
  price: string;
  rawPrice: number;
  oldPrice: string | null;
  rawOldPrice?: number | null;
  brand: string;
  vendor: string;
  vendorRating: number;
  category: string;
  department: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  tag?: string;
  tagColor?: string;
}

export const DEPARTMENTS_DATA = [
  {
    name: "Electronics & Gadgets",
    slug: "electronics",
    icon: "Smartphone",
    subcategories: ["Smartphones", "Wireless Earbuds", "Gaming Consoles", "Smartwatches", "Tablets", "Headphones"]
  },
  {
    name: "Computers & Gaming",
    slug: "gaming",
    icon: "Gamepad2",
    subcategories: ["Gaming Controllers", "Laptops", "Mechanical Keyboards", "Monitors", "Graphics Cards"]
  },
  {
    name: "Power & Hand Tools",
    slug: "tools",
    icon: "Wrench",
    subcategories: ["Cordless Drills", "Power Saws", "Grinders & Polishers", "Routers & Planers", "Hand Tool Sets"]
  },
  {
    name: "Air Compressors & Pumps",
    slug: "compressors",
    icon: "Sliders",
    subcategories: ["Pneumatic Compressors", "Spray Guns", "Hoses & Fittings", "Pressure Gauges"]
  },
  {
    name: "Home & Furniture",
    slug: "furniture",
    icon: "Armchair",
    subcategories: ["Lounge Chairs", "Studio Desks", "Terrariums & Plants", "Smart Lighting"]
  },
  {
    name: "Watches & Wearables",
    slug: "wearables",
    icon: "Watch",
    subcategories: ["Smart Fitness Bands", "Luxury Chronographs", "Eyewear & Sunglasses"]
  },
  {
    name: "Woodworking & Workshop",
    slug: "woodworking",
    icon: "Scissors",
    subcategories: ["Jointers", "Carving Chisels", "Wood Lathes", "Dust Collectors"]
  }
];

export const VENDORS = [
  { id: "whitebox", name: "WhiteBox Official", rating: 4.9, verified: true },
  { id: "ofs", name: "OFS Technology", rating: 4.7, verified: true },
  { id: "samsung", name: "Samsung Authorized", rating: 4.8, verified: true },
  { id: "common-good", name: "Common Good Tech", rating: 4.6, verified: true },
  { id: "sagaform", name: "Sagaform Studios", rating: 4.7, verified: true },
  { id: "anker", name: "Anker Innovations", rating: 4.9, verified: true }
];

export const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "oneplus-nord-n10-5g",
    title: "OnePlus Nord N10 5G Unlocked",
    img: "/products/product-1.webp",
    gallery: [
      "/products/product-1.webp",
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner2.png"
    ],
    price: "₹19,999",
    rawPrice: 19999,
    oldPrice: "₹24,999",
    rawOldPrice: 24999,
    brand: "OnePlus",
    vendor: "WhiteBox Official",
    vendorRating: 4.9,
    category: "Smartphones",
    department: "Electronics & Gadgets",
    description: "Experience 5G speed with ultra-smooth 90 Hz display, Warp Charge 30T all-day battery, and quad camera setup with 64MP ultra-clear main sensor.",
    features: [
      "Warp Charge 30T: A day's power in 30 minutes",
      "Smooth 90Hz FHD+ IPS Display",
      "64 MP Quad Camera System with Ultra-Wide Lens",
      "Dual Stereo Speakers with Dirac Audio Tuner",
      "Expandable Storage up to 512GB via MicroSD"
    ],
    specs: {
      "Display": "6.49-inch 90Hz FHD+",
      "Processor": "Qualcomm Snapdragon 690 5G",
      "RAM": "6GB LPDDR4x",
      "Internal Storage": "128GB UFS 2.1",
      "Battery": "4300 mAh with 30W Fast Charging"
    },
    rating: 4.8,
    reviewsCount: 1420,
    inStock: true,
    stockCount: 42,
    tag: "BESTSELLER",
    tagColor: "#ff4d6d"
  },
  {
    id: 2,
    slug: "samsung-galaxy-s20-unlocked",
    title: "Samsung Galaxy S20 Unlocked Cloud Blue",
    img: "/products/product-2.webp",
    gallery: [
      "/products/product-2.webp",
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner2.png"
    ],
    price: "₹24,499",
    rawPrice: 24499,
    oldPrice: "₹29,999",
    rawOldPrice: 29999,
    brand: "Samsung",
    vendor: "Samsung Authorized",
    vendorRating: 4.8,
    category: "Smartphones",
    department: "Electronics & Gadgets",
    description: "Pro-grade triple camera with 30X Space Zoom, 120Hz Dynamic AMOLED 2X HDR10+ display, and hyper-fast 5G connectivity.",
    features: [
      "Dynamic AMOLED 2X 120Hz Display",
      "Single Take AI Camera Mode & 8K Video Recording",
      "Space Zoom up to 30x",
      "IP68 Water & Dust Resistant",
      "Wireless PowerShare Support"
    ],
    specs: {
      "Display": "6.2-inch Quad HD+ Dynamic AMOLED",
      "Processor": "Exynos 990 / Snapdragon 865",
      "RAM": "8GB High-Speed LPDDR5",
      "Internal Storage": "128GB",
      "Battery": "4000 mAh Intelligent All-Day Battery"
    },
    rating: 4.7,
    reviewsCount: 890,
    inStock: true,
    stockCount: 18,
    tag: "-18% OFF",
    tagColor: "#7928ca"
  },
  {
    id: 3,
    slug: "ps4-wireless-controller-gamepad",
    title: "DualShock 4 Wireless Controller Gamepad",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/88/404/19__30227.1623900382.jpg?c=1",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/88/404/19__30227.1623900382.jpg?c=1",
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner4.png"
    ],
    price: "₹3,999",
    rawPrice: 3999,
    oldPrice: "₹4,999",
    rawOldPrice: 4999,
    brand: "Sony PlayStation",
    vendor: "WhiteBox Official",
    vendorRating: 4.9,
    category: "Gaming Controllers",
    department: "Computers & Gaming",
    description: "Precision analog sticks, responsive triggers, built-in speaker, clickable multi-touch pad, and refined ergonomic grip for extended esports gaming.",
    features: [
      "Precision Control: Enhanced feel, shape, and sensitivity of dual analog sticks",
      "Clickable Touch Pad for innovative gameplay interactions",
      "Built-in 3.5mm Stereo Audio Jack and Mono Speaker",
      "USB and Bluetooth Wireless Connectivity"
    ],
    specs: {
      "Connectivity": "Bluetooth 2.1 + EDR & Micro-USB",
      "Battery": "1000 mAh Lithium-ion Rechargeable",
      "Motion Sensing": "Six-axis sensor (3-axis gyro, 3-axis accelerometer)",
      "Weight": "210 grams"
    },
    rating: 4.9,
    reviewsCount: 2310,
    inStock: true,
    stockCount: 75,
    tag: "GAMING",
    tagColor: "#ef4444"
  },
  {
    id: 4,
    slug: "canyon-star-raider-gaming-headset",
    title: "Canyon Star Raider Pro 7.1 Surround Gaming Headset",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner1.png",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner1.png",
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/1280w/carousel/3/slide-home2.png?c=1"
    ],
    price: "₹2,499",
    rawPrice: 2499,
    oldPrice: "₹3,999",
    rawOldPrice: 3999,
    brand: "Canyon Audio",
    vendor: "Common Good Tech",
    vendorRating: 4.6,
    category: "Headphones",
    department: "Electronics & Gadgets",
    description: "Deep bass 50mm neodymium audio drivers with virtual 7.1 surround sound positioning, omnidirectional noise-cancelling boom mic, and glowing RGB illumination.",
    features: [
      "50mm Neodymium Tuned Drivers for immersive positional audio",
      "Virtual 7.1 Surround Audio engine for pin-point enemy tracking",
      "Ultra-soft Memory Foam Ear Cushions",
      "Braided anti-tangle 2.2m heavy-duty cable with in-line remote"
    ],
    specs: {
      "Driver Size": "50mm Dynamic",
      "Frequency Response": "20Hz - 20,000Hz",
      "Microphone": "Omnidirectional with noise filtering",
      "Interface": "USB + 3.5mm Audio Splitter"
    },
    rating: 4.6,
    reviewsCount: 430,
    inStock: true,
    stockCount: 30,
    tag: "HOT DEAL",
    tagColor: "#ff7043"
  },
  {
    id: 5,
    slug: "galaxy-buds-plus-wireless",
    title: "Samsung Galaxy Buds Plus True Wireless Earbuds",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner3.png",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner3.png"
    ],
    price: "₹5,999",
    rawPrice: 5999,
    oldPrice: "₹8,999",
    rawOldPrice: 8999,
    brand: "Samsung",
    vendor: "Samsung Authorized",
    vendorRating: 4.8,
    category: "Wireless Earbuds",
    department: "Electronics & Gadgets",
    description: "2-way dynamic speaker system engineered by AKG with punchy bass and crystal clear high notes, adaptive 3-mic system for clear calls, and up to 22 hours playtime.",
    features: [
      "Rich Natural Sound by AKG with dedicated woofer and tweeter",
      "11 Hours on-earbuds playtime + additional 11 hours with charging case",
      "Qi Certified Wireless Charging compatibility",
      "Ambient Sound control with adjustable volume levels"
    ],
    specs: {
      "Bluetooth": "Bluetooth v5.0",
      "Battery Life": "22 Hours Total",
      "Water Resistance": "IPX2 splash resistant",
      "Sensors": "Accelerometer, IR, Hall, Touch"
    },
    rating: 4.7,
    reviewsCount: 1670,
    inStock: true,
    stockCount: 25,
    tag: "POPULAR",
    tagColor: "#00bfa5"
  },
  {
    id: 6,
    slug: "anker-soundcore-life-q20",
    title: "Anker Soundcore Life Q20 Hybrid Active Noise Cancelling",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/86/408/6-2__92578.1623900436.jpg?c=1",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/86/408/6-2__92578.1623900436.jpg?c=1"
    ],
    price: "₹16,499",
    rawPrice: 16499,
    oldPrice: "₹19,999",
    rawOldPrice: 19999,
    brand: "Anker",
    vendor: "Anker Innovations",
    vendorRating: 4.9,
    category: "Headphones",
    department: "Electronics & Gadgets",
    description: "Certified Hi-Res Audio with custom 40mm dynamic drivers, hybrid active noise cancellation reducing ambient noise by up to 90%, and 40-hour ultra battery life.",
    features: [
      "Hi-Res Audio certified with extended 40 kHz high frequencies",
      "Hybrid Active Noise Cancellation with internal and external microphones",
      "BassUp Technology for real-time low-frequency amplification",
      "40 Hours of playtime in ANC mode / 60 Hours in standard mode"
    ],
    specs: {
      "Driver": "40mm Silk Diaphragm",
      "Playtime": "40 Hours (ANC On), 60 Hours (ANC Off)",
      "Charging": "Fast Charge (5 mins gives 4 hours playback)",
      "Weight": "260 grams"
    },
    rating: 4.8,
    reviewsCount: 3120,
    inStock: true,
    stockCount: 19,
    tag: "TOP RATED",
    tagColor: "#06b6d4"
  },
  {
    id: 7,
    slug: "chair-swoon-lounge-velvet",
    title: "Chair Swoon Lounge Mid-Century Velvet Armchair",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/1280w/carousel/5/slide-home3.png?c=1",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/1280w/carousel/5/slide-home3.png?c=1"
    ],
    price: "₹12,999",
    rawPrice: 12999,
    oldPrice: "₹16,999",
    rawOldPrice: 16999,
    brand: "Sagaform Living",
    vendor: "Sagaform Studios",
    vendorRating: 4.7,
    category: "Lounge Chairs",
    department: "Home & Furniture",
    description: "Luxurious modern lounge armchair with premium deep navy velvet upholstery, ergonomic continuous back curve, and tapered solid steel legs with gold accents.",
    features: [
      "High-density resilience foam seating for all-day posture support",
      "Water-repellent Dutch velvet fabric",
      "Heavy-duty solid steel frame tested up to 180kg capacity",
      "Easy 10-minute tool-free assembly"
    ],
    specs: {
      "Dimensions": "82cm H x 76cm W x 78cm D",
      "Weight Capacity": "180 kg",
      "Frame Material": "Reinforced Cold Rolled Carbon Steel",
      "Fabric": "High-Thread-Count Micro Velvet"
    },
    rating: 4.9,
    reviewsCount: 185,
    inStock: true,
    stockCount: 8,
    tag: "FURNITURE",
    tagColor: "#8b5cf6"
  },
  {
    id: 8,
    slug: "dewalt-brushless-cordless-drill-kit",
    title: "DeWalt 20V MAX Brushless Cordless Drill Driver Kit",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/97/393/12__66039.1623900198.jpg?c=1",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/97/393/12__66039.1623900198.jpg?c=1"
    ],
    price: "₹14,999",
    rawPrice: 14999,
    oldPrice: "₹18,500",
    rawOldPrice: 18500,
    brand: "DeWalt Pro",
    vendor: "OFS Technology",
    vendorRating: 4.7,
    category: "Cordless Drills",
    department: "Power & Hand Tools",
    description: "Compact brushless motor delivers up to 57% more run-time over brushed, 2-speed transmission (0-500 / 0-1,750 RPM), and ergonomic comfort grip handle.",
    features: [
      "High-performance Brushless Motor technology",
      "Compact 6.3-inch front-to-back design fits into tight spaces",
      "LED Foot Light with 20-second trigger release delay",
      "Includes 2x 2.0Ah Lithium Batteries, Charger & ToughBox Case"
    ],
    specs: {
      "Voltage": "20V MAX",
      "Chuck Size": "1/2-inch Ratcheting Metal",
      "Speed": "0-500 / 0-1,750 RPM",
      "Clutch Settings": "15 Torque Positions"
    },
    rating: 4.9,
    reviewsCount: 920,
    inStock: true,
    stockCount: 15,
    tag: "PRO TOOLS",
    tagColor: "#ffb300"
  },
  {
    id: 9,
    slug: "bosch-heavy-duty-circular-power-saw",
    title: "Bosch Professional 18V Circular Power Saw",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/103/388/14__92848.1623900052.jpg?c=1",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/103/388/14__92848.1623900052.jpg?c=1"
    ],
    price: "₹17,499",
    rawPrice: 17499,
    oldPrice: "₹21,999",
    rawOldPrice: 21999,
    brand: "Bosch Power",
    vendor: "WhiteBox Official",
    vendorRating: 4.9,
    category: "Power Saws",
    department: "Power & Hand Tools",
    description: "Fast cutting progress and long runtime thanks to powerful EC brushless motor and Electronic Cell Protection against battery overload.",
    features: [
      "Heavy duty aluminum base plate and die-cast aluminum pendulum guard",
      "Integrated LED work light and dust blower port",
      "Fast electronic motor brake stops blade within 1.5 seconds",
      "Bevel cut up to 50 degrees"
    ],
    specs: {
      "Blade Diameter": "165mm",
      "No-load speed": "3,400 RPM",
      "Max Cutting Depth (90°)": "57 mm",
      "Weight": "3.4 kg"
    },
    rating: 4.7,
    reviewsCount: 310,
    inStock: true,
    stockCount: 12,
    tag: "HARDWARE",
    tagColor: "#2563eb"
  },
  {
    id: 10,
    slug: "orbit-smart-speaker-studio-360",
    title: "Orbit Smart Studio HiFi 360 Acoustic Speaker",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/81/409/3__19585.1623900470.jpg?c=1",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/81/409/3__19585.1623900470.jpg?c=1"
    ],
    price: "₹6,999",
    rawPrice: 6999,
    oldPrice: "₹9,499",
    rawOldPrice: 9499,
    brand: "WhiteBox",
    vendor: "WhiteBox Official",
    vendorRating: 4.9,
    category: "Smart Lighting",
    department: "Home & Furniture",
    description: "Handcrafted natural fir base supporting a spatial acoustic dispersion chamber. Connects via Wi-Fi, AirPlay 2, and Bluetooth 5.2.",
    features: [
      "360-degree Omnidirectional Acoustic Waveguide",
      "Multi-room synchronised audio support",
      "Voice assistant integration with far-field microphone array",
      "Solid Scandinavian fir wood and anodized aluminum body"
    ],
    specs: {
      "Output Power": "45W RMS",
      "Frequency Response": "35Hz - 22,000Hz",
      "Connectivity": "Wi-Fi 6, Bluetooth 5.2, Optical In, Aux 3.5mm",
      "Power Source": "100-240V AC adapter"
    },
    rating: 4.6,
    reviewsCount: 145,
    inStock: true,
    stockCount: 22,
    tag: "STUDIO",
    tagColor: "#7928ca"
  },
  {
    id: 11,
    slug: "pneumatic-air-compressor-50l-pro",
    title: "WhiteBox Pro Silent Pneumatic Air Compressor 50L",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/104/384/31-1__98800.1623899968.jpg?c=1",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/104/384/31-1__98800.1623899968.jpg?c=1"
    ],
    price: "₹21,999",
    rawPrice: 21999,
    oldPrice: "₹26,999",
    rawOldPrice: 26999,
    brand: "WhiteBox Pro",
    vendor: "WhiteBox Official",
    vendorRating: 4.9,
    category: "Pneumatic Compressors",
    department: "Air Compressors & Pumps",
    description: "Ultra-quiet oil-free twin piston compressor delivering 8 Bar continuous pressure. Ideal for spray painting, nail guns, pneumatic impact wrenches, and workshop maintenance.",
    features: [
      "Ultra-quiet 60dB operating noise level",
      "Oil-free maintenance-free motor design",
      "50-liter thick steel pressure vessel with anti-rust coating",
      "Dual quick-connect European brass air outlets"
    ],
    specs: {
      "Tank Capacity": "50 Liters",
      "Power": "2.5 HP (1800W)",
      "Max Pressure": "8 Bar (116 PSI)",
      "Air Flow": "220 Liters/min"
    },
    rating: 4.9,
    reviewsCount: 180,
    inStock: true,
    stockCount: 10,
    tag: "INDUSTRIAL",
    tagColor: "#0066ff"
  },
  {
    id: 12,
    slug: "precision-woodworking-jointer-plane",
    title: "OFS Pro Cast Iron Benchtop Wood Jointer 6-Inch",
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/98/391/1__24060.1623900118.jpg?c=1",
    gallery: [
      "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/300x300/products/98/391/1__24060.1623900118.jpg?c=1"
    ],
    price: "₹31,499",
    rawPrice: 31499,
    oldPrice: "₹38,000",
    rawOldPrice: 38000,
    brand: "OFS",
    vendor: "OFS Technology",
    vendorRating: 4.7,
    category: "Jointers",
    department: "Woodworking & Workshop",
    description: "Precision-ground cast iron table with helical spiral cutterhead, dual HSS reversible knives, and tilting fence for accurate 45 and 90-degree edge squaring.",
    features: [
      "Heavy duty cast iron vibration dampening infeed/outfeed tables",
      "Helical cutterhead with 12 two-sided indexable carbide inserts",
      "Integrated 2.5-inch dust collection port",
      "Adjustable fence stops at 45° and 90°"
    ],
    specs: {
      "Motor": "10 Amp 120V 1.5 HP",
      "Cutterhead Speed": "12,000 cuts/min",
      "Max Cutting Width": "6 Inches (152mm)",
      "Max Depth of Cut": "1/8 Inch (3.2mm)"
    },
    rating: 4.8,
    reviewsCount: 95,
    inStock: true,
    stockCount: 6,
    tag: "WORKSHOP",
    tagColor: "#10b981"
  }
];

// Helper to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

// Backward compatibility alias
export const PRODUCTS = ALL_PRODUCTS;

export const CATEGORIES = [
  { name: "Control Tools", icon: "Sliders", count: "12 Products", gradient: "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)", color: "#ff6b6b" },
  { name: "Power Saws", icon: "Zap", count: "24 Products", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "#00c6ff" },
  { name: "Routers", icon: "Radio", count: "18 Products", gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)", color: "#ec4899" },
  { name: "Grinders", icon: "Disc", count: "15 Products", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#10b981" },
  { name: "Sanders", icon: "Square", count: "9 Products", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "#f59e0b" },
  { name: "Saws", icon: "Scissors", count: "22 Products", gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)", color: "#6366f1" },
  { name: "Jointers", icon: "Maximize2", count: "8 Products", gradient: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)", color: "#06b6d4" },
  { name: "Wrenches", icon: "Wrench", count: "31 Products", gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)", color: "#f43f5e" }
];

export const HERO_SLIDES = [
  {
    id: 1,
    title: "Gaming Headset Brilliant Lighting Effect",
    subtitle: "Wireless Connection With TV, Computer, Laptop...",
    buttonText: "DISCOVER NOW",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/1280w/carousel/3/slide-home2.png?c=1",
    badge: "FLASH PROMO",
    gradient: "linear-gradient(135deg, #ff414d 0%, #ff5e62 50%, #ff7657 100%)"
  },
  {
    id: 2,
    title: "Sport Edition Best Choice Of Your",
    subtitle: "Active Noise Cancellation & 40H Wireless Battery...",
    buttonText: "EXPLORE COLLECTION",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/1280w/carousel/4/slide-home1.png?c=1",
    badge: "TRENDING TECH",
    gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%)"
  },
  {
    id: 3,
    title: "Next Gen Audio & Gaming Controllers",
    subtitle: "Haptic Feedback & Ultra Low Latency 2.4GHz...",
    buttonText: "SHOP DEALS",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/1280w/carousel/5/slide-home3.png?c=1",
    badge: "HOT RELEASE",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #c026d3 100%)"
  }
];

export const MODERN_TILES = [
  {
    id: 1,
    title: "Canyon Star Raider",
    category: "Headphone & Audio",
    gradient: "linear-gradient(135deg, #ff7043 0%, #ff5722 100%)",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner1.png",
    link: "/shop?category=Headphones"
  },
  {
    id: 2,
    title: "Phone Galaxy S20",
    category: "Cellphone & Tablets",
    gradient: "linear-gradient(135deg, #ec407a 0%, #d81b60 100%)",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner2.png",
    link: "/shop?category=Smartphones"
  },
  {
    id: 3,
    title: "Galaxy Buds Plus",
    category: "Wireless Earbuds",
    gradient: "linear-gradient(135deg, #26a69a 0%, #00897b 100%)",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner3.png",
    link: "/shop?category=Wireless%20Earbuds"
  },
  {
    id: 4,
    title: "Chair Swoon Lounge",
    category: "Decor & Furniture",
    gradient: "linear-gradient(135deg, #7e57c2 0%, #5e35b1 100%)",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/1280w/carousel/5/slide-home3.png?c=1",
    link: "/shop?category=Lounge%20Chairs"
  }
];

export const PROMO_STRIPS = [
  {
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner1.png",
    title: "Weekend Cyber Sale — 40% Off",
    subtitle: "Smart Wireless Gear",
    gradient: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)"
  },
  {
    img: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner2.png",
    title: "Heavy Duty Cordless Hardware",
    subtitle: "Lifetime Motor Warranty",
    gradient: "linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)"
  }
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Top 10 Essential Power Tools Every Woodworker Needs",
    date: "October 12, 2026",
    comments: "3 Comments",
    author: "Admin",
    category: "Guide",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner1.png",
    excerpt: "Discover the most reliable, precise and durable power tools that make every DIY and workshop project effortless."
  },
  {
    id: 2,
    title: "How to Choose the Right Wireless Headset in 2026",
    date: "October 08, 2026",
    comments: "5 Comments",
    author: "Admin",
    category: "Audio",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner2.png",
    excerpt: "A comprehensive guide on sound fidelity, active noise cancellation, and ergonomic design for work and gaming."
  },
  {
    id: 3,
    title: "Battery Maintenance Tips for Heavy-Duty Cordless Equipment",
    date: "September 29, 2026",
    comments: "8 Comments",
    author: "Admin",
    category: "Hardware",
    image: "https://cdn11.bigcommerce.com/s-eofpr986v7/images/stencil/original/content/home3/banner/banner3.png",
    excerpt: "Extend the lifetime of lithium-ion tool batteries with these expert maintenance and storage practices."
  }
];

